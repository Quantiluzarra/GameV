const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: canvas.width / 2, y: canvas.height - 30, width: 50, height: 50 };
let bullets = [];
let enemies = [];
let score = 0;

document.getElementById('startBtn').addEventListener('click', startGame);
document.addEventListener('keydown', shoot);

function startGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    gameLoop();
}

function shoot(event) {
    if (event.code === 'Space') {
        bullets.push({ x: player.x + player.width / 2, y: player.y });
        document.getElementById('shootSound').play();
    }
}

function createEnemy() {
    const x = Math.random() * (canvas.width - 50);
    enemies.push({ x, y: 0, width: 50, height: 50 });
}

function update() {
    // Обновление позиции пуль
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
        
        // Проверка на столкновение с врагами
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                bullets.splice(index, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                document.getElementById('explosionSound').play();
            }
        });
    });

    // Обновление позиции врагов
    enemies.forEach(enemy => {
        enemy.y += 2; // Скорость врагов
        if (enemy.y > canvas.height) {
            enemies.splice(enemies.indexOf(enemy), 1);
            score -= 5; // Штраф за пропущенного врага
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем игрока
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Рисуем пули
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2.5, bullet.y - 10, 5, 10);
    });

    // Рисуем врагов
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Выводим счет
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Счет: ${score}`, 10, 20);
}

function gameLoop() {
    update();
    draw();
    
    if (Math.random() < 0.02) createEnemy(); // Создаем врагов с некоторой вероятностью

    requestAnimationFrame(gameLoop);
}
