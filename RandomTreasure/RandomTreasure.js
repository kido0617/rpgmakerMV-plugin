/*---------------------------------------------------------------------------*
 * 2017/04/17 kido0617
 * http://kido0617.github.io/
 * License MIT
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc Random Treasure plugin
 * @author kido0617
 * @help
 *   Get random treasure plugin
 *
 */

/*:ja
 * @plugindesc ランダム宝箱プラグイン
 * @author kido0617
 * @help
 *   ランダムにアイテムを入手できる宝箱を実装するプラグインです。
 *   プラグインコマンドで RandomTreasure reset を実行後の「ショップ処理」で選んだアイテムが
 *   ランダムで手に入るアイテム群となります。その際、価格がくじの本数となり、確率として利用できます。
 *   アイテムを手に入れるときは、プラグインコマンドで RandomTreasure get とします。
 *   http://kido0617.github.io/rpgmaker/2017-04-17-random-treasure/
 *
 */

(function(){
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'RandomTreasure') {
      switch (args[0]) {
      case 'reset':
        $gameTemp.randomTreasureReset = true;
        break;
      case 'get':
        getRandom();
        break;
      }
    }
  };

  function getRandom(){
    if(!$gameSystem.randomTreasures || !$gameSystem.randomTreasures.length){
      $gameSystem.lastRandomTreasure = null;
      return null;
    }
    var sum = 0;
    $gameSystem.randomTreasures.forEach(function(treasure){
      sum += treasure.rate;
    });
    var rand = Math.randomInt(sum);
    var item;
    sum = 0;
    for(var i = 0; i < $gameSystem.randomTreasures.length; i++){
      sum += $gameSystem.randomTreasures[i].rate;
      if(rand < sum){
        item = getItem($gameSystem.randomTreasures[i].type, $gameSystem.randomTreasures[i].id);
        break;
      }
    }
    $gameParty.gainItem(item, 1);
    $gameSystem.lastRandomTreasure = item;
  }

  function getItem(type, id){
    var item;
    switch (type) {
    case 0:
      item = $dataItems[id];
      break;
    case 1:
      item = $dataWeapons[id];
      break;
    case 2:
      item = $dataArmors[id];
      break;
    }
    return item;
  }

  // Shop Processing
  var _command302 = Game_Interpreter.prototype.command302;
  Game_Interpreter.prototype.command302 = function() {
    if($gameTemp.randomTreasureReset){
      $gameTemp.randomTreasureReset = false;
      var goodsList = [this._params];
      while (this.nextEventCode() === 605) {
        this._index++;
        goodsList.push(this.currentCommand().parameters);
      }
      data = [];
      goodsList.forEach(function(goods) {
        var item = getItem(goods[0], goods[1]);
        data.push({
          type: goods[0],
          id: goods[1],
          rate: goods[2] === 0 ? item.price : goods[3]
        });
      }, this);
      $gameSystem.randomTreasures = data;
      return true;
    }
    return _command302.call(this);
  };

})();