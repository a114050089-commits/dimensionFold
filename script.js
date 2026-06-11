const canvas = document.querySelector("#rift-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];

function resize() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  particles = Array.from({ length: Math.min(110, Math.floor(width / 12)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.8 + 0.3,
    s: Math.random() * 0.4 + 0.1,
    a: Math.random() * Math.PI * 2,
  }));
}

function drawRift(time) {
  const cx = width * 0.56;
  const cy = height * 0.43;
  const radius = Math.min(width, height) * 0.34;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 0.00018) * 0.08);

  for (let layer = 0; layer < 9; layer += 1) {
    ctx.beginPath();
    const points = 84;
    for (let i = 0; i <= points; i += 1) {
      const angle = (i / points) * Math.PI * 2;
      const fold =
        Math.sin(angle * 3 + time * 0.0007 + layer) * 0.24 +
        Math.cos(angle * 7 - time * 0.00045) * 0.11;
      const rr = radius * (0.28 + layer * 0.075) * (1 + fold);
      const x = Math.cos(angle) * rr * 0.62;
      const y = Math.sin(angle) * rr * 1.18;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle =
      layer % 2 === 0
        ? `rgba(124, 255, 203, ${0.19 - layer * 0.012})`
        : `rgba(255, 63, 164, ${0.22 - layer * 0.014})`;
    ctx.lineWidth = 1.3;
    ctx.shadowBlur = 22;
    ctx.shadowColor = layer % 2 === 0 ? "#7cffcb" : "#ff3fa4";
    ctx.stroke();
  }

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.66);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
  gradient.addColorStop(0.35, "rgba(255, 63, 164, 0.08)");
  gradient.addColorStop(1, "rgba(3, 4, 8, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.42, radius * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles(time) {
  for (const particle of particles) {
    particle.a += 0.003;
    particle.y -= particle.s;
    particle.x += Math.sin(time * 0.001 + particle.a) * 0.18;
    if (particle.y < -10) particle.y = height + 10;
    ctx.beginPath();
    ctx.fillStyle = Math.random() > 0.985 ? "rgba(124, 255, 203, 0.9)" : "rgba(255,255,255,0.28)";
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCity() {
  const base = height * 0.9;
  ctx.fillStyle = "rgba(2, 4, 8, 0.74)";
  ctx.beginPath();
  ctx.rect(0, base, width, height - base);
  ctx.fill();

  for (let x = 0; x < width; x += 24) {
    const buildingHeight = 35 + ((x * 19) % 130);
    ctx.fillStyle = x % 72 === 0 ? "rgba(21, 27, 42, 0.82)" : "rgba(8, 13, 24, 0.86)";
    ctx.fillRect(x, base - buildingHeight, 18, buildingHeight);
  }
}

function animate(time = 0) {
  ctx.clearRect(0, 0, width, height);
  drawParticles(time);
  drawRift(time);
  drawCity();
  requestAnimationFrame(animate);
}

resize();
animate();
window.addEventListener("resize", resize);
