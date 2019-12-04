/*---------------------------------------------------------------------------*
 * 2019/01/15 @kido0617
 * https://kido0617.github.io/
 * Ver.1.0
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc アルファ付きの動画を有効にする
 * @author kido
 * @help
 * デフォだと動画再生時にプレイ中の画面は非表示になるが、それを抑止する
 * 
 * 
*/


(function(){
  Graphics._updateVisibility = function(videoVisible) {
    this._video.style.opacity = videoVisible ? 1 : 0;
    this._canvas.style.opacity = 1;
  };
})();