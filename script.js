/* ===================================================================
   EDIT EVERYTHING HERE — one place to personalise the whole surprise
   =================================================================== */
const CONFIG = {
  name: "Shravani",                 // birthday girl's name
  from: "AK", // your name / signature
  revealEyebrow: "Today is all about you",
  messages: [
    "Today I celebrate you as someone truly wonderful.",
    "Wishing you happiness, laughter and unforgettable memories.",
    "May this year bring everything you've been dreaming of. 🎂"
  ],
  gallery: [
    { icon:"📸", caption:"How it Started",   src:"images/pic1.jpeg" },
    { icon:"🌻", caption:"That golden day",  src:"images/pic2.jpeg" },
    { icon:"😂", caption:"Our funniest story", src:"images/pic3.jpeg" },
    { icon:"✈️", caption:"I being your comfortable space", src:"images/pic4.jpeg" },
    { icon:"🩷", caption:"More memories ahead", src:"images/pic5.jpeg" }
  ],
  letter: [
    "Happy Birthday! I hope today brings you lots of smiles, laughter, great food and wonderful memories.",
    "Thank you for being such an amazing person. Here's to another year of exciting adventures and a million reasons to celebrate.",
    "Have an incredible birthday!"
  ].join("\n\n"),
  question: "Do you know how special you are?",
  noReplies: ["Are you sure? 🥺","Reallyyy? 😢","The button is shy 🙈","You can't catch me! 🏃‍♀️","Just say yes already 💖"],
  surprises: [
    { icon:"🎁", label:"A year of good luck 🍀" },
    { icon:"🎂", label:"Extra slices of cake 🍰" },
    { icon:"🌍", label:"Amazing adventures ✈️" },
    { icon:"😂", label:"Endless laughter 💫" },
    { icon:"🌟", label:"Everything you wish for ✨" }
  ],
  finalLine: "Thank you for making the world brighter. Here's to an unforgettable year ahead."
};

/* ---------------- tiny helpers ---------------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const rand = (a,b) => a + Math.random()*(b-a);

/* ---------------- confetti / fireworks canvas engine ---------------- */
const cvs = $("#fx"), ctx = cvs.getContext("2d");
let W, H, DPR = Math.min(devicePixelRatio||1, 2);
function sizeCanvas(){
  W = innerWidth; H = innerHeight;
  cvs.width = W*DPR; cvs.height = H*DPR;
  cvs.style.width = W+"px"; cvs.style.height = H+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
sizeCanvas(); addEventListener("resize", sizeCanvas);

const COLORS = ["#f7d9e3","#e891a9","#b76e79","#e0b25a","#f6e6da","#fff8f3","#d98f76"];
let parts = [], running = false;

function addParticle(p){ parts.push(p); if(!running) loop(); }
function loop(){
  running = true;
  ctx.clearRect(0,0,W,H);
  parts = parts.filter(p => p.life > 0);
  for(const p of parts){
    p.vy += p.g; p.vx *= p.fric; p.vy *= p.fric;
    p.x += p.vx; p.y += p.vy;
    p.rot += p.vr; p.life--;
    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life/p.fade);
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if(p.shape === "circle"){ ctx.beginPath(); ctx.arc(0,0,p.size,0,7); ctx.fill(); }
    else ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * (p.shape==="strip"?.5:1));
    ctx.restore();
  }
  if(parts.length) requestAnimationFrame(loop);
  else { running = false; ctx.clearRect(0,0,W,H); }
}
function burst(x, y, n=70, power=8){
  for(let i=0;i<n;i++){
    const a = Math.random()*Math.PI*2, s = rand(2,power);
    addParticle({ x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s - 3, g:.16, fric:.985,
      color:COLORS[(Math.random()*COLORS.length)|0], size:rand(5,11),
      shape:Math.random()<.5?"circle":"strip", rot:rand(0,6), vr:rand(-.2,.2), life:rand(70,120), fade:40 });
  }
}
function rain(n=90){
  for(let i=0;i<n;i++){
    addParticle({ x:rand(0,W), y:rand(-H*0.4,0), vx:rand(-1.5,1.5), vy:rand(2,5), g:.05, fric:1,
      color:COLORS[(Math.random()*COLORS.length)|0], size:rand(6,12),
      shape:Math.random()<.4?"circle":"strip", rot:rand(0,6), vr:rand(-.15,.15), life:rand(180,320), fade:90 });
  }
}
function firework(x,y){
  burst(x,y,60,7);
  setTimeout(()=>burst(x+rand(-40,40), y-rand(10,40), 40, 6), 160);
}
function fireworksShow(){
  let i=0; const t = setInterval(()=>{ firework(rand(W*.15,W*.85), rand(H*.15,H*.55)); if(++i>6) clearInterval(t); }, 320);
}

