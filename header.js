/**
<script src="http://m4i.jp/m4i.hatenablog.com/header.js"></script>
*/
(function($, window, undefined) {

if (!window.m4i) window.m4i = {}
if (window.m4i.headerjs_loaded) return;
window.m4i.headerjs_loaded = true;

$('<link>')
  .attr('rel', 'stylesheet')
  .attr('href', 'http://m4i.jp/m4i.hatenablog.com/style.css')
  .appendTo('head');

})(jQuery, window);
