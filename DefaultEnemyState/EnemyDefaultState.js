/*---------------------------------------------------------------------------*
 * 2018/03/27 kido0617
 * http://kido0617.github.io/
 * Ver.1.0
 * 完全に自由にどうぞ。
 * クレジットの表記もいりません。
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc 敵キャラにデフォルトのステートを付与するプラグイン
 * @author kido0617
 * @help
 * 敵キャラのメモ欄に<defaultState:4> と記述すると ステートの4番目がデフォルトで付与されます。
 * 複数付与する場合は<defaultState:4,5> とカンマで区切ってください。
 */

(function(){

  var _setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    _setup.call(this, enemyId, x, y);
    var meta = this.enemy().meta;
    if(!meta.defaultState) return;
    var states = meta.defaultState.split(",");
    for(var i = 0 ; i < states.length; i++){
      var id = parseInt(states[i].trim());
      this.addState(id);
      this.clearResult();
    }
  };

})();