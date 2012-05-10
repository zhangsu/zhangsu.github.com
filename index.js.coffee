$(window).load ->
  $scroll = $('#scroll')
  $roll = $('#container .roll-container:last')
  scrollHeight = $scroll.height()
  rollHeight = $roll.height()
  $scroll.height(scrollHeight)
  setTimeout ->
    $scroll.addClass('scrolling')

  $('.roll').click ->
    if $scroll.height() > 0
      $scroll.height(0)
      $roll.addClass('collapsed')
    else
      $scroll.height(scrollHeight)
      $roll.removeClass('collapsed')
