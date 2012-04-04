Character.FRAME_COUNT = 4

function Character(x, y, unitWidth, imagePath) {
  this.pace = 5
  this.x = x || 0
  this.y = y || 0
  this.unitWidth = unitWidth || 20
  this.alive = true

  this.spriteFrame = 0
  this.spriteFrameCount = 0
  this.orientation = 0
  this.scale = 1.0
  this.opacity = 1.0
  if (imagePath) {
    this.image = new Image()
    var self = this
    this.image.onload = function () {
      self.spriteWidth = this.width / 4
      self.spriteHeight = this.height / 4
    }
    this.image.src = imagePath
  }
}

Character.prototype = {
  overflow : function () {
    return this.x < 0 || this.y < 0 ||
           this.x >= canvas.width || this.y >= canvas.height
  },

  moveToward : function (direction) {
    switch (direction) {
    case 0:
      this.moveDown()
      break
    case 1:
      this.moveLeft()
      break
    case 2:
      this.moveRight()
      break
    case 3:
      this.moveUp()
      break
    }
  },

  undoMove : function (direction) {
    switch (direction) {
    case 0:
      this.undoMoveDown()
      break
    case 1:
      this.undoMoveLeft()
      break
    case 2:
      this.undoMoveRight()
      break
    case 3:
      this.undoMoveUp()
      break
    }
    this.moving = false
  },

  moveDown : function () {
    var y = this.y + this.pace
    if (y < Lover.canvas.height)
      this.y = y
    this.orientation = 0
  },

  moveUp : function () {
    var y = this.y - this.pace
    if (y >= 0)
      this.y = y
    this.orientation = 3
  },

  moveLeft : function () {
    var x = this.x - this.pace
    if (x >= 0)
      this.x = x
    this.orientation = 1
  },

  moveRight : function () {
    var x = this.x + this.pace
    if (x < Lover.canvas.width)
      this.x = x
    this.orientation = 2
  },
  undoMoveDown : function () {
    this.y -= this.pace
  },

  undoMoveUp : function () {
    this.y += this.pace
  },

  undoMoveLeft : function () {
    this.x += this.pace
  },

  undoMoveRight : function () {
    this.x -= this.pace
  },

  colliding : function (character) {
    if (!character.alive)
      return
    var thisOffset = this.unitWidth / 2,
        thisX1 = this.x - thisOffset,
        thisY1 = this.y - thisOffset,
        thisX2 = this.x + thisOffset,
        thisY2 = this.y + thisOffset,
        offset = character.unitWidth / 2,
        x1 = character.x - offset,
        y1 = character.y - offset,
        x2 = character.x + offset,
        y2 = character.y + offset
    return thisX1 <= x2 && thisX2 >= x1 && thisY1 <= y2 && thisY2 >= y1
  },

  draw : function () {
    ++this.spriteFrameCount
    if (this.spriteFrameCount > (this.moving ? this.pace : this.pace * 2)) {
      ++this.spriteFrame
      this.spriteFrame %= Character.FRAME_COUNT
      this.spriteFrameCount = 0
    }

    var context = Lover.context
    var width = Math.round(this.spriteWidth * this.scale)
    var height = Math.round(this.spriteHeight * this.scale)
    context.globalAlpha = this.opacity
    context.drawImage(this.image, this.spriteFrame * this.spriteWidth,
                      this.orientation * this.spriteHeight,
                      this.spriteWidth, this.spriteHeight,
                      this.x - width / 2, this.y - height / 2,
                      width, height)
  },
}
