/*---------------------------------------------------------------------------*
 * 2019/12/20 @kido0617
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc マップのリフレッシュ表示
 * @author kido
 * @help
 * リフレッシュしたタイミングでコンソールにそのフレーム番号を出す
 * 
 * 
*/


(function(){
  const _refreshIfNeeded = Game_Map.prototype.refreshIfNeeded;
  Game_Map.prototype.refreshIfNeeded = function() {
    if (this._needsRefresh) {
        console.log(Graphics.frameCount + " : Map Refreshed!");
    }
    _refreshIfNeeded.call(this);
  };
})();