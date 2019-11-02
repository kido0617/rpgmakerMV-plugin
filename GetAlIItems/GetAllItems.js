/*---------------------------------------------------------------------------*
 * 2017/04/13 kido
 * https://kido0617.github.io/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc 全アイテム取得プラグイン
 * @author kido
 *
 * @help
 *   Plug-in to get all weapons, armors, items
 * plugin command:
 *   GetAllItems item 99      # Earn 99 items for all items
 *   GetAllItems armor 1      # Earn 99 armors for all items
 *   GetAllItems weapon 1     # Earn 99 weapons for all items
 */

/*:ja
 * @plugindesc 全アイテム取得プラグイン
 * @author kido
 *
 * @help
 *   全武器、防具、アイテムを取得するプラグイン
 * プラグインコマンド:
 *   GetAllItems item 99      # 全アイテムを99個獲得
 *   GetAllItems armor 1      # 全防具を1個獲得
 *   GetAllItems weapon 1     # 全武器を1個獲得
 */

(function(){

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'GetAllItems') {
      switch (args[0]) {
      case 'item':
        getAlls($dataItems, Number(args[1]));
        break;
      case 'armor':
        getAlls($dataArmors, Number(args[1]));
        break;
      case 'weapon':
        getAlls($dataWeapons, Number(args[1]));
        break;
      }
    }
  };

  function getAlls(data, num){
    for(var i = 1 ; i < data.length; i++){
      if(data[i].name == "")continue;
      $gameParty.gainItem(data[i], num);
    }
  }

})();

