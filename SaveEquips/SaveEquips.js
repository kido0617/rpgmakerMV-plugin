/*---------------------------------------------------------------------------*
 * 2018/09/19 @kido0617
 * https://kido0617.github.io/
 * 完全に自由にどうぞ。
 * クレジットの表記もいりません。
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc 装備をセーブ、ロードするプラグイン
 * @author @kido0617
 * @help
 * 詳細
 * https://kido0617.github.io/rpgmaker/2018-09-19-save-equips/
 * 
 * プラグインコマンド
 *   SaveEquips arg0 arg1
 *     arg0はアクター番号、arg1は保存先番号
 *       例: SaveEquips 1 1
 *     引数には変数の制御文字が使えます。
 *       例: SaveEquips \V[3] \V[4]
 *   LoadEquips arg0 arg1 arg2
 *     arg0はアクター番号、arg1は保存元番号 arg2は所持品に装備がない場合にパーティの装備を奪うか(0か指定なしは奪わない、1は奪う)
 *       例: LoadEquips 1 1
 *       例: LoadEquips 1 1 1
 *     引数には変数の制御文字が使えます。
 *       例: LoadEquips \V[3] \V[4]
*/

(function(){
  
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'SaveEquips') {
      let [actor, saveIndex] = parseArg(args);
      if(!actor) return;
      if(!$gameSystem.saveEquips) $gameSystem.saveEquips = {};
      $gameSystem.saveEquips[saveIndex] = actor._equips.map(e => {
        return {_dataClass: e._dataClass, _itemId: e._itemId};
      });
    }else if(command === 'LoadEquips') {
      let [actor, loadIndex] = parseArg(args);
      if(!actor) return;
      if(!$gameSystem.saveEquips) return;
      let equips = $gameSystem.saveEquips[loadIndex];
      if(!equips) return;
      let getFromParty = args[2] == '1' ? true: false;
      loadEquips(actor, equips, getFromParty);
    }
  };

  function loadEquips(actor, equips, getFromParty){
    actor.clearEquipments();
    for(var i = 0; i < equips.length; i++){
      var item = getItemInstance(equips[i]._dataClass, equips[i]._itemId);
      if(getFromParty && !$gameParty.hasItem(item)){
        //パーティから奪う場合、所持品になくて誰かの装備品にあれば、それを奪う。
        //discardMembersEquipが捨てるメソッドなので、捨ててから１個取得というまわりくどいことをする
        if($gameParty.hasItem(item, true) && actor.canEquip(item)){
          $gameParty.discardMembersEquip(item, 1);
          $gameParty.gainItem(item, 1);
        }
      }
      actor.changeEquip(i, item);
    }
  }

  function getItemInstance(type, id){
    if(type == 'weapon'){
      return $dataWeapons[id];
    }else if(type == 'armor'){
      return $dataArmors[id];
    }else if(type == 'item'){
      return $dataItems[id];
    }
    return null;
  }

  function parseArg(args){
    if(args.length < 2){
      console.error('アクター番号と保存元番号を指定してください');
      return [null, null];
    }
    var actorNum = parseInt(convertEscapeCharacter(args[0]));
    var actor = $gameActors.actor(actorNum);
    if(!actor){
      console.error('アクターが存在しません');
      return [null, null];
    }
    var saveIndex = parseInt(convertEscapeCharacter(args[1]));
    return [actor, saveIndex];
  }

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

})();