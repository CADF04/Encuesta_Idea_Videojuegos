/* ============ CONFIGURACIÓN ============
   Pega aquí la URL de tu Apps Script publicado como aplicación web
   (termina en /exec). Mira las instrucciones de Code.gs. */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHT9ge9b9SwepnGd3IhD6s6GGEFvA0vp1ZRz8eE5vTqWed7H-tZz0hYpCndD-WgiRa/exec";

/* ============ ÍCONOS ============ */
const ICONOS = {
  A: '<circle cx="32" cy="32" r="24"/><path d="M32 22l9 6.5-3.5 10.5h-11L23 28.5z"/><path d="M32 22V8M41 28.5l14-4.5M37.5 39l8 12M26.5 39l-8 12M23 28.5L9 24"/>',
  B: '<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="6"/><path d="M32 8v18M32 38v18M8 32h18M38 32h18M15 15l12.7 12.7M36.3 36.3L49 49M49 15L36.3 27.7M27.7 36.3L15 49"/>',
  C: '<path d="M22 6C44 18 44 46 22 58"/><path d="M22 6V58"/><path d="M6 32h44M42 24l8 8-8 8"/>'
};
function icono(id, px) {
  return `<svg width="${px}" height="${px}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[id]}</svg>`;
}

/* ============ LAS 3 IDEAS ============
   Las letras A, B y C son fijas (así tus datos siempre usan la misma etiqueta),
   pero cada persona las ve en un orden distinto. */
const IDEAS = [
  {
    id: "A",
    nombre: "Carrera de futbolista con vida real",
    color: "var(--a)",
    texto: "Eres un futbolista que apenas arranca: sueldo bajo, un equipo de divisiones menores y una casa casi vacía. Con lo que ganas puedes hacer lo que quieras: amueblar tu casa, cambiar de carro, renovar tu ropa, salir de fiesta o ahorrar para algo grande. Pero cada decisión se siente en el campo: si te trasnochas, comes mal o te pasas de copas, rindes peor el fin de semana; si te cuidas, ganas el puesto de titular, te fichan equipos mejores y tu sueldo sube. Y tu vida no es solo fútbol: puedes conocer gente, hacer amigos, moverte por tu ciudad e incluso encontrar pareja."
  },
  {
    id: "B",
    nombre: "Evolución desde la prehistoria",
    color: "var(--b)",
    texto: "Es el inicio de todo, despiertas sin nada, con hambre, frío y depredadores cerca. La única forma de avanzar es explorar: cada lugar que recorres te enseña algo, y aprender es lo que te permite descubrir el fuego, dominar la construcción, inventar la rueda y fabricar mejores herramientas. Al explorar también te cruzas con otras personas y civilizaciones, y tú decides qué hacer: aliarte con ellas, comerciar o saquearlas. Con lo que construyes te proteges, atacas, te desplazas más lejos y das el salto a la siguiente época. Es supervivencia con progreso por eras: cada avance cambia lo que puedes hacer."
  },
  {
    id: "C",
    nombre: "Arena de supervivencia",
    color: "var(--c)",
    texto: "Estás atrapado en una arena con otros participantes y solo uno puede ganar. Pero no se trata solo de pelear: el día y la noche cambian las reglas y traen amenazas distintas, y el ambiente es hostil. ¿Cruzas el lago? Cuidado con cocodrilos. ¿Te adentras en la selva? Allí hay leones. ¿Te refugias en una cueva? Puede haber ratas infectadas. ¿Trepas a un árbol? Quizá haya abejas o bichos que te envenenan. Cada personaje tiene una habilidad especial y tú eliges cómo luchar: arquero de puntería certera, bruto con armas pesadas o sigiloso que ataca desde las sombras. Pueden haber trampas y emboscadas de otros participantes o tuyas. Es un último en pie, pero donde gana el ingenio."
  }
];
const PROBABILIDAD = ["Seguro", "Probablemente", "Tal vez", "Poco probable", "Nunca"];

/* ============ ORDEN ALEATORIO ============ */
function mezclar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const orden = mezclar(IDEAS);

