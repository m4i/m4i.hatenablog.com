includeEmbedJs = ->
  s = document.createElement 'script'
  s.async = true
  s.src = "//#{disqus_shortname}.disqus.com/embed.js"
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild s

# URL を元に DISQUS の identifier を作成する
getIdentifier = (url) ->
  url
    .replace(/[#?].*$/, '')
    .replace(/^https?:\/\/[^\/]*/, '')
    .replace(/[^-\w]+/g, '')

# DISQUS のコメント欄を表示する
openComment = (entry) ->
  window.disqus_url =
    document.querySelector('link[rel="canonical"]').href ||
    canonicalise location.href

  window.disqus_identifier =
    getIdentifier disqus_url

  window.disqus_title =
    entry.querySelector('.entry-title > a').firstChild.data

  includeEmbedJs()

# article.entry を受取り、その中の .comment-box を返す
getCommentBox = (entry) ->
  # entry 本文に ".comment-box" があっても動くように最後のを取得する
  elements = entry.querySelectorAll '.comment-box'
  elements[elements.length - 1]

main = ->
  return if document.getElementById 'disqus_thread'

  window.disqus_shortname = 'm4i'

  # PC版は article.entry
  # Mobile版は li.entry-article
  entry = document.querySelector 'article.entry, li.entry-article'

  # DISQUS コメント欄の入れ物
  disqus_thread = document.createElement 'div'
  disqus_thread.id = 'disqus_thread'
  getCommentBox(entry).appendChild disqus_thread

  openComment entry

# エントリーページのみに適用する
if location.pathname[0...7] == '/entry/'
  # DISQUS を表示したいのがこの JavaScript が挿入される部分よりも後にある、
  # かつ、すぐに表示しないといけないような性質のものではないので、
  # DOM をロードし終わった後に実行する
  if document.addEventListener
    document.addEventListener 'DOMContentLoaded', main, false
  else
    window.attachEvent 'onload', main
