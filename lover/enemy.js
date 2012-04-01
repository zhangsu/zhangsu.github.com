Enemy.RETAIN_DIRECTION_COUNT = 10
Enemy.SPAWN_AREA_LENGTH = 100

function Enemy(unitWidth, canvasWidth, canvasHeight, imagePath) {
  Character.call(this, 0, 0, unitWidth, canvasWidth, canvasHeight, imagePath)
  var spawnPosition = {}, entryEdge = randInt(0, 4)
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
  this.pace = 5
  this.retainDirectionCount = Enemy.RETAIN_DIRECTION_COUNT
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
    if ((--this.retainDirectionCount) > 0)
      this.moveToward(this.orientation)
    else {
      this.retainDirectionCount = Enemy.RETAIN_DIRECTION_COUNT
      this.moveToward(randInt(0, 4))
    }
  }
}