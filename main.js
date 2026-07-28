// Reveals bij het scrollen, glas op de navigatiebalk, de videoknop, en het
// kleine beetje leven dat de aanwijzer aan het glas geeft.

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- reveals ---------- */

const reveals = document.querySelectorAll(".reveal");

if (!reduced) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );
  reveals.forEach((el) => io.observe(el));

  // Vangnet: mocht de observer om wat voor reden dan ook niets doen, dan staat
  // de pagina na drie seconden alsnog gewoon te lezen in plaats van leeg.
  setTimeout(() => reveals.forEach((el) => el.classList.add("is-in")), 3000);
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

/* De stappen komen na elkaar binnen in plaats van tegelijk, zodat je ze in
   volgorde leest. De vertraging hangt aan de stap zelf, niet aan een timer. */
document.querySelectorAll(".steps .step").forEach((step, i) => {
  step.style.setProperty("--d", `${i * 90}ms`);
});

/* ---------- navigatiebalk ---------- */

const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

/* ---------- aanwijzer: kleurvelden en het app-venster kijken mee ---------- */

if (!reduced && matchMedia("(pointer: fine)").matches) {
  let px = 0.5;
  let py = 0.5;
  let queued = false;

  const apply = () => {
    queued = false;
    document.documentElement.style.setProperty("--px", px.toFixed(3));
    document.documentElement.style.setProperty("--py", py.toFixed(3));
  };

  addEventListener(
    "pointermove",
    (e) => {
      px = e.clientX / innerWidth;
      py = e.clientY / innerHeight;
      // één schrijfactie per frame, anders vecht dit met de compositor
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    },
    { passive: true },
  );

  // De schijnwerper op een kaart is lokaal, dus die leest zijn eigen positie.
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      },
      { passive: true },
    );
  });
}

/* ---------- video ---------- */

// De video heeft geluid, dus hij start pas op een klik. Daarna neemt de
// browser het over met de eigen bediening.
const video = document.getElementById("promo");
const playBtn = document.getElementById("playBtn");

if (video && playBtn) {
  playBtn.addEventListener("click", () => {
    video.controls = true;
    playBtn.classList.add("is-hidden");
    video.play();
  });

  video.addEventListener("pause", () => {
    if (video.currentTime === 0 || video.ended) playBtn.classList.remove("is-hidden");
  });
}

/* ---------- het commando kopiëren ---------- */

const copyBtn = document.getElementById("copyBtn");
const cmd = document.getElementById("cmd");

if (copyBtn && cmd) {
  const label = copyBtn.querySelector(".copy-label");
  let resetTimer;

  const flash = (text) => {
    copyBtn.classList.add("is-done");
    label.textContent = text;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      copyBtn.classList.remove("is-done");
      label.textContent = "Kopieer";
    }, 2200);
  };

  copyBtn.addEventListener("click", async () => {
    const text = cmd.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      flash("Gekopieerd");
    } catch {
      // Zonder clipboard-rechten (of op http) selecteren we de regel, dan kan
      // de bezoeker hem alsnog met cmd+C pakken.
      const range = document.createRange();
      range.selectNodeContents(cmd);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      flash("Selecteer en kopieer");
    }
  });
}
