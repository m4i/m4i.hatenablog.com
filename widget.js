(function($, window, undefined) {

function createHatenaModuleHTML() {
  return $('<div>')
    .addClass('hatena-module hatena-module-html')
    .append(
      $('<div>')
        .addClass('hatena-module-body')
    );
}

var $module = $('.hatena-module-category');
if ($module.length) {
  var hatena_widget_id;

  // 新着エントリー
  $module = createHatenaModuleHTML().insertAfter($module);
  hatena_widget_id = 10;
  $('<div>')
    .attr('id', 'hatena-bookmark-widget' + hatena_widget_id)
    .appendTo($module.find('.hatena-module-body'));
  Hatena.BookmarkWidget.url   = 'blog.m4i.jp';
  Hatena.BookmarkWidget.title = '新着エントリー';
  Hatena.BookmarkWidget.sort  = 'hot';
  Hatena.BookmarkWidget.width = 210;
  Hatena.BookmarkWidget.num   = 10;
  Hatena.BookmarkWidget.theme = 'default';
  Hatena.BookmarkWidget.load(hatena_widget_id);

  // 人気エントリー
  $module = createHatenaModuleHTML().insertAfter($module);
  hatena_widget_id = 11;
  $('<div>')
    .attr('id', 'hatena-bookmark-widget' + hatena_widget_id)
    .appendTo($module.find('.hatena-module-body'));
  Hatena.BookmarkWidget.url   = 'blog.m4i.jp';
  Hatena.BookmarkWidget.title = '人気エントリー';
  Hatena.BookmarkWidget.sort  = 'count';
  Hatena.BookmarkWidget.width = 210;
  Hatena.BookmarkWidget.num   = 10;
  Hatena.BookmarkWidget.theme = 'default';
  Hatena.BookmarkWidget.load(hatena_widget_id);

  // Twitter
  new TWTR.Widget({
    version: 2,
    type: 'profile',
    rpp: 10,
    interval: 30000,
    width: 'auto',
    height: 465,
    theme: {
      shell: {
        background: '#d7f3f3',
        color: '#289c9c'
      },
      tweets: {
        background: '#ffffff',
        color: '#5a5a5a',
        links: '#289c9c'
      }
    },
    features: {
      scrollbar: true,
      loop: false,
      live: false,
      behavior: 'all'
    }
  }).render().setUser('m4i').start();
}

})(jQuery, window);
