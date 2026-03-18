import { useState, useEffect } from "react";

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const C = {
  pageBg:   "#DFF4F0",
  white:    "#FFFFFF",
  teal:     "#3BBFAD",
  tealDk:   "#1A7A6E",
  tealMd:   "#2FA898",
  tealLt:   "#C6EDE8",
  tealXlt:  "#EAF8F5",
  tealVivid:"#7EEEE4",   // uploaded accent colour
  navy:     "#0D2B3E",
  navyLt:   "#163D52",
  muted:    "#4A7A72",
  mutedLt:  "#7AADA6",
  border:   "#C2E8E2",
  inputBg:  "#F4FBFA",
  // result tiers
  strongBg: "#7EEEE4",   // vivid teal from screenshot
  strongBd: "#3BBFAD",
  strongCol:"#0D4A3E",
  possibleBg:"#EAF8F5",
  possibleBd:"#C6EDE8",
  possibleCol:"#1A7A6E",
  earlyBg:  "#F4FBFA",
  earlyBd:  "#C2E8E2",
  earlyCol: "#4A7A72",
  amberBg:  "#FFFBEB",
  amberBd:  "#FDE68A",
  amberCol: "#92400E",
  // share section — warm sand to contrast the teal result cards
  shareBg:  "#FDF6EC",
  shareBd:  "#F0DEC0",
  shareCol: "#7A4F1A",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0);    }
}
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes scaleIn {
  from { opacity:0; transform:scale(0.97); }
  to   { opacity:1; transform:scale(1);    }
}

.fade-up  { animation: fadeUp  0.42s cubic-bezier(.22,.68,0,1.15) both; }
.fade-in  { animation: fadeIn  0.35s ease both; }
.scale-in { animation: scaleIn 0.4s  cubic-bezier(.22,.68,0,1.15) both; }

