/*---------------------------------------------------------------------------*
 * 2019/06/11 @kido0617
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc 敵グループの敵の重なり順を定義するプラグイン
 * @author kido
 * @help
 *  敵のメモ欄にレイヤー番号を記載します。大きいほうが上。
 *  <troopLayer:4>
 *  
 *  重なり順サンプル
 *  troopLayer:5  > troopLayer:1 > troopLayer:0 > 記載なし
*/

(function(){

  Spriteset_Battle.prototype.compareEnemySprite = function(a, b) {
    var atl = a._enemy.enemy().meta.troopLayer;
    var btl = b._enemy.enemy().meta.troopLayer;
    if(atl != null && btl != null) return Number(atl) - Number(btl);
    if(atl != null) return 1;
    if(btl != null) return -1;
  
    if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
  };

  if(Spriteset_Battle.prototype.battleFieldDepthCompare){
    Spriteset_Battle.prototype.battleFieldDepthCompare = function(a, b) {
      var priority = BattleManager.getSpritePriority();
      if (a._battler && b._battler && priority !== 0) {
        if (priority === 1) {
          if (a._battler.isActor() && b._battler.isEnemy()) return 1;
          if (a._battler.isEnemy() && b._battler.isActor()) return -1;
        } else if (priority === 2) {
          if (a._battler.isActor() && b._battler.isEnemy()) return -1;
          if (a._battler.isEnemy() && b._battler.isActor()) return 1;
        }
      }
      if(a._battler && b._battler && a._battler.isEnemy() && b._battler.isEnemy()){
        var atl = a._enemy.enemy().meta.troopLayer;
        var btl = b._enemy.enemy().meta.troopLayer;
        if(atl != null && btl != null) return Number(atl) - Number(btl);
        if(atl != null) return 1;
        if(btl != null) return -1;
      }
      if (a.z < b.z) return -1;
      if (a.z > b.z) return 1;
      if (a.y < b.y) return -1;
      if (a.y > b.y) return 1;
      return 0;
    };
  }

})();