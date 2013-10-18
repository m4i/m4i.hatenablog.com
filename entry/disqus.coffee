# element に指定した className を追加する
addClass = (element, className) ->
  classes = element.className.split(/\s+/)
  classes.push className unless className in classes
  element.className = classes.join(' ')


# element から指定した className を削除する
removeClass = (element, className) ->
  classes           = element.className.split(/\s+/)
  classes           = (klass for klass in classes when klass != className)
  element.className = classes.join(' ')


# http://m4i.disqus.com/admin/settings/universalcode/
includeCountJs = ->
  s = document.createElement 'script'
  s.async = true
  s.src = "//#{disqus_shortname}.disqus.com/count.js"
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild s


# http://m4i.disqus.com/admin/settings/universalcode/
includeEmbedJs = ->
  s = document.createElement 'script'
  s.async = true
  s.src = "//#{disqus_shortname}.disqus.com/embed.js"
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild s


# URL を正規化する
canonicalise = (url) ->
  url.replace /[#?].*$/, ''


# URL を元に DISQUS の identifier を作成する
getIdentifier = (url) ->
  canonicalise(url)
    .replace(/^https?:\/\/[^\/]*/, '')
    .replace(/[^-\w]+/g, '')


# entry の element を返す
_entryElementCache = null
getEntryElement = ->
  # PC版は article.entry
  # Mobile版は li.entry-article
  _entryElementCache ?= document.querySelector 'article.entry, li.entry-article'


# entry の URL を返す
getEntryUrl = ->
  document.querySelector('link[rel="canonical"]').href ||
  canonicalise location.href


# entry の title を返す
getEntryTitle = ->
  getEntryElement().querySelector('.entry-title > a').firstChild.data


# DISQUS のコメント欄を表示する
openComment = ->
  return if document.getElementById 'disqus_thread'

  # DISQUS コメント欄の入れ物
  disqusContainer = document.createElement 'div'
  disqusContainer.id = 'disqus_thread'
  getCommentBox().appendChild disqusContainer

  # DISQUS 用グローバル変数の設定
  entryUrl = getEntryUrl()
  window.disqus_url        = entryUrl
  window.disqus_identifier = getIdentifier entryUrl
  window.disqus_title      = getEntryTitle()

  includeEmbedJs()


# article.entry を受取り、その中の .comment-box を返す
getCommentBox = ->
  # entry 本文に ".comment-box" があっても動くように最後のを取得する
  elements = getEntryElement().querySelectorAll '.comment-box'
  elements[elements.length - 1]


# オリジナルの "コメントを書く" の element を返す
getOriginalOpenCommentElement = ->
  elements = getEntryElement().querySelectorAll '.leave-comment-title'
  elements[elements.length - 1]


# コメント欄を開くためのリンク/ボタンを作成する
createOpenCommentElement = ->
  openCommentElement = getOriginalOpenCommentElement().cloneNode true
  addClass    openCommentElement, 'open-disqus-thread'
  removeClass openCommentElement, 'leave-comment-title'
  openCommentElement.onclick = ->
    openCommentElement.style.display = 'none'
    openComment()
    false
  getCommentBox().appendChild openCommentElement
  openCommentElement


# コメント数を取得するための element を作成する
createCountAnchor = ->
  entryUrl = getEntryUrl()
  countAnchor = document.createElement 'a'
  countAnchor.href = entryUrl + '#disqus_thread'
  countAnchor.setAttribute 'data-disqus-identifier', getIdentifier entryUrl
  countAnchor.style.display = 'none'
  document.getElementsByTagName('body')[0].appendChild countAnchor


# コメント数の監視を開始する
startCountAnchorObservation = (countAnchor, openCommentElement) ->
  # disqus.com/count.js が load されることによって、
  # リンクの text がコメント数に書き換えられるまで observe を繰り返し実行する
  observeCount = 0

  observe = ->
    # 書き換えられていれば
    if matches = countAnchor.firstChild?.data.match /(\d+)\s*comments?/i
      # 用済みの countAnchor を削除
      countAnchor.parentNode.removeChild countAnchor

      # コメントがあれば
      if Number(matches[1]) > 0
        # コメント欄を表示する
        openCommentElement.style.display = 'none'
        openComment()

    # 書き換えられていなければ
    else
      # 500ミリ秒間隔で60回、約30秒間調べる
      setTimeout observe, 500 if ++observeCount < 60

  observe()


main = ->
  # 2重起動防止
  return if window.disqus_shortname
  window.disqus_shortname = 'm4i'

  openCommentElement = createOpenCommentElement()
  countAnchor        = createCountAnchor()

  includeCountJs()
  startCountAnchorObservation countAnchor, openCommentElement


# エントリーページのみに適用する
if location.pathname[0...7] == '/entry/'
  # DISQUS を表示したいのがこの JavaScript が挿入される部分よりも後にある、
  # かつ、すぐに表示しないといけないような性質のものではないので、
  # DOM をロードし終わった後に実行する
  if document.addEventListener
    document.addEventListener 'DOMContentLoaded', main, false
  else
    window.attachEvent 'onload', main
