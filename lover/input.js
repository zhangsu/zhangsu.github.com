Lover.leftKeyDown = false
Lover.rightKeyDown = false
Lover.downKeyDown = false
Lover.upKeyDown = false
Lover.mouseX = 0
Lover.mouseY = 0
Lover.hasFocus = true
Lover.mouseOnScreen = false

window.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
  case 37:
    Lover.leftKeyDown = true
    break
  case 38:
    Lover.upKeyDown = true
    break
  case 39:
    Lover.rightKeyDown = true
    break
  case 40:
    Lover.downKeyDown = true
    break
  default:
    return true
  }
  e.preventDefault()
}, true);

window.addEventListener('keyup', function (e) {
  switch (e.keyCode) {
  case 37:
    Lover.leftKeyDown = false
    break
  case 38:
    Lover.upKeyDown = false
    break
  case 39:
    Lover.rightKeyDown = false
    break
  case 40:
    Lover.downKeyDown = false
    break
  default:
    return true
  }
  e.preventDefault()
}, true);

window.addEventListener("mousemove", function (e) {
  var female = Lover.female, canvas = Lover.canvas
  if (!Lover.hasFocus) {
    Lover.mouseOnScreen = false
    if (female)
      female.huggingLover = false
    return
  }
  var x = e.pageX - canvas.offset.left
  var y = e.pageY - canvas.offset.top
  if (0 < x && x < canvas.width && 0 < y && y < canvas.height) {
    Lover.mouseOnScreen = true
    Lover.mouseX = x
    Lover.mouseY = y
    e.preventDefault()
  } else {
    Lover.mouseOnScreen = false
    if (female)
      female.moving = false
  }
}, true)

window.addEventListener("focus", function (e) {
  Lover.hasFocus = true
  Lover.leftKeyDown = false
  Lover.upKeyDown = false
  Lover.rightKeyDown = false
  Lover.downKeyDown = false
  var female = Lover.female
  if (female)
    female.moving = false
}, true)

window.addEventListener("blur", function (e) {
  Lover.hasFocus = false
  Lover.leftKeyDown = false
  Lover.upKeyDown = false
  Lover.rightKeyDown = false
  Lover.downKeyDown = false
  var female = Lover.female
  if (female)
    female.moving = false
}, true)
