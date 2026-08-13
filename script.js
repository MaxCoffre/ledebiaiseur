const defaultNames = [
  "Candidat A", "Candidat B", "Candidat C",
  "Candidat D", "Candidat E", "Candidat F", "Candidat G"
];

const candidateInputs = document.getElementById("candidateInputs");
const countSelect = document.getElementById("candidateCount");

function renderInputs() {
  const count = Number(countSelect.value);
  candidateInputs.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 40;
    input.value = defaultNames[i];
    input.dataset.index = i;
    input.setAttribute("aria-label", `Nom du candidat ${i + 1}`);
    candidateInputs.appendChild(input);
  }
}

function randomNormal() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateShares(count) {
  // Distribution fictive : positive, irrégulière et normalisée à 100.
  const weights = Array.from({length: count}, () => Math.max(0.5, 1 + randomNormal() * 0.45));
  const total = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map(w => (w / total) * 100);

  const rounded = raw.map(x => Math.floor(x * 10) / 10);
  let remainder = Math.round((100 - rounded.reduce((a, b) => a + b, 0)) * 10) / 10;

  while (remainder > 0) {
    const i = Math.floor(Math.random() * count);
    rounded[i] = Math.round((rounded[i] + 0.1) * 10) / 10;
    remainder = Math.round((remainder - 0.1) * 10) / 10;
  }

  return rounded.sort((a, b) => b - a);
}

function generate() {
  const election = document.getElementById("election").value;
  const names = [...candidateInputs.querySelectorAll("input")]
    .map((input, i) => input.value.trim() || `Candidat ${String.fromCharCode(65 + i)}`);

  const shares = generateShares(names.length);
  const results = names.map((name, i) => ({name, pct: shares[i]}))
    .sort((a, b) => b.pct - a.pct);

  const title = document.getElementById("resultTitle");
  title.textContent = election;
  document.getElementById("resultQuestion").textContent =
    "Si le scrutin avait lieu aujourd'hui, pour qui voteriez-vous ?";

  const bars = document.getElementById("bars");
  bars.innerHTML = "";

  results.forEach((r) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-label"><span>${escapeHtml(r.name)}</span><span>${r.pct.toFixed(1).replace(".", ",")} %</span></div>
      <div class="track"><div class="fill" style="width:${r.pct}%"></div></div>
    `;
    bars.appendChild(row);
  });

  const n = Math.floor(800 + Math.random() * 1200);
  const margin = (1.96 * Math.sqrt(0.25 / n) * 100).toFixed(1).replace(".", ",");
  document.getElementById("sample").textContent = `Échantillon fictif : ${n.toLocaleString("fr-FR")} personnes`;
  document.getElementById("margin").textContent = `Marge théorique : ± ${margin} pt`;

  document.getElementById("seedLabel").textContent =
    `Scénario #${Math.floor(Math.random() * 900000 + 100000)}`;

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").scrollIntoView({behavior: "smooth", block: "start"});
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[char]));
}

document.getElementById("generate").addEventListener("click", generate);
document.getElementById("randomize").addEventListener("click", generate);
countSelect.addEventListener("change", renderInputs);

document.getElementById("copy").addEventListener("click", async () => {
  const result = document.getElementById("result");
  const text = `SONDAGE FICTIF — ${document.getElementById("resultTitle").textContent}

${[...result.querySelectorAll(".bar-row")].map(row => {
  const spans = row.querySelectorAll(".bar-label span");
  return `${spans[0].textContent} : ${spans[1].textContent}`;
}).join("\n")}

⚠ Résultats entièrement fictifs. Ils ne constituent pas une mesure de l'opinion publique.
ledebiaiseur`;

  try {
    await navigator.clipboard.writeText(text);
    const button = document.getElementById("copy");
    button.textContent = "Copié ✓";
    setTimeout(() => button.textContent = "Copier", 1600);
  } catch {
    alert("Impossible de copier automatiquement.");
  }
});

renderInputs();
