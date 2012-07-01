/*
<script src="http://m4i.jp/m4i.hatenablog.com/header.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.string/2.0.0/underscore.string.min.js"></script>
<script src="http://m4i.jp/m4i.hatenablog.com/footer.js"></script>
<script src="http://b.hatena.ne.jp/js/widget.js"></script>
<script src="http://widgets.twimg.com/j/2/widget.js"></script>
<script src="http://m4i.jp/m4i.hatenablog.com/widget.js"></script>
*/
(function($, window, undefined) {

function isPC() {
  return !isMobile();
}
function isMobile() {
  return location.pathname.indexOf('/touch/') === 0;
}

function isIndex() {
  return isPCIndex() || isMobileIndex();
}
function isPCIndex() {
  return location.pathname === '/';
}
function isMobileIndex() {
  return location.pathname === '/touch/';
}

function isEntry() {
  return isPCEntry() || isMobileEntry();
}
function isPCEntry() {
  return location.pathname.indexOf('/entry/') === 0;
}
function isMobileEntry() {
  return location.pathname.indexOf('/touch/entry/') === 0;
}

function isPCEntries() {
  return location.pathname.indexOf('/entries/') === 0;
}

function isCategory() {
  return isPCCategory() || isMobileCategory();
}
function isPCCategory() {
  return location.pathname.indexOf('/category/') === 0;
}
function isMobileCategory() {
  return false;
}

function isPCArchive() {
  return location.pathname.indexOf('/archive') === 0;
}
function isPCAllArchive() {
  return location.pathname === '/archive';
}

function isCategories() {
  return location.pathname === '/categories';
}

function isAbout() {
  return location.pathname === '/about';
}

function isSearch() {
  return location.pathname === '/search';
}

/**
 * URL を受け取りはてなブックマーク件数画像の element を返す
 */
function linkToHatenaBookmark(url) {
  if (!/^http:/.test(url)) {
    url = 'http://' + location.host + url;
  }
  return $('<a>')
    .attr('href', 'http://b.hatena.ne.jp/entry/' + url)
    .attr('target', '_blank')
    .append($('<img>').attr('src', 'http://b.hatena.ne.jp/entry/image/' + url));
}

/**
 * エントリーリンクに日付とはてなブックマーク件数画像を追加する
 */
function formatEntryTitleOfList($a) {
  var url = $a.attr('href');

  var date, matches;
  if (matches = url.match(/\/entry\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{2})(\d{2})(\d{2})$/)) {
    date = new Date(matches[1], matches[2] - 1, matches[3], matches[4], matches[5], matches[6]);
  }
  if (matches = url.match(/\/entry\/\d{8}\/(\d{10})$/)) {
    date = new Date(matches[1] * 1000);
  }
  if (date) {
    var date_string = _.str.sprintf(
      '%04d-%02d-%02d',
      date.getFullYear(), date.getMonth() + 1, date.getDate()
    );
    var datetime_string = _.str.sprintf(
      '%sT%02d:%02d:%02d+09:00',
      date_string, date.getHours(), date.getMinutes(), date.getSeconds()
    );
    $('<time>')
      .attr('datetime', datetime_string)
      .text(date_string)
      .insertBefore($a);
  }

  $a.after(linkToHatenaBookmark(url)).after(' ');
}

/**
 * エントリータイトル横の日付のリンク先を日のページではなく記事のページにする
 */
$('article.entry header.entry-header').each(function() {
  var $header = $(this);
  $header.find('.date a').attr('href', $header.find('h1 a:first').attr('href'));
});

/**
 * エントリータイトル横にはてなブックマーク件数画像
 */
if (isPCCategory() || isPCEntries()) {
  $('article.entry h1.entry-title a').each(function() {
    var $a = $(this);
    var url = $a.attr('href');
    $a.after(linkToHatenaBookmark(url)).after(' ');
  });
}

/**
 * アーカイブページを見やすく
 */
if (isPCArchive()) {
  $('#main-inner li > a').each(function() {
    formatEntryTitleOfList($(this));
  });
}
if (isPCAllArchive()) {
  $('#main-inner').prepend($('<p>').text('全記事リスト'));
}

/**
 * 「新着記事」サイドバー
 */
if (isPCAllArchive()) {
  $('.hatena-module-recent-entries').hide();
} else {
  $('.hatena-module-recent-entries .hatena-module-body a').each(function() {
    formatEntryTitleOfList($(this));
  });
  $('<p>')
    .addClass('seemore')
    .append(
      $('<a>')
        .attr('href', '/archive')
        .text('もっと読む')
    )
    .appendTo('.hatena-module-recent-entries .hatena-module-body');
}

/**
 * DISQUS
 */
(function(disqus_shortname) {
  function entry() {
    var $article = $('article.entry');
    if ($article.length !== 1) return;

    window.disqus_url =
      $('link[rel="canonical"]').attr('href') || canonicalize(location.href);
    window.disqus_identifier = identifier(disqus_url);
    window.disqus_title      = $article.find('.entry-title-link:first').text();

    var $disqus_thread = $('<div>')
      .attr('id', 'disqus_thread')
      .insertAfter($article.find('.comment-box:last'));

    if (/^#?disqus_thread$/.test(location.hash)) {
      $(window).scrollTop($disqus_thread.offset().top);
    }

    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  }

  function canonicalize(permalink) {
    return permalink
      .replace(/[#?].*$/g, '')
      .replace(/^(https?:\/\/[^\/]*)?\/touch/, '$1');
  }

  function identifier(permalink) {
    return canonicalize(permalink)
      .replace(/^https?:\/\/[^\/]*/, '')
      .replace(/[^-\w]+/g, '');
  }

  if (isPCEntry()) {
    window.disqus_shortname = disqus_shortname;
    entry();
  }
})('m4i');

})(jQuery, window);
