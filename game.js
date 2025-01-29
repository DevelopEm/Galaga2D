const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player, bullets = [], enemies = [], score = 0;

// Key press states
let keyState = {
    left: false,
    right: false,
    space: false
};

// Player object
function Player() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 50;
    this.width = 50;
    this.height = 30;
    this.speed = 5;

    this.update = function() {
        if (keyState.left && this.x > 0) this.x -= this.speed;
        if (keyState.right && this.x < canvas.width - this.width) this.x += this.speed;
    };

    this.draw = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

// Bullet object
function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = 7;

    this.update = function() {
        this.y -= this.speed;
    };

    this.draw = function() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

// Enemy object
function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 2;

    this.update = function() {
        this.y += this.speed;
    };

    this.draw = function() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
}

// Handle key inputs
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keyState.left = true;
    if (e.key === 'ArrowRight') keyState.right = true;
    if (e.key === ' ') keyState.space = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keyState.left = false;
    if (e.key === 'ArrowRight') keyState.right = false;
    if (e.key === ' ') keyState.space = false;
});

// Spawn enemies
function spawnEnemies() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            let enemy = new Enemy(50 + j * 60, 50 + i * 50);
            enemies.push(enemy);
        }
    }
}

// Collision detection
function detectCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 10;
                break;
            }
        }
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    // Update and draw bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        bullets[i].draw();
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }

    // Update and draw enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].y > canvas.height) {
            // Handle game over condition
            alert('Game Over!');
            enemies = [];
            bullets = [];
            score = 0;
            spawnEnemies();
        }
    }

    detectCollisions();

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    player = new Player();
    spawnEnemies();
    gameLoop();
}

// Start the game
init();

// Fire bullet
setInterval(() => {
    if (keyState.space) {
        bullets.push(new Bullet(player.x + player.width / 2 - 2, player.y));
    }
}, 200);
