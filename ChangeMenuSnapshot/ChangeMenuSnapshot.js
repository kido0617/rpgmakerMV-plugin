/*---------------------------------------------------------------------------*
 * 2018/09/25 kido0617
 * http://kido0617.github.io/
 * 完全に自由にどうぞ。
 * クレジットの表記もいりません。
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc メニューのオプションとゲーム終了の背景をメニュー画面にするプラグイン
 * @author kido0617
 * @help
 * 導入するとメニューのオプションとゲーム終了選択時の背景がメニュー画面になります
 * 
 * @param ぼかしON
 * @desc ぼかしをかけるか
 * @default true
 * @type boolean
*/


(function(){
  
  const parameters = PluginManager.parameters('ChangeMenuSnapshot');
  const needBlur = parameters['ぼかしON'] == 'true';

  var commandOptions = Scene_Menu.prototype.commandOptions;
  Scene_Menu.prototype.commandOptions = function() {
    $gameTemp.tempSnap = SceneManager.snap();
    if(needBlur)$gameTemp.tempSnap.blur();
    commandOptions.call(this);
  };

  var commandGameEnd = Scene_Menu.prototype.commandGameEnd;
  Scene_Menu.prototype.commandGameEnd = function() {
    $gameTemp.tempSnap = SceneManager.snap();
    if(needBlur)$gameTemp.tempSnap.blur();
    commandGameEnd.call(this);
  };

  Scene_Options.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    if(SceneManager.isPreviousScene(Scene_Menu)) this._backgroundSprite.bitmap = $gameTemp.tempSnap;
    else this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
  };

  Scene_GameEnd.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    if(SceneManager.isPreviousScene(Scene_Menu)) this._backgroundSprite.bitmap = $gameTemp.tempSnap;
    else this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
  };

})();