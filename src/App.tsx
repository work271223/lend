import React, { useEffect, useState, useRef } from "react";
import { Check, Star, Clock, Shield, ChevronRight, Play, BookOpen, Sparkles, Gift, Users, GraduationCap, HelpCircle, Rocket, Settings, Save, Link as LinkIcon, Upload, Download } from "lucide-react";

// Landing with persist fix: config.json loads only once if localStorage is empty
const TELEGRAM_REVIEWS_URL = "https://t.me/+ClNCXSObpic0ZDli";
const defaults:any = {
  brand:{ title:"Pro Binary — Academy", telegram:"@your_id", email:"info@yourdomain.com" },
  hero:{ badge:"Access via Pocket Option deposit", title:"Three trading courses — effectively free", subtitle:"Unlock access after deposit: $100 / $200 / $300 or the full bundle with a $500 deposit. Video lessons, checklists, mini‑quizzes, and support.", ctaPrimary:"How to get access", ctaSecondary:"Course contents", image:"" },
  features:[{icon:"shield",text:"Structured program: beginner to pro"},{icon:"clock",text:"Format: video + breakdowns + checklists"},{icon:"graduation",text:"Mini‑exams and certificate"},{icon:"users",text:"Support and trade reviews in chat"}],
  courses:[
    {id:"basic100",color:"from-sky-500 to-cyan-400",title:"BASIC • Technical analysis from scratch",deposit:100,audienceTitle:"Who it's for",audience:["Absolute beginners","Trend logic: up/down/range","Drawing trendlines and levels"],outcomesTitle:"Outcomes",outcomes:["Spot reversals and continuations","Read candles on M1 with confidence","Assemble a simple price‑action system"],modulesTitle:"Modules",modules:[{name:"Trends & Lines",bullets:["Types of trends and price logic","Trendlines: drawing and invalidation","Entry signal on trendline break"]},{name:"Support / Resistance",bullets:["How to build levels and judge strength","Confirmations: touches & timeframe","Entry algorithm: approach → reaction → entry"]},{name:"Chart Patterns",bullets:["Head & Shoulders / Inverted H&S","Double Top/Bottom, Wedge, Triangle","Entry rules & targets (pattern height)"]}],button:"Unlock — deposit"},
    {id:"indicators200",color:"from-violet-500 to-fuchsia-500",title:"PRO • Indicators & precise entries",deposit:200,audienceTitle:"Who it's for",audience:["You know basics","You want rule‑based signals","Less subjectivity"],outcomesTitle:"Outcomes",outcomes:["Build indicator stacks","Filter noise & false signals","Increase winrate with confirmations"],modulesTitle:"Modules",modules:[{name:"Moving Average (MA)",bullets:["Why MA is core","MA + Patterns: filtering","Practice: find 3 patterns & 3 wins"]},{name:"Williams %R + Accelerator",bullets:["-80/-20 zones","Signal diversification","Trend/counter‑trend scenarios"]},{name:"CCI + Momentum",bullets:["Cycles & levels","Momentum 100 rule","Early reversal combo"]}],button:"Unlock — deposit"},
    {id:"master300",color:"from-emerald-500 to-teal-500",title:"MASTER • System trading & risk management",deposit:300,audienceTitle:"Who it's for",audience:["Adv. beginners / intermediate","Ready for daily plan & journal","Goal: consistency & scaling"],outcomesTitle:"Outcomes",outcomes:["Build a trading plan & checklist","Risk profile & limits","Templates & journal to automate"],modulesTitle:"Modules",modules:[{name:"Entry System",bullets:["Trend / counter‑trend / range","Timing & duration for M1","Signal: conditions → confirm → entry"]},{name:"Risk & Money",bullets:["Fixed risk per trade & daily cap","Anti‑martingale growth","Drawdown recovery plan"]},{name:"Psychology",bullets:["Avoid overtrading","Rules for breaks","Trader's journal template"]}],button:"Unlock — deposit"}
  ],
  programsIntro:"Each module = video, notes, checklist, and a short quiz. The next block unlocks after passing the quiz.",
  bundle:{title:"Best value — access to all courses",text:"Unlock all 3 courses after a $500 deposit on Pocket Option. No extra payments for education.",button:"Unlock all — deposit",deposit:500,includes:"Includes: Basic ($100) • Indicators ($200) • Master ($300)"},
  howTo:{title:"How to get access for free",steps:["Sign up / log in to Pocket Option.","Top up your deposit — $100 / $200 / $300 or $500 for the bundle.","Send your account ID / receipt to Telegram support — we'll activate access."],note:"Important: we do not accept payments for courses; the deposit stays in your Pocket Option account.",pocketLink:"#",proofLink:"#"},
  reviewsLink:{title:"Real reviews on Telegram",subtitle:"Open our reviews channel to see live feedback and results.",button:"Open reviews channel",url:TELEGRAM_REVIEWS_URL},
  faq:[{q:"Are courses paid?",a:"No. Courses are effectively free: access unlocks after your Pocket Option deposit for the selected level."},{q:"Where does the deposit go?",a:"Only to your Pocket Option account. We do not take money for training."},{q:"How to confirm the deposit?",a:"Send your account ID / receipt in Telegram — we'll activate access."},{q:"Lifetime access?",a:"Yes. Lifetime access. Updates included."},{q:"Where to start?",a:"Start with Basic ($100), then Indicators ($200) and Master ($300) — or go bundle with a $500 deposit."}],
  cta:{title:"Ready to start? Unlock via deposit",text:"Top up your Pocket Option deposit and send your ID/receipt — we'll activate access. Questions? Message us on Telegram.",chosenLabel:"You selected:",btnPocket:"Go to Pocket Option",btnProof:"Send receipt/ID in Telegram",disclaimer:"We do not accept payments for training. The deposit & risks are on the Pocket Option side."},
  footer:{about:"Trading education for Pocket Option: theory, practice, discipline.",docs:["Public Offer","Refund Policy","Privacy Policy"]}
};
const KEY = "pb_cfg_v3_en";
const usd = (n:number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function App(){
  const [cfg, setCfg] = useState<any>(defaults);
  const [selected, setSelected] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const ninePressRef = useRef(0);
  const nineTimerRef = useRef<any>(null);
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      try { setCfg(JSON.parse(saved)); return; } catch {}
    }
    (async () => {
      try {
        const res = await fetch('/config.json', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const merged = deepMerge(defaults, json || {});
          localStorage.setItem(KEY, JSON.stringify(merged));
          setCfg(merged);
          return;
        }
      } catch {}
      localStorage.setItem(KEY, JSON.stringify(defaults));
      setCfg(defaults);
    })();
  }, []);
  useEffect(()=>{
    const onKey = (e:KeyboardEvent) => {
      const isNine = e.key === '9' || e.code === 'Numpad9';
      if(!isNine) return;
      ninePressRef.current += 1;
      if(nineTimerRef.current) clearTimeout(nineTimerRef.current);
      nineTimerRef.current = setTimeout(()=>{ ninePressRef.current = 0; }, 1500);
      if(ninePressRef.current >= 7){ setAdminOpen(v=>!v); ninePressRef.current = 0; }
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[]);
  const onAccess = (id:string) => { document.getElementById('cta')?.scrollIntoView({behavior:'smooth'}); setSelected(id); };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-925 to-slate-900 text-slate-100 selection:bg-cyan-400/30">
      <Header title={cfg.brand.title} />
      <Hero hero={cfg.hero} features={cfg.features} />
      <Programs courses={cfg.courses} programsIntro={cfg.programsIntro} onAccess={onAccess} />
      <Bundle bundle={cfg.bundle} onAccess={onAccess} />
      <HowTo howTo={cfg.howTo} />
      <ReviewsLink reviewsLink={cfg.reviewsLink} />
      <FAQ faq={cfg.faq} />
      <CTA cta={cfg.cta} howTo={cfg.howTo} selected={selected} />
      <Footer brand={cfg.brand} footer={cfg.footer} />
      {adminOpen && (<AdminPanel cfg={cfg} onClose={()=>setAdminOpen(false)} onSave={(next)=>{ setCfg(next); localStorage.setItem(KEY, JSON.stringify(next)); }} />)}
    </div>
  );
}

