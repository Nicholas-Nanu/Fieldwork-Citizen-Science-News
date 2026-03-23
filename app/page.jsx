'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import articlesData from "../data/articles.js";

/* ─── THEME TOKENS ─── */
const THEMES = {
  light: {
    bg: "#F9FAF6", surface: "#FFFFFF", surfaceAlt: "#F0F1EC", border: "#E2E3DD",
    borderHover: "#7FB685", textPrimary: "#222222", textSecondary: "#5A5A52",
    textTertiary: "#8E8E84", textMuted: "#B3B3A8", accent: "#3A7D44",
    accentLight: "#7FB685", accentBg: "#3A7D4410", lavender: "#9B8EC1",
    sunlight: "#F2C57C", danger: "#C04B50", trending: "#D97706",
    shadow: "rgba(0,0,0,0.06)", shadowHover: "rgba(58,127,68,0.1)",
    headerBg: "#FFFFFFEF", sidebarBg: "#FFFFFF",
  },
  dark: {
    bg: "#0C1A12", surface: "#132419", surfaceAlt: "#1A3024", border: "#243D2C",
    borderHover: "#4E9A5A", textPrimary: "#E8EDE9", textSecondary: "#A8B5AB",
    textTertiary: "#728576", textMuted: "#4E6354", accent: "#5CB86B",
    accentLight: "#7FD88E", accentBg: "#5CB86B18", lavender: "#B0A4D4",
    sunlight: "#F2C57C", danger: "#E8756A", trending: "#F5B942",
    shadow: "rgba(0,0,0,0.2)", shadowHover: "rgba(92,184,107,0.15)",
    headerBg: "#0C1A12EE", sidebarBg: "#132419",
  },
};

const CATEGORIES = [
  { id: "ecology", label: "Ecology & Environment", icon: "🌿", color: "#3A7D44" },
  { id: "space", label: "Space & Astronomy", icon: "🔭", color: "#6B5BA7" },
  { id: "marine", label: "Marine & Ocean", icon: "🌊", color: "#2B7A9B" },
  { id: "archaeology", label: "Archaeology & History", icon: "🏛️", color: "#A67C52" },
  { id: "health", label: "Health & Biomedical", icon: "🧬", color: "#C04B50" },
  { id: "biodiversity", label: "Biodiversity & Wildlife", icon: "🦋", color: "#5A8F3C" },
  { id: "climate", label: "Weather & Climate", icon: "🌤️", color: "#3A8FB7" },
  { id: "tech", label: "Tech & AI in Science", icon: "🤖", color: "#7B6DB0" },
];

const EVIDENCE = ["Peer-Reviewed", "Preprint", "Observational", "Anecdotal"];
const SOURCES = ["Academic", "Government", "NGO/Nonprofit", "Independent"];
const REPLICATION = ["Replicated", "Awaiting", "First Observation", "Unverified"];
const FUNDING_T = ["Fully Disclosed", "Partially Known", "Undisclosed"];
const TYPES = [
  { id: "all", label: "All Stories" }, { id: "discovery", label: "Discoveries" },
  { id: "project", label: "Projects" }, { id: "organization", label: "Organizations" },
  { id: "award", label: "Awards" }, { id: "individual", label: "People" },
];

const HERO_GRADIENTS = [
  ["#1B4332", "#2D6A4F", "#40916C"],
  ["#1B3A4B", "#144552", "#3A7CA5"],
  ["#3C1642", "#5C2D82", "#7B2CBF"],
  ["#462521", "#6B3A36", "#A67C52"],
];

/* ─── ARTICLES: loaded from data file (auto-updated by RSS bot) ─── */
const ARTICLES = (Array.isArray(articlesData) && articlesData.length > 0) ? articlesData : [
  { id:1, title:"Welcome to Fieldwork — stories are loading", source:"Fieldwork", category:"ecology", hoursAgo:1, excerpt:"Our RSS bot is fetching citizen science stories from 20+ sources. New stories appear automatically twice a day. Check back soon!", credibility:{evidence:0,source:0,replication:0,funding:0}, type:"project", featured:true, readTime:"1 min" },
];

function relativeTime(hours) {
  if (hours < 1) return "Just now";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  if (hours < 48) return "Yesterday";
  if (hours < 168) return `${Math.round(hours / 24)}d ago`;
  return `${Math.round(hours / 168)}w ago`;
}