/* ---------------- flowers & butterflies ambient ---------------- */
(function spawnFlorals(){
  const box = $("#florals");
  const glyphs = ["🦋","🌸","🌺","🌷","🦋","🌼","🦋","✨"];
  for(let i=0;i<16;i++){
    const b = document.createElement("span");
    b.className = "fly";
    b.textContent = glyphs[(Math.random()*glyphs.length)|0];
    b.style.left = rand(0,100)+"%";
    b.style.top  = rand(20,110)+"%";
    b.style.fontSize = rand(14,30)+"px";
    b.style.setProperty("--s", rand(.7,1.3).toFixed(2));
    b.style.animationDuration = rand(9,20)+"s";
    b.style.animationDelay = (-rand(0,14))+"s";
    box.appendChild(b);
  }
})();

/* ---------------- stage navigation ---------------- */
function show(id){
  $$(".stage").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  el.classList.add("active");
  el.scrollTop = 0;
}
$$("[data-next]").forEach(b => b.addEventListener("click", () => {
  const to = b.dataset.next;
  if(to === "memory") revealOnEnter = true;
  show(to);
  if(to === "memory") buildRail();
  if(to === "letter") startTyping();
  if(to === "surprises") rain(70);
  if(to === "final"){ rain(120); fireworksShow(); }
}));

/* ---------------- 1. loader ---------------- */
(function load(){
  let p = 0;
  const bar = $("#bar"), pct = $("#percent");
  const t = setInterval(() => {
    p = Math.min(100, p + rand(3,9));
    bar.style.width = p+"%"; pct.textContent = Math.round(p)+"%";
    if(p >= 100){ clearInterval(t); setTimeout(()=>show("gift"), 500); }
  }, 190);
})();

/* ---------------- 2. gift ---------------- */
$("#giftName").textContent = CONFIG.name;
const giftbox = $("#giftbox");
giftbox.addEventListener("click", () => {
  if(giftbox.classList.contains("open")) return;
  giftbox.classList.add("open");
  const r = giftbox.getBoundingClientRect();
  burst(r.left+r.width/2, r.top+r.height/2, 120, 11);
  setTimeout(()=>{ buildReveal(); show("reveal"); rain(120); setTimeout(fireworksShow, 250); }, 850);
});
giftbox.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" ") giftbox.click(); });

/* ---------------- 3. reveal ---------------- */
let revealDone = false, revealOnEnter = false;
function buildName(target, delayBase=0){
  const holder = document.getElementById(target);
  holder.innerHTML = "";
  [...CONFIG.name.toUpperCase()].forEach((ch,i) => {
    const s = document.createElement("span");
    s.className = "l";
    s.textContent = ch === " " ? "\u00A0" : ch;
    s.style.animationDelay = (delayBase + i*0.09)+"s";
    holder.appendChild(s);
  });
}
function buildReveal(){
  if(revealDone) return; revealDone = true;
  $("#revealEyebrow").textContent = CONFIG.revealEyebrow;
  buildName("nameLetters");
  const box = $("#messages");
  CONFIG.messages.forEach((m, i) => {
    const p = document.createElement("p");
    p.textContent = m;
    p.style.animationDelay = (CONFIG.name.length*0.09 + 0.5 + i*1.1)+"s";
    box.appendChild(p);
  });
}

