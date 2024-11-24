const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.9; // Адаптация под мобильные устройства
canvas.height = window.innerHeight * 0.9;

let player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50 };
let bullets = [];
let enemies = [];
let score = 0;

document.getElementById('startBtn').addEventListener('click', startGame);
document.addEventListener('keydown', shoot);
document.addEventListener('touchstart', shootMobile);

function startGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    
    // Сброс игры
    score = 0;
    bullets = [];
    enemies = [];
    
    gameLoop();
}

function shoot(event) {
    if (event.code === 'Space') {
        createBullet();
        playSound('shootSound');
    }
}

function shootMobile(event) {
    createBullet();
    playSound('shootSound');
}

function createBullet() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Сброс времени воспроизведения
    sound.play();
}

function createEnemy() {
    const x = Math.random() * (canvas.width - 50);
    enemies.push({ x, y: -50, width: 50, height: 50 });
}

function update() {
    // Обновление позиции пуль
    bullets.forEach((bullet, index) => {
        bullet.y -= 5; // Скорость пули
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
                playSound('explosionSound');
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
        animateBullet(bullet); // Анимация пули
    });

    // Рисуем врагов
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        animateEnemy(enemy); // Анимация врагов
    });

   // Выводим счет
   ctx.fillStyle = 'white';
   ctx.font = '20px Arial';
   ctx.fillText(`Счет: ${score}`, canvas.width - 150, 30);
}

function animateBullet(bullet) {
   ctx.save();
   ctx.translate(bullet.x + 2.5, bullet.y);
   ctx.rotate(Math.PI / 4); // Поворот пули для эффекта
   ctx.fillRect(-2.5, -10, 5, 10);
   ctx.restore();
}

function animateEnemy(enemy) {
   const scaleFactor = Math.sin(Date.now() / 500) * 0.1 + 1; // Эффект пульсации
   ctx.save();
   ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
   ctx.scale(scaleFactor, scaleFactor);
   ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
   ctx.restore();
}

function gameLoop() {
   update();
   draw();
   
   if (Math.random() < 0.02) createEnemy(); // Создаем врагов с некоторой вероятностью

   requestAnimationFrame(gameLoop);
}
