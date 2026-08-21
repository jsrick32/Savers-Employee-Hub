// ---------------------------------------------------------------------------
// Saver's Employee Hub — tool registry
// Each brand gets its own color identity (mark + tile color) since we
// display initials rather than pulling in third-party logo image assets.
// Swap in official logo PNGs later by replacing the .tool-card__icon markup.
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    name: "Workhappy",
    desc: "Paystubs and W2",
    url: "https://workhappy.fmssolutions.com/",
    mark: "W",
    bg: "#DCEFDD",
    fg: "#1E4620",
  },
  {
    name: "TimeForge",
    desc: "Scheduling and employee forms",
    url: "https://app.timeforge.com/Scheduler/login.jsp",
    mark: "TF",
    bg: "#D8E7FE",
    fg: "#0B3D91",
  },
  {
    name: "Employee Navigator",
    desc: "Benefits enrollment",
    url: "https://www.employeenavigator.com/identity/Account/Login?ReturnUrl=%2Fidentity%2Fconnect%2Fauthorize%2Fcallback%3FauthzId%3DF36D48538FDCC95A90DB177812F49F98BF60545C96EBA4FF51DD5ABB50797E01",
    mark: "EN",
    bg: "#DCEBFB",
    fg: "#0C4A8E",
  },
  {
    name: "Empower",
    desc: "401(k) provider",
    url: "https://plan.retirementpartner.com/planweb/#/login/?accu=PlanEmpowerCR&role=PL_USER",
    mark: "E",
    bg: "#FFEAB0",
    fg: "#4A3600",
  },
  {
    name: "Curative",
    desc: "Health insurance",
    url: "https://health.curative.com/",
    mark: "C",
    bg: "#D9E9F5",
    fg: "#0E3A56",
  },
  {
    name: "isolved",
    desc: "COBRA insurance",
    url: "https://www.isolvedhcm.com/login",
    mark: "iS",
    bg: "#E8DAF5",
    fg: "#4A1B72",
  },
];

const grid = document.getElementById("grid");

function renderTools(list) {
  grid.innerHTML = "";
  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No tools match your search.";
    grid.appendChild(empty);
    return;
  }
  list.forEach((tool) => {
    const card = document.createElement("button");
    card.className = "tool-card";
    card.setAttribute("data-name", tool.name.toLowerCase());
    card.setAttribute("data-desc", tool.desc.toLowerCase());
    card.innerHTML = `
      <div class="tool-card__icon" style="background:${tool.bg}; color:${tool.fg};">${tool.mark}</div>
      <div class="tool-card__body">
        <span class="tool-card__name">${tool.name}</span>
        <span class="tool-card__desc">${tool.desc}</span>
      </div>
      <span class="material-symbols-outlined tool-card__arrow" aria-hidden="true">north_east</span>
    `;
    card.addEventListener("click", () => openConfirm(tool));
    grid.appendChild(card);
  });
}

renderTools(TOOLS);

// ---------------- Search ----------------
const searchInput = document.getElementById("toolSearch");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = TOOLS.filter(
    (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
  );
  renderTools(filtered);
});

// ---------------- Greeting ----------------
const greetingTitle = document.getElementById("greetingTitle");
const hour = new Date().getHours();
let greeting = "Welcome back";
if (hour < 12) greeting = "Good morning";
else if (hour < 17) greeting = "Good afternoon";
else greeting = "Good evening";
greetingTitle.textContent = greeting;

// ---------------- Scroll-to helper ----------------
document.querySelector('[data-scroll="grid"]').addEventListener("click", () => {
  grid.scrollIntoView({ behavior: "smooth", block: "start" });
  searchInput.focus();
});

document.getElementById("helpChip").addEventListener("click", () => {
  alert("For login issues, reach out to your manager or the HR team.");
});

document.getElementById("profileBtn").addEventListener("click", () => {
  alert("Saver's Cost Plus\nEmployee Hub");
});

// ---------------- Link confirmation modal ----------------
const modalScrim = document.getElementById("modalScrim");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalContinue = document.getElementById("modalContinue");
const modalCancel = document.getElementById("modalCancel");

let pendingTool = null;

function openConfirm(tool) {
  pendingTool = tool;
  modalIcon.textContent = tool.mark;
  modalIcon.style.background = tool.bg;
  modalIcon.style.color = tool.fg;
  modalTitle.textContent = `Open ${tool.name}?`;
  modalBody.textContent = `You'll be taken to ${tool.name} (${tool.desc.toLowerCase()}) in a new tab.`;
  modalScrim.hidden = false;
}

function closeConfirm() {
  modalScrim.hidden = true;
  pendingTool = null;
}

modalCancel.addEventListener("click", closeConfirm);
modalScrim.addEventListener("click", (e) => {
  if (e.target === modalScrim) closeConfirm();
});
modalContinue.addEventListener("click", () => {
  if (pendingTool) window.open(pendingTool.url, "_blank", "noopener");
  closeConfirm();
});

// ---------------- Install prompt (Android/Chrome) ----------------
const installBanner = document.getElementById("installBanner");
const installBtn = document.getElementById("installBtn");
const dismissInstall = document.getElementById("dismissInstall");
const installSubtitle = document.getElementById("installSubtitle");
let deferredPrompt = null;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

if (!isStandalone() && !sessionStorage.getItem("savers-hub-install-dismissed")) {
  if (isIOS()) {
    installSubtitle.textContent = "Tap the Share icon, then \"Add to Home Screen\".";
    installBtn.textContent = "Got it";
    installBanner.hidden = false;
    installBtn.addEventListener("click", () => {
      installBanner.hidden = true;
    });
  } else {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBanner.hidden = false;
    });
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBanner.hidden = true;
    });
  }
}

dismissInstall.addEventListener("click", () => {
  installBanner.hidden = true;
  sessionStorage.setItem("savers-hub-install-dismissed", "1");
});

// ---------------- Service worker ----------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      /* offline support is best-effort */
    });
  });
}
