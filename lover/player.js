Player.RETAIN_CURSOR_DIRECTION_COUNT = 3
Player.BREATH_BAR_MARGIN = 10
Player.BREATH_BAR_WIDTH = 50
Player.BREATH_BAR_HEIGHT = 400

function Player(x, y, unitWidth, imagePath) {
  Character.call(this, x, y, unitWidth, imagePath)
  this.pace = 3
  this.retainCursorDirectionCount = Player.RETAIN_CURSOR_DIRECTION_COUNT
  this.huggingLover = false
  this.breath = 1000
  this.maxBreath = 1000
  this.breathRegenRate = 2
  this.breathLoseRate = 5
  this.breathBarX = Player.BREATH_BAR_MARGIN
  this.heartImage = new Image()
  this.heartImage.src = "img/heart.png"
  this.heartScale = 0.1
}

Player.prototype = Object.create(new Character())

Player.prototype.updateBreath = function () {
  if (this.huggingLover) {
    if (this.breath < this.maxBreath) {
      this.breath += this.breathRegenRate
      if (this.breath > this.maxBreath)
        this.breath = this.maxBreath
    }
  } else if (this.breath > 0) {
    this.breath -= this.breathLoseRate
    if (this.breath <= 0) {
      this.die()
      this.breath = 0
    }
  }
}

Player.prototype.cursorDirection = function (deltaX, deltaY, cursorX, cursorY) {
  if ((--this.retainCursorDirectionCount) > 0)
    return this.orientation
  else
    this.retainCursorDirectionCount = Player.RETAIN_CURSOR_DIRECTION_COUNT

  if (deltaX < deltaY)
    return this.y < cursorY ? 0 : 3
  else
    return this.x < cursorX ? 2 : 1
}

Player.prototype.followCursor = function (cursorX, cursorY) {
  var deltaX = Math.abs(cursorX - this.x),
      deltaY = Math.abs(cursorY - this.y)
  if (deltaX <= this.pace && deltaY <= this.pace) {
    this.moving = false
    return
  }

  var direction = this.cursorDirection(deltaX, deltaY, cursorX, cursorY)
  this.moveToward(direction)
  this.moving = true
  return direction
}

Player.prototype.drawBreathBar = function() {
  var context = lover.context,
      radius = Player.BREATH_BAR_WIDTH / 2
  context.save()
  context.translate(this.breathBarX,
                    (lover.canvas.height - Player.BREATH_BAR_HEIGHT) / 2)
  context.globalAlpha = 0.5
  context.lineWidth = 3
  context.beginPath()
  context.strokeStyle = "rgb(30, 30, 30)"
  context.moveTo(0, 0)
  context.arcTo(radius, -400, Player.BREATH_BAR_WIDTH, 0, radius)
  context.lineTo(Player.BREATH_BAR_WIDTH, Player.BREATH_BAR_HEIGHT)
  context.arcTo(radius, Player.BREATH_BAR_HEIGHT + 400,
                0, Player.BREATH_BAR_HEIGHT, radius)
  context.lineTo(0, 0)
  context.stroke()
  context.clip()
  var barHeight = Player.BREATH_BAR_HEIGHT + radius * 2
  var progressHeight =
    this.alive ? Math.round(this.breath / this.maxBreath * barHeight) : 0
  context.fillStyle = Player.breathBarGradient
  context.fillRect(0, barHeight - progressHeight - radius,
                   Player.BREATH_BAR_WIDTH, progressHeight)
  context.restore()
}

Player.prototype.draw = function() {
  Character.prototype.draw.call(this)
  if (!this.alive) {
    if (this.scale < 0.01)
      return
    this.scale -= 0.01
    this.opacity -= 0.04
    if (this.opacity < 0)
    this.opacity = 0
    this.y += 1
  } else if (this.huggingLover) {
    var context = lover.context
   /* if (scale < 
    this.heartScale -= 0.01*/
    context.drawImage(this.heartImage, this.x - 10, this.y - 10, 20, 20)
  }
}

Player.prototype.die = function () {
  this.alive = false
  this.huggingLover = false
}
