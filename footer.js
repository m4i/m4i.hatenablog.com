/*
例えば /about では「ヘッダ」はないが「サイドバー」はある。
そのため、ヘッダで読み込むべき JavaScript は2重読込防止を施した上でここでも読み込む

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
 * URL から pathname を抽出する
 */
function pathname(url) {
  return url.replace(/^https?:\/\/[^\/]*|[#?].*$/g, '');
}
/**
 * URL から query string を抽出する
 */
function query_string(url) {
  return url.replace(/^[^?]+/, '');
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
  $('article.entry a.entry-title-link:first').each(function() {
    var $a = $(this);
    var url = $a.attr('href');
    $a.after(linkToHatenaBookmark(url)).after(' ');
  });
}

/**
 * アーカイブページを見やすく
 */
if (isPCArchive()) {
  $('#main-inner').addClass('m4i-entry-list');
  $('#main-inner ul').addClass('m4i-entry-list-body');

  $('#main-inner li > a').each(function() {
    formatEntryTitleOfList($(this));
  });
}
if (isPCAllArchive()) {
  // /archive のページにタイトルを追加
  $('#main-inner').prepend($('<p>').text('全記事リスト'));
}

/**
 * 「新着記事」サイドバー
 */
if (isPCAllArchive()) {
  $('.hatena-module-recent-entries').hide();
} else {
  $('.hatena-module-recent-entries').addClass('m4i-entry-list');
  $('.hatena-module-recent-entries .hatena-module-body').addClass('m4i-entry-list-body');

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
 * 同じカテゴリーの記事一覧サイドバー
 */
if (isPCEntry()) (function() {
  // カテゴリページの HTML からエントリータイトルリンクを抜き出す正規表現
  var title_regex =
    /<a\s(?:[^>]+\s)?class=(["'])(?:[^"']*\s)?entry-title-link(?:\s[^"']*)?\1[\s\S]+?<\/a>/g;
  // カテゴリページの HTML から「次のページ」を抜き出す正規表現
  var pager_regex =
    /<span\s(?:[^>]+\s)?class=(["'])(?:[^"']*\s)?pager-next(?:\s[^"']*)?\1[\s\S]+?<\/span>/;

  // エントリータイトル下のカテゴリ数分ループ
  $('article.entry header.entry-header .categories:first a').each(function() {
    var $category_link = $(this);
    var category_url   = pathname($category_link.attr('href'));
    var category_name  = $category_link.text();

    // そのカテゴリの記事の件数を取得して複数件なければ skip
    var $category_list_link =
      $('.hatena-module-category a[href$="' + category_url + '"]');
    var matches = $category_list_link.text().match(/\((\d+)\)\s+$/);
    if (!(matches && Number(matches[1]) > 1)) return;

    // カテゴリページの HTML を取得
    //
    // どのカテゴリページ順にレスポンスがあるかは不定なので、
    // エントリーリストの順番も不定
    $.get(category_url).done(function(html) {
      // HTML からエントリーリストを取得
      var entries = [];
      var matches;
      while (matches = title_regex.exec(html)) {
        var $entry_link = $(matches[0]);
        var entry_url   = pathname($entry_link.attr('href'));
        if (entry_url === location.pathname) continue;
        entries.push({ url: entry_url, title: $entry_link.text() });
      }

      // 「最新記事」モジュールを clone して利用
      var $module = $('.hatena-module-recent-entries:first').clone()
        .removeClass('hatena-module-recent-entries')
        .addClass('hatena-module-recent-category-entries')
        .insertBefore('.hatena-module-recent-entries:first');

      // モジュールタイトルの書き換え
      $module.find('.hatena-module-title > a')
        .attr('href', category_url)
        .text(_.str.sprintf('"%s" カテゴリの記事', category_name));

      // エントリーリストの書き換え
      var $ul = $module.find('.hatena-module-body > ul').empty();
      $.each(entries, function(index, entry) {
        var $a = $('<a>')
          .attr('href', entry.url)
          .text(entry.title);
        $ul.append($('<li>').append($a));
        formatEntryTitleOfList($a);
      });

      // カテゴリページに「次のページ」があれば「もっと読む」をそれに書き換える
      if (matches = html.match(pager_regex)) {
        var $pager_link = $(matches[0]).find('a');
        $module.find('.seemore a')
          .attr('href', category_url + query_string($pager_link.attr('href')))
          .text($pager_link.text());

      // なければ「もっと読む」は消す
      } else {
        $module.find('.seemore').remove();
      }
    });
  });
})();

/**
 * DISQUS
 */
if (isPCEntry()) (function() {
  window.disqus_shortname = 'm4i';

  var DISQUS_LINK_TEXT = 'コメント欄を表示する';
  var OBSERVE_MAX_TIME = 30000; // 監視を続けるミリ秒数
  var OBSERVE_INTERVAL = 500;   // 監視間隔のミリ秒数

  // 2重起動防止
  if ($('#disqus_thread').length > 0) return;

  var $entry = $('article.entry:first');
  if ($entry.length === 0) return;

  var permalink = $entry.find('a.entry-title-link:first').attr('href');

  var $disqus_container = $('<div>')
    .attr('id', 'disqus_thread')
    .appendTo($entry.find('.comment-box:last'));

  var $disqus_link = $('<a>')
    .attr('href', permalink + '#disqus_thread')
    .attr('data-disqus-identifier', identifier(permalink))
    .text(DISQUS_LINK_TEXT)
    .click(function() {
      $disqus_link.hide();
      applyEmbed($entry);
      return false;
    })
    .appendTo($disqus_container);

  includeCountJs();

  // コメントがすでにあれば自動でコメント欄を表示
  // なければコメント件数を表示するのではなく、DISQUS_LINK_TEXT を表示
  var observe_count = 0;
  var observe = function() {
    var matches = $disqus_link.text().match(/(\d+)\s*comments?/i);
    if (matches) {
      if (Number(matches[1]) > 0) {
        $disqus_link.click();
      } else {
        $disqus_link.text(DISQUS_LINK_TEXT);
      }
    } else {
      if (++observe_count < OBSERVE_MAX_TIME / OBSERVE_INTERVAL) {
        setTimeout(observe, OBSERVE_INTERVAL);
      }
    }
  };
  observe();


  function applyEmbed($entry) {
    window.disqus_url =
      $('link[rel="canonical"]').attr('href') || canonicalize(location.href);
    window.disqus_identifier = identifier(disqus_url);
    window.disqus_title      = $entry.find('a.entry-title-link:first').text();

    includeEmbedJs();
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

  function includeCountJs() {
    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
  }

  function includeEmbedJs() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  }
})();

})(jQuery, window);
