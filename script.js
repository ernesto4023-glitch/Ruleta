const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const generarBtn = document.getElementById("generar");
const cantidadInput = document.getElementById("cantidad");
const modal = document.getElementById("modal");
const winnerName = document.getElementById("winnerName");
const closeModal = document.getElementById("closeModal");
const cerrarBtn = document.getElementById("cerrarBtn");
const vaciarListaBtn = document.getElementById("vaciarLista");

let cantidadTickets = 1;
let currentAngle = 0;
let colors = [];

// Dibujar ruleta
function drawWheel() {
  const anglePerSlice = (2 * Math.PI) / cantidadTickets;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cantidadTickets; i++) {
    const startAngle = i * anglePerSlice + currentAngle;
    const endAngle = startAngle + anglePerSlice;

    // Sector
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, startAngle, endAngle);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(startAngle + anglePerSlice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.font = "bold 16px poppins";
    ctx.fillText(i + 1, 230, 10);
    ctx.restore();
  }

  // Centro decorativo
  ctx.beginPath();
  ctx.arc(250, 250, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();
}

// Colores aleatorios
function randomColor() {
  return `hsl(${Math.random() * 360}, 70%, 55%)`;
}

// Generar talonario
function generarTalonario() {
  const talonarioDiv = document.getElementById("talonario");
  talonarioDiv.innerHTML = "";

  for (let i = 0; i < cantidadTickets; i++) {
    const numDiv = document.createElement("div");
    numDiv.classList.add("ticket");
    numDiv.textContent = i + 1;
    talonarioDiv.appendChild(numDiv);
  }
}

// Generar ruleta
function generarRuleta() {
  cantidadTickets = parseInt(cantidadInput.value);
  colors = Array.from({ length: cantidadTickets }, () => randomColor());
  currentAngle = 1;
  drawWheel();
  generarTalonario(); // 🔥 también se genera el talonario
  spinBtn.disabled = false;
}

// Girar ruleta
function spinWheel() {
  spinBtn.disabled = true;
  let spinAngle = Math.random() * 2000 + 3000; // ángulo total
  let duration = 5000;
  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let angle = easeOut(progress, 1, spinAngle, duration);

    currentAngle = angle * Math.PI / 180;
    drawWheel();

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      mostrarGanador();
      spinBtn.disabled = false;
    }
  }
  requestAnimationFrame(animate);
}

// Easing (frenado suave)
function easeOut(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
}

// Mostrar ganador
function mostrarGanador() {
  const anglePerSlice = (2 * Math.PI) / cantidadTickets;

  // Ajustamos el ángulo para la flecha en la parte superior
  let adjustedAngle = (2 * Math.PI - (currentAngle % (2 * Math.PI)) + Math.PI/2) % (2 * Math.PI);

  let ganador = Math.floor(adjustedAngle / anglePerSlice);
  winnerName.textContent = `🎉 El número ganador es: ${ganador}`;
  modal.style.display = "flex";

  // Guardar en localStorage
  let ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];
  ganadores.push({ numero: ganador, fecha: new Date().toLocaleString() });
  localStorage.setItem("ganadores", JSON.stringify(ganadores));

  // Resaltar en el talonario
  const tickets = document.querySelectorAll(".ticket");
  if (tickets[ganador]) {
    tickets[ganador].classList.add("ganador");
  }
}

// Eventos
generarBtn.addEventListener("click", generarRuleta);
spinBtn.addEventListener("click", spinWheel);
closeModal.addEventListener("click", () => { modal.style.display = "none"; });
cerrarBtn.addEventListener("click", () => { modal.style.display = "none"; });

// Generar ruleta por defecto
window.onload = generarRuleta;
