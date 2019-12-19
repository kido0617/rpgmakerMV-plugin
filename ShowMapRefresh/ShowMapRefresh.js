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
  const _refresh = Game_Map.prototype.refresh;
  Game_Map.prototype.refresh = function() {
    console.log(Graphics.frameCount + " : Map Refreshed!");
    _refresh.call(this);
  };
})();