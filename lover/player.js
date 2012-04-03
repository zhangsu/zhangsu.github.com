Player.TURTLE_MOVE_DURATION = 3
Player.BREATH_BAR_MARGIN = 10
Player.BREATH_BAR_WIDTH = 50
Player.BREATH_BAR_HEIGHT = 400
Player.HEART_SCALE = 0.1

function Player(x, y, unitWidth, gender, imagePath) {
  Character.call(this, x, y, unitWidth, imagePath)
  this.turtleMoveCount = Player.TURTLE_MOVE_DURATION
  this.huggingLover = false
  this.heart = new Image()
  this.heart.src = "img/heart.png"
  var self = this
  this.heart.onload = function () {
      self.heartWidth = this.width
      self.heartHeight = this.height
  }
  this.heartScale = Player.HEART_SCALE
  this.heartOpacity = 1.0
  this.gender = gender
  if (gender == "male") {
    this.pace = 4
    this.breathBarX = Player.BREATH_BAR_MARGIN
    this.breath = this.maxBreath = 1200
    this.breathRegenRate = 2
    this.breathLoseRate = 4
  } else if (gender == "female") {
    this.pace = 6
    this.breathBarX = lover.canvas.width - Player.BREATH_BAR_WIDTH
                        - Player.BREATH_BAR_MARGIN
    this.breath = this.maxBreath = 1000
    this.breathRegenRate = 4
    this.breathLoseRate = 6
  } else {
    this.pace = 3
    this.breathBarX = Player.BREATH_BAR_MARGIN
    this.breath = this.maxBreath = 1000
    this.breathRegenRate = 2
    this.breathLoseRate = 5
  }
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
  if ((--this.turtleMoveCount) > 0)
    return this.orientation
  else
    this.turtleMoveCount = Player.TURTLE_MOVE_DURATION

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

Player.prototype.animateHeart = function() {
  var context = lover.context
  context.save()
  this.heartScale += 0.01
  if (this.heartScale >= 2 * Player.HEART_SCALE)
    this.heartScale = Player.HEART_SCALE
  this.heartOpacity -= 0.05
  if (this.heartOpacity <= 0)
    this.heartOpacity = 1.0
  var width = Math.round(this.heartWidth * this.heartScale),
      height = Math.round(this.heartHeight * this.heartScale);
  context.globalAlpha = this.heartOpacity
  context.drawImage(this.heart, this.x - width / 2, this.y - height / 2, width, height)
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
    this.animateHeart()
  }
}

Player.prototype.die = function () {
  if (!this.alive)
    return
  if (this.gender == "male")
    document.getElementById("boy-death-sound").play()
  else if (this.gender == "female")
    document.getElementById("girl-death-sound").play()
  this.alive = false
  this.huggingLover = false
}
