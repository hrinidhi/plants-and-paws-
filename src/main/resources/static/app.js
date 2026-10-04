async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`);
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function renderNavigation() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const links = [
    ["/", "Home"], ["/animals", "Animals"], ["/plants", "Plants"],
    ["/adoption", "Adopt"], ["/reports", "Report"], ["/nearby", "Nearby"],
    ["/my-reports", "My Reports"], ["/admin/verification", "Admin"]
  ];
  const path = location.pathname.replace(/\/$/, "") || "/";
  nav.innerHTML = `<a class="brand" href="/"><img class="brand-logo" src="/images/Trust%20The%20Idea%20Logo.png" alt="Plants &amp; Paws"></a>
    <div class="nav-links">${links.map(([href, label]) => `<a href="${href}"${path === href || (href === "/" && path === "/home") ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</div>
    <div class="nav-actions"><a href="/login">Sign in</a><a class="nav-register" href="/register">Join us</a></div>`;
}

const animalCatalog = [
  { name: "Miso", species: "Cat", location: "Adyar, Chennai", age: "1 year", status: "Looking for a home", temperament: "Gentle, curious", health: "Vet-checked", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=82", description: "A soft-hearted little explorer who loves sunny windows and slow introductions." },
  { name: "Bruno", species: "Dog", location: "Besant Nagar, Chennai", age: "2 years", status: "Foster welcome", temperament: "Friendly, playful", health: "Healthy", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=82", description: "A cheerful companion who is happiest on a neighbourhood walk." },
  { name: "Clover", species: "Cat", location: "Mylapore, Chennai", age: "8 months", status: "Looking for a home", temperament: "Calm, affectionate", health: "Vaccinated", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=82", description: "A quiet cuddle-fan with a fondness for gentle company." },
  { name: "Sunny", species: "Dog", location: "Velachery, Chennai", age: "3 years", status: "Rescued · recovering", temperament: "Patient, warm", health: "Care follow-up", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=82", description: "Making a lovely recovery and ready for a kind foster family." },
  { name: "Pip", species: "Rabbit", location: "Alwarpet, Chennai", age: "1 year", status: "Looking for a home", temperament: "Quiet, sweet", health: "Healthy", image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=82", description: "A small, gentle friend who enjoys a calm space and fresh greens." }
];

const plantCatalog = [
  { name: "Monstera", location: "T. Nagar, Chennai", sunlight: "Bright, indirect", watering: "Weekly, when dry", difficulty: "Easy", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=82", description: "A generous leafy companion that likes warmth and room to unfurl." },
  { name: "Snake Plant", location: "Anna Nagar, Chennai", sunlight: "Low to bright", watering: "Every 2–3 weeks", difficulty: "Beginner", image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg?width=900", imageCredit: "Mokkie · CC BY-SA 3.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Snake_Plant_(Sansevieria_trifasciata_%27Laurentii%27).jpg", description: "Resilient, sculptural leaves make this an easy first plant." },
  { name: "Peace Lily", location: "Adyar, Chennai", sunlight: "Soft, indirect", watering: "Keep lightly moist", difficulty: "Easy", image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Peace_lily_-_1.jpg", imageCredit: "W.carter · CC BY-SA 4.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Peace_lily_-_1.jpg", description: "Graceful blooms and glossy leaves brighten a quiet corner." },
  { name: "Golden Pothos", location: "Mylapore, Chennai", sunlight: "Indirect light", watering: "Weekly, when dry", difficulty: "Beginner", image: "https://upload.wikimedia.org/wikipedia/commons/9/98/Golden_Pothos_%28Money_Plant%29.jpg?width=900", imageCredit: "Kuttykrishnan Photos · CC0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Golden_Pothos_(Money_Plant).jpg", description: "An adaptable trailing plant ready to find a new sunny shelf." },
  { name: "Rubber Plant", location: "Besant Nagar, Chennai", sunlight: "Bright, indirect", watering: "Every 1–2 weeks", difficulty: "Moderate", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/Ficus_November_2008-1.jpg", imageCredit: "Alvesgaspar · CC BY-SA 4.0", imageCreditUrl: "https://commons.wikimedia.org/wiki/File:Ficus_November_2008-1.jpg", description: "Bold, glossy leaves and an easygoing routine for a bright room." }
];

function setupCatalog(kind) {
  const host = document.querySelector(`#catalog[data-catalog-kind="${kind}"]`);
  if (!host) return;
  const items = kind === "animal" ? animalCatalog : plantCatalog;
  const search = document.querySelector("#catalogSearch");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const empty = document.querySelector("#catalogEmpty");
  let active = "All";
  const draw = () => {
    const term = (search?.value || "").trim().toLowerCase();
    const shown = items.filter(item => {
      const matchesType = active === "All" || (kind === "animal" ? item.species === active : item.difficulty === active);
      const matchesTerm = Object.values(item).join(" ").toLowerCase().includes(term);
      return matchesType && matchesTerm;
    });
    host.innerHTML = shown.map((item, index) => kind === "animal" ? animalCard(item, index) : plantCard(item, index)).join("");
    if (empty) empty.hidden = shown.length !== 0;
  };
  filters.forEach(button => button.addEventListener("click", () => {
    active = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute("aria-pressed", String(filter === button)));
    draw();
  }));
  search?.addEventListener("input", draw);
  draw();
}

function animalCard(item, index) {
  const queryName = encodeURIComponent(item.name);
  return `<article class="card"><div class="card-image"><img src="${item.image}" alt="${escapeHtml(item.name)}, a ${escapeHtml(item.species.toLowerCase())}" loading="lazy"><span class="pill">${escapeHtml(item.status)}</span></div>
    <div class="card-body"><div class="card-title-row"><div><h3>${escapeHtml(item.name)}</h3><p class="small-text">${escapeHtml(item.species)} · ${escapeHtml(item.age)}</p></div><span aria-hidden="true">&#128062;</span></div>
    <div class="card-meta"><span>&#128205; ${escapeHtml(item.location)}</span><span>&#9829; ${escapeHtml(item.temperament)}</span><span>&#10003; ${escapeHtml(item.health)}</span></div>
    <p>${escapeHtml(item.description)}</p><details><summary class="text-link">View care notes</summary><p class="small-text">Profile ${index + 1}: please contact a local rescue in person to confirm availability and care needs.</p></details>
    <div class="actions"><a class="btn small" href="/adoption?animal=${queryName}">Adopt</a><a class="btn soft small" href="/adoption?animal=${queryName}&amp;interest=foster">Foster</a><a class="btn alt small" href="/reports?type=ANIMAL&amp;title=${encodeURIComponent(`Help needed: ${item.name}`)}">Report</a></div></div></article>`;
}

function plantCard(item, index) {
  return `<article class="card"><div class="card-image"><img src="${item.image}" alt="${escapeHtml(item.name)} plant" loading="lazy"><span class="pill">${escapeHtml(item.difficulty)} care</span></div>
    <div class="card-body"><div class="card-title-row"><h3>${escapeHtml(item.name)}</h3><span aria-hidden="true">&#127807;</span></div>
    <div class="card-meta"><span>&#128205; ${escapeHtml(item.location)}</span><span>&#9728; ${escapeHtml(item.sunlight)}</span><span>&#128167; ${escapeHtml(item.watering)}</span></div>
    <p>${escapeHtml(item.description)}</p><details><summary class="text-link">View plant care</summary><p class="small-text">Care tip: check the soil before watering and keep tender leaves out of harsh afternoon sun.</p>${item.imageCredit ? `<p class="small-text">Photo: <a href="${escapeHtml(item.imageCreditUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.imageCredit)}</a></p>` : ""}</details>
    <div class="actions"><a class="btn small" href="/adoption?plant=${encodeURIComponent(item.name)}&amp;interest=plant">Adopt plant</a><a class="btn alt small" href="/reports?type=PLANT&amp;title=${encodeURIComponent(`Plant care: ${item.name}`)}">View / report</a></div></div></article>`;
}

function initChat() {
  const box = document.querySelector(".chat-box");
  const button = document.querySelector(".chat-btn");
  const input = document.querySelector("#chatInput");
  const send = document.querySelector("#chatSend");
  const body = document.querySelector(".chat-body");
  if (!box || !button || !input || !send || !body) return;

  const toggle = () => {
    box.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(box.classList.contains("is-open")));
    if (box.classList.contains("is-open")) input.focus();
  };
  button.onclick = toggle;
  async function go(message = input.value.trim()) {
    if (!message || send.disabled) return;
    body.insertAdjacentHTML("beforeend", `<div class="msg user">${escapeHtml(message)}</div><div class="typing" role="status">Paws is thinking...</div>`);
    body.scrollTop = body.scrollHeight;
    input.value = "";
    send.disabled = true;
    try {
      const data = await api("/api/chat", { method: "POST", body: JSON.stringify({ message }) });
      body.querySelector(".typing")?.remove();
      body.insertAdjacentHTML("beforeend", `<div class="msg">${escapeHtml(data.reply)}</div>`);
    } catch (error) {
      body.querySelector(".typing")?.remove();
      body.insertAdjacentHTML("beforeend", `<div class="msg" role="alert">Paws Assistant is temporarily unavailable. Please try again.</div>`);
    } finally {
      send.disabled = false;
      body.scrollTop = body.scrollHeight;
    }
  }
  document.querySelectorAll("[data-chat-prompt]").forEach(action => action.addEventListener("click", () => go(action.dataset.chatPrompt)));
  send.onclick = () => go();
  input.onkeydown = event => { if (event.key === "Enter") go(); };
}

function buildChat() {
  return `<aside class="chat" aria-label="Paws Assistant"><div class="chat-box" aria-label="Paws Assistant conversation">
    <div class="chat-head"><div>Paws Assistant<small>Here to help your community</small></div></div>
    <div class="chat-body" aria-live="polite"><div class="msg">Hello, kind human! I can point you toward adoption, reporting, plant care and more.</div></div>
    <div class="chat-quick" aria-label="Quick questions">
      <button type="button" data-chat-prompt="How can I adopt an animal?">Adopt an animal</button>
      <button type="button" data-chat-prompt="How do I report an animal?">Report an animal</button>
      <button type="button" data-chat-prompt="How do I report a plant?">Report a plant</button>
      <button type="button" data-chat-prompt="Where can I find nearby help?">Nearby help</button>
      <button type="button" data-chat-prompt="Can you share plant care tips?">Plant care</button>
      <button type="button" data-chat-prompt="What is Paws Passport?">Paws Passport</button>
    </div>
    <div class="chat-input"><input id="chatInput" aria-label="Ask Paws Assistant" placeholder="Ask me anything..."><button id="chatSend" type="button">Send</button></div>
  </div><button class="chat-btn" type="button" aria-label="Open Paws Assistant" aria-expanded="false">&#128062;</button></aside>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavigation();
  document.body.insertAdjacentHTML("beforeend", buildChat());
  initChat();
  setupCatalog("animal");
  setupCatalog("plant");
});