/* ============ INICIO: tres íconos ============ */
document.getElementById("trio").innerHTML = orden.map(x => `<div class="t" style="background:${x.color}">${icono(x.id, 44)}</div>`).join("");

/* ============ PASOS DE CADA IDEA ============ */
const form = document.getElementById("survey");
const finalStep = form.querySelector('[data-kind="final"]');

orden.forEach((idea, i) => {
  const sec = document.createElement("section");
  sec.className = "step card";
  sec.dataset.kind = "idea";
  sec.dataset.idea = idea.id;
  sec.style.setProperty("--idea", idea.color);
  sec.style.setProperty("--pick", idea.color);

  const bloques = [1, 2, 3, 4, 5].map(n =>
    `<label class="opt"><input type="radio" name="${idea.id}_interes" value="${n}"><span>${n}</span></label>`
  ).join("");
  const probs = PROBABILIDAD.map(p =>
    `<label class="opt"><input type="radio" name="${idea.id}_prob" value="${p}"><span>${p}</span></label>`
  ).join("");

  sec.innerHTML = `
    <div class="idea-hero">
      <div class="ico">${icono(idea.id, 44)}</div>
      <div>
        <div class="which">Idea ${i + 1} de 3</div>
        <h2 tabindex="-1">${idea.nombre}</h2>
      </div>
    </div>
    <p class="idea-pitch">${idea.texto}</p>

    <fieldset>
      <legend>¿Qué tanto te llama la atención esta idea?</legend>
      <div class="meter">${bloques}</div>
      <div class="meter-ends"><span>1 = Nada</span><span>5 = Mucho</span></div>
    </fieldset>

    <fieldset>
      <legend>¿Qué tan probable es que la jugaras?</legend>
      <div class="options">${probs}</div>
    </fieldset>

    <fieldset>
      <legend><label for="${idea.id}_gusta" class="q" style="margin:0">¿Qué es lo que más te gusta de esta idea?</label></legend>
      <textarea id="${idea.id}_gusta" name="${idea.id}_gusta" maxlength="600"></textarea>
    </fieldset>

    <fieldset>
      <legend><label for="${idea.id}_preocupa" class="q" style="margin:0">¿Qué te preocupa o crees que podría fallar?</label></legend>
      <textarea id="${idea.id}_preocupa" name="${idea.id}_preocupa" maxlength="600"></textarea>
    </fieldset>
  `;
  form.insertBefore(sec, finalStep);
});

/* El medidor se llena hasta el valor elegido */
form.addEventListener("change", (e) => {
  const t = e.target;
  if (t.type === "radio" && /_interes$/.test(t.name)) {
    const n = Number(t.value);
    form.querySelectorAll(`input[name="${t.name}"]`).forEach(r => {
      r.closest(".opt").classList.toggle("on", Number(r.value) <= n);
    });
  }
});

/* ============ RANKING POR TOQUES ============ */
let ranking = [];
const rankBox = document.getElementById("rank");
const rankHint = document.getElementById("rankHint");
const rankReset = document.getElementById("rankReset");
const ETQ = ["1.º", "2.º", "3.º"];
const TXT = ["primera", "segunda", "tercera"];

function pintarRanking() {
  rankBox.innerHTML = "";
  orden.forEach(idea => {
    const pos = ranking.indexOf(idea.id);
    const b = document.createElement("button");
    b.type = "button";
    b.style.setProperty("--idea", idea.color);
    b.className = pos >= 0 ? "sel" : "";
    b.setAttribute("aria-pressed", pos >= 0 ? "true" : "false");
    b.setAttribute("aria-label", pos >= 0 ? `${idea.nombre}, tu ${TXT[pos]} opción` : `${idea.nombre}, sin elegir`);
    b.innerHTML = `<span class="ico">${icono(idea.id, 28)}</span><span class="name">${idea.nombre}</span><span class="badge">${pos >= 0 ? ETQ[pos] : ""}</span>`;
    b.addEventListener("click", () => {
      const k = ranking.indexOf(idea.id);
      if (k >= 0) ranking.splice(k, 1); else ranking.push(idea.id);
      rankBox.closest("fieldset").classList.remove("invalid");
      if (!form.querySelector("fieldset.invalid")) errorBox.textContent = "";
      pintarRanking();
      b.focus();
    });
    rankBox.appendChild(b);
  });
  rankHint.textContent = ranking.length === 3
    ? "Tu orden está listo."
    : ranking.length === 0
      ? "Toca primero la que más jugarías."
      : `Ahora toca tu ${TXT[ranking.length]} opción.`;
  rankReset.hidden = ranking.length === 0;
}
rankReset.addEventListener("click", () => { ranking = []; pintarRanking(); });
pintarRanking();