/* ---------------- 4. memory gallery ---------------- */
let railBuilt = false;
function buildRail(){
  if(railBuilt) return; railBuilt = true;
  const rail = $("#rail");
  CONFIG.gallery.forEach((g, i) => {
    const card = document.createElement("div");
    card.className = "polaroid";
    card.style.setProperty("--r", rand(-6,6).toFixed(1)+"deg");
    card.innerHTML = `<div class="photo" style="background-image:url('${g.src}')">${g.icon}</div>
                      <div class="cap">${g.caption}</div>`;
    rail.appendChild(card);
  });
  // drag to scroll
  let down=false, sx=0, sl=0;
  rail.addEventListener("pointerdown", e => { down=true; sx=e.clientX; sl=rail.scrollLeft; rail.style.cursor="grabbing"; });
  addEventListener("pointermove", e => { if(!down) return; rail.scrollLeft = sl - (e.clientX-sx); });
  addEventListener("pointerup", () => { down=false; rail.style.cursor="grab"; });
}

/* ---------------- 5. letter typewriter ---------------- */
function startTyping(){
  const ln = $("#letterName"); if (ln) ln.textContent = CONFIG.name;
  $("#signName").textContent = CONFIG.from;
  const target = CONFIG.letter.replace(/^Dear /, "Dear " + CONFIG.name + ",\n\n");
  const el = $("#typed");
  if(el.dataset.done) return;
  el.dataset.done = "1";
  el.textContent = ""; el.classList.remove("done");
  let i = 0;
  (function type(){
    el.textContent = target.slice(0, ++i);
    if(i % 3 === 0 && Math.random()<.5) burst(rand(W*.2,W*.8), rand(H*.3,H*.6), 2, 3);
    if(i < target.length) setTimeout(type, target[i-1] === "\n" ? 120 : rand(16,34));
    else { el.classList.add("done"); const b=$("#letterBtn"); b.style.opacity=1; b.style.pointerEvents="auto"; }
  })();
}

/* ---------------- 6. yes / no ---------------- */
$("#qTitle").textContent = CONFIG.question;
const noBtn = $("#noBtn"), qNote = $("#qNote");
let noCount = 0;
function dodge(){
  const r = noBtn.getBoundingClientRect();
  const pad = 12;
  const box = document.querySelector(".q-box").getBoundingClientRect();
  const yesRect = $("#yesBtn").getBoundingClientRect();
  const minY = yesRect.bottom + 10;
  const maxY = Math.max(minY, box.bottom - r.height - pad);
  const minX = box.left + pad;
  const maxX = Math.max(minX, box.right - r.width - pad);
  const nx = minX + rand(0, maxX - minX);
  const ny = minY + rand(0, maxY - minY);
  noBtn.style.position = "fixed";
  noBtn.style.left = nx+"px"; noBtn.style.top = ny+"px";
  qNote.textContent = CONFIG.noReplies[Math.min(noCount, CONFIG.noReplies.length-1)];
  noCount++;
}
noBtn.addEventListener("pointerenter", dodge);
noBtn.addEventListener("pointerover", dodge);
noBtn.addEventListener("touchstart", dodge, {passive:true});
noBtn.addEventListener("click", dodge);
$("#yesBtn").addEventListener("click", e => {
  const r = e.currentTarget.getBoundingClientRect();
  burst(r.left+r.width/2, r.top, 130, 11);
  qNote.textContent = "I knew it. You're the best. 💖";
  noBtn.style.display = "none";
  setTimeout(()=>{ buildSurprises(); show("surprises"); }, 900);
});

