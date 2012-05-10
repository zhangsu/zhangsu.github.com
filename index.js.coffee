$(window).load ->
  $scroll = $('#scroll')
  scrollHeight = $scroll.height()
  $scroll.height(scrollHeight)
  setTimeout ->
    $scroll.addClass('sliding')
  $('.roll').click ->
    $scroll.height(if $scroll.height() > 0 then 0 else scrollHeight)