/* ============ NAVEGACIÓN ============ */
const steps = Array.from(form.querySelectorAll(".step"));
const TOTAL = steps.length - 2;          // pasos con preguntas (sin inicio ni gracias)
const GRACIAS = steps.length - 1;
let actual = 0;

const btnBack = document.getElementById("back");
const btnNext = document.getElementById("next");
const errorBox = document.getElementById("error");
const stepper = document.getElementById("stepper");
const actionbar = document.getElementById("actionbar");
const live = document.getElementById("live");

stepper.innerHTML = Array.from({ length: TOTAL }, (_, k) =>
  `<li><span class="node">${k + 1}</span></li>`).join("");
const nodos = Array.from(stepper.children);

function mostrar(i) {
  actual = i;
  steps.forEach((s, k) => s.classList.toggle("active", k === i));
  errorBox.textContent = "";

  const enPreguntas = i >= 1 && i <= TOTAL;
  stepper.classList.toggle("on", enPreguntas);
  actionbar.classList.toggle("on", enPreguntas);
  nodos.forEach((li, k) => {
    li.classList.toggle("done", k + 1 < i);
    li.classList.toggle("current", k + 1 === i);
    li.querySelector(".node").textContent = k + 1 < i ? "✓" : String(k + 1);
  });
  btnNext.textContent = i === TOTAL ? "Enviar respuestas" : "Siguiente";
  if (enPreguntas) live.textContent = `Paso ${i} de ${TOTAL}`;

  const h = steps[i].querySelector("h1, h2");
  if (h) h.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
  if (i === GRACIAS) lanzarConfeti();
}

function valor(nombre) {
  const el = form.querySelector(`input[name="${nombre}"]:checked`);
  return el ? el.value : "";
}
function valores(nombre) {
  return Array.from(form.querySelectorAll(`input[name="${nombre}"]:checked`)).map(e => e.value);
}

function vacio(nombre) {
  return !form.elements[nombre].value.trim();
}
function campo(nombre) {
  return form.querySelector(`[name="${nombre}"]`).closest("fieldset");
}

/* Devuelve null si todo está completo, o { msg, el } con el primer campo que falta. */
function validar(i) {
  const paso = steps[i];
  const tipo = paso.dataset.kind;
  const falta = (msg, el) => ({ msg, el });

  if (tipo === "about") {
    if (!valor("frecuencia")) return falta("Elige qué tan seguido juegas.", campo("frecuencia"));
    if (valores("plataformas").length === 0) return falta("Marca al menos una plataforma.", campo("plataformas"));
    if (valores("generos").length === 0) return falta("Marca al menos un género.", campo("generos"));
    if (vacio("favoritos")) return falta("Escribe cuáles son tus videojuegos favoritos.", campo("favoritos"));
  }
  if (tipo === "idea") {
    const id = paso.dataset.idea;
    if (!valor(id + "_interes")) return falta("Califica de 1 a 5 qué tanto te llama la atención esta idea.", campo(id + "_interes"));
    if (!valor(id + "_prob")) return falta("Elige qué tan probable es que la jugaras.", campo(id + "_prob"));
    if (vacio(id + "_gusta")) return falta("Cuéntame qué es lo que más te gusta de esta idea.", campo(id + "_gusta"));
    if (vacio(id + "_preocupa")) return falta("Cuéntame qué te preocupa o qué crees que podría fallar.", campo(id + "_preocupa"));
  }
  if (tipo === "final") {
    if (ranking.length !== 3) return falta("Toca las tres ideas para armar tu orden de preferencia.", rankBox.closest("fieldset"));
    if (!valor("precio")) return falta("Elige una opción sobre el precio.", campo("precio"));
    if (vacio("comentario")) return falta("Cuéntame qué le agregarías o cambiarías a tu primera opción.", campo("comentario"));
    if (!valor("demo")) return falta("Dinos si te gustaría probar una demo.", campo("demo"));
    if (vacio("contacto")) return falta("Escribe tu nombre o un contacto.", campo("contacto"));
  }
  return null;
}