/* ---------------- 7. five surprises ---------------- */
let surpriseBuilt = false;
function buildSurprises(){
  if(surpriseBuilt) return; surpriseBuilt = true;
  const grid = $("#surpriseGrid");
  let opened = 0;
  CONFIG.surprises.forEach((s, i) => {
    const b = document.createElement("div");
    b.className = "sbox";
    b.innerHTML = `<span class="icon">🎁</span><span class="label">${s.label}</span>`;
    b.addEventListener("click", () => {
      if(b.classList.contains("opened")) return;
      b.classList.add("opened");
      b.querySelector(".icon").textContent = s.icon;
      const r = b.getBoundingClientRect();
      burst(r.left+r.width/2, r.top+r.height/2, 46, 7);
      if(++opened === CONFIG.surprises.length){
        const btn = $("#surpriseBtn"); btn.style.opacity=1; btn.style.pointerEvents="auto";
      }
    });
    grid.appendChild(b);
  });
}

/* ---------------- 8. cake + mic blow ---------------- */
const cakeEl = $("#cakeEl");
let cakeDone = false, audioCtx, micStream;
function blowOut(){
  if(cakeDone) return; cakeDone = true;
  cakeEl.classList.add("blown");
  const r = cakeEl.getBoundingClientRect();
  burst(r.left+r.width/2, r.top+20, 140, 11);
  setTimeout(fireworksShow, 400);
  $("#cakeHint").textContent = "✨ May all your wishes come true ✨";
  const btn = $("#cakeBtn"); btn.style.opacity=1; btn.style.pointerEvents="auto";
  if(micStream) micStream.getTracks().forEach(t=>t.stop());
}
cakeEl.addEventListener("click", blowOut);
async function armMic(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    micStream = stream;
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(stream);
    const an = audioCtx.createAnalyser(); an.fftSize = 512;
    src.connect(an);
    const data = new Uint8Array(an.frequencyBinCount);
    (function watch(){
      if(cakeDone) return;
      an.getByteFrequencyData(data);
      let sum=0; for(const v of data) sum+=v;
      if(sum/data.length > 55) return blowOut();
      requestAnimationFrame(watch);
    })();
  }catch(e){ /* mic denied — tap still works */ }
}
// arm the mic only once, when the cake stage becomes visible
$$("[data-next]").forEach(b => b.addEventListener("click", () => { if(b.dataset.next==="cake") setTimeout(armMic, 600); }));

/* ---------------- 9. final + replay ---------------- */
$("#finalLine").textContent = CONFIG.finalLine;
const finalBuilt = new MutationObserver(() => {
  if($("#final").classList.contains("active") && !$("#finalName").dataset.b){
    $("#finalName").dataset.b = "1";
    buildName("finalName");
  }
});
finalBuilt.observe($("#final"), {attributes:true, attributeFilter:["class"]});

const replayBtn = $("#replay");
if (replayBtn) replayBtn.addEventListener("click", () => location.reload());

/* ---------------- music ---------------- */
console.log("[MUSIC] loading music module...");
const music = $("#bgMusic"), mBtn = $("#musicBtn");
console.log("[MUSIC] audio element:", music, "button:", mBtn);
const FALLBACK_MUSIC = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1718e63e9a.mp3?filename=romantic-piano-100718.mp3";
let fallbackUsed = false;
music.addEventListener("error", () => {
  console.error("Music file failed to load.",
    "readyState:", music.readyState, "networkState:", music.networkState);
  if (!fallbackUsed) {
    fallbackUsed = true;
    console.log("Local file failed — trying hosted fallback song for testing...");
    music.src = FALLBACK_MUSIC;
    music.load();
  }
});
mBtn.addEventListener("click", async () => {
  console.log("[MUSIC] button clicked! paused=", music.paused, "readyState=", music.readyState, "src=", music.src);
  if(music.paused){
    music.volume = .55;
    // make sure the file is loaded before playing
    if(music.readyState < 2) music.load();
    try {
      await music.play();
      mBtn.classList.add("playing");
      $(".mtext", mBtn).textContent = "Pause";
    } catch (err) {
      console.error("Play failed:", err);
      $(".mtext", mBtn).textContent = "Check music file";
      setTimeout(() => { $(".mtext", mBtn).textContent = "Play us"; }, 2500);
    }
  } else {
    music.pause();
    mBtn.classList.remove("playing");
    $(".mtext", mBtn).textContent = "Play us";
  }
});