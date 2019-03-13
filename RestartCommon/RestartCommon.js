/*---------------------------------------------------------------------------*
 * 2019/03/12 kido0617
 * http://kido0617.github.io/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc 並列コモンを最初から開始するプラグイン
 * @author kido0617
 * @help
 * ・プラグインコマンド
 *  コモンイベント番号を指定してください。
 *  RestartCommon 3
 *
 * 
 */


(function(){
  const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'RestartCommon') {
      var id = Number(args[0]);
      if(!id) return;
      var events = $gameMap._commonEvents;
      if(!events) return;
      for(var i = 0 ; i < events.length; i++){
        if(events[i]._commonEventId == id){
          events[i].discardInterpreter();
          events[i].refresh();
          return;
        }
      }
    }
  };

  Game_CommonEvent.prototype.discardInterpreter = function() {
    this._interpreter = null;
  };


})();