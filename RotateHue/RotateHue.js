/*---------------------------------------------------------------------------*
 * 2018/08/16 @kido0617
 * https://kido0617.github.io/
 * 完全に自由にどうぞ。
 * クレジットの表記もいりません。
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ピクチャの色相を変えるプラグイン
 * @author @kido0617
 * @help
 * 詳細は https://kido0617.github.io/rpgmaker/2018-08-16-rotate-hue/
 * プラグインコマンド
 *   RotateHue arg0 arg1
 *     arg0はピクチャ番号、arg1はデフォルトからの色相の回転角度。単位は度
 *       例: RotateHue 1 180 
 *     引数には変数の制御文字が使えます。
 *       例: RotateHue \V[3] \V[4]
*/

(function(){
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'RotateHue') {
      if(args.length < 2){
        console.error('ピクチャ番号と色相の値を入れてください');
        return;
      }
      var picId = convertEscapeCharacter(args[0]);
      var pic = $gameScreen.picture(parseInt(picId));
      if(!pic){
        console.error('存在しないピクチャ番号です');
        return;
      }
      var hue = parseInt(convertEscapeCharacter(args[1]));
      if(hue === NaN){
        console.error('色相の値が正しくありません');
        return;
      }
      pic.rotateHue(hue);
    }
  };

  function convertEscapeCharacter(text){
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    return text;
  }

  Game_Picture.prototype.rotateHue = function(hue) {
    this.hue = hue;
  };
  Game_Picture.prototype.resetHue = function() {
    this.hue = 0;
  };

  var show = Game_Picture.prototype.show;
  Game_Picture.prototype.show = function(name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
    show.call(this, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this.resetHue();
  };

  var updateBitmap = Sprite_Picture.prototype.updateBitmap;
  Sprite_Picture.prototype.updateBitmap = function() {
    var picture = this.picture();
    var isPictureChanged = picture && picture.name() !== this._pictureName;

    updateBitmap.call(this); 
    
    if(picture && (picture.hue != this.hue || isPictureChanged)){
      this.hue = picture.hue;
      this.bitmap.addLoadListener(function(){
        //bitmapのキャッシュがあるのでそのままhueを変えてしまうとキャッシュしているbitmapを変えてしまうのでコピーする
        //bltしてコピーするのでちらつき防止の効果もある
        if(isPictureChanged){
          //hueが0のときのbitmapを保存しておく
          this.defaultBitmap = this.bitmap;
        }
        var bitmap = Object.create(Bitmap.prototype);
        bitmap.initialize(this.defaultBitmap.width, this.defaultBitmap.height);
        bitmap.smooth = true;
        bitmap.blt(this.defaultBitmap, 0, 0, this.defaultBitmap.width, this.defaultBitmap.height, 0, 0);
        this.bitmap = bitmap;
        this.bitmap.rotateHue(this.hue);
      }.bind(this));
    }
  };


})();