/*---------------------------------------------------------------------------*
 * 2018/10/19 @kido0617
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ピクチャの位置やサイズなどをそのままにファイル名だけを変えるプラグイン
 * @author kido
 * @help
 * 
 * プラグインコマンド
 *    PictureChange arg0 arg1
 *     arg0はピクチャ番号
 *     arg1はファイル名
 *       例: PictureChange 13 button2
 * 
 * 
*/


(function(){

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'PictureChange') {
      var pic = $gameScreen.picture(args[0]);
      if(!pic) return;
      $gameScreen.picture(args[0])._name = args[1];
    }
  };

})();