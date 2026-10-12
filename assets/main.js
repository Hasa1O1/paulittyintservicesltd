const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.documentElement.classList.add("js");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "paulitty.inters@gmail.com",
  WA = "260977133018";

/* nav */
const tb = $(".topbar"),
  nav = $(".nav"),
  mb = $(".menu");
mb &&
  mb.addEventListener("click", () => {
    const o = nav.classList.toggle("open");
    tb.classList.toggle("open", o);
    mb.setAttribute("aria-expanded", o);
  });

/* scroll-driven: sticky nav, progress bar, hero parallax, back-to-top */
const bar = document.createElement("div");
bar.className = "progress";
tb && tb.appendChild(bar);
const hero = $(".hero");
const upBtn = document.createElement("button");
upBtn.className = "fab fab-top";
upBtn.type = "button";
upBtn.setAttribute("aria-label", "Back to top");
upBtn.innerHTML =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
upBtn.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }),
);
const wa = document.createElement("a");
wa.className = "fab fab-wa";
wa.href = `https://wa.me/${WA}`;
wa.target = "_blank";
wa.rel = "noopener";
wa.setAttribute("aria-label", "Chat on WhatsApp");
wa.innerHTML =
  '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>';
document.body.append(upBtn, wa);
let ticking = false;
const onScroll = () => {
  const y = scrollY,
    h = document.documentElement.scrollHeight - innerHeight;
  tb && tb.classList.toggle("scrolled", y > 40);
  bar.style.setProperty("--p", h > 0 ? y / h : 0);
  upBtn.classList.toggle("show", y > innerHeight * 0.8);
  if (hero && !reduce && y < hero.offsetHeight)
    hero.style.setProperty("--py", y * 0.35 + "px");
  tb &&
    document.documentElement.style.setProperty(
      "--nav-h",
      tb.offsetHeight + "px",
    );
  ticking = false;
};
addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true },
);
addEventListener("resize", onScroll);
onScroll();

/* hero headline word-by-word entrance */
const h1 = $(".hero-body h1");
if (h1 && !reduce) {
  let d = 0;
  const walk = (n) =>
    [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) {
            f.append(t);
            return;
          }
          const w = document.createElement("span");
          w.className = "w";
          const i = document.createElement("span");
          i.textContent = t;
          i.style.setProperty("--d", d++);
          w.append(i);
          f.append(w);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1) walk(c);
    });
  walk(h1);
}
h1 && h1.classList.add("words");

/* scroll reveal */
const revealSel =
  "main h2,main .lead,main h3,main .kicker,.tile,.list li,.clients p,.facts>div,.values span,.vm>div,.info,form,.stat,.group-head,.band .btn,main .split>div>p>.btn,.split>img,.slider";
const items = $$(revealSel);
items.forEach((el) => {
  const sib = [...el.parentElement.children].filter((c) =>
    c.matches(revealSel),
  );
  el.style.setProperty("--i", Math.max(0, sib.indexOf(el)));
});
$$(".slider").forEach((s) =>
  $$(".card", s).forEach((c, i) => c.style.setProperty("--i", i)),
);
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0, rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((el) => io.observe(el));
} else items.forEach((el) => el.classList.add("in"));

/* count-up stats */
$$("[data-since]").forEach(
  (el) => (el.dataset.count = new Date().getFullYear() - +el.dataset.since),
);
const counters = $$("[data-count]");
const runCount = (el) => {
  const end = +el.dataset.count,
    suf = el.dataset.suffix || "",
    start = +el.dataset.from || 0,
    t0 = performance.now(),
    dur = 1600;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur),
      e = 1 - Math.pow(1 - k, 4);
    el.textContent = Math.round(start + (end - start) * e) + suf;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
if (counters.length) {
  if ("IntersectionObserver" in window && !reduce) {
    const co = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            co.unobserve(e.target);
          }
        }),
      { threshold: 0.6 },
    );
    counters.forEach((c) => {
      c.textContent = (+c.dataset.from || 0) + (c.dataset.suffix || "");
      co.observe(c);
    });
  } else
    counters.forEach(
      (c) => (c.textContent = c.dataset.count + (c.dataset.suffix || "")),
    );
}

/* 3D tilt on tiles */
if (!reduce && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  $$(".tile").forEach((t) => {
    t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    t.addEventListener("pointerleave", () => (t.style.transform = ""));
  });
}