/* ─── CREDIBILITY LABEL ─── */
function CredibilityLabel({ credibility, compact, t }) {
  const axes = [
    { label: "Evidence", values: EVIDENCE, val: credibility.evidence, colors: ["#3A7D44","#7FB685","#D4A373","#C04B50"] },
    { label: "Source", values: SOURCES, val: credibility.source, colors: ["#2B5A83","#5A8FB7","#D4A373","#A67C52"] },
    { label: "Replication", values: REPLICATION, val: credibility.replication, colors: ["#3A7D44","#7FB685","#D4A373","#C04B50"] },
    { label: "Funding", values: FUNDING_T, val: credibility.funding, colors: ["#3A7D44","#D4A373","#C04B50"] },
  ];
  if (compact) return (
    <div style={{ display:"flex", gap:3 }} title="Credibility indicators">
      {axes.map((a,i) => <div key={i} title={`${a.label}: ${a.values[a.val]}`} style={{ width:8, height:8, borderRadius:"50%", background:a.colors[a.val], border:`2px solid ${t.surface}`, boxShadow:`0 1px 3px ${t.shadow}` }} />)}
    </div>
  );
  return (
    <div style={{ background:t.surfaceAlt, borderRadius:12, padding:"16px 18px", border:`1px solid ${t.border}` }}>
      <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, marginBottom:12 }}>
        Credibility Label
      </div>
      {axes.map((axis,i) => (
        <div key={i} style={{ marginBottom: i < 3 ? 10 : 0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600, color:t.textSecondary }}>{axis.label}</span>
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, color:axis.colors[axis.val], background:`${axis.colors[axis.val]}15`, padding:"2px 10px", borderRadius:20 }}>{axis.values[axis.val]}</span>
          </div>
          <div style={{ display:"flex", gap:3, height:4 }}>
            {axis.values.map((_,j) => <div key={j} style={{ flex:1, background: j<=axis.val ? axis.colors[axis.val] : `${t.textMuted}25`, borderRadius:2 }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── ICON BUTTONS ─── */
function IconBtn({ icon, label, active, onClick, t, activeColor }) {
  return (
    <button onClick={onClick} title={label} style={{
      background:"none", border:"none", cursor:"pointer", padding:4,
      color: active ? (activeColor || t.accent) : t.textMuted,
      transition:"color 0.2s", display:"flex", alignItems:"center", fontSize:16,
    }}>
      {icon}
    </button>
  );
}

/* ─── SHARE POPOVER ─── */
function ShareButton({ article, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <IconBtn icon="↗" label="Share" onClick={() => setOpen(!open)} t={t} />
      {open && (
        <div style={{
          position:"absolute", bottom:"100%", right:0, marginBottom:6,
          background:t.surface, border:`1px solid ${t.border}`, borderRadius:10,
          padding:8, boxShadow:`0 8px 24px ${t.shadow}`, zIndex:50,
          display:"flex", gap:4, whiteSpace:"nowrap",
        }}>
          {["𝕏","in","✉","🔗"].map((icon,i) => (
            <button key={i} onClick={() => setOpen(false)} style={{
              width:32, height:32, borderRadius:8, border:`1px solid ${t.border}`,
              background:t.surfaceAlt, color:t.textSecondary, cursor:"pointer",
              fontFamily:"'Nunito Sans',sans-serif", fontSize:13, display:"flex",
              alignItems:"center", justifyContent:"center",
            }}>{icon}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── FEATURED CARD ─── */
function FeaturedCard({ article, bookmarks, toggleBookmark, t }) {
  const cat = CATEGORIES.find(c => c.id === article.category);
  const grad = HERO_GRADIENTS[article.heroImg ?? (article.id % HERO_GRADIENTS.length)];
  return (
    <div style={{
      borderRadius:20, overflow:"hidden", cursor:"pointer",
      border:`1px solid ${t.border}`, transition:"all 0.3s",
      background:t.surface, display:"flex", flexDirection:"column",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 16px 48px ${t.shadowHover}`; }}
    onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
    >
      <div style={{
        height:200, position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg, ${grad[0]}, ${grad[1]}, ${grad[2]})`,
      }}>
        <div style={{ position:"absolute", inset:0, background:`repeating-conic-gradient(${grad[1]}08 0% 25%, transparent 0% 50%) 0 0 / 40px 40px` }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4))" }} />
        <span style={{ position:"absolute", bottom:16, right:20, fontSize:72, opacity:0.15, lineHeight:1 }}>{cat.icon}</span>
        <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:6 }}>
          <span style={{ background:"#ffffffEE", color:cat.color, padding:"5px 12px", borderRadius:100, fontSize:12, fontWeight:600, fontFamily:"'Nunito Sans',sans-serif", display:"flex", alignItems:"center", gap:5 }}>
            {cat.icon} {cat.label}
          </span>
        </div>
        <div style={{ position:"absolute", top:14, right:14, display:"flex", gap:6, alignItems:"center" }}>
          <CredibilityLabel credibility={article.credibility} compact t={{...t, surface:"#fff"}} />
        </div>
        <div style={{ position:"absolute", bottom:14, left:14 }}>
          <span style={{ color:"#ffffffCC", fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:500 }}>
            {relativeTime(article.hoursAgo)} · {article.readTime}
          </span>
        </div>
      </div>
      <div style={{ padding:"20px 24px 22px", flex:1, display:"flex", flexDirection:"column" }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:21, fontWeight:600, lineHeight:1.3, color:t.textPrimary, margin:"0 0 10px", letterSpacing:"-0.01em" }}>
          {article.title}
        </h2>
        <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, lineHeight:1.6, color:t.textSecondary, margin:"0 0 16px", flex:1 }}>
          {article.excerpt}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:`1px solid ${t.border}` }}>
          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600, color:t.textTertiary }}>{article.source}</span>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <IconBtn icon={bookmarks.has(article.id) ? "★" : "☆"} label="Bookmark" active={bookmarks.has(article.id)} onClick={e => { e.stopPropagation(); toggleBookmark(article.id); }} t={t} activeColor={t.sunlight} />
            <ShareButton article={article} t={t} />
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600, color:t.accent }}>Read →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ARTICLE CARD (GRID) ─── */
function ArticleCard({ article, bookmarks, toggleBookmark, t }) {
  const cat = CATEGORIES.find(c => c.id === article.category);
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}`, transition:"all 0.25s", overflow:"hidden" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 24px ${t.shadow}`; e.currentTarget.style.borderColor=t.borderHover; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor=t.border; }}
    >
      <div style={{ padding:"18px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ background:`${cat.color}12`, color:cat.color, padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600, fontFamily:"'Nunito Sans',sans-serif", display:"inline-flex", alignItems:"center", gap:4 }}>
              {cat.icon} {cat.label}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            <CredibilityLabel credibility={article.credibility} compact t={t} />
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, color:t.textMuted }}>{relativeTime(article.hoursAgo)}</span>
          </div>
        </div>
        <h3 style={{ fontFamily:"'Lora',serif", fontSize:17, fontWeight:600, lineHeight:1.35, color:t.textPrimary, margin:"0 0 8px" }}>
          {article.title}
        </h3>
        <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, lineHeight:1.6, color:t.textSecondary, margin:"0 0 14px" }}>
          {article.excerpt}
        </p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600, color:t.textTertiary }}>{article.source}</span>
            <span style={{ width:3, height:3, borderRadius:"50%", background:t.border }} />
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:12, color:t.textMuted }}>{article.readTime}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <IconBtn icon={bookmarks.has(article.id) ? "★" : "☆"} label="Bookmark" active={bookmarks.has(article.id)} onClick={e => { e.stopPropagation(); toggleBookmark(article.id); }} t={t} activeColor={t.sunlight} />
            <ShareButton article={article} t={t} />
            <button onClick={() => setExpanded(!expanded)} style={{ background:"none", border:"none", fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:600, color:t.accent, cursor:"pointer", padding:"2px 0" }}>
              {expanded ? "Hide ▴" : "Label ▾"}
            </button>
          </div>
        </div>
        {expanded && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${t.border}`, animation:"fadeIn 0.2s ease" }}>
            <CredibilityLabel credibility={article.credibility} t={t} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ARTICLE ROW (LIST VIEW) ─── */
function ArticleRow({ article, bookmarks, toggleBookmark, t }) {
  const cat = CATEGORIES.find(c => c.id === article.category);
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
      background:t.surface, borderRadius:12, border:`1px solid ${t.border}`,
      transition:"all 0.2s", cursor:"pointer",
    }}
    onMouseEnter={e => { e.currentTarget.style.background=t.surfaceAlt; }}
    onMouseLeave={e => { e.currentTarget.style.background=t.surface; }}
    >
      <div style={{ fontSize:28, width:44, textAlign:"center", flexShrink:0 }}>{cat.icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:600, color:cat.color }}>{cat.label}</span>
          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, color:t.textMuted }}>· {relativeTime(article.hoursAgo)}</span>
        </div>
        <h3 style={{ fontFamily:"'Lora',serif", fontSize:16, fontWeight:600, lineHeight:1.3, color:t.textPrimary, margin:0, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
          {article.title}
        </h3>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, color:t.textTertiary }}>{article.source}</span>
          <span style={{ width:3, height:3, borderRadius:"50%", background:t.border }} />
          <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, color:t.textMuted }}>{article.readTime}</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
        <CredibilityLabel credibility={article.credibility} compact t={t} />
        <IconBtn icon={bookmarks.has(article.id) ? "★" : "☆"} label="Bookmark" active={bookmarks.has(article.id)} onClick={e => { e.stopPropagation(); toggleBookmark(article.id); }} t={t} activeColor={t.sunlight} />
        <ShareButton article={article} t={t} />
      </div>
    </div>
  );
}

/* ─── METHODOLOGY PAGE ─── */
function MethodologyPage({ t, onNavigate }) {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom:32 }}>
      <h3 style={{ fontFamily:"'Lora',serif", fontSize:20, fontWeight:600, color:t.textPrimary, margin:"0 0 12px" }}>{title}</h3>
      {children}
    </div>
  );
  const P = ({ children }) => <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, lineHeight:1.7, color:t.textSecondary, margin:"0 0 12px" }}>{children}</p>;

  const axes = [
    { name:"Evidence Quality", icon:"🔬", spectrum:EVIDENCE, desc:"How rigorously has this been tested? Peer-reviewed research has survived expert scrutiny. Preprints are shared before formal review. Observational data comes from structured citizen science protocols. Anecdotal reports are individual accounts not yet systematically verified.", colors:["#3A7D44","#7FB685","#D4A373","#C04B50"] },
    { name:"Source Type", icon:"🏛️", spectrum:SOURCES, desc:"Who produced or funded the work? Academic institutions have formal research infrastructure. Government agencies operate under public mandates. NGOs and nonprofits often bridge research and community action. Independent and community groups bring grassroots innovation.", colors:["#2B5A83","#5A8FB7","#D4A373","#A67C52"] },
    { name:"Replication Status", icon:"🔄", spectrum:REPLICATION, desc:"Has anyone else confirmed these findings? Replicated results have been independently verified. Awaiting replication means the work is credible but unconfirmed. First observations are novel findings reported for the first time. Unverified claims lack structured evidence.", colors:["#3A7D44","#7FB685","#D4A373","#C04B50"] },
    { name:"Funding Transparency", icon:"💰", spectrum:FUNDING_T, desc:"Do we know who paid for this work? Fully disclosed means all funding sources are public. Partially known means some information is available. Undisclosed means we could not determine the funding source.", colors:["#3A7D44","#D4A373","#C04B50"] },
  ];

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"40px 28px 80px", animation:"fadeIn 0.3s ease" }}>
      <button onClick={() => onNavigate("feed")} style={{ background:"none", border:"none", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.accent, cursor:"pointer", marginBottom:20, fontWeight:600, padding:0 }}>← Back to stories</button>
      <div style={{ marginBottom:36 }}>
        <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.accent, marginBottom:6 }}>Transparency</div>
        <h1 style={{ fontFamily:"'Lora',serif", fontSize:36, fontWeight:600, color:t.textPrimary, margin:"0 0 12px", letterSpacing:"-0.02em" }}>Our Methodology</h1>
        <P>Every story on Fieldwork carries a credibility label — a transparent, multi-axis rating system that tells you exactly what you're reading. Think of it as a nutritional label for science news.</P>
        <P>We don't hide stories based on their rating. Anecdotal observations and peer-reviewed papers both have a place here. But you deserve to know the difference, so we make it visible.</P>
      </div>

      <Section title="Why We Built This">
        <P>Most science news platforms present all stories identically — a peer-reviewed Nature paper looks the same as a blog post about a backyard observation. That's not transparent, and it's not fair to readers or to the researchers and citizen scientists behind the work.</P>
        <P>Inspired by platforms like AllSides (which rates political media bias), we built a system specifically for science news. No one else is doing this, and we think it's overdue.</P>
      </Section>

      <Section title="The Four Axes">
        {axes.map((axis, i) => (
          <div key={i} style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}`, padding:"22px 24px", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:24 }}>{axis.icon}</span>
              <h4 style={{ fontFamily:"'Lora',serif", fontSize:18, fontWeight:600, color:t.textPrimary, margin:0 }}>{axis.name}</h4>
            </div>
            <P>{axis.desc}</P>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {axis.spectrum.map((level, j) => (
                <span key={j} style={{
                  background:`${axis.colors[j]}12`, color:axis.colors[j], border:`1.5px solid ${axis.colors[j]}30`,
                  padding:"6px 14px", borderRadius:100, fontSize:13, fontFamily:"'Nunito Sans',sans-serif", fontWeight:600,
                }}>
                  {level}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="How We Assign Labels">
        <div style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}`, padding:"22px 24px" }}>
          {[
            { step:"1", title:"Story is identified", desc:"Through our RSS feeds, partner organizations, or community submissions." },
            { step:"2", title:"Source verification", desc:"We trace the story to its original source — the paper, dataset, or organization behind it." },
            { step:"3", title:"Axis assessment", desc:"Each of the four axes is rated independently using our published rubric." },
            { step:"4", title:"Label applied", desc:"The credibility label is attached to the story and visible to all readers." },
            { step:"5", title:"Community feedback", desc:"Readers can flag labels they believe are inaccurate. We review and update." },
          ].map((s, i) => (
            <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"12px 0", borderBottom: i < 4 ? `1px solid ${t.border}` : "none" }}>
              <div style={{ width:32, height:32, borderRadius:10, background:t.accentBg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito Sans',sans-serif", fontSize:14, fontWeight:700, color:t.accent, flexShrink:0 }}>{s.step}</div>
              <div>
                <h5 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, fontWeight:700, color:t.textPrimary, margin:"0 0 2px" }}>{s.title}</h5>
                <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textSecondary, margin:0, lineHeight:1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Our Principles">
        {[
          "No story is excluded based on its credibility rating. Context, not censorship.",
          "Labels are applied by our editorial team using a consistent, published rubric.",
          "We are transparent about our process and welcome challenges to any label.",
          "Credibility labels are never influenced by sponsors, advertisers, or partners.",
          "We aim to semi-automate this process with AI assistance, but human review remains the standard.",
        ].map((p, i) => (
          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"6px 0" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:t.accent, marginTop:7, flexShrink:0 }} />
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, color:t.textSecondary, lineHeight:1.6 }}>{p}</span>
          </div>
        ))}
      </Section>

      <div style={{ background:`${t.accent}08`, borderRadius:16, border:`1px solid ${t.accent}20`, padding:"24px 28px", textAlign:"center" }}>
        <h3 style={{ fontFamily:"'Lora',serif", fontSize:18, fontWeight:600, color:t.textPrimary, margin:"0 0 6px" }}>Questions about our methodology?</h3>
        <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, color:t.textSecondary, margin:"0 0 14px" }}>We welcome feedback, challenges, and suggestions. Our goal is to get this right.</p>
        <button style={{ background:`linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, border:"none", borderRadius:10, padding:"10px 24px", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}>Get in Touch</button>
      </div>
    </div>
  );
}

