/*---------------------------------------------------------------------------*
 * 2017/04/12 kido
 * https://kido0617.github.io/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ティッカープラグイン
 * @author kido
 * @help
 *   簡易メッセージを表示するプラグインです
 *   使用方法: TickerManager.show('\\I[5]あいうえお');
 *
 * @param Opacity
 * @desc 背景の透明度(0 - 255)
 * @default 127
 *
 * @param DisplayDuration
 * @desc 表示時間[frame]
 * @default 180
 *
 * @param ToggleDuration
 * @desc 表示、消去にかける時間[frame]
 * @default 30
 * 
 * @param y位置
 * @desc y位置のずらし(pixel) 10と入力すると下に10ピクセル下がります
 * @default 0
 */

(function(){

  var parameters = PluginManager.parameters('Ticker');
  var BACKGROUND_OPACITY = Number(parameters['Opacity'] || 127);
  var DISPLAY_DURATION = Number(parameters['DisplayDuration'] || 3 * 60);
  var TOGGLE_DURATION = Number(parameters['ToggleDuration'] || 30);
  var Y_POSITION = Number(parameters['y位置'] || 0);

  window.TickerManager = function(){};
  TickerManager.tickers = [];

  TickerManager.show = function(text){
    var ticker = new Window_Ticker(this.tickers.length, text);
    this.tickers.push(ticker);
    SceneManager._scene.addWindow(ticker);
  };
  TickerManager.hide = function(){
    var ticker = this.tickers.shift();
    SceneManager._scene._windowLayer.removeChild(ticker);
    //y位置直し
    for(var i = 0; i < this.tickers.length; i++){
      this.tickers[i].y = this.tickers[i].lineHeight() * i + Y_POSITION;
    }
  };
  TickerManager.hideAll = function(){
    while(this.tickers.length != 0){
      var ticker = this.tickers.shift();
      SceneManager._scene._windowLayer.removeChild(ticker);
    }
  };

  var _terminate = Scene_Base.prototype.terminate;
  Scene_Base.prototype.terminate = function(){
    _terminate.call(this);
    TickerManager.hideAll();
  };

  function Window_Ticker() {
    this.frameCount = 0;
    this.isShowing = true;
    this.isHiding = false;
    this.isDisplaying = false;
    this.initialize.apply(this, arguments);
  }

  Window_Ticker.prototype = Object.create(Window_Base.prototype);
  Window_Ticker.prototype.constructor = Window_Ticker;

  Window_Ticker.prototype.initialize = function(index, text) {
    Window_Base.prototype.initialize.call(this, 0, this.lineHeight() * index + Y_POSITION, Graphics.width, this.lineHeight());
    this.text = text;
    this.textX = 100;
    this.createBackground();
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.refresh();
  };

  Window_Ticker.prototype.standardPadding = function() {
    return 0;
  };

  Window_Ticker.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = new Bitmap(this.width, this.height);
    this.addChildToBack(this._backSprite);
    this._backSprite.bitmap.fillAll('rgba(0, 0, 0, 1)');
    this._backSprite.opacity = 0;
  };

  Window_Ticker.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this.text, this.textX, 0);
  };

  Window_Ticker.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.frameCount++;
    if(this.isShowing){
      this._backSprite.opacity = (this.frameCount / TOGGLE_DURATION) * BACKGROUND_OPACITY;
      this.contentsOpacity = (this.frameCount / TOGGLE_DURATION) * 255;
      this.textX = ((1 - this.frameCount * 2 / TOGGLE_DURATION) * 100).clamp(0, 100);
      if(this.frameCount == TOGGLE_DURATION){
        this.isShowing = false;
        this.isDisplaying = true;
        this.frameCount = 0;
      }
    }else if(this.isDisplaying){
      if(this.frameCount == DISPLAY_DURATION){
        this.isDisplaying = false;
        this.isHiding = true;
        this.frameCount = 0;
      }
    }else if(this.isHiding){
      this._backSprite.opacity =  (1 - this.frameCount / TOGGLE_DURATION) * BACKGROUND_OPACITY;
      this.contentsOpacity = (1 - this.frameCount / TOGGLE_DURATION) * 255;;
      if(this.frameCount == TOGGLE_DURATION){
        TickerManager.hide();
      }
    }
    this.refresh();
  };

})();