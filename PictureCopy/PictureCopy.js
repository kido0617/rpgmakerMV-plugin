/*---------------------------------------------------------------------------*
 * 2019/03/15 @kido0617
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ピクチャ番号を変えるプラグイン
 * @author kido
 * @help
 * 
 * プラグインコマンド
 *    PictureCopy arg0 arg1 arg2
 *     arg0はコピー元ピクチャ番号
 *     arg1はコピー先ピクチャ番号
 *     arg2はコピー元を残すか。true指定で残す。指定なしで消す
 *       例: PictureCopy 13 14
 * 
 * 
*/


(function(){

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'PictureCopy') {
      var srcId = Number(args[0]), distId = Number(args[1]);
      var src = $gameScreen.picture(srcId);
      if(!src || !src._name)return;
      $gameScreen.showPicture(distId, src._name, src._origin, 
        src._x, src._y, src._scaleX, src._scaleY, src._opacity, src._blendMode);
      if(args[2] != 'true'){
        $gameScreen.erasePicture(srcId);
      }
    }
  };


})();