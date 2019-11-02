/*---------------------------------------------------------------------------*
 * 2017/11/17 kido
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ピクチャにniconico動画っぽいテキストを出すプラグイン
 * @author kido
 * @help
 *   ・参照
 *   https://kido0617.github.io/rpgmaker/2017-11-17-niconico-like-text/
 *
 * @param Big
 * @desc 文字サイズ'b'のときの文字サイズ
 * @default 34
 *
 * @param Medium
 * @desc 文字サイズ'm'のときの文字サイズ
 * @default 26
 * 
 * @param Small
 * @desc 文字サイズ's'のときの文字サイズ
 * @default 18
 * 
 * @param Speed
 * @desc 文字の流れるスピード（文字の長さによって変わりますが基準となる値です）
 * @default 1
 * 
 * @param UeShitaTime
 * @desc 'ue'、'shita'時の表示時間[フレーム]
 * @default 120
 * 
 * @param Font
 * @desc テキストに使うフォント名
 * @default GameFont
 * 
 */

(function(){
    
    var parameters = PluginManager.parameters('NiconicoLikeText');
    var BIG_SIZE = Number(parameters['Big'] || 50);
    var MEDIUM_SIZE = Number(parameters['Medium'] || 40);
    var SMALL_SIZE = Number(parameters['Small'] || 30);
    var FLOW_SPEED = Number(parameters['Speed'] || 1);
    var FONT_FAMILY = parameters['Font'] || 'GameFont';
    var UE_SHITA_TIME = Number(parameters['UeShitaTime'] || 120);


    window.NLTManager = {
      delay: 10
    };

    var TYPES = ['ue', 'naka', 'shita'];
    var COLORS = {
      white: '#FFF',
      red: '#F00',
      blue: '#00F',
      orange: '#ffc000',
      pink: '#ff8080',
      yellow: '#FF0',
      green: '#0F0',
      cyan: '#0FF',
      purple: '#c000ff',
      black: '#000'
    };
    var SIZES = {
      'b': BIG_SIZE,
      'm': MEDIUM_SIZE,
      's': SMALL_SIZE
    };

    Game_System.prototype.addNLTAdlib = function(data) {
      if (!this.NLTAdlibs) {
        this.clearNLTAdlib();
      }
      this.NLTAdlibs.push(data);
    };
    Game_System.prototype.pickNLTAdlib = function(){
      if (!this.NLTAdlibs || this.NLTAdlibs.length == 0) {
        this.clearNLTAdlib();
        return null; 
      }
      return this.NLTAdlibs[Math.randomInt(this.NLTAdlibs.length)];
    };
    Game_System.prototype.clearNLTAdlib = function() {
      this.NLTAdlibs = [];
    };

    NLTManager.linkPicture = function(pictureId){
      if(this.sprite)this.sprite.unLinkNLT();
      this.sprite = SceneManager._scene._spriteset._pictureContainer.children[pictureId - 1];
      this.sprite.linkNLT();
    };

    NLTManager.unLink = function(){
      if(this.sprite){
        this.sprite.unLinkNLT();
        this.sprite = null;
      }
    };

    NLTManager.setDelay = function(delay){
      this.delay = delay;
    }

    NLTManager.show = function(text, type, color, size, y){
      if(!this.sprite) {
        console.error('Linked Picture is nothing');
        return;
      }
      if(TYPES.indexOf(type) == -1) type = 'naka';
      if(Object.keys(COLORS).indexOf(color) == -1) color =  'white';
      if(Object.keys(SIZES).indexOf(size) == -1) size = 'm';
      
      this.sprite.addText({
        text: text, 
        type: type, 
        color: color, 
        size: size, 
        y: y,
        delay: NLTManager.delay
      });
    };

    NLTManager.addAdlib = function(text, type, color, size, y){
      if(TYPES.indexOf(type) == -1) type = 'naka';
      if(Object.keys(COLORS).indexOf(color) == -1) color =  'white';
      if(Object.keys(SIZES).indexOf(size) == -1) size = 'm';
      $gameSystem.addNLTAdlib({
        text: text,
        type: type,
        color: color,
        size: size,
        y: y
      })
    };

    NLTManager.clearAdlib = function(){
      $gameSystem.clearNLTAdlib();
    };
  
    Sprite_Picture.prototype.linkNLT = function(){
      this.isLink = true;
      this.texts = [];
      this.adlibMode = false;
      this.frameCount = 0;
      this.nextAdlibFrame = 0;
      var textBitmap = new Bitmap(this.width, this.height);
      this.textSprite = new Sprite(textBitmap);
      this.addChild(this.textSprite);
    };
    Sprite_Picture.prototype.unLinkNLT = function(){
      this.isLink = false;
      this.removeChild(this.textSprite);
    };

    Sprite_Picture.prototype.addText = function(data){
      this.adlibMode = false;
      this._addText(data);
    };

    Sprite_Picture.prototype.getLatestNLTFrame = function(){
      var frame = 0;
      for(var i = 0;  i < this.texts.length; i++){
        if(this.texts[i].frame < frame) frame = this.texts[i].frame;
      }
      return frame;
    };

    Sprite_Picture.prototype._addText = function(data){
      data.x = 1.0;
      if(!data.delay) data.delay = 0;
      data.frame = this.getLatestNLTFrame() - data.delay;
      
      this.resetFontSettings(data);
      this.textSprite.bitmap.fontSize = SIZES[data.size];
      data.width = this.textSprite.bitmap.measureTextWidth(data.text) / Graphics.width;
      data.height = this.textSprite.bitmap.fontSize / Graphics.height;
      if(data.type != 'naka'){
        data.x = 0.5 - data.width / 2;
      }
      this.texts.push(data);
    };

    Sprite_Picture.prototype.setValidPosY = function(data){
      var texts = this.filterFlowTexts(data.type, false);
      if(data.type == 'naka'){
        //すでに左側に流れているなら除外していい
        texts = texts.filter(function(text){
          if(text.x + text.width < 0.9)return false;
          return true;
        }, this);
      }
      for(var i = 0; i < 100; i++){
        //適当に散らす。100回のランダム置きで適当な場所が見つからなかったら場所の被りも可とする
        if(data.type == 'ue') data.y = getRandomArbitary(data.height, 0.5 - data.height);
        else if(data.type == 'shita') data.y = getRandomArbitary(0.5, 1 - data.height);
        else data.y = getRandomArbitary(data.height, 1 - data.height);
        if(!this.isNLTCollision(texts, data)){
          break;
        }
      }
    };

    Sprite_Picture.prototype.isNLTCollision = function(texts, data){
      var collision = false;
      var y1_ = data.y, y2_ = data.y + data.height;
      texts.some(function(text){
        var y1 = text.y, y2 = text.y + text.height;
        if((y1 < y1_ || y1 < y2_) && (y2 > y1_ || y2 > y2_)){
          collision = true;
          return true;
        }
      }, this);
      return collision;
    };

    var _update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
      _update.call(this);
      if(!this.isLink)return;
      var picture = this.picture();
      if(!picture){
        //ピクチャを非表示にした
        this.unLinkNLT();
        return;
      }
      this.frameCount++;
      this.displayRate = this.height / Graphics.height;
      this.refresh();
      if(this.texts.length == 0 && !this.adlibMode){
        this.adlibMode = true;
        this.nextAdlibFrame =  this.frameCount;
      }
      if(this.adlibMode){
        if(this.frameCount >= this.nextAdlibFrame){
          var data = $gameSystem.pickNLTAdlib();
          if(!data) return;
          this._addText(JsonEx.makeDeepCopy(data));
          this.nextAdlibFrame = this.frameCount + Math.randomInt(120);
        }
      }
    };
  
    Sprite_Picture.prototype.refresh = function() {
      this.textSprite.bitmap.clear();
      for(var i = 0; i < this.texts.length; i++){
        var data = this.texts[i];
        if(data.frame == 0){
          if(data.y === undefined || data.y === null){
            this.setValidPosY(data)
          }
        }
        data.frame++;
        if(data.frame < 0) continue;
        this.resetFontSettings(data);
        this.textSprite.bitmap.drawText(data.text, data.x * this.width, data.y * this.height, 2000, this.textSprite.bitmap.fontSize);
        if(data.type == 'naka'){
          data.x -= this.getNLTSpeed(data.width);
          if(data.x + data.width <= 0){
            this.texts.splice(i, 1);
            i--;
          }
        }else{
          if(data.frame == UE_SHITA_TIME){
            this.texts.splice(i, 1);
            i--;
          }
        }
      }
      
    };

    var _loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
      _loadBitmap.call(this);
      if(this.isLink){
        this.bitmap.addLoadListener(function(){
          this.textSprite.bitmap = new Bitmap(this.width, this.height);
        }.bind(this));
      }
    };

    Sprite_Picture.prototype.resetFontSettings = function(data){
      this.textSprite.bitmap.outlineColor = 'rgba(0, 0, 0, 1)';
      this.textSprite.bitmap.textColor = COLORS[data.color];
      this.textSprite.bitmap.fontFace = FONT_FAMILY;
      this.textSprite.bitmap.fontSize = SIZES[data.size] * this.displayRate;
    };

    Sprite_Picture.prototype.getNLTSpeed = function(width){
      var speed = width / 100 * FLOW_SPEED;
      var max = 0.01 * FLOW_SPEED;
      var min = 0.004 * FLOW_SPEED;
      speed = speed.clamp(min, max);
      return speed;
    };    

    Sprite_Picture.prototype.filterFlowTexts = function(type, includeNotShown){
      return this.texts.filter(function(data){
        if(!includeNotShown && (data.frame < 0 || data.y === null || data.y === undefined)) return false;
        if(data.type == type) return true;
        return false;
      }, this);
    };

    var getRandomArbitary = function(min, max) {
      return Math.random() * (max - min) + min;
    };
    
})();