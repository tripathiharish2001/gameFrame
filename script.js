window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  canvas.height = 650;
  canvas.width = 1400;
  // ########################################################################3

  // input handling
  class InputHandler {
    constructor(game) {
      this.game = game;
      // adding event for key press
      window.addEventListener("keydown", (e) => {
        // adding keys only if they do not exists. restricts more than one key to stay in array
        if (
          (e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          this.game.player.shootTop();
        }
        // console.log(this.game.keys);
      });

      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
          // console.log(this.game.keys);
        }
      });
    }
  }

  // ########################################################################3

  // input handling
  class Projectile {
    // x and y are players coordinate
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      // height and width of projectiles
      this.width = 10;
      this.height = 10;

      // speed of projectile
      // or for changing the position of projectile in y direction
      this.speed = 3;

      // for deletio of particle once it crosses boundry for every object/particle created
      this.markedForDeletion = false;
    }

    // updating position of projection
    update() {
      this.x += this.speed;
      // for deletion of projectiles which are out of range
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }

    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  // ########################################################################3

  // input handling
  class Particle {}

  // ########################################################################3
  // input handling
  class Player {
    constructor(game) {
      this.game = game;
      // height and width of player
      this.width = 100;
      this.height = 190;
      // starting horizontal height and width of Player
      this.x = 20;
      this.y = 100;

      // for verticle movement
      this.speedY = 0;
      this.speedX = 0;
      this.maxSpeed = 2;

      // holds all projectiles available
      this.projectiles = [];
    }

    // method to move player
    update() {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown"))
        this.speedY = this.maxSpeed;
      else if (this.game.keys.includes("ArrowRight"))
        this.speedX = this.maxSpeed;
      else if (this.game.keys.includes("ArrowLeft"))
        this.speedX = -this.maxSpeed;
      else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.y += this.speedY;
      this.x += this.speedX;

      // handle projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });

      // filters deleted projectiles form the array
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }

    draw(context) {
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);

      // drwaing each projectile
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }

    shootTop() {
      // pushing new proectile on space
      if (this.game.ammo > 0) {
        this.projectiles.push(new Projectile(this.game, this.x, this.y));
        this.game.ammo--;
      }
      // console.log(this.projectiles);
    }
  }

  // ########################################################################3

  // input handling
  class Enemy {
    constructor(game) {
      this.game = game;
      // starting of enemy
      this.x = this.game.width;
      // horizontal speed of enemy random bt -0.5 and -2 px
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
    }

    update() {
      this.x += this.speedX;
      if (this.x + this.game.width < 0) this.markedForDeletion = true;
      // console.log(this.x);
      // console.log(this.x);
      // console.log(this.game.enemies);
    }

    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "black";
      context.font = "20px Helvetica";
      context.fillText(this.lives, this.x, this.y);
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228 * 0.2;
      this.height = 169 * 0.2;
      this.y = Math.random() * (this.game.height * 0.9);
    }
  }

  // ########################################################################3

  // input handling
  class Layer {}

  // ########################################################################3

  // input handling
  class Background {}

  // ########################################################################3

  // input handling
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 20;
      this.fontFamily = "HelVetica";
      this.color = "white";
    }

    // only draw method and no update method
    draw(context) {
      context.fillStyle = this.color;
      context.font = this.fontSize + "px " + this.fontFamily;
      // score
      context.fillText("SCORE: " + this.game.score, 20, 40);
      // ammo
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i, 50, 3, 20);
      }

      // timer
      context.fillText(
        "TIMER : " + (this.game.gameTime * 0.001).toFixed(1),
        20,
        100
      );
      // game over
      if (this.game.gameOver) {
        let message1, message2;
        if (this.game.score >= this.game.winningScore) {
          message1 = "You win!";
          message2 = "Well done!";
        } else {
          message1 = "You Lose!";
          message2 = "Better Luck next time!";
        }

        // message display
        // context.textAlign = "center";
        context.font = "50px " + this.fontFamily;
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );

        context.font = "25px " + this.fontFamily;
        context.fillText(
          message2,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }
    }
  }

  // ########################################################################3

  // input handling
  class Game {
    constructor(width, height) {
      this.height = height;
      this.width = width;
      this.keys = [];
      this.enemies = [];

      this.ammo = 20;
      this.ammoTimer = 0;
      this.maxAmmo = 35;
      this.ammoInterval = 500;

      this.enemyTimer = 0;
      this.enemyInterval = 1000;

      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);

      this.score = 0;
      this.winningScore = 5;
      this.gameOver = false;

      // game timer
      this.gameTime = 0;
      this.gameLimit = 5000;
    }

    update(deltaTime) {
      if (this.gameTime < this.gameLimit) this.gameTime += deltaTime;
      if (this.gameTime > this.gameLimit) this.gameOver = true;
      // update player
      this.player.update();

      // updating ammo count
      // updating when ammo timer for updating ammo is greater than ammointerval and ammo is not full
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }

      // calling enemy update
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(enemy, this.player)) {
          if (!this.gameOver) this.score--;
          enemy.markedForDeletion = true;
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markedForDeletion = true;
              if (!this.gameOver) this.score += enemy.score;
              if (this.score >= this.winningScore) {
                this.gameOver = true;
              }
            }
          }
        });
      });

      // removing marked for deletion enemies
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

      // adding enemy as done for ammo
      // console.log(this.enemyTimer);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }

    draw(context) {
      // drawing updated player
      this.player.draw(context);

      // drawing ui for ammos
      this.ui.draw(context);

      // drawing enemy class
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }

    addEnemy() {
      this.enemies.push(new Angler1(this));
      console.log(this.enemies);
    }

    // checking collisions
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);

  //animate loop
  // we are going to run update and run methods for animation;

  // to store prev time stamp of animation
  let lastTime = 0;

  // ###########################################################################3
  // ANIMATION
  function animate(timeStamp) {
    // time difference of prev and curr
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // console.log(deltaTime);
    // clearing previous animations
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    // for performing animation of endless loop
    requestAnimationFrame(animate);
  }

  animate(0);
});
