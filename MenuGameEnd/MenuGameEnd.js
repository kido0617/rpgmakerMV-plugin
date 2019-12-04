/*---------------------------------------------------------------------------*
 * 2019/01/10 @kido0617
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc メニューのシャットダウンでゲーム終了させる
 * @author kido
 * @help
 * メニューのシャットダウンをタイトルじゃなくてゲーム終了させる
 * 
 * @param 文言
 * @desc シャットダウンに使う好きな名前を指定してください
 * @default ゲーム終了
 * 
 * @param 文言2
 * @desc キャンセルに使う好きな名前を指定してください
 * @default キャンセル
 * 
 * @param フェードアウト時間
 * @desc 終了押してからメードアウトする時間(ミリ秒)
 * @default 500
 * @type number
 * 
*/


(function(){

  var param = PluginManager.parameters('MenuGameEnd');
  var shutdownText = param['文言'] || 'ゲーム終了'; 
  var cancelText = param['文言2'] || 'キャンセル'; 
  var fadeoutTime = param['フェードアウト時間']; 

  Scene_GameEnd.prototype.commandToTitle = function() {
    this.fadeOutAll();
    setTimeout(() => {
      window.close();
    }, fadeoutTime);
  };

  Window_GameEnd.prototype.makeCommandList = function() {
    this.addCommand(shutdownText, 'toTitle');
    this.addCommand(cancelText,  'cancel');
  };
})();