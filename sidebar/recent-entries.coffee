# 日付の Array [year, month, day] を返す
getDateFromEntryUrl = (url) ->
  if matches = url.match /\entry\/(\d{4})\/?(\d{2})\/?(\d{2})\//
    matches[1..]


# 日付を表示する <div> を返す
getDateElement = (url) ->
  return unless date = getDateFromEntryUrl(url).join '-'

  div = document.createElement 'div'
  div.className = 'date'
  div.appendChild document.createTextNode date

  div


# はてなブックマークへのリンクの <a> を返す
getLinkToHatenaBookmark = (url) ->
  # path のみの場合 host を追加する
  url = 'http://' + location.host + url unless /^http:/.test url

  a = document.createElement 'a'
  a.href      = 'http://b.hatena.ne.jp/entry/' + url
  a.target    = '_blank'
  a.className = 'bookmark-widget-counter'

  img = document.createElement 'img'
  img.src = 'http://b.hatena.ne.jp/entry/image/' + url
  a.appendChild img

  a


# Recent Entries module のすべての <li> に対して
for li in document.querySelectorAll '.hatena-module-recent-entries li'
  titleLink = li.getElementsByTagName('a')[0]
  url       = titleLink.href

  #  を div で wrapping する
  titleContainer = document.createElement 'div'
  titleContainer.className = 'recent-entries-title-container'
  titleContainer.appendChild titleLink
  li.appendChild titleContainer

  # 先頭に日付を追加
  if dateContainer = getDateElement url
    li.insertBefore dateContainer, li.firstChild

  # 末尾にはてなブックマークへのリンクを追加
  titleContainer.appendChild getLinkToHatenaBookmark url
