// Turbo: Q+ Edition — Perfect Round Celebration (confetti + banner + shake)
// Keeps all previous functionality from your last version: global tokens (cap 7, commit-on-finish),
// unlock ramp 200→…→40, Try Again, TTS/voice, identical UI/brand.
//
// Drop-in replacement for script.js

(() => {
  const $  = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // ===================== CONFIG =====================
  const QUESTIONS_PER_ROUND = 10;
  const PENALTY_PER_WRONG   = 30;
  const BASE_THRESH = { 1:200, 2:180, 3:160, 4:140, 5:120, 6:100, 7:80, 8:60, 9:40 };

  // Global Spanish-read tokens (cap 7, commit-on-finish)
  const GLOBAL_CHEATS_MAX = 7;
  const GLOBAL_CHEATS_KEY = "tqplus:v3:globalCheats";

  // ===================== DATA (present-based for all tenses) =====================
 const GAME2 = {
  // Level 1 — super easy, positive, simple family adjectives
  1: [
    { en: "I have a big family", es: "Tengo una familia grande" },
    { en: "My family is small", es: "Mi familia es pequeña" },
    { en: "My mother is kind", es: "Mi madre es amable" },
    { en: "My father is strict", es: "Mi padre es estricto" },
    { en: "My sister is funny", es: "Mi hermana es divertida" },
    { en: "My brother is tall", es: "Mi hermano es alto" },
    { en: "My parents are patient", es: "Mis padres son pacientes" },
    { en: "My grandparents are generous", es: "Mis abuelos son generosos" },
    { en: "My best friend is loyal", es: "Mi mejor amigo es leal" },
    { en: "My friends are friendly", es: "Mis amigos son simpáticos" }
  ],

  // Level 2 — still easy; add a few negatives and simple questions
  2: [
    { en: "I have two sisters", es: "Tengo dos hermanas" },
    { en: "I do not have brothers", es: "No tengo hermanos" },
    { en: "My cousin is hardworking", es: "Mi primo es trabajador" },
    { en: "My aunt is strict but fair", es: "Mi tía es estricta pero justa" },
    { en: "My uncle is funny", es: "Mi tío es gracioso" },
    { en: "Is your family big?", es: "Tu familia es grande?" },
    { en: "Are your parents nice?", es: "Tus padres son amables?" },
    { en: "Do you have a close family?", es: "Tienes una familia unida?" },
    { en: "My sister is shy", es: "Mi hermana es tímida" },
    { en: "My friends are honest", es: "Mis amigos son honestos" }
  ],

  // Level 3 — introduce connector "pero"; mix pos/neg/questions
  3: [
    { en: "My mother is strict but fair", es: "Mi madre es estricta pero justa" },
    { en: "My father is serious but kind", es: "Mi padre es serio pero amable" },
    { en: "My brother is tall but quiet", es: "Mi hermano es alto pero callado" },
    { en: "My sister is smart and friendly", es: "Mi hermana es lista y simpática" },
    { en: "I do not argue with my parents", es: "No discuto con mis padres" },
    { en: "Do you have a good friend?", es: "Tienes un buen amigo?" },
    { en: "Are your friends loyal?", es: "Tus amigos son leales?" },
    { en: "My best friend is funny but honest", es: "Mi mejor amigo es gracioso pero honesto" },
    { en: "My parents are strict", es: "Mis padres son estrictos" },
    { en: "I have a small but happy family", es: "Tengo una familia pequeña pero feliz" }
  ],

  // Level 4 — more friendship statements; a little richer
  4: [
    { en: "I get on well with my family", es: "Me llevo bien con mi familia" },
    { en: "Sometimes we argue, but we talk", es: "A veces discutimos, pero hablamos" },
    { en: "My friends are supportive", es: "Mis amigos son solidarios" },
    { en: "A true friend is loyal", es: "Un amigo verdadero es leal" },
    { en: "I do not like toxic friendships", es: "No me gustan las amistades tóxicas" },
    { en: "Do you trust your friends?", es: "Confías en tus amigos?" },
    { en: "Do you respect your parents?", es: "Respetas a tus padres?" },
    { en: "My cousin is creative but impatient", es: "Mi primo es creativo pero impaciente" },
    { en: "My sister is calm and generous", es: "Mi hermana es tranquila y generosa" },
    { en: "My father is strict but patient", es: "Mi padre es estricto pero paciente" }
  ],

  // Level 5 — bring in (formal) with usted; balance pos/neg/questions
  5: [
    { en: "Do you have a big family? (formal)", es: "Tiene usted una familia grande?" },
    { en: "Do you get on with your family? (formal)", es: "Se lleva usted bien con su familia?" },
    { en: "My best friend is reliable", es: "Mi mejor amigo es fiable" },
    { en: "My friends are not perfect", es: "Mis amigos no son perfectos" },
    { en: "My parents are loving but strict", es: "Mis padres son cariñosos pero estrictos" },
    { en: "I have a small circle of friends", es: "Tengo un círculo pequeño de amigos" },
    { en: "Do you argue with your parents?", es: "Discutes con tus padres?" },
    { en: "Is your sister independent?", es: "Tu hermana es independiente?" },
    { en: "My brother is kind but disorganised", es: "Mi hermano es amable pero desorganizado" },
    { en: "A good friend is honest and patient", es: "Un buen amigo es honesto y paciente" }
  ],

  // Level 6 — deeper opinions; more adjective agreement variety
  6: [
    { en: "My friends are funny but sometimes immature", es: "Mis amigos son graciosos pero a veces inmaduros" },
    { en: "My parents are strict but understanding", es: "Mis padres son estrictos pero comprensivos" },
    { en: "My sister is creative and ambitious", es: "Mi hermana es creativa y ambiciosa" },
    { en: "I do not accept toxic behaviour", es: "No acepto el comportamiento tóxico" },
    { en: "Do you have loyal friends?", es: "Tienes amigos leales?" },
    { en: "Are your parents supportive?", es: "Tus padres son solidarios?" },
    { en: "Do you spend time with your family? (formal)", es: "Pasa usted tiempo con su familia?" },
    { en: "My cousin is confident but arrogant", es: "Mi primo es seguro pero arrogante" },
    { en: "My friends are generous and respectful", es: "Mis amigos son generosos y respetuosos" },
    { en: "My family is strict but fair", es: "Mi familia es estricta pero justa" }
  ],

  // Level 7 — realistic teen themes begin to appear
  7: [
    { en: "Sometimes my parents are strict but fair", es: "A veces mis padres son estrictos pero justos" },
    { en: "I do not hang out with negative people", es: "No salgo con gente negativa" },
    { en: "My sister is friendly but stubborn", es: "Mi hermana es simpática pero terca" },
    { en: "My brother is responsible and helpful", es: "Mi hermano es responsable y servicial" },
    { en: "My friends are honest but direct", es: "Mis amigos son honestos pero directos" },
    { en: "Do your parents trust you?", es: "Tus padres confían en ti?" },
    { en: "Do you have supportive friends? (formal)", es: "Tiene usted amigos solidarios?" },
    { en: "I have a close and loyal group", es: "Tengo un grupo cercano y leal" },
    { en: "I do not like false friends", es: "No me gustan los amigos falsos" },
    { en: "A good friend listens and respects", es: "Un buen amigo escucha y respeta" }
  ],

  // Level 8 — more nuanced adjectives; balance of pos/neg/questions
  8: [
    { en: "My parents are protective but reasonable", es: "Mis padres son protectores pero razonables" },
    { en: "My mother is strict but affectionate", es: "Mi madre es estricta pero cariñosa" },
    { en: "My father is patient and hardworking", es: "Mi padre es paciente y trabajador" },
    { en: "I do not tolerate disrespect", es: "No tolero la falta de respeto" },
    { en: "My friends are mature and realistic", es: "Mis amigos son maduros y realistas" },
    { en: "Is your brother responsible?", es: "Tu hermano es responsable?" },
    { en: "Do you trust your best friend? (formal)", es: "Confía usted en su mejor amigo?" },
    { en: "My cousin is calm but lazy", es: "Mi primo es tranquilo pero perezoso" },
    { en: "My sister is optimistic and patient", es: "Mi hermana es optimista y paciente" },
    { en: "A true friend is loyal but sincere", es: "Un amigo verdadero es leal pero sincero" }
  ],

  // Level 9 — richer opinions; clear LC prep tone
  9: [
    { en: "My parents are strict but they support me", es: "Mis padres son estrictos pero me apoyan" },
    { en: "My friends are loyal but not perfect", es: "Mis amigos son leales pero no perfectos" },
    { en: "I do not accept controlling friends", es: "No acepto amigos controladores" },
    { en: "My sister is ambitious and generous", es: "Mi hermana es ambiciosa y generosa" },
    { en: "My brother is sensible but shy", es: "Mi hermano es sensato pero tímido" },
    { en: "Do your friends respect your limits?", es: "Tus amigos respetan tus límites?" },
    { en: "Do you have an honest group of friends? (formal)", es: "Tiene usted un grupo de amigos honesto?" },
    { en: "I have a small but loyal circle", es: "Tengo un círculo pequeño pero leal" },
    { en: "My family is strict but supportive", es: "Mi familia es estricta pero solidaria" },
    { en: "A good friend is reliable and respectful", es: "Un buen amigo es fiable y respetuoso" }
  ],

  // Level 10 — mature, exam-ready but still concise
  10: [
    { en: "My parents are demanding but fair", es: "Mis padres son exigentes pero justos" },
    { en: "My friends are sincere and supportive", es: "Mis amigos son sinceros y solidarios" },
    { en: "I do not tolerate toxic attitudes", es: "No tolero actitudes tóxicas" },
    { en: "My sister is creative, kind, and responsible", es: "Mi hermana es creativa, amable y responsable" },
    { en: "My brother is independent but impatient", es: "Mi hermano es independiente pero impaciente" },
    { en: "Do your parents listen to you?", es: "Tus padres te escuchan?" },
    { en: "Do you have respectful friends? (formal)", es: "Tiene usted amigos respetuosos?" },
    { en: "A true friend is loyal, honest, and patient", es: "Un amigo verdadero es leal, honesto y paciente" },
    { en: "My family is small but very united", es: "Mi familia es pequeña pero muy unida" },
    { en: "I choose loyal friends over popular friends", es: "Elijo amigos leales en lugar de amigos populares" }
  ]
};

  // ===================== Global cheats =====================
  const clampCheats = n => Math.max(0, Math.min(GLOBAL_CHEATS_MAX, n|0));
  function getGlobalCheats(){
    const v = localStorage.getItem(GLOBAL_CHEATS_KEY);
    if (v == null) { localStorage.setItem(GLOBAL_CHEATS_KEY, String(GLOBAL_CHEATS_MAX)); return GLOBAL_CHEATS_MAX; }
    const n = parseInt(v,10);
    return Number.isFinite(n) ? clampCheats(n) : GLOBAL_CHEATS_MAX;
  }
  function setGlobalCheats(n){ localStorage.setItem(GLOBAL_CHEATS_KEY, String(clampCheats(n))); }

  // ===================== Compare =====================
  const norm = s => (s||"").trim();
  const endsWithQM = s => norm(s).endsWith("?");
  function core(s){
    let t = norm(s);
    if (t.startsWith("¿")) t = t.slice(1);
    if (t.endsWith("?"))  t = t.slice(0,-1);
    t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    t = t.replace(/ñ/gi, "n");
    return t.replace(/\s+/g," ").toLowerCase();
  }
  function cmpAnswer(user, expected){ if (!endsWithQM(user)) return false; return core(user) === core(expected); }

  // ===================== Best/unlocks (per tense) =====================
  const STORAGE_PREFIX = "tqplus:v3";
  const bestKey = (tense, lvl) => `${STORAGE_PREFIX}:best:${tense}:${lvl}`;
  function getBest(tense, lvl){ const v = localStorage.getItem(bestKey(tense,lvl)); const n = v==null?null:parseInt(v,10); return Number.isFinite(n)?n:null; }
  function saveBest(tense, lvl, score){ const prev = getBest(tense,lvl); if (prev==null || score<prev) localStorage.setItem(bestKey(tense,lvl), String(score)); }
  function isUnlocked(tense, lvl){ if (lvl===1) return true; const need = BASE_THRESH[lvl-1]; const prev = getBest(tense,lvl-1); return prev!=null && (need==null || prev<=need); }

  // ===================== Helpers =====================
  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
  function speak(text, lang="es-ES"){ try{ if(!("speechSynthesis" in window)) return; const u=new SpeechSynthesisUtterance(text); u.lang=lang; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);}catch{} }
  let rec=null, recActive=false;
  function ensureRecognizer(){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return null; if(!rec){ rec=new SR(); rec.lang="es-ES"; rec.interimResults=false; rec.maxAlternatives=1; } return rec; }
  function startDictationFor(input,onStatus){
    const r=ensureRecognizer(); if(!r){onStatus&&onStatus(false);return;}
    if(recActive){try{r.stop();}catch{} recActive=false; onStatus&&onStatus(false);}
    try{
      r.onresult=e=>{ const txt=(e.results[0]&&e.results[0][0]&&e.results[0][0].transcript)||""; const v=txt.trim(); input.value = v.endsWith("?")?v:(v+"?"); input.dispatchEvent(new Event("input",{bubbles:true})); };
      r.onend=()=>{recActive=false; onStatus&&onStatus(false);};
      recActive=true; onStatus&&onStatus(true); r.start();
    }catch{ onStatus&&onStatus(false); }
  }
  function miniBtn(text,title){ const b=document.createElement("button"); b.type="button"; b.textContent=text; b.title=title; b.setAttribute("aria-label",title);
    Object.assign(b.style,{fontSize:"0.85rem",lineHeight:"1",padding:"4px 8px",marginLeft:"6px",border:"1px solid #ddd",borderRadius:"8px",background:"#fff",cursor:"pointer",verticalAlign:"middle"}); return b; }

  // ===================== Celebration Styles & Helpers =====================
  function injectCelebrationCSS(){
    if (document.getElementById("tqplus-anim-style")) return;
    const css = `
    @keyframes tq-burst { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
    @keyframes tq-pop { 0%{transform:scale(0.6); opacity:0} 25%{transform:scale(1.05); opacity:1} 60%{transform:scale(1)} 100%{opacity:0} }
    @keyframes tq-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    .tq-celebrate-overlay{ position:fixed; inset:0; z-index:9999; pointer-events:none; }
    .tq-confetti{ position:absolute; width:8px; height:14px; border-radius:2px; opacity:0.95; will-change:transform,opacity; animation:tq-burst 1600ms ease-out forwards; }
    .tq-perfect-banner{ position:fixed; left:50%; top:16%; transform:translateX(-50%); padding:10px 18px; border-radius:12px; font-weight:900; font-size:28px; letter-spacing:1px;
      color:#fff; background:linear-gradient(90deg,#ff2d55,#ff9f0a); box-shadow:0 10px 30px rgba(0,0,0,0.25); animation:tq-pop 1800ms ease-out forwards; text-shadow:0 1px 2px rgba(0,0,0,0.35); }
    .tq-shake{ animation:tq-shake 650ms ease-in-out; }
    `;
    const s=document.createElement("style"); s.id="tqplus-anim-style"; s.textContent=css; document.head.appendChild(s);
  }

  function showPerfectCelebration(){
    injectCelebrationCSS();
    // overlay
    const overlay = document.createElement("div");
    overlay.className = "tq-celebrate-overlay";
    document.body.appendChild(overlay);

    // make 120 confetti bits across width
    const COLORS = ["#ff2d55","#ff9f0a","#ffd60a","#34c759","#0a84ff","#bf5af2","#ff375f"];
    const W = window.innerWidth;
    for (let i=0; i<120; i++){
      const c = document.createElement("div");
      c.className = "tq-confetti";
      const size = 6 + Math.random()*8;
      c.style.width  = `${size}px`;
      c.style.height = `${size*1.4}px`;
      c.style.left   = `${Math.random()*W}px`;
      c.style.top    = `${-20 - Math.random()*120}px`;
      c.style.background = COLORS[i % COLORS.length];
      c.style.animationDelay = `${Math.random()*200}ms`;
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      overlay.appendChild(c);
    }

    // banner
    const banner = document.createElement("div");
    banner.className = "tq-perfect-banner";
    banner.textContent = "PERFECT!";
    document.body.appendChild(banner);

    // cleanup after 2.2s
    setTimeout(()=>{ overlay.remove(); banner.remove(); }, 2200);
  }

  // ===================== UI flow =====================
  let CURRENT_TENSE = "Present";
  let quiz = [], currentLevel = null, t0=0, timerId=null, submitted=false;

  // attempt-local token tracking (commit on finish)
  let cheatsUsedThisRound = 0;
  let globalSnapshotAtStart = 0;
  const attemptRemaining = () => Math.max(0, globalSnapshotAtStart - cheatsUsedThisRound);

  function updateESButtonsState(container){
    const left = attemptRemaining();
    const esBtns = Array.from(container.querySelectorAll('button[data-role="es-tts"]'));
    esBtns.forEach(btn=>{
      const active = left>0;
      btn.disabled = !active;
      btn.style.opacity = active ? "1" : "0.5";
      btn.style.cursor  = active ? "pointer" : "not-allowed";
      btn.title = active ? `Read Spanish target (uses 1; attempt left: ${left})` : "No Spanish reads left for this attempt";
    });
  }

  function startTimer(){
    t0 = Date.now();
    clearInterval(timerId);
    timerId = setInterval(()=>{ const t=Math.floor((Date.now()-t0)/1000); const el=$("#timer"); if(el) el.textContent=`Time: ${t}s`; },200);
  }
  function stopTimer(){ clearInterval(timerId); timerId=null; return Math.floor((Date.now()-t0)/1000); }

  function renderLevels(){
    const host = $("#level-list"); if(!host) return;
    host.innerHTML = "";
    const ds = DATASETS[CURRENT_TENSE] || {};
    const available = Object.keys(ds).map(n=>parseInt(n,10)).filter(Number.isFinite).sort((a,b)=>a-b);
    available.forEach(i=>{
      const unlocked = isUnlocked(CURRENT_TENSE,i);
      const best = getBest(CURRENT_TENSE,i);
      const btn = document.createElement("button");
      btn.className="level-btn"; btn.disabled=!unlocked;
      btn.textContent = unlocked?`Level ${i}`:`🔒 Level ${i}`;
      if (unlocked && best!=null){
        const span=document.createElement("span"); span.className="best"; span.textContent=` (Best Score: ${best}s)`; btn.appendChild(span);
      }
      if (unlocked) btn.onclick=()=>startLevel(i);
      host.appendChild(btn);
    });
    host.style.display="flex"; const gm=$("#game"); if(gm) gm.style.display="none";
  }

  function startLevel(level){
    currentLevel = level; submitted=false; cheatsUsedThisRound=0; globalSnapshotAtStart=getGlobalCheats();
    const lv=$("#level-list"); if(lv) lv.style.display="none";
    const res=$("#results"); if(res) res.innerHTML="";
    const gm=$("#game"); if(gm) gm.style.display="block";

    const pool=(DATASETS[CURRENT_TENSE]?.[level])||[];
    const sample=Math.min(QUESTIONS_PER_ROUND,pool.length);
    quiz = shuffle(pool).slice(0,sample).map(it=>({prompt:it.en, answer:it.es, user:""}));

    renderQuiz(); startTimer();
  }

  function renderQuiz(){
    const qwrap=$("#questions"); if(!qwrap) return; qwrap.innerHTML="";
    quiz.forEach((q,i)=>{
      const row=document.createElement("div"); row.className="q";

      const p=document.createElement("div"); p.className="prompt"; p.textContent=`${i+1}. ${q.prompt}`;
      const controls=document.createElement("span");
      Object.assign(controls.style,{display:"inline-block",marginLeft:"6px",verticalAlign:"middle"});

      const enBtn=miniBtn("🔈 EN","Read English prompt"); enBtn.onclick=()=>speak(q.prompt,"en-GB");
      const esBtn=miniBtn("🔊 ES","Read Spanish target (uses 1 this attempt)"); esBtn.setAttribute("data-role","es-tts");
      esBtn.onclick=()=>{ if (attemptRemaining()<=0){ updateESButtonsState(qwrap); return; } speak(q.answer,"es-ES"); cheatsUsedThisRound+=1; updateESButtonsState(qwrap); };
      const micBtn=miniBtn("🎤","Dictate into this answer"); micBtn.onclick=()=>{ startDictationFor(input,(on)=>{ micBtn.style.borderColor=on?"#f39c12":"#ddd"; micBtn.style.boxShadow=on?"0 0 0 2px rgba(243,156,18,0.25)":"none"; }); };

      controls.appendChild(enBtn); controls.appendChild(esBtn); controls.appendChild(micBtn); p.appendChild(controls);

      const input=document.createElement("input"); input.type="text"; input.placeholder="Type the Spanish here (must end with ?)";
      input.oninput=e=>{ quiz[i].user=e.target.value; };
      input.addEventListener("keydown",(e)=>{ if(e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey){ if(e.code==="KeyR"){e.preventDefault();enBtn.click();} else if(e.code==="KeyS"){e.preventDefault();esBtn.click();} else if(e.code==="KeyM"){e.preventDefault();micBtn.click();} }});

      row.appendChild(p); row.appendChild(input); qwrap.appendChild(row);
    });
    updateESButtonsState(qwrap);

    const submit=$("#submit"); if(submit){ submit.disabled=false; submit.textContent="Finish & Check"; submit.onclick=finishAndCheck; }
    const back=$("#back-button"); if(back){ back.style.display="inline-block"; back.onclick=backToLevels; }
  }

  function finishAndCheck(){
    if (submitted) return; submitted=true;

    const elapsed=stopTimer();
    const inputs=$$("#questions input"); inputs.forEach((inp,i)=>{ quiz[i].user=inp.value; });

    let correct=0, wrong=0;
    quiz.forEach((q,i)=>{ const ok=cmpAnswer(q.user,q.answer); if(ok) correct++; else wrong++; inputs[i].classList.remove("good","bad"); inputs[i].classList.add(ok?"good":"bad"); inputs[i].readOnly=true; inputs[i].disabled=true; });

    const penalties = wrong*PENALTY_PER_WRONG;
    const finalScore = elapsed + penalties;

    const submit=$("#submit"); if(submit){ submit.disabled=true; submit.textContent="Checked"; }

    // Unlock message
    let unlockMsg="";
    if (currentLevel<10){
      const need=BASE_THRESH[currentLevel];
      if (typeof need==="number"){
        if (finalScore<=need) unlockMsg=`🎉 Next level unlocked! (Needed ≤ ${need}s)`;
        else unlockMsg=`🔓 Need ${finalScore-need}s less to unlock Level ${currentLevel+1} (Target ≤ ${need}s).`;
      }
    } else unlockMsg="🏁 Final level — great work!";

    // ===== Commit global tokens now =====
    const before = getGlobalCheats();
    let after = clampCheats(globalSnapshotAtStart - cheatsUsedThisRound);
    const perfect = (correct===quiz.length);
    if (perfect && after<GLOBAL_CHEATS_MAX) after = clampCheats(after+1);
    setGlobalCheats(after);

    // Results UI
    const results=$("#results"); if(!results) return;
    const summary=document.createElement("div"); summary.className="result-summary";
    summary.innerHTML =
      `<div class="line" style="font-size:1.35rem; font-weight:800;">🏁 FINAL SCORE: ${finalScore}s</div>
       <div class="line">⏱️ Time: <strong>${elapsed}s</strong></div>
       <div class="line">➕ Penalties: <strong>${wrong} × ${PENALTY_PER_WRONG}s = ${penalties}s</strong></div>
       <div class="line">✅ Correct: <strong>${correct}/${quiz.length}</strong></div>
       <div class="line" style="margin-top:8px;"><strong>${unlockMsg}</strong></div>
       <div class="line" style="margin-top:8px;">🎧 Spanish reads used this round: <strong>${cheatsUsedThisRound}</strong> &nbsp;|&nbsp; Global after commit: <strong>${after}/${GLOBAL_CHEATS_MAX}</strong></div>`;

    // Celebrate on perfect
    if (perfect){
      showPerfectCelebration();
      // subtle shake on the summary box so it "feels" like a win
      summary.classList.add("tq-shake");
      const bonusNote = document.createElement("div");
      bonusNote.className = "line";
      bonusNote.style.marginTop = "6px";
      bonusNote.innerHTML = (after>before)
        ? `⭐ Perfect round! Spanish-read tokens: ${before} → ${after} (max ${GLOBAL_CHEATS_MAX}).`
        : `⭐ Perfect round! (Spanish-read tokens already at max ${GLOBAL_CHEATS_MAX}).`;
      summary.appendChild(bonusNote);
    }

    const ul=document.createElement("ul");
    quiz.forEach(q=>{
      const li=document.createElement("li"); const ok=cmpAnswer(q.user,q.answer);
      li.className=ok?"correct":"incorrect";
      li.innerHTML = `${q.prompt} — <strong>${q.answer}</strong>` + (ok?"":` &nbsp;❌&nbsp;(you: “${q.user||""}”)`);
      ul.appendChild(li);
    });

    const again=document.createElement("button");
    again.className="try-again"; again.textContent="Try Again"; again.onclick=()=>startLevel(currentLevel);

    results.innerHTML=""; results.appendChild(summary); results.appendChild(ul); results.appendChild(again);

    saveBest(CURRENT_TENSE,currentLevel,finalScore);
    summary.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function backToLevels(){ stopTimer(); const gm=$("#game"); if(gm) gm.style.display="none"; renderLevels(); }

  // ===================== Init =====================
  document.addEventListener("DOMContentLoaded", ()=>{
    // init global cheats
    setGlobalCheats(getGlobalCheats());

    // tense switching (present-based datasets across all)
    $$("#tense-buttons .tense-button").forEach(btn=>{
      btn.addEventListener("click", e=>{
        e.preventDefault();
        const t = btn.dataset.tense || btn.textContent.trim();
        if (!DATASETS[t]) return;
        $$("#tense-buttons .tense-button").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        CURRENT_TENSE = t;
        backToLevels();
      });
    });

    // default active
    const presentBtn = $(`#tense-buttons .tense-button[data-tense="Present"]`) || $$("#tense-buttons .tense-button")[0];
    if (presentBtn) presentBtn.classList.add("active");

    renderLevels();
  });
})();