/* ── Option button states ───────────────────────────────────────────────── */
.opt-btn {
  transition: border-color .18s, background .18s, box-shadow .18s;
}
/* unselected hover */
.opt-btn:not(.opt-selected):hover {
  border-color: #0D2B3E !important;
  background: #EAF8F5 !important;
}
.opt-btn:not(.opt-selected):hover .opt-label {
  color: #0D2B3E !important;
}
.opt-btn:not(.opt-selected):hover .opt-box {
  border-color: #0D2B3E !important;
}
/* selected — keep navy background on hover, boost ring */
.opt-btn.opt-selected {
  border-color: #0D2B3E !important;
  background: #0D2B3E !important;
}
.opt-btn.opt-selected:hover {
  background: #163D52 !important;
  border-color: #163D52 !important;
  box-shadow: 0 0 0 3px rgba(13,43,62,.18);
}
.opt-btn.opt-selected .opt-label { color: #FFFFFF !important; }
.opt-btn.opt-selected .opt-box   { border-color: #3BBFAD !important; background: #3BBFAD !important; }

/* ── Buttons ─────────────────────────────────────────────────────────────── */
.cta-btn:not(:disabled):hover   { opacity:.87; }
.ghost-btn:hover { background: #F4FBFA !important; }
.bmi-btn:hover   { opacity:.8; }
.share-btn:hover { opacity:.85; }
`;

/* ─── YOUR QUIZ LINK — replace with your actual URL ─────────────────────── */
const QUIZ_URL = "https://YOUR_WEBSITE_LINK_HERE";

/* ─── QUESTIONS ──────────────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id:"q1", step:"01", tag:"Health Status",
    question:"Have you been told your blood sugar is high?",
    sub:"Includes Type 2 diabetes, prediabetes, or a recent flag from your doctor.",
    type:"single",
    options:[
      { id:"a", label:"Yes — I have Type 2 diabetes",                 score:4, flag:null   },
      { id:"b", label:"Yes — I have prediabetes or borderline levels", score:3, flag:null   },
      { id:"c", label:"Not sure — I haven't been tested recently",     score:2, flag:null   },
      { id:"d", label:"No — my blood sugar is normal",                score:0, flag:null   },
      { id:"e", label:"I have Type 1 diabetes",                       score:0, flag:"T1DM" },
    ],
  },
  {
    id:"q2", step:"02", tag:"Body Weight",
    question:"How would you describe your current weight?",
    sub:"GLP-1 therapy is indicated at BMI ≥ 30, or ≥ 27 with a health condition.",
    type:"single", bmiButton:true,
    options:[
      { id:"a", label:"BMI over 30 — significantly above healthy range", score:4, flag:null },
      { id:"b", label:"BMI 27–30 — overweight with health concerns",     score:3, flag:null },
      { id:"c", label:"BMI 25–27 — slightly above healthy range",        score:1, flag:null },
      { id:"d", label:"BMI under 25 — within healthy range",             score:0, flag:null },
    ],
  },
  {
    id:"q3", step:"03", tag:"Daily Wellbeing",
    question:"How do you feel on most days?",
    sub:"Pick the description that best matches your typical day.",
    type:"single",
    options:[
      { id:"a", label:"Tired, thirsty, and low-energy most of the time",  score:4, flag:null },
      { id:"b", label:"Energy dips noticeably — especially after meals",  score:3, flag:null },
      { id:"c", label:"Generally okay but something feels off",           score:2, flag:null },
      { id:"d", label:"I feel fine — exploring options as a precaution",  score:1, flag:null },
    ],
  },
  {
    id:"q4", step:"04", tag:"Your Goal",
    question:"What is your primary goal right now?",
    sub:"Choose the outcome that matters most to you.",
    type:"single",
    options:[
      { id:"a", label:"Lose significant weight — 15% or more of my body weight", score:4, flag:null },
      { id:"b", label:"Get my blood sugar under control",                          score:4, flag:null },
      { id:"c", label:"Reduce my risk of heart disease or stroke",                score:3, flag:null },
      { id:"d", label:"Lose some weight and feel healthier overall",              score:3, flag:null },
      { id:"e", label:"I am just exploring my options",                           score:1, flag:null },
    ],
  },
  {
    id:"q5", step:"05", tag:"Prior Efforts",
    question:"What have you already tried?",
    sub:"Select all that apply.",
    type:"multi",
    options:[
      { id:"a", label:"A structured diet or exercise programme (3+ months)", score:3, flag:null },
      { id:"b", label:"Calorie restriction or meal plans on my own",         score:2, flag:null },
      { id:"c", label:"Prescription medication for weight or blood sugar",   score:2, flag:null },
      { id:"d", label:"Multiple approaches — nothing has worked long-term",  score:3, flag:null },
      { id:"e", label:"I haven't started a structured approach yet",         score:0, flag:null },
    ],
  },
];

/* ─── SCORING ────────────────────────────────────────────────────────────── */
function getResult(answers) {
  let score = 0;
  const flags = new Set();
  const MAX = 4+4+4+4+3;

  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    (Array.isArray(ans)?ans:[ans]).forEach(id => {
      const opt = q.options.find(o=>o.id===id);
      if (!opt) return;
      score += opt.score;
      if (opt.flag) flags.add(opt.flag);
    });
  });

  const pct = Math.round((score/MAX)*100);

  if (flags.has("T1DM")) return {
    tier:"T1DM", headline:"GLP-1 is not indicated for Type 1 diabetes",
    sub:"These medications are approved for Type 2 diabetes and obesity. Speak with your endocrinologist about therapies designed for your condition.",
    bg:C.amberBg, bd:C.amberBd, col:C.amberCol, pillLabel:"Not Indicated",
    steps:[
      "Continue your current insulin regimen as directed",
      "Ask your endocrinologist about approved adjunct therapies for Type 1",
      "Monitor your HbA1c regularly and discuss targets with your provider",
    ],
    shareMsg:`I scored ${pct}% on the GLP-1 eligibility quiz. Find out if GLP-1 therapy could be right for you:`,
    score, pct,
  };

  if (pct>=70) return {
    tier:"STRONG", headline:"You are a strong candidate for GLP-1 therapy",
    sub:"Your profile aligns closely with the clinical criteria doctors look for — your diabetes status, weight range, and treatment history all point in the same direction.",
    bg:C.strongBg, bd:C.strongBd, col:C.strongCol, pillLabel:"Strong Candidate",
    steps:[
      "Book a consultation with a GLP-1 specialist or your GP",
      "Ask about tirzepatide (Mounjaro®) or semaglutide (Wegovy® / Ozempic®)",
      "Bring a list of your current medications and health history",
    ],
    shareMsg:`I scored ${pct}% on the GLP-1 eligibility quiz — strong candidate. See if it could be right for you:`,
    score, pct,
  };

  if (pct>=45) return {
    tier:"POSSIBLE", headline:"You may be a good fit for GLP-1 therapy",
    sub:"Your profile shows several factors that align with eligibility criteria. A full assessment by a healthcare provider will confirm whether this is the right path.",
    bg:C.possibleBg, bd:C.possibleBd, col:C.possibleCol, pillLabel:"Possible Candidate",
    steps:[
      "Speak with your GP or a diabetes specialist about GLP-1 options",
      "Get your BMI and HbA1c checked if you haven't recently",
      "Ask whether your health history meets the eligibility criteria",
    ],
    shareMsg:`I scored ${pct}% on the GLP-1 eligibility quiz. Worth taking if you have diabetes or weight concerns:`,
    score, pct,
  };

  return {
    tier:"EARLY", headline:"Lifestyle intervention is your strongest first step",
    sub:"Right now, structured lifestyle changes are likely your most effective tool. GLP-1 may become relevant if your weight or blood sugar changes.",
    bg:C.earlyBg, bd:C.earlyBd, col:C.earlyCol, pillLabel:"Early Stage",
    steps:[
      "Focus on nutrition and movement as your primary strategy",
      "Ask your GP for a diabetes risk assessment and blood sugar test",
      "Revisit this quiz if your weight or health status changes",
    ],
    shareMsg:`I just took the GLP-1 eligibility quiz. Useful even if you're just keeping an eye on your health:`,
    score, pct,
  };
}

/* ─── SHARED ATOMS ───────────────────────────────────────────────────────── */
function Checkmark({ color="white", size=10 }) {
  return (
    <svg width={size} height={Math.round(size*0.8)} viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5L9 1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ marginBottom:30 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.mutedLt, fontWeight:500 }}>Question {current} of {total}</span>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.tealDk,  fontWeight:600 }}>{Math.round((current/total)*100)}%</span>
      </div>
      <div style={{ height:3, background:C.tealLt, borderRadius:999 }}>
        <div style={{ height:"100%", borderRadius:999, width:`${(current/total)*100}%`, background:`linear-gradient(90deg,${C.tealMd},${C.navy})`, transition:"width .5s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function StepPill({ label }) {
  return (
    <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11, color:C.tealDk, background:C.tealXlt, padding:"4px 12px", borderRadius:999, letterSpacing:"0.06em", textTransform:"uppercase" }}>
      {label}
    </span>
  );
}

