# /entries/<year>/<month>/<day> (日毎記事ページ)
#
# へのアクセスをすべて
#
# /archive/<year>/<month>/<day> (日毎アーカイブページ)
#
# に
#
# にリダイレクトする
if matches = location.pathname.match /^\/entries(\/.*)/
  location.href = '/archive' + matches[1]


# /category/<category> (カテゴリ記事ページ)
#
# へのアクセスをすべて
#
# /archive/category/<category> (カテゴリアーカイブページ)
#
# にリダイレクトする
if /^\/category\//.test location.pathname
  location.href = '/archive' + location.pathname


# /search (検索ページ)
#
# へのアクセスをすべて Google にリダイレクトする
if location.pathname == '/search'
  if matches = location.search.match /(?:^|[&?])q=([^&]*)/
    word  = matches[1]
    query = 'site:' + location.host + '+inurl:entry+' + word
    location.href = 'https://www.google.co.jp/#q=' + query
