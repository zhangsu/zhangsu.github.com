Enemy.TURTLE_MOVE_COUNT = 10
Enemy.SPAWN_AREA_LENGTH = 100

function Enemy(unitWidth, imagePath) {
  var randInt = Lover.randInt
  Character.call(this, 0, 0, unitWidth, imagePath)
  var spawnPosition = {}, entryEdge = randInt(0, 4),
      canvasWidth = Lover.canvas.width,
      canvasHeight = Lover.canvas.height
  switch (entryEdge) {
  case 0:
    this.x = randInt(-Enemy.SPAWN_AREA_LENGTH, 0)
    this.y = randInt(-Enemy.SPAWN_AREA_LENGTH, canvasHeight)
    break
  case 1:
    this.x = randInt(-Enemy.SPAWN_AREA_LENGTH, canvasWidth)
    this.y = randInt(canvasHeight, canvasHeight + Enemy.SPAWN_AREA_LENGTH)
    break
  case 2:
    this.x = randInt(canvasWidth, canvasWidth + Enemy.SPAWN_AREA_LENGTH)
    this.y = randInt(Enemy.SPAWN_AREA_LENGTH,
                     canvasHeight + Enemy.SPAWN_AREA_LENGTH)
    break
  case 3:
    this.x = randInt(Enemy.SPAWN_AREA_LENGTH,
                              canvasWidth + Enemy.SPAWN_AREA_LENGTH)
    this.y = randInt(-Enemy.SPAWN_AREA_LENGTH, 0)
    break
  }
  // Enemies are always moving.
  this.moving = true
  this.pace = 5
  this.turtleMoveCount = Enemy.TURTLE_MOVE_COUNT
}

Enemy.prototype = Object.create(new Character())

Enemy.prototype.move = function (width, height) {
  if (this.x < 0)
    this.moveRight()
  else if (this.y < 0)
    this.moveDown()
  else if (this.x >= width)
    this.moveLeft()
  else if (this.y >= height)
    this.moveUp()
  else {
    if ((--this.turtleMoveCount) > 0)
      this.moveToward(this.orientation)
    else {
      this.turtleMoveCount = Enemy.TURTLE_MOVE_COUNT
      this.moveToward(Lover.randInt(0, 4))
    }
  }
}
