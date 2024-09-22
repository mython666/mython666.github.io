const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  return `hsl(${random(0, 360)}, 100%, 50%)`;
}

function randomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}

class FlowPath {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.points = [];
    this.lifeSpan = 100;
    this.life = this.lifeSpan;
  }

  update() {
    this.life--;
    if (this.life <= 0) {
      this.points = [];
      this.life = this.lifeSpan;
      this.x = random(0, width);
      this.y = random(0, height);
    }

    this.points.push({ x: this.x, y: this.y });
    this.x += random(-3, 3) * randomSign();
    this.y += random(-3, 3) * randomSign();
  }

  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
  }
}

let flowPaths = [];

// 初始化一些路径
for (let i = 0; i < 25; i++) {
  let x = random(0, width);
  let y = random(0, height);
  let size = random(3, 6);
  let color = randomColor();
  flowPaths.push(new FlowPath(x, y, size, color));
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "#00FFFF"; // 设置背景色为深灰色
  ctx.fillRect(0, 0, width, height);

  flowPaths.forEach(path => {
    path.update();
    path.draw();
  });
}

animate();