function BMIButton() {
  return (
    <a href="#YOUR_BMI_CALCULATOR_LINK" target="_blank" rel="noopener noreferrer" className="bmi-btn"
      style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:8, marginBottom:18, background:C.tealXlt, border:`1px solid ${C.tealLt}`, textDecoration:"none", transition:"opacity .15s" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.tealDk} strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, color:C.tealDk }}>Calculate my BMI</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.tealDk} strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
    </a>
  );
}

/* ─── OPTION BUTTON ──────────────────────────────────────────────────────── */
function OptionButton({ label, selected, onClick, type, delay=0 }) {
  return (
    <button
      className={`opt-btn fade-up ${selected ? "opt-selected" : ""}`}
      onClick={onClick}
      style={{ animationDelay:`${delay}ms`, width:"100%", padding:"15px 20px", borderRadius:12, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:16, border:`1.5px solid ${selected?C.navy:C.border}`, background:selected?C.navy:C.white, marginBottom:8 }}
    >
      <div className="opt-box" style={{ width:20, height:20, borderRadius:type==="multi"?5:"50%", border:`1.5px solid ${selected?C.teal:C.border}`, background:selected?C.teal:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .18s" }}>
        {selected && <Checkmark />}
      </div>
      <span className="opt-label" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:selected?600:400, color:selected?C.white:C.navy, flex:1, lineHeight:1.5 }}>
        {label}
      </span>
    </button>
  );
}

