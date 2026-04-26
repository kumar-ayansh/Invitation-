// ---------------- Preloader ----------------
const preloader = document.getElementById("preloader");
const loadBarFill = document.getElementById("loadBarFill");
let load = 0;
const preloadTimer = setInterval(() => {
  load += Math.random() * 18;
  if (load >= 100) load = 100;
  loadBarFill.style.width = load + "%";
  if (load === 100) {
    clearInterval(preloadTimer);
    setTimeout(() => preloader.classList.add("hide"), 350);
  }
}, 120);

// ---------------- Guest personalization ----------------
const params = new URLSearchParams(location.search);
const guest = params.get("guest");
if (guest) {
  const guestLine = document.getElementById("guestLine");
  if (guestLine) guestLine.textContent = `Dear ${decodeURIComponent(guest)},`;
}

// ---------------- Typing utility ----------------
function typeText(el, text, speed = 42) {
  if (!el) return;
  let i = 0;
  el.textContent = "";
  const t = setInterval(() => {
    el.textContent += text.charAt(i++);
    if (i >= text.length) clearInterval(t);
  }, speed);
}

// Hero typing
typeText(
  document.getElementById("typingText"),
  "With the blessings of God and our elders, we invite you to celebrate the wedding of Santosh Yadav & Rubi Yadav.",
  30
);

// Hindi typing on view
const hindiInviteText = document.getElementById("hindiInviteText");
const hindiMsg =
`आप सपरिवार सादर आमंत्रित हैं।
हमारे प्रिय संतोष यादव एवं रूबी यादव के शुभ विवाह समारोह में आपकी उपस्थिति हमारे लिए हर्ष और सौभाग्य का विषय होगी।
कृपया पधारकर नवदंपति को अपना आशीर्वाद प्रदान करें।`;

if (hindiInviteText && document.getElementById("message")) {
  const msgObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !hindiInviteText.dataset.done) {
        hindiInviteText.dataset.done = "1";
        typeText(hindiInviteText, hindiMsg, 22);
      }
    });
  }, { threshold: 0.35 });
  msgObs.observe(document.getElementById("message"));
}

// ---------------- Language toggle (label only) ----------------
let langHindi = true;
const langToggle = document.getElementById("langToggle");
langToggle?.addEventListener("click", () => {
  langHindi = !langHindi;
  langToggle.textContent = langHindi ? "हिं / EN" : "EN / हिं";
});

// ---------------- Theme cycle button ----------------
const themeCycleBtn = document.getElementById("themeCycleBtn");
const themes = window.APP_CONFIG?.themes || ["royal-gold", "floral-pastel", "dark-luxury"];
let themeIndex = themes.indexOf(document.documentElement.getAttribute("data-theme"));
if (themeIndex < 0) themeIndex = 0;

themeCycleBtn?.addEventListener("click", () => {
  themeIndex = (themeIndex + 1) % themes.length;
  document.documentElement.setAttribute("data-theme", themes[themeIndex]);
});

// ---------------- Share ----------------
const shareBtn = document.getElementById("shareBtn");
shareBtn?.addEventListener("click", async () => {
  const shareData = {
    title: "Santosh ❤️ Rubi Wedding Invitation",
    text: "You are invited to our wedding on 05 May 2026 at Saijal Pur, Gonda.",
    url: location.href
  };
  try {
    if (navigator.share) await navigator.share(shareData);
    else {
      await navigator.clipboard.writeText(location.href);
      alert("Link copied!");
    }
  } catch {}
});

// ---------------- Scroll progress ----------------
const scrollProgress = document.getElementById("scrollProgress");
window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  if (h > 0 && scrollProgress) scrollProgress.style.width = ((scrollY / h) * 100) + "%";
});

// ---------------- Reveal ----------------
const revealEls = document.querySelectorAll(".reveal, .detail-card");
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.17 });
revealEls.forEach((el) => revObs.observe(el));

// ---------------- Parallax ----------------
const parallaxEls = document.querySelectorAll(".parallax");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || "0.05");
    el.style.backgroundPosition = `center ${y * speed}px`;
  });
});

// ---------------- 3D Tilt cards (disabled on mobile) ----------------
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (window.matchMedia("(max-width: 600px)").matches) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = -((y / r.height) - 0.5) * 8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});

// ---------------- Gallery slider ----------------
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("dots");
const prev = document.getElementById("prevSlide");
const next = document.getElementById("nextSlide");
let idx = 0;
let auto = null;

