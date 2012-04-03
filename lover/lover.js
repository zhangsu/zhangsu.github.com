function randInt(leftBound, rightBound) {
  return Math.floor(Math.random() * (rightBound - leftBound)) + leftBound
}

var lover = {
  canvas : document.createElement('canvas'),
  mask : document.createElement('canvas')
}

lover.context = lover.canvas.getContext('2d')

;(function () {
  var canvas = document.getElementById('viewport'),
      context = canvas.getContext('2d'),
      male, female, enemies = [],
      leftKeyDown = false,
      rightKeyDown = false,
      downKeyDown = false,
      upKeyDown = false,
      cursorX, cursorY, hasFocus = true,
      cursorOnScreen,
      sampleSpaceX, sampleSpaceY,
      maleHuggingFemale, femaleHuggingMale,
      score = 0,
      started = false
  
  var bgMusic = document.getElementById('bg-music')
  bgMusic.volume = 0.3
  bgMusic.play()

  lover.canvas.setAttribute('width', canvas.width)
  lover.canvas.setAttribute('height', canvas.height)
  lover.mask.setAttribute('width', canvas.width)
  lover.mask.setAttribute('height', canvas.height)

  Player.breathBarGradient =
    lover.context.createLinearGradient(0, 0, 0, canvas.height)
  Player.breathBarGradient.addColorStop(0, '#5fffff')
  Player.breathBarGradient.addColorStop(1, '#7db9e8')

  var maskContext = lover.mask.getContext('2d'),
      underWaterGradient =
        maskContext.createLinearGradient(0, 0, 0, canvas.height)
  underWaterGradient.addColorStop(0, '#1e5799')
  underWaterGradient.addColorStop(0.2, '#207cca')
  underWaterGradient.addColorStop(1, '#7db9e8')
  maskContext.globalAlpha = 0.6
  maskContext.fillStyle = underWaterGradient
  maskContext.fillRect(0, 0, canvas.width, canvas.height)
  
  gotoPrepareScreen()

  window.setInterval(spawnEnemy, 5000)

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
    if (!hasFocus) {
      cursorOnScreen = false
      female.huggingLover = false
      return
    }
    var x = e.pageX - canvas.offsetLeft
    var y = e.pageY - canvas.offsetTop
    if (0 < x && x < canvas.width && 0 < y && y < canvas.height) {
      cursorOnScreen = true
      cursorX = x
      cursorY = y
      e.preventDefault()
    } else {
      cursorOnScreen = false
      if (female)
        female.moving = false
    }
  }, true)

  window.addEventListener("focus", function (e) {
    hasFocus = true
    leftKeyDown = upKeyDown = rightKeyDown = downKeyDown = false
    if (female)
      female.moving = false
  }, true)

  window.addEventListener("blur", function (e) {
    hasFocus = false
    leftKeyDown = upKeyDown = rightKeyDown = downKeyDown = false
    if (female)
      female.moving = false
  }, true)

  // Main logic layer loop.
  var mainUpdater = window.setInterval(function () {
    updateEnemyPositions()
    if (started) {
      updateMalePosition()
      updateFemalePosition()
      checkEnemyCollisions()
      updateBreaths()
      updateScore()
      updateRecoverySound()
    }
    refresh()
  }, 50)

  function gotoPrepareScreen() {
    started = false
    var clickToContinue = window.addEventListener("click", cont)
    var pressToContinue = window.addEventListener("keypress", cont)

    function cont(e) {
      e.preventDefault()
      window.removeEventListener('click', cont)
      window.removeEventListener('keypress', cont)
      restart()
    }

    showHighscores()
  }

  function restart() {
    male = new Player(randInt(0, canvas.width / 2), randInt(0, canvas.height),
                      16, "male", "img/male.png"),
    female = new Player(randInt(canvas.width / 2, canvas.width),
                        randInt(0, canvas.height), 16, "female", "img/female.png")
    enemies = []
    // Spawn enemies.
    for (var i = 0; i < 20; ++i)
      spawnEnemy()
    started = true
    score = 0

    var boyDeathSound = document.getElementById("boy-death-sound")
    var girlDeathSound = document.getElementById("girl-death-sound")
    boyDeathSound.pause()
    girlDeathSound.pause()
    boyDeathSound.currentTime = 0
    girlDeathSound.currentTime = 0
  }

  function showHighscores() {
    if (!Storage)
      return

    var highscoreDiv = document.getElementById("highscore")
    highscoreDiv.innerHTML = ''

    if (localStorage.highscores) {
      JSON.parse(localStorage.highscores).forEach(function (score) {
        var scoreDiv = document.createElement("div"),
            text = document.createTextNode(score)
        scoreDiv.appendChild(text)
        highscoreDiv.appendChild(scoreDiv)
      })
    } else {
      localStorage.highscores = JSON.stringify([])
    }
  }

  function spawnEnemy() {
    enemies.push(new Enemy(50, "img/giantsquid.png"))
  }

  function refresh() {
    var sprites = enemies.slice(0)
    if (male)
      sprites.push(male)
    if (female)
      sprites.push(female)
    sprites.sort(function (a, b) {
      return a.y - b.y
    })
    sprites.forEach(function (sprite) {
      sprite.draw()
    })
    drawFullscreenMask()
    if (male)
      male.drawBreathBar()
    if (female)
      female.drawBreathBar()
    drawScore()
    if (!started)
      drawPrepareScreen()
    context.drawImage(lover.canvas, 0, 0)
  }

  function drawPrepareScreen() {
    var context = lover.context
    context.fillStyle = "black"
    context.fillRect(0, 0, canvas.width, canvas.height)
    var x = canvas.width / 2
    context.textAlign = "center"
    context.fillStyle = "white"
    context.font = "20pt Arial"
    context.fillText("Move mouse to move the girl", x, 150)
    context.fillText("Use arrow keys to move the boy", x, 200)
    context.fillText("Avoid the evil sea monsters!", x, 300)
    context.fillText("Move toward and hug each other to survive!", x, 350)
    context.font = "30pt Arial"
    context.fillText("Continue", x, 450)
  }

  function drawFullscreenMask() {
    var context = lover.context
    context.globalAlpha = 0.5
    context.fillStyle = underWaterGradient
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  function drawScore() {
    var context = lover.context
    context.font = "30pt Arial";
    context.textAlign = "center";
    context.fillStyle = "rgb(10,80,255)";
    context.fillText(score, canvas.width / 2,
                     canvas.height + canvas.offsetTop - 50);
  }

  function checkEnemyCollisions() {
    enemies.forEach(function (enemy) {
      if (male.colliding(enemy))
        male.die()
      if (female.colliding(enemy))
        female.die()
    })
  }

  function updateScore() {
    if (male.alive || female.alive) {
      score += randInt(1, 11)
    } else if (started) {
      var highscores = JSON.parse(localStorage.highscores)
      highscores.push(score)
      highscores.sort(function (a, b) { return b - a })
      localStorage.highscores = JSON.stringify(highscores.slice(0, 10))
      gotoPrepareScreen()
    }
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
    }

    if (male.colliding(female)) {
      male.huggingLover = true
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
      male.huggingLover = false
    }
  }

  function updateFemalePosition() {
    if (!female.alive)
      return
    var direction
    if (cursorOnScreen)
      direction = female.followCursor(cursorX, cursorY)
    if (female.colliding(male) && cursorOnScreen) {
      female.huggingLover = true
      female.undoMove(direction)
    } else {
      female.huggingLover = false
    }
  }

  function updateRecoverySound() {
    var sound = document.getElementById('recovery-sound')
    if (male.huggingLover || female.huggingLover)
      sound.play()
    else
      sound.pause()
  }

  function updateEnemyPositions() {
    enemies.forEach(function (enemy) {
      enemy.move()
    })
  }

  function updateBreaths() {
    male.updateBreath()
    female.updateBreath()
  }
})()
