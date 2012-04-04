var Lover = {
  canvas : document.createElement('canvas'),
  mask : document.createElement('canvas'),
  randInt: function (leftBound, rightBound) {
    return Math.floor(Math.random() * (rightBound - leftBound)) + leftBound
  }
}

Lover.context = Lover.canvas.getContext('2d')

;(function () {
  var canvas = document.getElementById('viewport'),
      context = canvas.getContext('2d'),
      offscreenCanvas = Lover.canvas,
      offscreenContext = Lover.context,
      mask = Lover.mask,
      bgMusic = document.getElementById('bg-music'),

      enemies = [],
      score = 0,
      started = false

  bgMusic.volume = 0.3
  bgMusic.play()

  offscreenCanvas.setAttribute('width', canvas.width)
  offscreenCanvas.setAttribute('height', canvas.height)
  offscreenCanvas.offset = {
    left : canvas.offsetLeft,
    top : canvas.offsetTop
  }

  mask.setAttribute('width', canvas.width)
  mask.setAttribute('height', canvas.height)

  Player.breathBarGradient =
    offscreenContext.createLinearGradient(0, 0, 0, canvas.height)
  Player.breathBarGradient.addColorStop(0, '#5fffff')
  Player.breathBarGradient.addColorStop(1, '#7db9e8')

  var underWaterGradient =
        offscreenContext.createLinearGradient(0, 0, 0, canvas.height)
  underWaterGradient.addColorStop(0, '#1e5799')
  underWaterGradient.addColorStop(0.2, '#207cca')
  underWaterGradient.addColorStop(1, '#7db9e8')

  gotoPromptScreen()

  window.setInterval(spawnEnemy, 7500)

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

  function gotoPromptScreen() {
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
    var randInt = Lover.randInt
    Lover.male = new Player(randInt(0, canvas.width / 2), randInt(0, canvas.height),
      16, "male", "img/male.png"),
    Lover.female = new Player(randInt(canvas.width / 2, canvas.width),
      randInt(0, canvas.height), 16, "female", "img/female.png")
    enemies = []
    // Spawn enemies.
    for (var i = 0; i < 10; ++i)
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
    var male = Lover.male, female = Lover.female
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
    if (started) {
      male.drawBreathBar()
      female.drawBreathBar()
    }
    drawScore()
    if (!started)
      drawPromptScreen()
    context.drawImage(offscreenCanvas, 0, 0)
  }

  function drawPromptScreen() {
    var context = Lover.context
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
    var context = Lover.context
    context.globalAlpha = 0.5
    context.fillStyle = underWaterGradient
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  function drawScore() {
    var context = Lover.context
    context.font = "30pt Arial";
    context.textAlign = "center";
    context.fillStyle = "rgb(10,80,255)";
    context.fillText(score, canvas.width / 2,
                     canvas.height + canvas.offsetTop - 50);
  }

  function checkEnemyCollisions() {
    var male = Lover.male, female = Lover.female
    enemies.forEach(function (enemy) {
      if (male.colliding(enemy))
        male.die()
      if (female.colliding(enemy))
        female.die()
    })
  }

  function updateScore() {
    if (Lover.male.alive || Lover.female.alive) {
      score += Lover.randInt(1, 11)
    } else if (started) {
      var highscores = JSON.parse(localStorage.highscores)
      highscores.push(score)
      highscores.sort(function (a, b) { return b - a })
      localStorage.highscores = JSON.stringify(highscores.slice(0, 10))
      gotoPromptScreen()
    }
  }

  function updateMalePosition() {
    var male = Lover.male
    if (!male.alive)
      return
    male.moving = true
    if (Lover.leftKeyDown)
      male.moveLeft()
    else if (Lover.rightKeyDown)
      male.moveRight()
    else if (Lover.upKeyDown)
      male.moveUp()
    else if (Lover.downKeyDown)
      male.moveDown()
    else {
      male.moving = false
    }

    if (male.colliding(Lover.female)) {
      male.huggingLover = true
      if (Lover.leftKeyDown)
        male.undoMoveLeft()
      else if (Lover.rightKeyDown)
        male.undoMoveRight()
      else if (Lover.upKeyDown)
        male.undoMoveUp()
      else if (Lover.downKeyDown)
        male.undoMoveDown()
      male.moving = false
    } else {
      male.huggingLover = false
    }
  }

  function updateFemalePosition() {
    var female = Lover.female, mouseOnScreen = Lover.mouseOnScreen
    if (!female.alive)
      return
    var direction
    if (mouseOnScreen)
      direction = female.followCursor(Lover.mouseX, Lover.mouseY)
    if (female.colliding(Lover.male) && mouseOnScreen) {
      female.huggingLover = true
      female.undoMove(direction)
    } else {
      female.huggingLover = false
    }
  }

  function updateRecoverySound() {
    var sound = document.getElementById('recovery-sound')
    if (Lover.male.huggingLover || Lover.female.huggingLover)
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
    Lover.male.updateBreath()
    Lover.female.updateBreath()
  }
})()