if (slides.length && dotsWrap) {
  dotsWrap.innerHTML = "";
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === 0);

    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", `Go to slide ${i + 1}`);
    d.addEventListener("click", () => {
      show(i);
      restart();
    });
    dotsWrap.appendChild(d);

    s.addEventListener("error", () => {
      s.src = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop";
    });
  });
}

function dots() { return [...document.querySelectorAll(".dot")]; }

function show(i) {
  if (!slides.length) return;
  const prev = slides[idx];
  prev?.classList.remove("active");
  prev?.classList.add("exit");
  setTimeout(() => prev?.classList.remove("exit"), 750);
  dots()[idx]?.classList.remove("active");
  idx = (i + slides.length) % slides.length;
  slides[idx]?.classList.add("active");
  dots()[idx]?.classList.add("active");
}
function start() {
  if (!slides.length) return;
  stop();
  auto = setInterval(() => show(idx + 1), 3200);
}
function stop() {
  if (auto) clearInterval(auto);
}
function restart() {
  stop();
  start();
}
prev?.addEventListener("click", () => { show(idx - 1); restart(); });
next?.addEventListener("click", () => { show(idx + 1); restart(); });

const slider = document.querySelector(".slider");
slider?.addEventListener("mouseenter", stop);
slider?.addEventListener("mouseleave", start);
slider?.addEventListener("touchstart", stop, { passive: true });
slider?.addEventListener("touchend", start);

start();

// ---------------- Lightbox + swipe ----------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

slides.forEach((img, i) => {
  img.addEventListener("click", () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.add("show");
    lightboxImg.src = img.src;
    lightbox.dataset.index = i;
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.classList.remove("show"));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("show");
});

let touchStartX = 0;
lightbox?.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox?.addEventListener("touchend", (e) => {
  if (!lightboxImg || !slides.length) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  let i = parseInt(lightbox.dataset.index || "0", 10);
  if (Math.abs(dx) > 40) {
    i = dx < 0 ? (i + 1) % slides.length : (i - 1 + slides.length) % slides.length;
    lightbox.dataset.index = i;
    lightboxImg.src = slides[i].src;
  }
}, { passive: true });

// ---------------- Countdown ----------------
const target = new Date(window.APP_CONFIG?.wedding?.dateISO || "2026-05-05T00:00:00");
const dEl = document.getElementById("days");
const hEl = document.getElementById("hours");
const mEl = document.getElementById("minutes");
const sEl = document.getElementById("seconds");

function tick() {
  if (!dEl || !hEl || !mEl || !sEl) return;
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    [dEl, hEl, mEl, sEl].forEach((el) => el.textContent = "00");
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  dEl.textContent = String(d).padStart(2, "0");
  hEl.textContent = String(h).padStart(2, "0");
  mEl.textContent = String(m).padStart(2, "0");
  sEl.textContent = String(s).padStart(2, "0");
}
tick();
setInterval(tick, 1000);

// ---------------- Location ----------------
const locationBtn = document.getElementById("locationBtn");
locationBtn?.addEventListener("click", () => {
  const mapLink = window.APP_CONFIG?.wedding?.mapLink || "https://maps.app.goo.gl/7i4nMBoFDMVnRZHT9";
  window.open(mapLink, "_blank", "noopener,noreferrer");
});

// ---------------- Calendar links ----------------
const title = encodeURIComponent("Wedding: Santosh Yadav & Rubi Yadav");
const details = encodeURIComponent("You are invited to our wedding celebration.");
const loc = encodeURIComponent("Saijal Pur, Gonda");
const startDate = "20260505T130000Z";
const endDate = "20260505T170000Z";

const googleCalBtn = document.getElementById("googleCalBtn");
if (googleCalBtn) {
  googleCalBtn.href =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${loc}`;
}

const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTAMP:20260101T000000Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Wedding: Santosh Yadav & Rubi Yadav
DESCRIPTION:You are invited to our wedding celebration.
LOCATION:Saijal Pur, Gonda
END:VEVENT
END:VCALENDAR`;

const icsBtn = document.getElementById("icsBtn");
if (icsBtn) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  icsBtn.href = URL.createObjectURL(blob);
}

// ---------------- Particles ----------------
const pCanvas = document.getElementById("particle-canvas");
const pCtx = pCanvas?.getContext("2d");
let particles = [];

function resizeP() {
  if (!pCanvas) return;
  pCanvas.width = innerWidth;
  pCanvas.height = innerHeight;
}
window.addEventListener("resize", resizeP);
resizeP();

