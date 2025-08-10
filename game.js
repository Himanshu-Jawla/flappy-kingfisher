const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Images
let bgImg = new Image();
bgImg.src = "pixel_sky.png";

let planeImg = new Image();
planeImg.src = "plane.png";

// Debt starting score
let score = -9000; // Example starting debt

// Plane properties
let plane = {
    x: 100,
    y: canvas.height / 2,
    width: 68 * 2,
    height: 48 * 2,
    velocity: 0,
    gravity: 0.5,
    lift: -10
};

// Game states
let gameOver = false;
let pipes = [];
let pipeWidth = 80;
let pipeGap = 200;
let frameCount = 0;

// Popup elements
const popup = document.getElementById("gameOverPopup");
const gameOverText = document.getElementById("gameOverText");
const restartBtn = document.getElementById("restartBtn");

// Restart logic
restartBtn.onclick = () => {
    score = -9000;
    pipes = [];
    plane.y = canvas.height / 2;
    plane.velocity = 0;
    gameOver = false;
    popup.classList.remove("show");
    setTimeout(() => popup.style.display = "none", 300);
    animate();
};

// Jump controls
window.addEventListener("keydown", e => {
    if (e.code === "Space") plane.velocity = plane.lift;
});
window.addEventListener("click", () => plane.velocity = plane.lift);

// Drawing functions
function drawBackground() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawPlane() {
    ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
}

function drawPipes() {
    ctx.fillStyle = "#008000";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Debt: ₹${Math.abs(score).toLocaleString()} cr left`, 20, 40);
}

// Update game logic
function updatePipes() {
    if (frameCount % 100 === 0) {
        let top = Math.random() * (canvas.height - pipeGap - 100);
        let bottom = top + pipeGap;
        pipes.push({ x: canvas.width, top: top, bottom: bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 3;

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score += 1; // Add ₹1 cr per pipe
        }

        // Collision check
        if (
            plane.x < pipe.x + pipeWidth &&
            plane.x + plane.width > pipe.x &&
            (plane.y < pipe.top || plane.y + plane.height > pipe.bottom)
        ) {
            endGame();
        }
    });
}

function updatePlane() {
    plane.velocity += plane.gravity;
    plane.y += plane.velocity;

    if (plane.y + plane.height > canvas.height || plane.y < 0) {
        endGame();
    }
}

// End game & show popup
function endGame() {
    gameOver = true;
    gameOverText.textContent = `Kingfisher still owes ₹${Math.abs(score).toLocaleString()} cr. Try Again?`;
    popup.style.display = "block";
    setTimeout(() => popup.classList.add("show"), 20);
}

// Animation loop
function animate() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPipes();
    drawPlane();
    drawScore();
    updatePlane();
    updatePipes();

    frameCount++;
    requestAnimationFrame(animate);
}

// Start game when background loads
bgImg.onload = () => {
    animate();
};
