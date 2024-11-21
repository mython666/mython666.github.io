let player, ball, violetBricks, yellowBricks, redBricks, cursors;
let gameStarted = false;
let openingText, gameOverText, playerWonText;

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 640,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: false
    }
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('ball', 'images/ball.png');
  this.load.image('paddle', 'images/paddle.png');
  this.load.image('brick1', 'images/brick1.png');
  this.load.image('brick2', 'images/brick2.png');
  this.load.image('brick3', 'images/brick3.png');
}

function create() {
  player = this.physics.add.sprite(400, 600, 'paddle');
  ball = this.physics.add.sprite(400, 565, 'ball');

  violetBricks = this.physics.add.group({
    key: 'brick1',
    repeat: 9,
    immovable: true,
    setXY: { x: 80, y: 140, stepX: 70 }
  });

  yellowBricks = this.physics.add.group({
    key: 'brick2',
    repeat: 9,
    immovable: true,
    setXY: { x: 80, y: 90, stepX: 70 }
  });

  redBricks = this.physics.add.group({
    key: 'brick3',
    repeat: 9,
    immovable: true,
    setXY: { x: 80, y: 40, stepX: 70 }
  });

  cursors = this.input.keyboard.createCursorKeys();
  player.setCollideWorldBounds(true);
  ball.setCollideWorldBounds(true);
  ball.setBounce(1, 1);
  this.physics.world.checkCollision.down = false;

  this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
  this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
  this.physics.add.collider(ball, redBricks, hitBrick, null, this);
  player.setImmovable(true);
  this.physics.add.collider(ball, player, hitPlayer, null, this);

  openingText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'Press SPACE to Start', { fontFamily: 'Monaco, Courier, monospace', fontSize: '50px', fill: '#fff' }).setOrigin(0.5);
  gameOverText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'Game Over', { fontFamily: 'Monaco, Courier, monospace', fontSize: '50px', fill: '#fff' }).setOrigin(0.5).setVisible(false);
  playerWonText = this.add.text(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'You won!', { fontFamily: 'Monaco, Courier, monospace', fontSize: '50px', fill: '#fff' }).setOrigin(0.5).setVisible(false);
}

function update() {
  if (isGameOver(this.physics.world)) {
    gameOverText.setVisible(true);
    ball.disableBody(true, true);
  } else if (isWon()) {
    playerWonText.setVisible(true);
    ball.disableBody(true, true);
  } else {
    player.body.setVelocityX(0);
    if (cursors.left.isDown) {
      player.body.setVelocityX(-350);
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(350);
    }

    if (!gameStarted) {
      ball.setX(player.x);
      if (cursors.space.isDown) {
        gameStarted = true;
        ball.setVelocityY(-200);
        openingText.setVisible(false);
      }
    }
  }
}

function isGameOver(world) {
  return ball.body.y > world.bounds.height;
}

function isWon() {
  return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() === 0;
}

function hitBrick(ball, brick) {
  brick.disableBody(true, true);
  if (ball.body.velocity.x === 0) {
    ball.body.setVelocityX(Math.random() >= 0.5 ? 150 : -150);
  }
}

function hitPlayer(ball, player) {
  ball.setVelocityY(ball.body.velocity.y - 5);
  let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
  if (ball.x < player.x) {
    ball.setVelocityX(-newXVelocity);
  } else {
    ball.setVelocityX(newXVelocity);
  }
}