function initP() {
  if (!pCanvas) return;
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * pCanvas.width,
    y: Math.random() * pCanvas.height,
    r: Math.random() * 2.5 + 0.8,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -Math.random() * 0.45 - 0.1,
    a: Math.random() * 0.5 + 0.2
  }));
}
initP();

function animateP() {
  if (!pCanvas || !pCtx) return;
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.y < -10) {
      p.y = pCanvas.height + 10;
      p.x = Math.random() * pCanvas.width;
    }
    if (p.x < -10 || p.x > pCanvas.width + 10) {
      p.x = Math.random() * pCanvas.width;
    }

    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(255, 190, 210, ${p.a})`;
    pCtx.fill();
  }

  requestAnimationFrame(animateP);
}
animateP();

// ---------------- Blessings wall ----------------
const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function renderWishes() {
  if (!wishList) return;
  const wishes = JSON.parse(localStorage.getItem("wishes") || "[]");
  wishList.innerHTML = "";
  wishes.slice().reverse().forEach((w) => {
    const div = document.createElement("div");
    div.className = "wish-item";
    div.innerHTML = `<strong>${escapeHTML(w.name)}</strong><p>${escapeHTML(w.text)}</p>`;
    wishList.appendChild(div);
  });
}

wishForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameEl = document.getElementById("wishName");
  const textEl = document.getElementById("wishText");
  const name = nameEl?.value.trim();
  const text = textEl?.value.trim();
  if (!name || !text) return;

  const wishes = JSON.parse(localStorage.getItem("wishes") || "[]");
  wishes.push({ name, text, at: Date.now() });
  localStorage.setItem("wishes", JSON.stringify(wishes));

  wishForm.reset();
  renderWishes();
});
renderWishes();

// ---------------- Confetti ----------------
const cCanvas = document.getElementById("confetti-canvas");
const cCtx = cCanvas?.getContext("2d");
let confetti = [];
let confStarted = false;

function resizeC() {
  if (!cCanvas) return;
  cCanvas.width = cCanvas.offsetWidth;
  cCanvas.height = cCanvas.offsetHeight;
}
window.addEventListener("resize", resizeC);
resizeC();

function spawnC() {
  if (!cCanvas) return;
  confetti = Array.from({ length: 140 }, () => ({
    x: Math.random() * cCanvas.width,
    y: Math.random() * -cCanvas.height,
    w: Math.random() * 8 + 4,
    h: Math.random() * 12 + 6,
    vy: Math.random() * 2.8 + 1.2,
    vx: (Math.random() - 0.5) * 1.2,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 8,
    color: ["#d4af37", "#ff5e8a", "#ffffff", "#8cc8ff"][Math.floor(Math.random() * 4)]
  }));
}

function drawC() {
  if (!cCanvas || !cCtx) return;
  cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);

  for (const f of confetti) {
    f.x += f.vx;
    f.y += f.vy;
    f.rot += f.vr;

    if (f.y > cCanvas.height + 20) {
      f.y = -20;
      f.x = Math.random() * cCanvas.width;
    }

    cCtx.save();
    cCtx.translate(f.x, f.y);
    cCtx.rotate((f.rot * Math.PI) / 180);
    cCtx.fillStyle = f.color;
    cCtx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
    cCtx.restore();
  }

  requestAnimationFrame(drawC);
}

const endingSection = document.getElementById("ending");
if (endingSection) {
  new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !confStarted) {
        confStarted = true;
        spawnC();
        drawC();
      }
    });
  }, { threshold: 0.25 }).observe(endingSection);
}

// ---------------- Mobile layout helpers ----------------
function normalizeMobileLayout() {
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  if (isMobile) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.style.transform = "none";
    });
  }
}
window.addEventListener("resize", normalizeMobileLayout);
window.addEventListener("load", normalizeMobileLayout);

function setVHVar() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}
setVHVar();
window.addEventListener("resize", setVHVar);

/* =========================================
   SECTION-WISE MUSIC (AUTO CHANGE ON SCROLL)
========================================= */

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

let musicEnabled = false;
let currentTrack = "";
let fadeInterval = null;
let pendingSwitch = null;

const sectionMusicMap = {
  home:       "assets/music/intro.mp3",
  couple:     "assets/music/couple.mp3",
  details:    "assets/music/details.mp3",
  tradition:  "assets/music/tradition.mp3",
  gallery:    "assets/music/gallery.mp3",
  message:    "assets/music/message.mp3",
  schedule:   "assets/music/schedule.mp3",
  countdown:  "assets/music/countdown.mp3",
  location:   "assets/music/location.mp3",
  rsvp:       "assets/music/rsvp.mp3",
  blessings:  "assets/music/blessings.mp3",
  ending:     "assets/music/ending.mp3"
};

// Smooth volume fade
function fadeTo(volume, duration = 500) {
  return new Promise((resolve) => {
    if (!bgMusic) return resolve();
    clearInterval(fadeInterval);
    const start = bgMusic.volume;
    const change = volume - start;
    const steps = 20;
    const stepTime = Math.max(duration / steps, 10);
    let i = 0;
    fadeInterval = setInterval(() => {
      i++;
      bgMusic.volume = Math.max(0, Math.min(1, start + (change * i / steps)));
      if (i >= steps) { clearInterval(fadeInterval); resolve(); }
    }, stepTime);
  });
}

// Switch track safely
async function switchTrack(newSrc) {
  if (!bgMusic || !musicEnabled || !newSrc || newSrc === currentTrack) return;

  pendingSwitch = newSrc;

  try {
    if (!bgMusic.paused && bgMusic.volume > 0) {
      await fadeTo(0, 400);
    }

    if (pendingSwitch !== newSrc) return;

    bgMusic.src = newSrc;
    bgMusic.volume = 0;
    bgMusic.currentTime = 0;
    bgMusic.loop = true;

    // Wait for canplay OR error — whichever comes first
    await new Promise((resolve) => {
      const onReady = () => { cleanup(); resolve("ok"); };
      const onError = () => { cleanup(); resolve("err"); };
      bgMusic.addEventListener("canplay", onReady, { once: true });
      bgMusic.addEventListener("error",   onError, { once: true });
      function cleanup() {
        bgMusic.removeEventListener("canplay", onReady);
        bgMusic.removeEventListener("error",   onError);
      }
      // Timeout fallback — 3s baad bhi try karo
      setTimeout(() => { cleanup(); resolve("timeout"); }, 3000);
    });

    if (pendingSwitch !== newSrc) return;

    // Only update currentTrack AFTER file is confirmed loaded
    currentTrack = newSrc;

    const playPromise = bgMusic.play();
    if (playPromise !== undefined) await playPromise;

    await fadeTo(0.40, 600);
  } catch (e) {
    // Reset so next scroll attempt retries this track
    if (currentTrack === newSrc) currentTrack = "";
    console.warn("Music switch failed:", e.message);
  }
}

// Music toggle button
musicToggle?.addEventListener("click", async () => {
  if (!bgMusic) return;

  if (!musicEnabled) {
    musicEnabled = true;
    musicToggle.textContent = "🔊 Music ON";
    const visibleId = getMostVisibleSectionId();
    const track = sectionMusicMap[visibleId] || sectionMusicMap.home;
    currentTrack = ""; // force play even if same src
    await switchTrack(track);
  } else {
    musicEnabled = false;
    musicToggle.textContent = "🔈 Music OFF";
    await fadeTo(0, 350);
    bgMusic.pause();
    currentTrack = "";
  }
});

// Get section most visible in viewport
function getMostVisibleSectionId() {
  const sections = document.querySelectorAll("section[id], header[id], footer[id]");
  let bestId = "home";
  let bestPx = 0;
  sections.forEach((sec) => {
    const r = sec.getBoundingClientRect();
    const px = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
    if (px > bestPx) { bestPx = px; bestId = sec.id; }
  });
  return bestId;
}

// Scroll-based section detection (more reliable than IntersectionObserver on mobile)
let scrollMusicTimer = null;
window.addEventListener("scroll", () => {
  if (!musicEnabled) return;
  clearTimeout(scrollMusicTimer);
  scrollMusicTimer = setTimeout(() => {
    const visibleId = getMostVisibleSectionId();
    const track = sectionMusicMap[visibleId];
    if (track && track !== currentTrack) switchTrack(track);
  }, 300);
}, { passive: true });

// Also use IntersectionObserver as backup (lower threshold for mobile)
const musicObserver = new IntersectionObserver((entries) => {
  if (!musicEnabled) return;
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
      const track = sectionMusicMap[entry.target.id];
      if (track && track !== currentTrack) {
        // Only switch if this section is truly most visible
        const mostVisible = getMostVisibleSectionId();
        if (mostVisible === entry.target.id) switchTrack(track);
      }
    }
  });
}, { threshold: [0.3, 0.5] });

document.querySelectorAll("section[id], header[id], footer[id]").forEach((el) => {
  musicObserver.observe(el);
});

// ---------------- Service Worker ----------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}