/* ─── ABOUT PAGE ─── */
function AboutPage({ t, onNavigate }) {
  const P = ({ children }) => <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, lineHeight:1.7, color:t.textSecondary, margin:"0 0 12px" }}>{children}</p>;

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"40px 28px 80px", animation:"fadeIn 0.3s ease" }}>
      <button onClick={() => onNavigate("feed")} style={{ background:"none", border:"none", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.accent, cursor:"pointer", marginBottom:20, fontWeight:600, padding:0 }}>← Back to stories</button>

      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ width:64, height:64, borderRadius:16, background:`linear-gradient(140deg, ${t.accent}, ${t.accentLight})`, display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:`0 4px 16px ${t.accent}30` }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 2L12 22"/><path d="M8 6C8 6 12 10 12 14"/><path d="M16 6C16 6 12 10 12 14"/><path d="M6 10C6 10 12 12 12 14"/><path d="M18 10C18 10 12 12 12 14"/></svg>
        </div>
        <h1 style={{ fontFamily:"'Lora',serif", fontSize:36, fontWeight:600, color:t.textPrimary, margin:"0 0 8px", letterSpacing:"-0.02em" }}>About Fieldwork</h1>
        <p style={{ fontFamily:"'Lora',serif", fontSize:18, fontWeight:400, fontStyle:"italic", color:t.textTertiary, margin:0, maxWidth:480, marginLeft:"auto", marginRight:"auto" }}>Science by everyone, for everyone.</p>
      </div>

      <div style={{ marginBottom:36 }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:22, fontWeight:600, color:t.textPrimary, margin:"0 0 12px" }}>The Mission</h2>
        <P>Every day, thousands of citizen scientists around the world are making real discoveries — mapping coral reefs, tracking bird migrations, identifying new species, uncovering lost archaeology. But their work rarely makes the news, and when it does, there's no way to know how reliable the reporting is.</P>
        <P>Fieldwork exists to change that. We aggregate, curate, and transparently label citizen science news from around the world, so everyone — from seasoned researchers to curious newcomers — can find, follow, and trust the science that matters to them.</P>
      </div>

      <div style={{ marginBottom:36 }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:22, fontWeight:600, color:t.textPrimary, margin:"0 0 12px" }}>What Makes Us Different</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {[
            { icon:"🔍", title:"Credibility Labels", desc:"Every story carries a transparent 4-axis label. No other science news platform does this." },
            { icon:"🚫", title:"No Tracking Ads", desc:"We'll never track you or sell your data. Revenue comes from ethical sponsorships and community support." },
            { icon:"🌍", title:"Global & Inclusive", desc:"We cover citizen science across 8 disciplines and every continent. Everyone's contribution matters." },
            { icon:"📖", title:"Always Open", desc:"No paywalls. Core content is free forever. Premium supporters get extras, not exclusives." },
          ].map((item, i) => (
            <div key={i} style={{ background:t.surface, borderRadius:14, border:`1px solid ${t.border}`, padding:"20px" }}>
              <span style={{ fontSize:28, display:"block", marginBottom:8 }}>{item.icon}</span>
              <h4 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:15, fontWeight:700, color:t.textPrimary, margin:"0 0 4px" }}>{item.title}</h4>
              <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textSecondary, margin:0, lineHeight:1.55 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:36 }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:22, fontWeight:600, color:t.textPrimary, margin:"0 0 12px" }}>The Story</h2>
        <P>Fieldwork started as a side project born from a simple frustration: citizen science is one of the most exciting movements in modern science, but it has no dedicated home in the media landscape. Stories about amateur astronomers discovering exoplanets or community divers mapping coral reefs get buried alongside clickbait and press releases.</P>
        <P>We thought: what if there was one place that celebrated all of this, and what if it was radically transparent about the quality and provenance of every story it published?</P>
        <P>That idea became Fieldwork, and the credibility label system became its foundation. We're building this in public, one story at a time.</P>
      </div>

      <div style={{ background:`${t.accent}08`, borderRadius:16, border:`1px solid ${t.accent}20`, padding:"28px", textAlign:"center" }}>
        <h3 style={{ fontFamily:"'Lora',serif", fontSize:20, fontWeight:600, color:t.textPrimary, margin:"0 0 6px" }}>Want to get involved?</h3>
        <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, color:t.textSecondary, margin:"0 0 16px", maxWidth:400, marginLeft:"auto", marginRight:"auto" }}>Whether you're a citizen scientist, a researcher, a science communicator, or just someone who cares — we'd love to hear from you.</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={() => onNavigate("methodology")} style={{ background:t.surface, border:`1.5px solid ${t.border}`, borderRadius:10, padding:"10px 20px", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600, color:t.textPrimary, cursor:"pointer" }}>Read Our Methodology</button>
          <button style={{ background:`linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, border:"none", borderRadius:10, padding:"10px 20px", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}>Contact Us</button>
        </div>
      </div>
    </div>
  );
}

/* ─── STORY VIEW PAGE ─── */
function StoryPage({ article, t, onBack, bookmarks, toggleBookmark }) {
  const cat = CATEGORIES.find(c => c.id === article.category);
  const grad = HERO_GRADIENTS[article.heroImg ?? (article.id % HERO_GRADIENTS.length)];
  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      {/* Hero */}
      <div style={{
        height:280, position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg, ${grad[0]}, ${grad[1]}, ${grad[2]})`,
      }}>
        <div style={{ position:"absolute", inset:0, background:`repeating-conic-gradient(${grad[1]}08 0% 25%, transparent 0% 50%) 0 0 / 50px 50px` }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5))" }} />
        <span style={{ position:"absolute", bottom:20, right:30, fontSize:100, opacity:0.1, lineHeight:1 }}>{cat.icon}</span>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, maxWidth:760, margin:"0 auto", padding:"0 28px 28px" }}>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <span style={{ background:"#ffffffEE", color:cat.color, padding:"5px 12px", borderRadius:100, fontSize:12, fontWeight:600, fontFamily:"'Nunito Sans',sans-serif" }}>{cat.icon} {cat.label}</span>
            <span style={{ background:"#ffffff30", color:"#fff", padding:"5px 10px", borderRadius:100, fontSize:11, fontWeight:600, fontFamily:"'Nunito Sans',sans-serif", textTransform:"capitalize" }}>{article.type}</span>
          </div>
          <h1 style={{ fontFamily:"'Lora',serif", fontSize:30, fontWeight:600, color:"#fff", margin:0, lineHeight:1.25, maxWidth:640, textShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>
            {article.title}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"28px 28px 80px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.accent, cursor:"pointer", marginBottom:20, fontWeight:600, padding:0 }}>← Back to stories</button>

        {/* Meta bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, paddingBottom:18, borderBottom:`1px solid ${t.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600, color:t.textPrimary }}>{article.source}</span>
            <span style={{ width:4, height:4, borderRadius:"50%", background:t.border }} />
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textTertiary }}>{relativeTime(article.hoursAgo)}</span>
            <span style={{ width:4, height:4, borderRadius:"50%", background:t.border }} />
            <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textTertiary }}>{article.readTime} read</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => toggleBookmark(article.id)} style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:8, padding:"6px 14px", fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600, color: bookmarks.has(article.id) ? t.sunlight : t.textTertiary, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              {bookmarks.has(article.id) ? "★ Saved" : "☆ Save"}
            </button>
            <button style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:8, padding:"6px 14px", fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600, color:t.textTertiary, cursor:"pointer" }}>↗ Share</button>
          </div>
        </div>

        {/* Credibility label */}
        <div style={{ marginBottom:28 }}>
          <CredibilityLabel credibility={article.credibility} t={t} />
        </div>

        {/* Article body */}
        <div style={{ marginBottom:36 }}>
          <p style={{ fontFamily:"'Lora',serif", fontSize:18, lineHeight:1.7, color:t.textPrimary, margin:"0 0 16px", fontWeight:500 }}>
            {article.excerpt}
          </p>
          <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:15, lineHeight:1.75, color:t.textSecondary, margin:"0 0 14px" }}>
            This is a preview of how the full story view would work. In production, this page would display the full aggregated article, link to the original source, and provide additional context about the research, the citizen scientists involved, and the methodology used.
          </p>
          <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:15, lineHeight:1.75, color:t.textSecondary, margin:0 }}>
            The credibility label above gives you transparent context about this story's provenance and reliability. You can read more about how we assign these labels on our methodology page.
          </p>
        </div>

        {/* Source link */}
        <div style={{ background:t.surfaceAlt, borderRadius:14, border:`1px solid ${t.border}`, padding:"18px 22px", marginBottom:36, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:t.textMuted, marginBottom:3 }}>Original Source</div>
            <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, fontWeight:600, color:t.textPrimary }}>{article.source}</div>
          </div>
          <button style={{ background:`${t.accent}12`, border:`1.5px solid ${t.accent}30`, borderRadius:10, padding:"8px 18px", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600, color:t.accent, cursor:"pointer" }}>Read original →</button>
        </div>

        {/* Related stories */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, margin:"0 0 14px" }}>More in {cat.label}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {related.map(a => {
                const rc = CATEGORIES.find(c => c.id === a.category);
                return (
                  <div key={a.id} style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px 20px", cursor:"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = t.borderHover}
                    onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                  >
                    <h4 style={{ fontFamily:"'Lora',serif", fontSize:15, fontWeight:600, color:t.textPrimary, margin:"0 0 4px", lineHeight:1.35 }}>{a.title}</h4>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, color:t.textTertiary }}>{a.source}</span>
                      <span style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, color:t.textMuted }}>· {relativeTime(a.hoursAgo)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── NEWSLETTER BANNER ─── */
function NewsletterBanner({ t }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ background:`${t.accent}08`, borderRadius:16, border:`1px solid ${t.accent}20`, padding:"24px 28px", textAlign:"center", marginBottom:28 }}>
        <span style={{ fontSize:28, display:"block", marginBottom:8 }}>🎉</span>
        <h3 style={{ fontFamily:"'Lora',serif", fontSize:18, fontWeight:600, color:t.textPrimary, margin:"0 0 4px" }}>You're on the list!</h3>
        <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textSecondary, margin:0 }}>Watch your inbox for the weekly Fieldwork digest.</p>
      </div>
    );
  }

  return (
    <div style={{ background:`linear-gradient(135deg, ${t.accent}10, ${t.lavender}08)`, borderRadius:16, border:`1px solid ${t.accent}20`, padding:"24px 28px", marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:240 }}>
          <h3 style={{ fontFamily:"'Lora',serif", fontSize:18, fontWeight:600, color:t.textPrimary, margin:"0 0 4px" }}>📬 The Weekly Fieldwork</h3>
          <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textSecondary, margin:0, lineHeight:1.5 }}>The best citizen science stories of the week, delivered every Friday. Free forever.</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            style={{ background:t.surface, border:`1.5px solid ${t.border}`, borderRadius:10, padding:"10px 16px", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textPrimary, width:220, outline:"none" }}
            onFocus={e => e.target.style.borderColor = t.accentLight}
            onBlur={e => e.target.style.borderColor = t.border}
          />
          <button onClick={() => { if(email.includes("@")) setSubmitted(true); }} style={{
            background:`linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
            border:"none", borderRadius:10, padding:"10px 20px",
            fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600,
            color:"#fff", cursor:"pointer", whiteSpace:"nowrap",
          }}>Subscribe</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function FieldworkApp() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [currentPage, setCurrentPage] = useState("feed");
  const [viewingArticle, setViewingArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [bookmarks, setBookmarks] = useState(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const sentinelRef = useRef(null);

  const navigate = (page) => { setCurrentPage(page); setViewingArticle(null); if(typeof window!=="undefined") window.scrollTo(0,0); };
  const openStory = (article) => { setViewingArticle(article); setCurrentPage("story"); if(typeof window!=="undefined") window.scrollTo(0,0); };

  const t = darkMode ? THEMES.dark : THEMES.light;

  const toggleBookmark = useCallback((id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const filtered = ARTICLES.filter(a => {
    if (showBookmarksOnly && !bookmarks.has(a.id)) return false;
    if (activeCategory !== "all" && a.category !== activeCategory) return false;
    if (activeType !== "all" && a.type !== activeType) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featured = filtered.filter(a => a.featured);
  const regular = filtered.filter(a => !a.featured);
  const visible = regular.slice(0, visibleCount);
  const hasMore = visibleCount < regular.length;

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setVisibleCount(c => Math.min(c + 4, regular.length));
      }
    }, { rootMargin: "200px" });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, regular.length]);

  useEffect(() => { setVisibleCount(6); }, [activeCategory, activeType, searchQuery, showBookmarksOnly]);

  return (
    <div style={{ minHeight:"100vh", background:t.bg, transition:"background 0.4s ease, color 0.4s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${t.border}; border-radius:10px; }
        ::selection { background:${t.accent}30; }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position:"sticky", top:0, zIndex:100,
        background:t.headerBg, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
        borderBottom:`1px solid ${t.border}`, transition:"background 0.4s",
      }}>
        <div style={{ maxWidth:1260, margin:"0 auto", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }} onClick={() => navigate("feed")}>
            <div style={{
              width:36, height:36, borderRadius:9,
              background:`linear-gradient(140deg, ${t.accent}, ${t.accentLight})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 2px 8px ${t.accent}30`,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2L12 22"/><path d="M8 6C8 6 12 10 12 14"/><path d="M16 6C16 6 12 10 12 14"/><path d="M6 10C6 10 12 12 12 14"/><path d="M18 10C18 10 12 12 12 14"/></svg>
            </div>
            <div>
              <h1 style={{ fontFamily:"'Lora',serif", fontSize:20, fontWeight:600, margin:0, color:t.textPrimary, letterSpacing:"-0.02em", lineHeight:1 }}>Fieldwork</h1>
              <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.accent, margin:0, marginTop:1 }}>Citizen Science News</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ position:"relative" }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search stories..."
                style={{ background:t.surfaceAlt, border:`1.5px solid ${t.border}`, borderRadius:10, padding:"8px 14px 8px 34px", color:t.textPrimary, fontFamily:"'Nunito Sans',sans-serif", fontSize:13, width:200, outline:"none", transition:"border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor=t.accentLight}
                onBlur={e => e.target.style.borderColor=t.border}
              />
              <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:t.textMuted }}>🔍</span>
            </div>
            {/* Bookmarks toggle */}
            <button onClick={() => setShowBookmarksOnly(!showBookmarksOnly)} style={{
              background: showBookmarksOnly ? `${t.sunlight}20` : t.surfaceAlt,
              border:`1.5px solid ${showBookmarksOnly ? t.sunlight : t.border}`,
              borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5,
              fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:600,
              color: showBookmarksOnly ? t.sunlight : t.textTertiary, transition:"all 0.2s",
            }}>
              ★ {bookmarks.size > 0 && <span>{bookmarks.size}</span>}
            </button>
            {/* Dark mode toggle */}
            <button onClick={() => setDarkMode(!darkMode)} style={{
              background:t.surfaceAlt, border:`1.5px solid ${t.border}`,
              borderRadius:10, width:38, height:38, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, transition:"all 0.2s", color:t.textSecondary,
            }} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => navigate("methodology")} style={{
              background:t.surfaceAlt, border:`1.5px solid ${t.border}`, borderRadius:10,
              padding:"8px 14px", fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:500,
              color:t.textSecondary, cursor:"pointer", transition:"all 0.2s",
            }}>Methodology</button>
            <button onClick={() => navigate("about")} style={{
              background:t.surfaceAlt, border:`1.5px solid ${t.border}`, borderRadius:10,
              padding:"8px 14px", fontFamily:"'Nunito Sans',sans-serif", fontSize:12, fontWeight:500,
              color:t.textSecondary, cursor:"pointer", transition:"all 0.2s",
            }}>About</button>
          </div>
        </div>
      </header>

      {/* ── PAGE ROUTING ── */}
      {currentPage === "methodology" && <MethodologyPage t={t} onNavigate={navigate} />}
      {currentPage === "about" && <AboutPage t={t} onNavigate={navigate} />}
      {currentPage === "story" && viewingArticle && <StoryPage article={viewingArticle} t={t} onBack={() => navigate("feed")} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}

      {currentPage === "feed" && (
      <>
      {/* ── BODY ── */}
      <div style={{ maxWidth:1260, margin:"0 auto", padding:"24px 28px 80px", display:"flex", gap:28 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width:240, flexShrink:0, position:"sticky", top:88, alignSelf:"flex-start",
          maxHeight:"calc(100vh - 100px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:24,
        }}>
          {/* Categories */}
          <div style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}`, padding:"18px 16px" }}>
            <h3 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, margin:"0 0 12px 2px" }}>Categories</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              <button onClick={() => setActiveCategory("all")} style={{
                display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:10,
                border:"none", cursor:"pointer", width:"100%", textAlign:"left", transition:"all 0.15s",
                background: activeCategory==="all" ? t.accentBg : "transparent",
                color: activeCategory==="all" ? t.accent : t.textSecondary,
                fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight: activeCategory==="all" ? 700 : 500,
              }}>
                <span style={{ width:22, textAlign:"center" }}>📊</span> All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(activeCategory===cat.id ? "all" : cat.id)} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:10,
                  border:"none", cursor:"pointer", width:"100%", textAlign:"left", transition:"all 0.15s",
                  background: activeCategory===cat.id ? `${cat.color}12` : "transparent",
                  color: activeCategory===cat.id ? cat.color : t.textSecondary,
                  fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight: activeCategory===cat.id ? 700 : 500,
                }}>
                  <span style={{ width:22, textAlign:"center" }}>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
          {/* Content Types */}
          <div style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}`, padding:"18px 16px" }}>
            <h3 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, margin:"0 0 12px 2px" }}>Content Type</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {TYPES.map(tp => (
                <button key={tp.id} onClick={() => setActiveType(tp.id)} style={{
                  padding:"8px 10px", borderRadius:10, border:"none", cursor:"pointer", width:"100%", textAlign:"left",
                  background: activeType===tp.id ? t.accentBg : "transparent",
                  color: activeType===tp.id ? t.accent : t.textSecondary,
                  fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight: activeType===tp.id ? 700 : 500,
                  transition:"all 0.15s",
                }}>
                  {tp.label}
                </button>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}`, padding:"18px 16px" }}>
            <h3 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, margin:"0 0 12px 2px" }}>Community</h3>
            {[
              { label:"Stories Today", value:"24", icon:"📰" },
              { label:"Active Projects", value:"1,247", icon:"🔬" },
              { label:"Contributors", value:"89.4K", icon:"👥" },
              { label:"Countries", value:"142", icon:"🌍" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 2px" }}>
                <span style={{ fontSize:16, width:24, textAlign:"center" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily:"'Lora',serif", fontSize:16, fontWeight:600, color:t.textPrimary, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:10, color:t.textMuted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, minWidth:0 }}>
          {/* Toolbar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h2 style={{ fontFamily:"'Lora',serif", fontSize:28, fontWeight:400, fontStyle:"italic", color:t.textPrimary, margin:0, lineHeight:1.2 }}>
                {showBookmarksOnly ? "Your Reading List" : "Science by everyone, for everyone."}
              </h2>
              <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:13, color:t.textTertiary, margin:"4px 0 0" }}>
                {filtered.length} stories {activeCategory !== "all" && `in ${CATEGORIES.find(c=>c.id===activeCategory)?.label}`}
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, background:t.surfaceAlt, borderRadius:10, padding:3, border:`1px solid ${t.border}` }}>
              {[{id:"grid",icon:"▦"},{id:"list",icon:"☰"}].map(v => (
                <button key={v.id} onClick={() => setViewMode(v.id)} style={{
                  width:34, height:32, borderRadius:8, border:"none", cursor:"pointer",
                  background: viewMode===v.id ? t.surface : "transparent",
                  color: viewMode===v.id ? t.textPrimary : t.textMuted,
                  fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow: viewMode===v.id ? `0 1px 3px ${t.shadow}` : "none",
                  transition:"all 0.2s",
                }} title={`${v.id} view`}>{v.icon}</button>
              ))}
            </div>
          </div>

          {/* Newsletter banner */}
          <NewsletterBanner t={t} />

          {/* Featured */}
          {featured.length > 0 && !showBookmarksOnly && (
            <div style={{ marginBottom:28 }}>
              <h3 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, margin:"0 0 14px 2px" }}>Featured</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))", gap:18 }}>
                {featured.map(a => <div key={a.id} onClick={() => openStory(a)}><FeaturedCard article={a} bookmarks={bookmarks} toggleBookmark={toggleBookmark} t={t} /></div>)}
              </div>
            </div>
          )}

          {/* Feed */}
          <div>
            <h3 style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:t.textMuted, margin:"0 0 14px 2px" }}>
              {showBookmarksOnly ? "Saved Stories" : "Latest"}
            </h3>
            {viewMode === "grid" ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:14 }}>
                {visible.map(a => <div key={a.id} onClick={() => openStory(a)}><ArticleCard article={a} bookmarks={bookmarks} toggleBookmark={toggleBookmark} t={t} /></div>)}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {visible.map(a => <div key={a.id} onClick={() => openStory(a)}><ArticleRow article={a} bookmarks={bookmarks} toggleBookmark={toggleBookmark} t={t} /></div>)}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} style={{ display:"flex", justifyContent:"center", padding:"32px 0" }}>
                <div style={{ width:24, height:24, border:`3px solid ${t.border}`, borderTopColor:t.accent, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
              </div>
            )}

            {filtered.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 20px", background:t.surface, borderRadius:16, border:`1px solid ${t.border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>{showBookmarksOnly ? "★" : "🌱"}</div>
                <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:14, color:t.textTertiary, margin:"0 0 12px" }}>
                  {showBookmarksOnly ? "No saved stories yet — bookmark stories to build your reading list" : "No stories match your current filters"}
                </p>
                <button onClick={() => { setActiveCategory("all"); setActiveType("all"); setSearchQuery(""); setShowBookmarksOnly(false); }}
                  style={{ background:t.surfaceAlt, border:`1px solid ${t.border}`, borderRadius:8, padding:"8px 20px", fontFamily:"'Nunito Sans',sans-serif", fontSize:13, fontWeight:600, color:t.textPrimary, cursor:"pointer" }}>
                  {showBookmarksOnly ? "Show all stories" : "Clear all filters"}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer style={{ marginTop:48, paddingTop:28, borderTop:`1px solid ${t.border}`, textAlign:"center" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:26, height:26, borderRadius:7, background:`linear-gradient(135deg, ${t.accent}, ${t.accentLight})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2L12 22"/><path d="M8 6C8 6 12 10 12 14"/><path d="M16 6C16 6 12 10 12 14"/></svg>
              </div>
              <span style={{ fontFamily:"'Lora',serif", fontSize:16, fontWeight:600, color:t.textPrimary }}>Fieldwork</span>
            </div>
            <p style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:12, color:t.textTertiary, lineHeight:1.7, maxWidth:380, margin:"0 auto 14px" }}>
              Every story is transparently labelled. No paywalls. No hidden agendas. Science belongs to everyone.
            </p>
            <div style={{ display:"flex", gap:18, justifyContent:"center" }}>
              {[{label:"About",page:"about"},{label:"Methodology",page:"methodology"},{label:"API",page:null},{label:"Contact",page:null}].map(link => (
                <a key={link.label} href="#" onClick={e => { e.preventDefault(); if(link.page) navigate(link.page); }} style={{ fontFamily:"'Nunito Sans',sans-serif", fontSize:11, fontWeight:600, color:t.textMuted, textDecoration:"none" }}
                  onMouseEnter={e => e.target.style.color=t.accent}
                  onMouseLeave={e => e.target.style.color=t.textMuted}
                >{link.label}</a>
              ))}
            </div>
          </footer>
        </main>
      </div>
      </>
      )}
    </div>
  );
}