/* portfolio sliders */
$$(".group").forEach((g) => {
  const s = $(".slider", g),
    cards = $$(".card", s),
    prev = $(".prev", g),
    next = $(".next", g),
    count = $(".count", g),
    fill = $(".bar i", g),
    ctrl = $(".ctrl", g);
  const stepW = () =>
    cards[0].getBoundingClientRect().width +
    parseFloat(getComputedStyle(s).columnGap || 0);
  const update = () => {
    const max = s.scrollWidth - s.clientWidth;
    ctrl.hidden = max < 4;
    g.querySelector(".bar").style.visibility = max < 4 ? "hidden" : "";
    const idx = Math.round(s.scrollLeft / stepW());
    count.textContent = `${Math.min(cards.length, idx + 1)} / ${cards.length}`;
    prev.disabled = s.scrollLeft < 4;
    next.disabled = s.scrollLeft > max - 4;
    fill.style.setProperty(
      "--w",
      max > 0 ? Math.min(1, (s.scrollLeft + s.clientWidth) / s.scrollWidth) : 1,
    );
  };
  prev.addEventListener("click", () => {
    s.scrollBy({ left: -stepW() });
    pause();
  });
  next.addEventListener("click", () => {
    s.scrollBy({ left: stepW() });
    pause();
  });
  s.addEventListener("scroll", () => requestAnimationFrame(update), {
    passive: true,
  });
  addEventListener("resize", update);
  update();
  s.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next.click();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev.click();
    }
  });
  /* mouse drag */
  let down = false,
    moved = false,
    sx = 0,
    sl = 0;
  s.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    moved = false;
    sx = e.clientX;
    sl = s.scrollLeft;
  });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 6) {
      moved = true;
      s.classList.add("drag");
    }
    if (moved) s.scrollLeft = sl - dx;
  });
  addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    if (moved) {
      s.classList.remove("drag");
      const w = stepW();
      s.scrollTo({ left: Math.round(s.scrollLeft / w) * w });
      pause();
    }
  });
  s.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );
  /* gentle autoplay while in view */
  let timer = null,
    paused = false,
    inView = false,
    resume = null;
  const tick = () => {
    if (paused || !inView || document.hidden) return;
    const max = s.scrollWidth - s.clientWidth;
    if (max < 4) return;
    s.scrollLeft >= max - 4
      ? s.scrollTo({ left: 0 })
      : s.scrollBy({ left: stepW() });
  };
  function pause() {
    paused = true;
    clearTimeout(resume);
    resume = setTimeout(() => (paused = false), 8000);
  }
  if (!reduce) {
    timer = setInterval(tick, 3800);
    ["pointerenter", "focusin", "touchstart"].forEach((ev) =>
      s.addEventListener(
        ev,
        () => {
          paused = true;
          clearTimeout(resume);
        },
        { passive: true },
      ),
    );
    ["pointerleave", "focusout"].forEach((ev) => s.addEventListener(ev, pause));
    s.addEventListener("touchend", pause, { passive: true });
    new IntersectionObserver((es) => (inView = es[0].isIntersecting), {
      threshold: 0.5,
    }).observe(s);
  }
});

/* chips: active section highlight */
const chips = $$(".chips a");
if (chips.length) {
  const map = new Map(chips.map((a) => [a.getAttribute("href").slice(1), a]));
  const so = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          chips.forEach((c) => c.classList.remove("active"));
          const a = map.get(e.target.id);
          if (a) {
            a.classList.add("active");
            a.scrollIntoView({
              block: "nearest",
              inline: "center",
              behavior: "smooth",
            });
          }
        }
      }),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  $$(".group").forEach((g) => so.observe(g));
}

/* lightbox with prev/next within a group */
const lb = $(".lightbox");
if (lb) {
  const img = $("img", lb),
    capT = $("figcaption strong", lb),
    capD = $("figcaption span", lb);
  let list = [],
    at = 0;
  const show = (i) => {
    at = (i + list.length) % list.length;
    const b = list[at],
      im = $("img", b);
    img.src = im.src;
    img.alt = im.alt;
    capT.textContent = $(".card-cap strong", b).textContent;
    capD.textContent = $(".card-cap span", b).textContent;
    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "";
  };
  $$(".slider").forEach((s) =>
    s.addEventListener("click", (e) => {
      const b = e.target.closest(".card button");
      if (!b) return;
      list = $$(".card button", s);
      show(list.indexOf(b));
      lb.showModal();
    }),
  );
  $(".lb-prev", lb).addEventListener("click", (e) => {
    e.stopPropagation();
    show(at - 1);
  });
  $(".lb-next", lb).addEventListener("click", (e) => {
    e.stopPropagation();
    show(at + 1);
  });
  $(".lb-close", lb).addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.tagName === "FIGURE") lb.close();
  });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(at + 1);
    if (e.key === "ArrowLeft") show(at - 1);
  });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), {
    passive: true,
  });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
  });
}

/* quote form */
const form = $("#quote");
if (form) {
  const digitsOnly = (value) => value.replace(/\D/g, "");
  const singleLine = (value) =>
    value
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const messageText = (value) =>
    value
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
      .trim();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = singleLine(String(data.get("name") || ""));
    const phone = singleLine(String(data.get("phone") || ""));
    const need = String(data.get("need") || "");
    const details = messageText(String(data.get("msg") || ""));
    const phoneDigits = digitsOnly(phone);

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      const phoneInput = form.elements.namedItem("phone");
      phoneInput.setCustomValidity(
        "Enter a phone number containing 7 to 15 digits.",
      );
      phoneInput.reportValidity();
      phoneInput.addEventListener(
        "input",
        () => phoneInput.setCustomValidity(""),
        { once: true },
      );
      return;
    }

    const message = `Hello Paulitty, my name is ${name}.\nI need: ${need}.\n${details}\nMy phone: ${phone}`;
    const submitByEmail = e.submitter?.value === "email";

    // User content is only placed in encoded URLs, never interpreted as HTML.
    if (submitByEmail)
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Quote request: ${need}`)}&body=${encodeURIComponent(message)}`;
    else
      window.open(
        `https://wa.me/${WA}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
  });
}
