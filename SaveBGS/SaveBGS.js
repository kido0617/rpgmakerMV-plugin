/*---------------------------------------------------------------------------*
 * 2018/06/19 kido
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc BGMの保存・再開と同様に、BGSを保存・再開するプラグイン
 * @author kido
 * @help
 * プラグインコマンド
 *  ・BGSの保存
 *     SaveBGS
 *  ・BGSの再開
 *     ReplayBGS
 * 
*/


(function(){

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'SaveBGS') {
      $gameSystem.saveBgs();
    }else if(command === 'ReplayBGS'){
      $gameSystem.replayBgs();
    }
  };

  Game_System.prototype.saveBgs = function() {
    this._savedBgs = AudioManager.saveBgs();
  };

  Game_System.prototype.replayBgs = function() {
    if (this._savedBgs) {
      AudioManager.replayBgs(this._savedBgs);
    }
  };

})();