function Header({title}:{title:string}){
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-slate-950/60 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-cyan-400" />
          <span className="font-semibold tracking-tight">{title}</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#programs" className="hover:text-white">Programs</a>
          <a href="#pricing" className="hover:text-white">Access</a>
          <a href="#reviews" className="hover:text-white">Reviews</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#cta" className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold">Get access</a>
        </nav>
      </div>
    </header>
  );
}
function Hero({hero, features}:{hero:any; features:any[]}){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(80%_80%_at_50%_20%,rgba(34,211,238,0.25),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> {hero.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">{hero.title}</h1>
          <p className="mt-5 text-slate-300 text-lg md:text-xl">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#pricing" className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold inline-flex items-center gap-2">
              {hero.ctaPrimary} <ChevronRight className="h-4 w-4" />
            </a>
            <a href="#programs" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold inline-flex items-center gap-2">
              {hero.ctaSecondary} <BookOpen className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-300">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5">{iconByName(f.icon)}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          {hero.image ? (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img src={hero.image} alt="Hero banner" className="w-full h-full object-cover"/>
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 p-2 shadow-2xl ring-1 ring-white/10">
              <div className="w-full h-full rounded-xl bg-slate-900/70 grid place-items-center">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-3 text-cyan-400" />
                  <p className="text-slate-300">Hero preview / platform screenshot</p>
                  <p className="text-xs text-slate-400 mt-1">(upload your image via Admin)</p>
                </div>
              </div>
            </div>
          )}
          <div className="absolute -bottom-6 -left-6 rotate-2 rounded-2xl bg-slate-800/80 p-4 ring-1 ring-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-amber-300 text-sm"><Star className="h-4 w-4"/> 1,200+ graduates</div>
            <div className="mt-1 text-slate-300 text-xs">Average rating 4.9/5</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Programs({courses, programsIntro, onAccess}:{courses:any[]; programsIntro:string; onAccess:(id:string)=>void}){
  return (
    <section id="programs" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight">Course programs</h2>
      <p className="mt-3 text-slate-300 max-w-3xl">{programsIntro}</p>
      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.id} className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-shadow hover:shadow-2xl">
            <div className={`bg-gradient-to-r ${c.color} p-6`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/15"><BookOpen className="h-6 w-6" /></div>
                <h3 className="font-extrabold text-lg leading-tight">{c.title}</h3>
              </div>
              <div className="mt-4 text-2xl font-black">Deposit to unlock: {usd(c.deposit)}</div>
              <div className="text-sm text-slate-900/90 bg-white/80 inline-flex px-2 py-0.5 rounded-lg mt-2 font-semibold">Deposit from ${c.deposit}</div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">{c.audienceTitle}</div>
                <ul className="space-y-2 text-slate-300">
                  {c.audience.map((a:string,i:number)=> (<li key={i} className="flex gap-2"><Check className="h-5 w-5 text-cyan-400 shrink-0"/> {a}</li>))}
                </ul>
              </div>
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">{c.outcomesTitle}</div>
                <ul className="space-y-2 text-slate-300">
                  {c.outcomes.map((a:string,i:number)=> (<li key={i} className="flex gap-2"><Check className="h-5 w-5 text-cyan-400 shrink-0"/> {a}</li>))}
                </ul>
              </div>
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">{c.modulesTitle}</div>
                <div className="space-y-3">
                  {c.modules.map((m:any, i:number) => (
                    <details key={i} className="rounded-xl bg-white/5 ring-1 ring-white/10 open:bg-white/10">
                      <summary className="cursor-pointer select-none px-4 py-3 font-semibold flex items-center justify-between">
                        <span>{m.name}</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90"/>
                      </summary>
                      <ul className="px-5 pb-4 text-sm text-slate-300 space-y-2">
                        {m.bullets.map((b:string, j:number) => (<li key={j} className="flex gap-2"><Check className="h-4 w-4 mt-0.5 text-cyan-400 shrink-0"/> {b}</li>))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
              <button onClick={()=>onAccess(c.id)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-5 py-3">
                {c.button} {usd(c.deposit)} <ChevronRight className="h-4 w-4"/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Bundle({bundle, onAccess}:{bundle:any; onAccess:(id:string)=>void}){
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 pb-16 md:pb-24">
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 ring-1 ring-white/10">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">{bundle.title}</h3>
          <p className="mt-3 text-slate-300">{bundle.text}</p>
          <div className="mt-6 rounded-xl p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-amber-300 font-semibold">ALL IN • 3 courses</div>
                <div className="text-3xl font-black">Deposit {usd(bundle.deposit)}</div>
                <div className="text-slate-400 text-sm">{bundle.includes}</div>
              </div>
              <button onClick={()=>onAccess("bundle500")} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-3">
                {bundle.button} {usd(bundle.deposit)} <Gift className="h-5 w-5"/>
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
            <div className="aspect-video bg-slate-800 grid place-items-center">
              <div className="text-center p-6">
                <Play className="h-10 w-10 mx-auto mb-3 text-cyan-400" />
                <div className="font-semibold">Student case: +$184 in 5 minutes</div>
                <div className="text-xs text-slate-400">(replace with your video/testimonial)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowTo({howTo}:{howTo:any}){
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
          <h4 className="font-bold text-lg">{howTo.title}</h4>
          <ol className="text-slate-300 text-sm mt-2 list-decimal list-inside space-y-1">
            {howTo.steps.map((s:string,i:number)=> (<li key={i}>{s}</li>))}
          </ol>
          <div className="mt-3 text-xs text-slate-400">{howTo.note}</div>
        </div>
        <div className="lg:col-span-5 space-y-2">
          <a className="block text-center w-full px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold" href={howTo.pocketLink}>Go to Pocket Option</a>
          <a className="block text-center w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold" href={howTo.proofLink}>Send receipt/ID in Telegram</a>
        </div>
      </div>
    </section>
  );
}
function ReviewsLink({reviewsLink}:{reviewsLink:any}){
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight">{reviewsLink.title}</h2>
      <p className="mt-3 text-slate-300">{reviewsLink.subtitle}</p>
      <a href={reviewsLink.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold">
        <LinkIcon className="h-5 w-5"/> {reviewsLink.button}
      </a>
    </section>
  );
}
function FAQ({faq}:{faq:any[]}){
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight">FAQ</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {faq.map((f, i) => (
          <details key={i} className="rounded-2xl bg-white/5 ring-1 ring-white/10 open:bg-white/10">
            <summary className="cursor-pointer select-none px-5 py-4 font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-cyan-400"/>
              {f.q}
            </summary>
            <div className="px-6 pb-5 text-slate-300">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
function CTA({cta, howTo, selected}:{cta:any; howTo:any; selected:string|null}){
  return (
    <section id="cta" className="mx-auto max-w-7xl px-4 pb-24">
      <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="p-8 md:p-12 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">{cta.title}</h3>
            <p className="mt-2 text-slate-300">{cta.text}</p>
            <div className="mt-4 text-sm text-slate-400">{cta.chosenLabel} <span className="font-semibold text-white">{selected ? selected : "— none —"}</span></div>
          </div>
          <div className="space-y-2">
            <a className="block text-center w-full px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold" href={howTo.pocketLink}>
              {cta.btnPocket}
            </a>
            <a className="block text-center w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold" href={howTo.proofLink}>
              {cta.btnProof}
            </a>
            <div className="text-xs text-slate-400">{cta.disclaimer}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Footer({brand, footer}:{brand:any; footer:any}){
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-400 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-slate-200">{brand.title}</div>
          <div className="mt-1">{footer.about}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-200">Contacts</div>
          <div className="mt-1">Telegram: {brand.telegram}</div>
          <div>Email: {brand.email}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-200">Documents</div>
          <ul className="mt-1 space-y-1">
            {footer.docs.map((d:string,i:number)=> (<li key={i}><a href="#" className="hover:text-white">{d}</a></li>))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

// Admin Panel
function AdminPanel({cfg, onSave, onClose}:{cfg:any; onSave:(c:any)=>void; onClose:()=>void}){
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(cfg)));
  const [uploadBusy, setUploadBusy] = useState(false);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "config.json"; a.click(); URL.revokeObjectURL(url);
  };
  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { try { const obj = JSON.parse(String(reader.result)); setDraft(deepMerge(draft, obj)); } catch {} };
    reader.readAsText(file);
  };
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm grid place-items-center">
      <div className="w-[95vw] max-w-4xl max-h-[85vh] overflow-auto rounded-2xl bg-slate-900/95 ring-1 ring-white/10 shadow-2xl p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold"><Settings className="h-5 w-5"/> Admin — edit all blocks</div>
          <div className="flex items-center gap-2">
            <button onClick={()=>{ onSave(draft); onClose(); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"><Save className="h-4 w-4"/> Save</button>
            <button onClick={exportJson} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10"><Download className="h-4 w-4"/> Export</button>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 cursor-pointer">
              <Upload className="h-4 w-4"/> Import
              <input type="file" accept="application/json" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) importJson(f); }} />
            </label>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10">Close</button>
          </div>
        </div>
        <Fieldset title="Brand / Contacts">
          <Input value={draft.brand.title} onChange={v=> setDraft({...draft, brand:{...draft.brand, title:v}})} placeholder="Site title"/>
          <div className="grid md:grid-cols-2 gap-2">
            <Input value={draft.brand.telegram} onChange={v=> setDraft({...draft, brand:{...draft.brand, telegram:v}})} placeholder="@telegram"/>
            <Input value={draft.brand.email} onChange={v=> setDraft({...draft, brand:{...draft.brand, email:v}})} placeholder="email"/>
          </div>
        </Fieldset>
        <Fieldset title="Hero">
          <Input value={draft.hero.badge} onChange={v=> setDraft({...draft, hero:{...draft.hero, badge:v}})} placeholder="Badge"/>
          <Input value={draft.hero.title} onChange={v=> setDraft({...draft, hero:{...draft.hero, title:v}})} placeholder="Title"/>
          <Textarea rows={3} value={draft.hero.subtitle} onChange={v=> setDraft({...draft, hero:{...draft.hero, subtitle:v}})} placeholder="Subtitle"/>
          <div className="grid md:grid-cols-2 gap-2">
            <Input value={draft.hero.ctaPrimary} onChange={v=> setDraft({...draft, hero:{...draft.hero, ctaPrimary:v}})} placeholder="Primary CTA"/>
            <Input value={draft.hero.ctaSecondary} onChange={v=> setDraft({...draft, hero:{...draft.hero, ctaSecondary:v}})} placeholder="Secondary CTA"/>
          </div>
          <div className="mt-2">
            <div className="text-xs text-slate-400 mb-1">Hero image (recommended 16:9). Stored as data URL.</div>
            <input type="file" accept="image/*" className="block w-full text-sm" onChange={async (e)=>{
              const f = e.target.files?.[0]; if(!f) return; setUploadBusy(true);
              const reader = new FileReader(); reader.onload = () => { setDraft({...draft, hero:{...draft.hero, image: String(reader.result)}}); setUploadBusy(false); };
              reader.readAsDataURL(f);
            }} />
            {uploadBusy && <div className="text-xs text-slate-400 mt-1">Uploading…</div>}
            {draft.hero.image && (<div className="mt-2 aspect-video rounded-lg overflow-hidden ring-1 ring-white/10"><img src={draft.hero.image} className="w-full h-full object-cover"/></div>)}
          </div>
        </Fieldset>
        <Fieldset title="Features">
          {draft.features.map((f:any, i:number)=> (
            <div key={i} className="grid md:grid-cols-4 gap-2 items-center">
              <select className="bg-white/5 rounded-lg px-3 py-2" value={f.icon} onChange={e=> updateArrField(draft, setDraft, 'features', i, { icon:e.target.value })}>
                <option value="shield">Shield</option>
                <option value="clock">Clock</option>
                <option value="graduation">Graduation</option>
                <option value="users">Users</option>
              </select>
              <Input className="md:col-span-3" value={f.text} onChange={v=> updateArrField(draft, setDraft, 'features', i, { text:v })} placeholder="Text"/>
            </div>
          ))}
        </Fieldset>
        <Fieldset title="Programs — intro text">
          <Textarea rows={2} value={draft.programsIntro} onChange={v=> setDraft({...draft, programsIntro:v})}/>
        </Fieldset>
        <Fieldset title="Courses">
          {draft.courses.map((c:any, i:number)=> (
            <div key={c.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 space-y-3 mb-4">
              <div className="grid md:grid-cols-6 gap-2">
                <Input className="md:col-span-4" value={c.title} onChange={v=> updateCourseField(draft,setDraft,i,{title:v})}/>
                <Input type="number" value={c.deposit} onChange={v=> updateCourseField(draft,setDraft,i,{deposit:Number(v||0)})}/>
                <Input value={c.color} onChange={v=> updateCourseField(draft,setDraft,i,{color:v})}/>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <Input value={c.audienceTitle} onChange={v=> updateCourseField(draft,setDraft,i,{audienceTitle:v})} placeholder="Audience heading"/>
                <Input value={c.outcomesTitle} onChange={v=> updateCourseField(draft,setDraft,i,{outcomesTitle:v})} placeholder="Outcomes heading"/>
              </div>
              <ArrayEditor label="Audience list" items={c.audience} onChange={(arr)=> updateCourseField(draft,setDraft,i,{audience:arr})} />
              <ArrayEditor label="Outcomes list" items={c.outcomes} onChange={(arr)=> updateCourseField(draft,setDraft,i,{outcomes:arr})} />
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Modules</div>
                {c.modules.map((m:any, k:number)=> (
                  <div key={k} className="rounded-lg bg-white/10 p-3 space-y-2">
                    <Input value={m.name} onChange={v=> updateModuleField(draft,setDraft,i,k,{name:v})}/>
                    <ArrayEditor label="Bullets" items={m.bullets} onChange={(arr)=> updateModuleField(draft,setDraft,i,k,{bullets:arr})} />
                  </div>
                ))}
              </div>
              <Input value={c.button} onChange={v=> updateCourseField(draft,setDraft,i,{button:v})} placeholder="Button text"/>
            </div>
          ))}
        </Fieldset>
        <Fieldset title="Bundle">
          <Input value={draft.bundle.title} onChange={v=> setDraft({...draft, bundle:{...draft.bundle, title:v}})} />
          <Textarea rows={2} value={draft.bundle.text} onChange={v=> setDraft({...draft, bundle:{...draft.bundle, text:v}})} />
          <div className="grid md:grid-cols-3 gap-2">
            <Input type="number" value={draft.bundle.deposit} onChange={v=> setDraft({...draft, bundle:{...draft.bundle, deposit:Number(v||0)}})} />
            <Input className="md:col-span-2" value={draft.bundle.includes} onChange={v=> setDraft({...draft, bundle:{...draft.bundle, includes:v}})} />
          </div>
          <Input value={draft.bundle.button} onChange={v=> setDraft({...draft, bundle:{...draft.bundle, button:v}})} />
        </Fieldset>
        <Fieldset title="How to get access">
          <Input value={draft.howTo.title} onChange={v=> setDraft({...draft, howTo:{...draft.howTo, title:v}})} />
          <ArrayEditor label="Steps" items={draft.howTo.steps} onChange={(arr)=> setDraft({...draft, howTo:{...draft.howTo, steps:arr}})} />
          <Textarea rows={2} value={draft.howTo.note} onChange={v=> setDraft({...draft, howTo:{...draft.howTo, note:v}})} />
          <div className="grid md:grid-cols-2 gap-2">
            <Input value={draft.howTo.pocketLink} onChange={v=> setDraft({...draft, howTo:{...draft.howTo, pocketLink:v}})} placeholder="Pocket Option link"/>
            <Input value={draft.howTo.proofLink} onChange={v=> setDraft({...draft, howTo:{...draft.howTo, proofLink:v}})} placeholder="Telegram proof link"/>
          </div>
        </Fieldset>
        <Fieldset title="Reviews link">
          <Input value={draft.reviewsLink.title} onChange={v=> setDraft({...draft, reviewsLink:{...draft.reviewsLink, title:v}})} />
          <Textarea rows={2} value={draft.reviewsLink.subtitle} onChange={v=> setDraft({...draft, reviewsLink:{...draft.reviewsLink, subtitle:v}})} />
          <div className="grid md:grid-cols-2 gap-2">
            <Input value={draft.reviewsLink.button} onChange={v=> setDraft({...draft, reviewsLink:{...draft.reviewsLink, button:v}})} placeholder="Button"/>
            <Input value={draft.reviewsLink.url} onChange={v=> setDraft({...draft, reviewsLink:{...draft.reviewsLink, url:v}})} placeholder="Telegram link"/>
          </div>
        </Fieldset>
        <Fieldset title="FAQ">
          {draft.faq.map((f:any, i:number)=> (
            <div key={i} className="grid md:grid-cols-2 gap-2">
              <Input value={f.q} onChange={v=> updateFaq(draft,setDraft,i,{q:v})} placeholder="Question"/>
              <Input value={f.a} onChange={v=> updateFaq(draft,setDraft,i,{a:v})} placeholder="Answer"/>
            </div>
          ))}
        </Fieldset>
        <Fieldset title="CTA">
          <Input value={draft.cta.title} onChange={v=> setDraft({...draft, cta:{...draft.cta, title:v}})} />
          <Textarea rows={2} value={draft.cta.text} onChange={v=> setDraft({...draft, cta:{...draft.cta, text:v}})} />
          <div className="grid md:grid-cols-3 gap-2">
            <Input value={draft.cta.chosenLabel} onChange={v=> setDraft({...draft, cta:{...draft.cta, chosenLabel:v}})} placeholder="Selected label"/>
            <Input value={draft.cta.btnPocket} onChange={v=> setDraft({...draft, cta:{...draft.cta, btnPocket:v}})} placeholder="Button 1"/>
            <Input value={draft.cta.btnProof} onChange={v=> setDraft({...draft, cta:{...draft.cta, btnProof:v}})} placeholder="Button 2"/>
          </div>
          <Input value={draft.cta.disclaimer} onChange={v=> setDraft({...draft, cta:{...draft.cta, disclaimer:v}})} placeholder="Disclaimer"/>
        </Fieldset>
      </div>
    </div>
  );
}
function Fieldset({title, children}:{title:string; children:any}){
  return (<fieldset className="space-y-2"><legend className="text-xs uppercase tracking-wide text-slate-400">{title}</legend>{children}</fieldset>);
}
function Input({value, onChange, placeholder, type="text", className=""}:{value:any; onChange:(v:string)=>void; placeholder?:string; type?:string; className?:string}){
  return <input type={type} className={`w-full bg-white/5 rounded-lg px-3 py-2 ${className}`} value={value} onChange={(e)=> onChange(e.target.value)} placeholder={placeholder}/>;
}
function Textarea({value, onChange, rows=3, placeholder}:{value:any; onChange:(v:string)=>void; rows?:number; placeholder?:string}){
  return <textarea rows={rows} className="w-full bg-white/5 rounded-lg px-3 py-2" value={value} onChange={(e)=> onChange(e.target.value)} placeholder={placeholder}/>;
}
function ArrayEditor({label, items, onChange}:{label:string; items:string[]; onChange:(arr:string[])=>void}){
  const [val, setVal] = useState(""); return (<div><div className="text-xs text-slate-400 mb-1">{label}</div>
  <div className="flex gap-2"><input className="flex-1 bg-white/5 rounded-lg px-3 py-2" value={val} onChange={e=> setVal(e.target.value)} placeholder="Add item"/>
  <button onClick={()=>{ if(val.trim()){ onChange([...(items||[]), val.trim()]); setVal(""); }}} className="px-3 py-2 rounded-lg bg-white/10">Add</button></div>
  <ul className="mt-2 space-y-1 text-sm">{(items||[]).map((e,i)=>(<li key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"><span className="text-slate-300">{e}</span><button onClick={()=> onChange(items.filter((_,k)=>k!==i))} className="text-slate-400 hover:text-white">Remove</button></li>))}</ul></div>);
}
function updateArrField(draft:any, setDraft:any, key:string, idx:number, patch:any){ const next = JSON.parse(JSON.stringify(draft)); next[key][idx] = { ...next[key][idx], ...patch }; setDraft(next); }
function updateCourseField(draft:any, setDraft:any, idx:number, patch:any){ const next = JSON.parse(JSON.stringify(draft)); next.courses[idx] = { ...next.courses[idx], ...patch }; setDraft(next); }
function updateModuleField(draft:any, setDraft:any, courseIdx:number, modIdx:number, patch:any){ const next = JSON.parse(JSON.stringify(draft)); next.courses[courseIdx].modules[modIdx] = { ...next.courses[courseIdx].modules[modIdx], ...patch }; setDraft(next); }
function updateFaq(draft:any, setDraft:any, idx:number, patch:any){ const next = JSON.parse(JSON.stringify(draft)); next.faq[idx] = { ...next.faq[idx], ...patch }; setDraft(next); }
function iconByName(name:string){ if(name==='shield') return <Shield className="h-5 w-5"/>; if(name==='clock') return <Clock className="h-5 w-5"/>; if(name==='graduation') return <GraduationCap className="h-5 w-5"/>; if(name==='users') return <Users className="h-5 w-5"/>; return <Shield className="h-5 w-5"/>; }
function deepMerge(a:any,b:any):any{ if(Array.isArray(a)&&Array.isArray(b)) return b; if(typeof a==='object'&&typeof b==='object'&&a&&b){ const out:any={...a}; for(const k of Object.keys(b)) out[k]=deepMerge(a[k],b[k]); return out;} return b??a; }