function marcarFalta(fallo) {
  errorBox.textContent = fallo.msg;
  form.querySelectorAll("fieldset.invalid").forEach(f => f.classList.remove("invalid"));
  fallo.el.classList.add("invalid");
  fallo.el.scrollIntoView({ behavior: "smooth", block: "center" });
  const primero = fallo.el.querySelector("input, textarea, button");
  if (primero) primero.focus({ preventScroll: true });
}

/* Al corregir un campo, se quita la marca de error */
form.addEventListener("input", (e) => {
  const f = e.target.closest("fieldset");
  if (f) f.classList.remove("invalid");
  if (!form.querySelector("fieldset.invalid")) errorBox.textContent = "";
});
form.addEventListener("change", (e) => {
  const f = e.target.closest("fieldset");
  if (f) f.classList.remove("invalid");
  if (!form.querySelector("fieldset.invalid")) errorBox.textContent = "";
});

document.getElementById("start").addEventListener("click", () => mostrar(1));
btnBack.addEventListener("click", () => { if (actual > 0) mostrar(actual - 1); });
btnNext.addEventListener("click", async () => {
  const fallo = validar(actual);
  if (fallo) { marcarFalta(fallo); return; }
  errorBox.textContent = "";
  if (actual < TOTAL) { mostrar(actual + 1); return; }
  await enviar();
});

/* ============ ENVÍO A GOOGLE SHEETS ============ */
async function enviar() {
  if (form.elements["website"].value) { mostrar(GRACIAS); return; } // bot

  if (!SCRIPT_URL) {
    errorBox.textContent = "Falta configurar SCRIPT_URL en index.html para guardar las respuestas.";
    return;
  }

  const datos = {
    frecuencia: valor("frecuencia"),
    plataformas: valores("plataformas").join(", "),
    generos: valores("generos").join(", "),
    favoritos: form.elements["favoritos"].value.trim(),
    orden_mostrado: orden.map(x => x.id).join(">")
  };
  IDEAS.forEach(x => {
    datos[x.id + "_interes"] = valor(x.id + "_interes");
    datos[x.id + "_prob"] = valor(x.id + "_prob");
    datos[x.id + "_gusta"] = form.elements[x.id + "_gusta"].value.trim();
    datos[x.id + "_preocupa"] = form.elements[x.id + "_preocupa"].value.trim();
  });
  datos.ranking = ranking.join(">");
  datos.precio = valor("precio");
  datos.comentario = form.elements["comentario"].value.trim();
  datos.demo = valor("demo");
  datos.contacto = form.elements["contacto"].value.trim();

  btnNext.disabled = true;
  btnBack.disabled = true;
  btnNext.textContent = "Enviando…";

  try {
    // text/plain evita la verificación previa (CORS preflight) con Apps Script.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datos)
    });
    mostrar(GRACIAS);
  } catch (e) {
    errorBox.textContent = "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
    btnNext.disabled = false;
    btnBack.disabled = false;
    btnNext.textContent = "Enviar respuestas";
  }
}

/* ============ CONFETI (solo al terminar) ============ */
function lanzarConfeti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const caja = document.getElementById("done");
  const colores = ["#2BD48D", "#FFA62B", "#A66BFF", "#FFD43B", "#16143F"];
  for (let k = 0; k < 36; k++) {
    const c = document.createElement("span");
    c.className = "confeti";
    c.style.left = Math.random() * 100 + "%";
    c.style.background = colores[k % colores.length];
    c.style.animationDelay = (Math.random() * 0.5) + "s";
    c.style.animationDuration = (1.6 + Math.random() * 1.2) + "s";
    caja.appendChild(c);
  }
}

mostrar(0);
