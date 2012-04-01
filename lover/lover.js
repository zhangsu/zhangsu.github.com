function randInt(leftBound, rightBound) {
  return Math.floor(Math.random() * (rightBound - leftBound)) + leftBound
}

;(function () {
  var canvas = document.getElementById('viewport'),
      offscreenCanvas = document.createElement('canvas'),
      screenContext = canvas.getContext('2d'),
      context = offscreenCanvas.getContext('2d'),
      male, female, enemies = [],
      leftKeyDown = false,
      rightKeyDown = false,
      downKeyDown = false,
      upKeyDown = false,
      cursorX, cursorY, cursorOnScreen,
      sampleSpaceX, sampleSpaceY,
      underWaterGradient =
        context.createLinearGradient(0, 0, 0, canvas.height)

  underWaterGradient.addColorStop(0, '#1e5799')
  underWaterGradient.addColorStop(0.2, '#207cca')
  underWaterGradient.addColorStop(1, '#7db9e8')

  Player.breathBarGradient =
    context.createLinearGradient(0, 0, 0, canvas.height)
  Player.breathBarGradient.addColorStop(0, '#5fffff')
  Player.breathBarGradient.addColorStop(1, '#7db9e8')

  offscreenCanvas.setAttribute('width', canvas.width)
  offscreenCanvas.setAttribute('height', canvas.height)

  male = new Player(randInt(0, canvas.width / 2), randInt(0, canvas.height),
                    16, canvas.width, canvas.height, "male.png")
  female = new Player(randInt(canvas.width / 2, canvas.width),
                      randInt(0, canvas.height),
                      16, canvas.width, canvas.height, "female.png")
  male.pace = 4
  male.breathBarX = Player.BREATH_BAR_MARGIN
  male.breath = male.maxBreath = 1200
  male.breathRegenRate = 2
  male.breathLoseRate = 4

  female.pace = 5
  female.breathBarX = canvas.width - Player.BREATH_BAR_WIDTH
                      - Player.BREATH_BAR_MARGIN
  female.breath = female.maxBreath = 1000
  female.breathRegenRate = 4
  female.breathLoseRate = 6

  refresh()

  function refresh() {
    var sprites = enemies.slice(0)
    sprites.push(male)
    sprites.push(female)
    sprites.sort(function (a, b) {
      return a.y - b.y
    })
    sprites.forEach(function (sprite) {
      sprite.draw(context)
    })
    drawFullscreenMask()
    male.drawBreathBar(context)
    female.drawBreathBar(context)
    screenContext.drawImage(offscreenCanvas, 0, 0)
  }

  function drawFullscreenMask() {
    context.globalAlpha = 0.5
    context.fillStyle = underWaterGradient
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  function checkEnemyCollisions() {
    enemies.forEach(function (enemy) {
      if (male.colliding(enemy))
        male.die()
      if (female.colliding(enemy))
        female.die()
    })
  }

  function updateMalePosition() {
    if (!male.alive)
      return
    male.moving = true
    if (leftKeyDown)
      male.moveLeft()
    else if (rightKeyDown)
      male.moveRight()
    else if (upKeyDown)
      male.moveUp()
    else if (downKeyDown)
      male.moveDown()
    else {
      male.moving = false
      return
    }
    
    if (male.colliding(female)) {
      male.besideLover = true
      if (leftKeyDown)
        male.undoMoveLeft()
      else if (rightKeyDown)
        male.undoMoveRight()
      else if (upKeyDown)
        male.undoMoveUp()
      else if (downKeyDown)
        male.undoMoveDown()
      male.moving = false
    } else {
      male.besideLover = false
    }
  }

  function updateFemalePosition() {
    if (!female.alive || !cursorOnScreen)
      return
    var direction = female.followCursor(cursorX, cursorY)
    if (female.colliding(male)) {
      female.besideLover = true
      female.undoMove(direction)
    } else {
      female.besideLover = false
    }
  }

  function updateEnemyPositions() {
    enemies.forEach(function (enemy) {
      enemy.move(canvas.width, canvas.height)
    })
  }

  function updateBreaths() {
    male.updateBreath()
    female.updateBreath()
  }

  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
    case 37:
      leftKeyDown = true
      break
    case 38:
      upKeyDown = true
      break
    case 39:
      rightKeyDown = true
      break
    case 40:
      downKeyDown = true
      break
    default:
      return true
    }
    e.preventDefault()
  }, true);

  window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
    case 37:
      leftKeyDown = false
      break
    case 38:
      upKeyDown = false
      break
    case 39:
      rightKeyDown = false
      break
    case 40:
      downKeyDown = false
      break
    default:
      return true
    }
    e.preventDefault()
  }, true);

  window.addEventListener("mousemove", function (e) {
    var x = e.clientX - canvas.offsetLeft
    var y = e.clientY - canvas.offsetTop
    if (0 < x && x < canvas.width && 0 < y && y < canvas.height) {
      cursorOnScreen = true
      cursorX = x
      cursorY = y
      e.preventDefault()
    } else {
      cursorOnScreen = false
      female.moving = false
    }
  }, true)

  window.addEventListener("blur", function (e) {
    leftKeyDown = false
    upKeyDown = false
    rightKeyDown = false
    downKeyDown = false
    cursorOnScreen = false
    female.moving = false
  }, true)

  // Main logic layer loop.
  window.setInterval(function () {
    updateMalePosition()
    updateFemalePosition()
    updateEnemyPositions()
    checkEnemyCollisions()
    updateBreaths()
    refresh()
  }, 50)
  
  function spawnEnemy() {
    enemies.push(new Enemy(20, canvas.width, canvas.height, "undead.png"))
  }

  // Spawn enemies.
  for (var i = 0; i < 20; ++i)
    spawnEnemy()
  window.setInterval(spawnEnemy, 5000)
})()