/* ─── NATIVE SHARE ───────────────────────────────────────────────────────── */
async function nativeShare(result) {
  const text = `${result.pillLabel}: ${result.shareMsg}`;
  const url  = QUIZ_URL;

  if (navigator.share) {
    try {
      await navigator.share({ title:"My GLP-1 Eligibility Result", text, url });
    } catch (e) {
      // user cancelled — no error needed
    }
  } else {
    // fallback: copy to clipboard silently
    await navigator.clipboard?.writeText(`${text}\n${url}`);
    alert("Link copied to clipboard!");
  }
}

/* ─── INTRO ──────────────────────────────────────────────────────────────── */
function IntroScreen({ onStart }) {
  return (
    <div className="fade-in">
      <div style={{ marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.navy, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11, color:C.mutedLt, letterSpacing:"0.07em", textTransform:"uppercase" }}>GLP-1 Eligibility Assessment</span>
        </div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:38, fontWeight:400, color:C.navy, lineHeight:1.2, marginBottom:14 }}>
          Could GLP-1 therapy<br/><em style={{ color:C.tealMd }}>be right for you?</em>
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:C.muted, lineHeight:1.75, maxWidth:400 }}>
          Answer 5 straightforward questions and receive a personalised eligibility assessment — no lab results required.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:0, marginBottom:28, background:C.white, borderRadius:14, border:`1.5px solid ${C.border}`, overflow:"hidden" }}>
        {[{v:"60 sec",l:"to complete"},{v:"5",l:"questions"},{v:"ADA 2025",l:"guidelines"}].map((s,i)=>(
          <div key={s.l} style={{ flex:1, padding:"18px 14px", textAlign:"center", borderRight:i<2?`1px solid ${C.border}`:"none" }}>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:C.navy, marginBottom:2 }}>{s.v}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.mutedLt, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* What you get */}
      <div style={{ background:C.white, borderRadius:14, border:`1.5px solid ${C.border}`, padding:"20px 22px", marginBottom:26 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:C.mutedLt, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:14 }}>What you will receive</p>
        {["A personalised eligibility assessment based on clinical criteria","A match score showing how well your profile aligns","Clear, specific next steps tailored to your answers","A shareable result to discuss with your healthcare provider"].map((t,i)=>(
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:i<3?11:0 }}>
            <div style={{ width:18,height:18,borderRadius:"50%",background:C.tealXlt,border:`1px solid ${C.tealLt}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2 }}>
              <Checkmark color={C.tealDk} size={8}/>
            </div>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.navy, lineHeight:1.6 }}>{t}</span>
          </div>
        ))}
      </div>

      <button className="cta-btn" onClick={onStart} style={{ width:"100%", padding:"16px 0", borderRadius:12, background:C.navy, color:C.white, border:"none", fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, cursor:"pointer", letterSpacing:"0.01em", transition:"opacity .2s" }}>
        Begin Assessment →
      </button>
      <p style={{ textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.mutedLt, marginTop:12 }}>
        Anonymous · No data stored · Free
      </p>
    </div>
  );
}

/* ─── QUESTION SCREEN ────────────────────────────────────────────────────── */
function QuestionScreen({ q, qIndex, total, answers, onPick, onNext, onBack }) {
  const [animKey, setAnimKey] = useState(0);
  useEffect(()=>{ setAnimKey(k=>k+1); },[qIndex]);

  const ans = answers[q.id];
  const canNext = q.type==="multi" ? Array.isArray(ans)&&ans.length>0 : !!ans;

  const pick = (optId) => {
    if (q.type==="single") {
      onPick(q.id, optId, "single");
    } else {
      const prev = Array.isArray(ans)?ans:[];
      if (optId==="e") { onPick(q.id, prev.includes("e")?[]:[optId], "set"); return; }
      const without = prev.filter(x=>x!=="e");
      onPick(q.id, without.includes(optId)?without.filter(x=>x!==optId):[...without,optId], "set");
    }
  };

  return (
    <div key={animKey}>
      <ProgressBar current={qIndex+1} total={total} />
      <div className="fade-up" style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <StepPill label={q.tag}/>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.mutedLt, fontWeight:500 }}>Step {q.step} of 05</span>
        </div>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontWeight:400, fontSize:26, color:C.navy, lineHeight:1.3, marginBottom:8 }}>{q.question}</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.mutedLt, lineHeight:1.6 }}>{q.sub}</p>
        {q.bmiButton && <div style={{ marginTop:14 }}><BMIButton/></div>}
        {q.type==="multi" && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.mutedLt, marginTop:10, fontStyle:"italic" }}>Select all that apply</p>}
      </div>

      <div>
        {q.options.map((opt,i)=>{
          const sel = q.type==="single" ? ans===opt.id : Array.isArray(ans)&&ans.includes(opt.id);
          return <OptionButton key={opt.id} label={opt.label} selected={sel} type={q.type} onClick={()=>pick(opt.id)} delay={i*55}/>;
        })}
      </div>

      <div style={{ display:"flex", gap:10, marginTop:22 }}>
        <button className="ghost-btn" onClick={onBack} style={{ padding:"13px 22px", borderRadius:12, background:"transparent", color:C.mutedLt, border:`1.5px solid ${C.border}`, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .15s" }}>← Back</button>
        <button className="cta-btn" onClick={onNext} disabled={!canNext} style={{ flex:1, padding:"13px 0", borderRadius:12, border:"none", background:canNext?C.navy:C.tealLt, color:canNext?C.white:C.mutedLt, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:canNext?"pointer":"not-allowed", transition:"all .2s" }}>
          {qIndex===total-1 ? "See My Result →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

/* ─── RESULT SCREEN ──────────────────────────────────────────────────────── */
function ResultScreen({ result, onRetake }) {
  const barColor = result.pct>=70 ? C.strongCol : result.pct>=45 ? C.tealDk : C.mutedLt;

  return (
    <div className="fade-in">
      <div style={{ textAlign:"center", marginBottom:22 }}>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontWeight:400, fontSize:30, color:C.navy }}>
          Your <em style={{ color:C.tealMd }}>Result</em>
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.mutedLt, marginTop:5 }}>Based on ADA 2025 clinical criteria</p>
      </div>

      {/* ── Hero result card — vivid teal for strong, distinct colours for others ── */}
      <div className="scale-in" style={{ background:result.bg, border:`1.5px solid ${result.bd}`, borderRadius:18, padding:"28px 26px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <span style={{ display:"inline-block", background:result.col, color:C.white, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:10, padding:"4px 12px", borderRadius:999, marginBottom:12, letterSpacing:"0.07em", textTransform:"uppercase" }}>
              {result.pillLabel}
            </span>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontWeight:400, fontSize:21, color:result.col, lineHeight:1.3 }}>{result.headline}</h2>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:38, color:result.col, lineHeight:1 }}>{result.pct}%</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:result.col, opacity:.65, fontWeight:500, marginTop:2 }}>match score</div>
          </div>
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:result.col, lineHeight:1.75, opacity:.85 }}>{result.sub}</p>
      </div>

      {/* Score bar */}
      <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"18px 22px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:C.mutedLt, textTransform:"uppercase", letterSpacing:"0.07em" }}>Eligibility match</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.mutedLt }}>{result.score} / 19 points</span>
        </div>
        <div style={{ height:6, background:C.tealLt, borderRadius:999, marginBottom:7 }}>
          <div style={{ height:"100%", width:`${result.pct}%`, borderRadius:999, background:barColor, transition:"width 1.4s cubic-bezier(.4,0,.2,1)" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {["Early stage","Exploring","Possible","Strong match"].map(l=>(
            <span key={l} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.mutedLt }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"22px 24px", marginBottom:14 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:C.mutedLt, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:18 }}>Recommended next steps</p>
        {result.steps.map((s,i)=>(
          <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", paddingBottom:i<result.steps.length-1?15:0, marginBottom:i<result.steps.length-1?15:0, borderBottom:i<result.steps.length-1?`1px solid ${C.border}`:"none" }}>
            <div style={{ width:26,height:26,borderRadius:"50%",background:C.tealXlt,border:`1px solid ${C.tealLt}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Serif Display',serif",fontSize:13,color:C.tealDk,flexShrink:0 }}>{i+1}</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.navy, lineHeight:1.7 }}>{s}</p>
          </div>
        ))}
      </div>

      {/* ── Share section — warm sand, distinct from teal result card ── */}
      <div style={{ background:C.shareBg, border:`1.5px solid ${C.shareBd}`, borderRadius:14, padding:"20px 22px", marginBottom:16 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, color:C.shareCol, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>
          Know someone who should take this?
        </p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.shareCol, lineHeight:1.65, marginBottom:16, opacity:.8 }}>
          Share your result and the quiz link with friends or family who may benefit.
        </p>
        <button
          className="share-btn"
          onClick={()=>nativeShare(result)}
          style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"11px 22px", borderRadius:10, background:C.shareCol, border:"none", color:C.white, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer", transition:"opacity .2s" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share My Result
        </button>
      </div>

      {/* Source */}
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.mutedLt, lineHeight:1.65, marginBottom:20 }}>
        Based on ADA Standards of Care 2025 · IDF Clinical Practice Recommendations 2025 · FDA prescribing criteria. For informational screening purposes only — not a medical diagnosis.
      </p>

      {/* CTAs */}
      <div style={{ display:"flex", gap:10 }}>
        <button className="ghost-btn" onClick={onRetake} style={{ padding:"14px 20px", borderRadius:12, background:"transparent", color:C.mutedLt, border:`1.5px solid ${C.border}`, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", transition:"background .15s" }}>Retake</button>
        <button className="cta-btn" style={{ flex:1, padding:"14px 0", borderRadius:12, background:C.navy, border:"none", color:C.white, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer", transition:"opacity .2s" }}>
          Book a Free Consultation →
        </button>
      </div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────────────── */
export default function GLP1Quiz() {
  const [step, setStep]     = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult]   = useState(null);

  const q = QUESTIONS[current];

  const handlePick = (qId, val, type) => {
    setAnswers(p => ({ ...p, [qId]: type==="single" ? val : val }));
  };

  const handleNext = () => {
    if (current < QUESTIONS.length-1) setCurrent(c=>c+1);
    else { setResult(getResult(answers)); setStep("result"); }
  };

  const handleBack = () => {
    if (current>0) setCurrent(c=>c-1);
    else setStep("intro");
  };

  const retake = () => { setStep("intro"); setCurrent(0); setAnswers({}); setResult(null); };

  return (
    <div style={{ background:C.pageBg, minHeight:"100vh", padding:"44px 20px 64px" }}>
      <style>{FONTS}{STYLES}</style>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        {step==="intro"  && <IntroScreen onStart={()=>setStep("quiz")} />}
        {step==="quiz"   && <QuestionScreen q={q} qIndex={current} total={QUESTIONS.length} answers={answers} onPick={handlePick} onNext={handleNext} onBack={handleBack} />}
        {step==="result" && result && <ResultScreen result={result} onRetake={retake} />}
      </div>
    </div>
  );
}
