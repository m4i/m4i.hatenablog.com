# /entries/<year>/<month>/<day> (日毎記事ページ)
#
# へのリンクをすべて
#
# /archive/<year>/<month>/<day> (日毎アーカイブページ)
#
# に
#
# /category/<category> (カテゴリ記事ページ)
#
# へのリンクをすべて
#
# /archive/category/<category> (カテゴリアーカイブページ)
#
# に変更する
isEntries  = new RegExp "^(?:http://#{location.host})?/entries/"
isCategory = new RegExp "^(?:http://#{location.host})?/category/"
for a in document.getElementsByTagName 'a'
  if isEntries.test a.href
    a.href = a.href.replace /\/entries\//, '/archive/'
  if isCategory.test(a.href)
    a.href = a.href.replace /\/category\//, '/archive$&'
