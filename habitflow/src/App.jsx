import { useState, useEffect, useRef } from 'react';

// ── Keyframe CSS ──────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes card-complete {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.015); }
    100% { transform: scale(1); }
  }
  @keyframes checkmark-pop {
    0%   { transform: scale(0) rotate(-20deg); }
    60%  { transform: scale(1.25) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = (dark) => dark ? {
  bg: '#0f1117',
  surface: '#1a1d27',
  surfaceAlt: '#13161f',
  surfaceHover: '#22253a',
  border: '#2a2d3e',
  borderStrong: '#3a3d52',
  text: '#e2e8f0',
  textSub: '#94a3b8',
  textMuted: '#64748b',
  pill: '#22253a',
  pillText: '#94a3b8',
  inputBg: '#13161f',
  shadow: '0 1px 3px rgba(0,0,0,0.4)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.5)',
  shadowLg: '0 8px 32px rgba(0,0,0,0.6)',
  navBg: '#13161f',
  progressBg: '#22253a',
  statCard: '#1a1d27',
  modalOverlay: 'rgba(0,0,0,0.7)',
  tutDot: '#3a3d52',
  tutBg: '#1a1d27',
  tutText: '#e2e8f0',
  tutSub: '#94a3b8',
  suggestBg: '#13161f',
} : {
  bg: '#f1f5f9',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  surfaceHover: '#f1f5f9',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  text: '#1e293b',
  textSub: '#64748b',
  textMuted: '#94a3b8',
  pill: '#f1f5f9',
  pillText: '#64748b',
  inputBg: '#f8fafc',
  shadow: '0 1px 3px rgba(0,0,0,0.08)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.1)',
  shadowLg: '0 8px 32px rgba(0,0,0,0.12)',
  navBg: '#ffffff',
  progressBg: '#f1f5f9',
  statCard: '#ffffff',
  modalOverlay: 'rgba(0,0,0,0.4)',
  tutDot: '#cbd5e1',
  tutBg: '#ffffff',
  tutText: '#1e293b',
  tutSub: '#64748b',
  suggestBg: '#f8fafc',
};

// ── Constants ─────────────────────────────────────────────────────────────────
const COLORS = [
  { hex: '#6366f1', name: 'Indigo' },  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#a855f7', name: 'Purple' },  { hex: '#ec4899', name: 'Pink' },
  { hex: '#f43f5e', name: 'Rose' },    { hex: '#ef4444', name: 'Red' },
  { hex: '#f97316', name: 'Orange' },  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#eab308', name: 'Yellow' },  { hex: '#84cc16', name: 'Lime' },
  { hex: '#10b981', name: 'Emerald' }, { hex: '#14b8a6', name: 'Teal' },
  { hex: '#06b6d4', name: 'Cyan' },    { hex: '#3b82f6', name: 'Blue' },
  { hex: '#0ea5e9', name: 'Sky' },     { hex: '#64748b', name: 'Slate' },
];

const CATEGORIES = ['All', 'Physical', 'Mind', 'Work', 'Journaling', 'Nutrition', 'Relationships', 'Other'];
const CAT_ICONS  = { Physical: '💪', Mind: '🧠', Work: '🚀', Journaling: '📓', Nutrition: '🥗', Relationships: '❤️', Other: '⭐', All: '' };

const QUOTES = [
  { text: 'We are what we repeatedly do. Excellence is not an act, but a habit.', author: 'Aristotle' },
  { text: 'Motivation gets you started. Habit keeps you going.', author: 'Jim Ryun' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Unknown' },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: 'James Clear' },
  { text: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock' },
  { text: 'An investment in yourself pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
];

const SUGGESTIONS = [
  { category: 'Physical',       name: 'Morning workout',           freq: 'daily',  color: '#ef4444' },
  { category: 'Physical',       name: '10,000 steps',              freq: 'daily',  color: '#f97316' },
  { category: 'Physical',       name: 'Stretch / mobility',        freq: 'daily',  color: '#f59e0b' },
  { category: 'Physical',       name: 'Strength training',         freq: 'weekly', color: '#ef4444' },
  { category: 'Physical',       name: 'No alcohol',                freq: 'daily',  color: '#f43f5e' },
  { category: 'Mind',           name: 'Meditate',                  freq: 'daily',  color: '#6366f1' },
  { category: 'Mind',           name: 'Deep work block',           freq: 'daily',  color: '#8b5cf6' },
  { category: 'Mind',           name: 'No phone first hour',       freq: 'daily',  color: '#a855f7' },
  { category: 'Mind',           name: 'Brain dump / clear head',   freq: 'daily',  color: '#8b5cf6' },
  { category: 'Work',           name: 'Review weekly goals',       freq: 'weekly', color: '#3b82f6' },
  { category: 'Work',           name: 'Learn something new',       freq: 'daily',  color: '#0ea5e9' },
  { category: 'Work',           name: 'Read industry news',        freq: 'daily',  color: '#14b8a6' },
  { category: 'Work',           name: 'Networking outreach',       freq: 'weekly', color: '#06b6d4' },
  { category: 'Journaling',     name: 'Morning pages',             freq: 'daily',  color: '#ec4899' },
  { category: 'Journaling',     name: 'Gratitude - 3 things',      freq: 'daily',  color: '#f43f5e' },
  { category: 'Journaling',     name: 'Evening reflection',        freq: 'daily',  color: '#8b5cf6' },
  { category: 'Journaling',     name: 'Weekly review',             freq: 'weekly', color: '#ec4899' },
  { category: 'Nutrition',      name: 'Drink 8 glasses of water',  freq: 'daily',  color: '#06b6d4' },
  { category: 'Nutrition',      name: 'No sugar',                  freq: 'daily',  color: '#10b981' },
  { category: 'Nutrition',      name: 'Cook at home',              freq: 'daily',  color: '#84cc16' },
  { category: 'Nutrition',      name: 'In bed by 11pm',            freq: 'daily',  color: '#6366f1' },
  { category: 'Relationships',  name: 'Check in with a friend',    freq: 'daily',  color: '#f59e0b' },
  { category: 'Relationships',  name: 'Quality time - no screens', freq: 'daily',  color: '#ec4899' },
  { category: 'Relationships',  name: 'Acts of kindness',          freq: 'daily',  color: '#f97316' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const today   = () => new Date().toISOString().split('T')[0];
const fmt     = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const last7   = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toISOString().split('T')[0];
});
// Returns the Mon–Sun of the current calendar week
const currentWeek = () => {
  const d   = new Date();
  const day = d.getDay(); // 0=Sun … 6=Sat
  const mon = new Date(d);
  mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(mon);
    nd.setDate(mon.getDate() + i);
    return nd.toISOString().split('T')[0];
  });
};
const uid     = () => Math.random().toString(36).slice(2, 10);

function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : init;
    } catch { return init; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

// ── Confetti ──────────────────────────────────────────────────────────────────
let cfCounter = 0;
function Confetti({ x, y, id, onDone }) {
  const baseId = useRef(`cf_${cfCounter++}_${id}`).current;

  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => {
      const angle = (i / 22) * 360 + Math.random() * 16 - 8;
      const dist  = 50 + Math.random() * 50;
      const size  = 6 + Math.random() * 5;
      const isCircle = Math.random() > 0.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
      const pid   = `${baseId}_p${i}`;
      const dx    = Math.cos((angle * Math.PI) / 180) * dist;
      const dy    = Math.sin((angle * Math.PI) / 180) * dist;
      return { pid, dx, dy, size, isCircle, color };
    })
  ).current;

  useEffect(() => {
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [onDone]);

  const keyframes = particles.map(p =>
    `@keyframes ${p.pid} {
      0%   { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(${p.dx}px,${p.dy}px) scale(0); opacity: 0; }
    }`
  ).join('\n');

  return (
    <>
      <style>{keyframes}</style>
      <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
        {particles.map(p => (
          <div
            key={p.pid}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.isCircle ? '50%' : '2px',
              animation: `${p.pid} 0.7s ease-out forwards`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ── Tutorial ──────────────────────────────────────────────────────────────────
const TUTORIAL_STEPS = [
  { title: 'Welcome to HabitFlow ✦', body: 'Your personal space to build powerful daily habits. Simple, beautiful, and designed to keep you consistent.' },
  { title: 'Check off habits daily', body: 'Tap the checkbox on any habit card to mark it done. Complete all of them for a satisfying confetti burst! 🎉' },
  { title: 'Track your progress', body: 'Switch to the Progress tab to see your 7-day history for each habit, your streaks, and weekly completion rates.' },
  { title: 'Filter by category', body: 'Use the category pills below the stats to focus on specific areas like Physical, Mind, Work, and more.' },
  { title: 'Browse suggestions', body: 'Not sure where to start? Click "Suggested Habits" to explore curated habits by category and add them in one click.' },
];

function Tutorial({ onDone, dark }) {
  const [step, setStep] = useState(0);
  const t = T(dark);
  const isLast = step === TUTORIAL_STEPS.length - 1;
  const s = TUTORIAL_STEPS[step];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: t.modalOverlay,
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: t.tutBg, borderRadius: 18, padding: 32,
        width: 380, maxWidth: 'calc(100vw - 48px)',
        boxShadow: t.shadowLg,
        animation: 'fade-in 0.4s ease',
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} style={{
              height: 8, width: i === step ? 24 : 8,
              borderRadius: 99,
              background: i === step ? '#6366f1' : t.tutDot,
              transition: 'width 0.2s, background 0.2s',
            }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.tutText, marginBottom: 10 }}>{s.title}</div>
          <div style={{ fontSize: 14, color: t.tutSub, lineHeight: 1.6 }}>{s.body}</div>
        </div>

        <button
          onClick={() => isLast ? onDone() : setStep(step + 1)}
          style={{
            width: '100%', background: '#6366f1', color: '#fff',
            border: 'none', borderRadius: 9, padding: '12px 0',
            fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {isLast ? 'Get started' : 'Next →'}
        </button>

        {!isLast && (
          <button
            onClick={onDone}
            style={{
              display: 'block', width: '100%', background: 'none', border: 'none',
              color: t.tutSub, fontSize: 13, cursor: 'pointer', marginTop: 12, fontFamily: 'inherit',
            }}
          >
            Skip tutorial
          </button>
        )}
      </div>
    </div>
  );
}

// ── SuggestedHabits ───────────────────────────────────────────────────────────
function SuggestedHabits({ habits, onAdd, dark }) {
  const [open, setOpen] = useState(false);
  const [openCats, setOpenCats] = useState({});
  const t = T(dark);

  const cats = CATEGORIES.filter(c => c !== 'All');
  const isAdded = (name) => habits.some(h => h.name === name);
  const toggleCat = (cat) => setOpenCats(prev => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div style={{ marginTop: 12, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: open ? 'none' : (dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.07)'),
          border: `1.5px solid ${open ? t.border : '#6366f1'}`,
          borderRadius: 10, padding: '11px 18px',
          color: open ? t.textSub : '#6366f1', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.07em', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: open ? 'none' : '0 0 0 3px rgba(99,102,241,0.15)',
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: 14 }}>✦</span>
        {open ? '▲' : '▼'} SUGGESTED HABITS
        {!open && <span style={{ background: '#6366f1', color: '#fff', borderRadius: 99, padding: '1px 8px', fontSize: 10, fontWeight: 800, marginLeft: 4 }}>EXPLORE</span>}
      </button>

      {open && (
        <div style={{
          background: t.suggestBg, border: `1px solid ${t.border}`,
          borderRadius: 9, marginTop: 8, overflow: 'hidden',
          animation: 'fade-in 0.3s ease',
        }}>
          {cats.map((cat, ci) => {
            const catSugs = SUGGESTIONS.filter(s => s.category === cat);
            const isOpen = openCats[cat];
            return (
              <div key={cat} style={{ borderBottom: ci < cats.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                <button
                  onClick={() => toggleCat(cat)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8,
                    cursor: 'pointer', color: t.text, fontSize: 13, fontWeight: 600,
                    fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <span>{CAT_ICONS[cat]}</span>
                  <span style={{ flex: 1 }}>{cat}</span>
                  <span style={{ color: t.textMuted, fontSize: 11 }}>{catSugs.length} habits</span>
                  <span style={{ color: t.textMuted, fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 16px 12px' }}>
                    {catSugs.map((s, si) => (
                      <div
                        key={s.name}
                        style={{
                          display: 'flex', alignItems: 'center', padding: '8px 0',
                          borderTop: si === 0 ? `1px solid ${t.border}` : `1px solid ${t.border}`,
                        }}
                      >
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: s.color, marginRight: 10, flexShrink: 0,
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'capitalize' }}>{s.freq}</div>
                        </div>
                        <button
                          onClick={() => !isAdded(s.name) && onAdd(s)}
                          style={{
                            background: isAdded(s.name) ? 'none' : s.color + '22',
                            color: isAdded(s.name) ? '#10b981' : s.color,
                            border: `1px solid ${isAdded(s.name) ? '#10b981' : s.color}`,
                            borderRadius: 99, padding: '4px 12px',
                            fontSize: 12, fontWeight: 600,
                            cursor: isAdded(s.name) ? 'default' : 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          {isAdded(s.name) ? '✓ Added' : '+ Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FriendsView ───────────────────────────────────────────────────────────────
function FriendsView({ myStats, userName, setUserName, friends, onAddFriend, onRemoveFriend, dark }) {
  const [code, setCode]         = useState('');
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const t    = T(dark);
  const font = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

  const allEntries = [{ ...myStats, isMe: true }, ...friends]
    .sort((a, b) => b.score - a.score);

  const handleAdd = () => {
    try {
      const parsed = JSON.parse(atob(code.trim()));
      if (!parsed.n || parsed.wa === undefined || parsed.bs === undefined) throw new Error();
      onAddFriend({
        id: uid(),
        name: parsed.n,
        weeklyAvg: parsed.wa,
        bestStreak: parsed.bs,
        totalHabits: parsed.th,
        score: parsed.sc,
        addedAt: new Date().toISOString(),
      });
      setCode(''); setError('');
    } catch { setError('Invalid code — ask your friend to copy it again.'); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(myStats.shareCode).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveName = () => {
    setUserName(nameInput.trim() || 'Anonymous');
    setEditName(false);
  };

  const MEDAL = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ animation: 'fade-in 0.3s ease' }}>

      {/* Your name */}
      <div style={{
        background: t.surface, borderRadius: 14, padding: '16px 18px',
        border: `1px solid ${t.border}`, boxShadow: t.shadow, marginBottom: 14,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 8 }}>YOUR DISPLAY NAME</div>
        {editName ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              placeholder="Enter your name..."
              style={{
                flex: 1, background: t.inputBg, border: `1px solid ${t.border}`,
                borderRadius: 9, padding: '9px 12px', fontSize: 13,
                color: t.text, fontFamily: font, outline: 'none',
              }}
            />
            <button onClick={saveName} style={{
              background: '#6366f1', color: '#fff', border: 'none',
              borderRadius: 9, padding: '9px 16px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: font,
            }}>Save</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{userName || 'Anonymous'}</span>
            <button onClick={() => { setNameInput(userName); setEditName(true); }} style={{
              background: 'none', border: `1px solid ${t.border}`, borderRadius: 7,
              padding: '4px 10px', fontSize: 12, color: t.textSub, cursor: 'pointer', fontFamily: font,
            }}>Edit</button>
          </div>
        )}
      </div>

      {/* Share code */}
      <div style={{
        background: t.surface, borderRadius: 14, padding: '16px 18px',
        border: `1px solid ${t.border}`, boxShadow: t.shadow, marginBottom: 14,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 6 }}>YOUR SHARE CODE</div>
        <div style={{ fontSize: 13, color: t.textSub, marginBottom: 10 }}>Send this to friends so they can add you to their leaderboard.</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, background: t.inputBg, border: `1px solid ${t.border}`,
            borderRadius: 9, padding: '9px 12px', fontSize: 11,
            color: t.textMuted, fontFamily: 'monospace',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{myStats.shareCode}</div>
          <button onClick={copyCode} style={{
            background: copied ? '#10b981' : '#6366f1', color: '#fff',
            border: 'none', borderRadius: 9, padding: '9px 16px',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: font,
            flexShrink: 0, transition: 'background 0.2s',
          }}>{copied ? '✓ Copied!' : 'Copy'}</button>
        </div>
      </div>

      {/* Add friend */}
      <div style={{
        background: t.surface, borderRadius: 14, padding: '16px 18px',
        border: `1px solid ${t.border}`, boxShadow: t.shadow, marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 8 }}>ADD A FRIEND</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            placeholder="Paste friend's share code..."
            style={{
              flex: 1, background: t.inputBg,
              border: `1px solid ${error ? '#ef4444' : t.border}`,
              borderRadius: 9, padding: '9px 12px', fontSize: 13,
              color: t.text, fontFamily: font, outline: 'none',
            }}
          />
          <button onClick={handleAdd} disabled={!code.trim()} style={{
            background: code.trim() ? '#6366f1' : t.pill,
            color: code.trim() ? '#fff' : t.textMuted,
            border: 'none', borderRadius: 9, padding: '9px 16px',
            fontSize: 13, fontWeight: 600,
            cursor: code.trim() ? 'pointer' : 'default',
            fontFamily: font, flexShrink: 0, transition: 'all 0.2s',
          }}>Add</button>
        </div>
        {error && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{error}</div>}
      </div>

      {/* Leaderboard */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 10 }}>
        LEADERBOARD · {allEntries.length} {allEntries.length === 1 ? 'PERSON' : 'PEOPLE'}
      </div>

      {allEntries.map((entry, i) => (
        <div key={entry.isMe ? 'me' : entry.id} style={{
          background: entry.isMe ? (dark ? '#1e2235' : '#eef2ff') : t.surface,
          border: `1px solid ${entry.isMe ? '#6366f1' : t.border}`,
          borderRadius: 14, padding: '14px 16px', marginBottom: 10,
          boxShadow: t.shadow, display: 'flex', alignItems: 'center', gap: 14,
          animation: 'fade-in 0.3s ease',
        }}>
          <div style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0, fontWeight: 700, color: t.textSub }}>
            {i < 3 ? MEDAL[i] : `#${i + 1}`}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{entry.name}</span>
              {entry.isMe && (
                <span style={{ fontSize: 10, fontWeight: 700, background: '#6366f1', color: '#fff', borderRadius: 99, padding: '1px 7px' }}>YOU</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}>🔥 {entry.bestStreak}d streak</span>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>📊 {entry.weeklyAvg}% weekly</span>
              <span style={{ fontSize: 12, color: t.textMuted }}>✦ {entry.totalHabits} habits</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#6366f1', letterSpacing: '-0.03em', lineHeight: 1 }}>{entry.score}</div>
            <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 600, marginTop: 2 }}>SCORE</div>
          </div>
          {!entry.isMe && (
            <button
              onClick={() => onRemoveFriend(entry.id)}
              style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: 13, padding: '0 3px', fontFamily: font }}
            >✕</button>
          )}
        </div>
      ))}

      {allEntries.length === 1 && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: t.textSub, fontSize: 13 }}>
          No friends added yet. Share your code and paste theirs to compete!
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [habits,      setHabits]      = useStorage('ht_h4', []);
  const [logs,        setLogs]        = useStorage('ht_l4', {});
  const [tutorialDone,setTutorialDone]= useStorage('ht_t4', false);
  const [dark,        setDark]        = useStorage('ht_d4', true);

  const [view,        setView]        = useState('today');
  const [showAdd,     setShowAdd]     = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [newHabit,    setNewHabit]    = useState({ name: '', freq: 'daily', color: '#6366f1', category: 'Physical' });
  const [confettis,   setConfettis]   = useState([]);
  const [completing,  setCompleting]  = useState({});
  const [filterCat,   setFilterCat]   = useState('All');
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [userName,    setUserName]    = useStorage('ht_name4', '');
  const [friends,     setFriends]     = useStorage('ht_friends4', []);

  const t            = T(dark);
  const todayStr     = today();
  const quote        = QUOTES[new Date().getDay() % QUOTES.length];
  const days         = last7();       // last 7 days — used for rate() and Progress view
  const weekViewDays = currentWeek(); // Mon–Sun of this week — used for the bar chart

  // ── Computed ─────────────────────────────────────────────────────────────
  const streak = (hid) => {
    let count = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (logs[`${hid}_${dateStr}`]) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return count;
  };

  const rate = (hid) => {
    const done = days.filter(d => logs[`${hid}_${d}`]).length;
    return Math.round((done / 7) * 100);
  };

  const doneToday      = (hid) => !!logs[`${hid}_${todayStr}`];
  const filteredHabits = filterCat === 'All' ? habits : habits.filter(h => h.category === filterCat);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalToday = habits.length;
  const doneCount  = habits.filter(h => doneToday(h.id)).length;
  const todayPct   = totalToday > 0 ? Math.round((doneCount / totalToday) * 100) : 0;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => streak(h.id))) : 0;
  const weeklyAvg  = habits.length > 0 ? Math.round(habits.reduce((s, h) => s + rate(h.id), 0) / habits.length) : 0;
  const dailyCount  = habits.filter(h => h.freq === 'daily').length;
  const weeklyCount = habits.filter(h => h.freq === 'weekly').length;

  const weekData = days.map(d => {
    if (habits.length === 0) return 0;
    const done = habits.filter(h => logs[`${h.id}_${d}`]).length;
    return Math.round((done / habits.length) * 100);
  });

  const weekBarData = weekViewDays.map(d => {
    if (habits.length === 0) return 0;
    const done = habits.filter(h => logs[`${h.id}_${d}`]).length;
    return Math.round((done / habits.length) * 100);
  });

  // ── Friends / Leaderboard ─────────────────────────────────────────────────
  const myScore   = weeklyAvg + bestStreak * 2;
  const shareCode = btoa(JSON.stringify({ n: userName || 'Anonymous', wa: weeklyAvg, bs: bestStreak, th: habits.length, sc: myScore }));
  const myStats   = { name: userName || 'Anonymous', weeklyAvg, bestStreak, totalHabits: habits.length, score: myScore, shareCode };

  const addFriend    = (f) => setFriends(prev => [...prev, f]);
  const removeFriend = (id) => setFriends(prev => prev.filter(f => f.id !== id));

  // ── Actions ───────────────────────────────────────────────────────────────
  const toggleLog = (hid, e) => {
    const key    = `${hid}_${todayStr}`;
    const wasDone = !!logs[key];
    if (!wasDone) {
      setCompleting(prev => ({ ...prev, [hid]: true }));
      setTimeout(() => setCompleting(prev => { const n = { ...prev }; delete n[hid]; return n; }), 500);
      const cid = uid();
      setConfettis(prev => [...prev, { id: cid, x: e.clientX, y: e.clientY }]);
    }
    setLogs(prev => {
      const next = { ...prev };
      if (wasDone) delete next[key]; else next[key] = true;
      return next;
    });
  };

  const openAdd = () => {
    setEditId(null);
    setNewHabit({ name: '', freq: 'daily', color: '#6366f1', category: 'Physical' });
    setShowAdd(true);
  };

  const openEdit = (h) => {
    setEditId(h.id);
    setNewHabit({ name: h.name, freq: h.freq, color: h.color, category: h.category });
    setShowAdd(true);
  };

  const closeModal = () => { setShowAdd(false); setEditId(null); };

  const saveHabit = () => {
    if (!newHabit.name.trim()) return;
    if (editId) {
      setHabits(prev => prev.map(h => h.id === editId ? { ...h, ...newHabit, name: newHabit.name.trim() } : h));
    } else {
      setHabits(prev => [...prev, { ...newHabit, id: uid(), created: todayStr, name: newHabit.name.trim() }]);
    }
    closeModal();
  };

  const deleteHabit = (hid) => {
    setHabits(prev => prev.filter(h => h.id !== hid));
    setLogs(prev => {
      const next = { ...prev };
      Object.keys(next).filter(k => k.startsWith(hid + '_')).forEach(k => delete next[k]);
      return next;
    });
  };

  const addSuggested = (s) => {
    if (habits.some(h => h.name === s.name)) return;
    setHabits(prev => [...prev, { ...s, id: uid(), created: todayStr }]);
  };

  const resetAll = () => {
    ['ht_h4','ht_l4','ht_t4','ht_d4','ht_name4','ht_friends4'].forEach(k => localStorage.removeItem(k));
    setHabits([]); setLogs({}); setTutorialDone(false); setDark(false); setUserName(''); setFriends([]); setShowDevMenu(false);
  };

  const font = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

  return (
    <div style={{ minHeight: '100vh', background: t.bg, fontFamily: font, color: t.text, transition: 'background 0.2s' }}>
      <style>{KEYFRAMES}</style>

      {/* Tutorial */}
      {!tutorialDone && <Tutorial onDone={() => setTutorialDone(true)} dark={dark} />}

      {/* Confetti bursts */}
      {confettis.map(c => (
        <Confetti key={c.id} id={c.id} x={c.x} y={c.y}
          onDone={() => setConfettis(prev => prev.filter(cf => cf.id !== c.id))} />
      ))}

      {/* ── Navbar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100, height: 60,
        background: t.navBg, borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', boxShadow: t.shadow,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: '#6366f1', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16, fontWeight: 700,
          }}>✦</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>HabitFlow</span>
        </div>

        {/* Segmented tabs */}
        <div style={{ display: 'flex', background: t.pill, borderRadius: 9, padding: 3, gap: 2 }}>
          {[['today','Today'], ['progress','Progress'], ['friends','Friends']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? t.surface : 'none',
              border: 'none', borderRadius: 7, padding: '6px 18px',
              fontSize: 13, fontWeight: 600,
              color: view === v ? t.text : t.textSub,
              cursor: 'pointer', fontFamily: font,
              boxShadow: view === v ? t.shadow : 'none',
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Date + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: t.textSub, fontWeight: 500 }}>{fmt(todayStr)}</span>
          <button
            onClick={() => setDark(d => !d)}
            style={{
              background: 'none', border: `1px solid ${t.border}`, borderRadius: 99,
              padding: '5px 12px', fontSize: 12, fontWeight: 600, color: t.textSub,
              cursor: 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* ── Dashboard strip ── */}
      <div style={{ background: t.navBg, borderBottom: `1px solid ${t.border}`, padding: '16px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>

          {/* Quote */}
          <div style={{
            background: dark ? '#1e2235' : '#eef2ff', borderRadius: 12,
            padding: '14px 18px', marginBottom: 16,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💬</span>
            <div>
              <div style={{ fontSize: 13, fontStyle: 'italic', color: t.text, fontWeight: 500, lineHeight: 1.5 }}>"{quote.text}"</div>
              <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginTop: 4 }}>— {quote.author}</div>
            </div>
          </div>

          {/* 4 Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {/* TODAY */}
            <div style={{ background: t.statCard, borderRadius: 14, padding: '14px 16px', boxShadow: t.shadow, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 4 }}>TODAY</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#6366f1', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{doneCount}/{totalToday}</div>
              <div style={{ height: 4, background: t.progressBg, borderRadius: 99, margin: '8px 0 4px' }}>
                <div style={{ height: '100%', width: `${todayPct}%`, background: '#6366f1', borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 12, color: t.textSub, fontWeight: 500 }}>
                {totalToday === 0 ? 'No habits yet' : doneCount === totalToday ? 'All done! 🎉' : `${todayPct}% complete`}
              </div>
            </div>

            {/* BEST STREAK */}
            <div style={{ background: t.statCard, borderRadius: 14, padding: '14px 16px', boxShadow: t.shadow, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 4 }}>BEST STREAK</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#f97316', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{bestStreak}</div>
              <div style={{ fontSize: 12, color: t.textSub, fontWeight: 500, marginTop: 14 }}>🔥 days in a row</div>
            </div>

            {/* WEEKLY AVG */}
            <div style={{ background: t.statCard, borderRadius: 14, padding: '14px 16px', boxShadow: t.shadow, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 4 }}>WEEKLY AVG</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{weeklyAvg}%</div>
              <div style={{ height: 4, background: t.progressBg, borderRadius: 99, margin: '8px 0 4px' }}>
                <div style={{ height: '100%', width: `${weeklyAvg}%`, background: '#10b981', borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 12, color: t.textSub, fontWeight: 500 }}>last 7 days</div>
            </div>

            {/* TOTAL HABITS */}
            <div style={{ background: t.statCard, borderRadius: 14, padding: '14px 16px', boxShadow: t.shadow, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 4 }}>TOTAL HABITS</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#ec4899', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{habits.length}</div>
              <div style={{ fontSize: 12, color: t.textSub, fontWeight: 500, marginTop: 14 }}>{dailyCount} daily · {weeklyCount} weekly</div>
            </div>
          </div>

          {/* Weekly bar chart — Mon to Sun of current week */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 8 }}>THIS WEEK AT A GLANCE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {weekViewDays.map((d, i) => {
                const pct      = weekBarData[i];
                const isToday  = d === todayStr;
                const isFuture = d > todayStr;
                const barColor = pct === 100 ? '#10b981' : '#6366f1';
                return (
                  <div key={d} style={{ textAlign: 'center', opacity: isFuture ? 0.35 : 1, transition: 'opacity 0.2s' }}>
                    <div style={{
                      height: 52, background: t.progressBg, borderRadius: 6,
                      border: isToday ? `2px solid #6366f1` : `1px solid ${t.border}`,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      {!isFuture && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: `${pct}%`, background: barColor, transition: 'height 0.3s',
                        }} />
                      )}
                    </div>
                    <div style={{
                      fontSize: 10, marginTop: 4, fontWeight: isToday ? 700 : 500,
                      color: isToday ? '#6366f1' : t.textMuted,
                    }}>
                      {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
            {CATEGORIES.map(cat => {
              const active = filterCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  style={{
                    background: active ? (dark ? '#1e2040' : '#eef2ff') : t.surface,
                    border: `1px solid ${active ? '#6366f1' : t.border}`,
                    color: active ? '#6366f1' : t.pillText,
                    borderRadius: 99, padding: '6px 14px',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    whiteSpace: 'nowrap', fontFamily: font, transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                >
                  {CAT_ICONS[cat]}{cat !== 'All' ? ' ' : ''}{cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 32px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted }}>
            {filterCat === 'All' ? 'ALL HABITS' : `${filterCat.toUpperCase()} HABITS`} · {filteredHabits.length}
          </div>
          <button
            onClick={openAdd}
            style={{
              background: '#6366f1', color: '#fff', border: 'none',
              borderRadius: 9, padding: '8px 18px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: font,
            }}
          >+ Add Habit</button>
        </div>

        {/* Suggested habits — shown right below the header so users see it immediately */}
        <SuggestedHabits habits={habits} onAdd={addSuggested} dark={dark} />

        {/* ── Today view ── */}
        {view === 'today' && (
          <>
            {filteredHabits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0 32px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: t.surface, border: `1px solid ${t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, margin: '0 auto 16px',
                }}>🌱</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 8 }}>No habits yet</div>
                <div style={{ fontSize: 13, color: t.textSub }}>Add your first habit or browse suggestions below.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {filteredHabits.map(h => {
                  const done        = doneToday(h.id);
                  const s           = streak(h.id);
                  const r           = rate(h.id);
                  const isCompleting = completing[h.id];
                  return (
                    <div
                      key={h.id}
                      style={{
                        background: t.surface, borderRadius: 14, padding: '14px 16px',
                        border: `1px solid ${t.border}`, boxShadow: t.shadow,
                        animation: isCompleting ? 'card-complete 0.5s ease' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        {/* Checkbox */}
                        <button
                          onClick={(e) => toggleLog(h.id, e)}
                          style={{
                            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                            border: `2px solid ${done ? h.color : t.borderStrong}`,
                            background: done ? h.color : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', padding: 0, fontSize: 14, color: '#fff',
                          }}
                        >
                          {done && <span style={{ animation: 'checkmark-pop 0.35s ease', display: 'block' }}>✓</span>}
                        </button>

                        {/* Name */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 600,
                            color: done ? t.textMuted : t.text,
                            textDecoration: done ? 'line-through' : 'none',
                            wordBreak: 'break-word',
                          }}>{h.name}</div>
                        </div>

                        {/* Rate + actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <span style={{
                            background: h.color + '22', color: h.color,
                            borderRadius: 99, padding: '2px 8px',
                            fontSize: 11, fontWeight: 700,
                          }}>{r}%</span>
                          <button onClick={() => openEdit(h)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '0 3px', fontSize: 13, fontFamily: font }}>✎</button>
                          <button onClick={() => deleteHabit(h.id)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '0 3px', fontSize: 13, fontFamily: font }}>✕</button>
                        </div>
                      </div>

                      {/* Pill tags */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          background: t.pill, color: t.pillText, borderRadius: 99,
                          padding: '2px 8px', fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                        }}>{h.freq}</span>
                        <span style={{
                          background: h.color + '22', color: h.color, borderRadius: 99,
                          padding: '2px 8px', fontSize: 11, fontWeight: 600,
                        }}>{CAT_ICONS[h.category]} {h.category}</span>
                        {s > 0 && (
                          <span style={{
                            background: '#f9731622', color: '#f97316', borderRadius: 99,
                            padding: '2px 8px', fontSize: 11, fontWeight: 600,
                          }}>🔥 {s}d</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Progress view ── */}
        {view === 'progress' && (
          filteredHabits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: t.surface, border: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, margin: '0 auto 16px',
              }}>🌱</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 8 }}>No habits to track</div>
              <div style={{ fontSize: 13, color: t.textSub }}>Add habits to see your progress here.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {filteredHabits.map(h => {
                const s = streak(h.id);
                const r = rate(h.id);
                return (
                  <div key={h.id} style={{
                    background: t.surface, borderRadius: 14, padding: '14px 16px',
                    border: `1px solid ${t.border}`, boxShadow: t.shadow,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: h.color, flexShrink: 0 }} />
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.text, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', flexShrink: 0 }}>🔥 {s}d</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', flexShrink: 0 }}>{r}%</span>
                    </div>

                    {/* 7-day grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                      {days.map(d => {
                        const done = logs[`${h.id}_${d}`];
                        const isToday = d === todayStr;
                        return (
                          <div key={d} style={{ textAlign: 'center' }}>
                            <div style={{
                              height: 30, borderRadius: 6,
                              background: done ? h.color : t.progressBg,
                              border: isToday ? `2px solid ${h.color}` : `1px solid ${t.border}`,
                            }} />
                            <div style={{ fontSize: 9, color: t.textMuted, marginTop: 2 }}>
                              {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── Friends / Leaderboard view ── */}
        {view === 'friends' && (
          <FriendsView
            myStats={myStats}
            userName={userName}
            setUserName={setUserName}
            friends={friends}
            onAddFriend={addFriend}
            onRemoveFriend={removeFriend}
            dark={dark}
          />
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: t.navBg, borderTop: `1px solid ${t.border}`,
        padding: '16px 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'relative',
      }}>
        <span style={{ fontSize: 13, color: t.textSub, fontWeight: 500 }}>Vibed by JC ✦</span>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDevMenu(d => !d)}
            style={{
              background: 'none', border: `1px solid ${t.border}`, borderRadius: 9,
              padding: '6px 12px', fontSize: 13, color: t.textSub,
              cursor: 'pointer', fontFamily: font,
            }}
          >⚙</button>
          {showDevMenu && (
            <div style={{
              position: 'absolute', bottom: 44, right: 0,
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 12, boxShadow: t.shadowMd, padding: 8, minWidth: 180,
              zIndex: 200, animation: 'fade-in 0.2s ease',
            }}>
              {[
                { label: '🔁 Replay tutorial', color: t.text,    action: () => { setTutorialDone(false); setShowDevMenu(false); } },
                { label: '🗑 Reset everything', color: '#ef4444', action: resetAll },
                { label: '✕ Close',             color: t.textMuted, action: () => setShowDevMenu(false) },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{
                    display: 'block', width: '100%', background: 'none', border: 'none',
                    color: item.color, padding: '8px 12px', textAlign: 'left',
                    cursor: 'pointer', borderRadius: 7, fontSize: 13, fontFamily: font,
                  }}
                >{item.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit modal ── */}
      {showAdd && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: t.modalOverlay, backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            background: t.surface, borderRadius: 18, padding: 28,
            width: 400, maxWidth: 'calc(100vw - 48px)',
            boxShadow: t.shadowLg, animation: 'fade-in 0.3s ease',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 20 }}>
              {editId ? 'Edit Habit' : 'New Habit'}
            </div>

            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 6 }}>HABIT NAME</div>
              <input
                autoFocus
                value={newHabit.name}
                onChange={e => setNewHabit(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveHabit()}
                placeholder="e.g. Morning workout"
                style={{
                  width: '100%', background: t.inputBg, border: `1px solid ${t.border}`,
                  borderRadius: 9, padding: '10px 12px', fontSize: 14, color: t.text,
                  fontFamily: font, boxSizing: 'border-box', outline: 'none',
                }}
              />
            </div>

            {/* Frequency + Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 6 }}>FREQUENCY</div>
                <div style={{ display: 'flex', background: t.pill, borderRadius: 9, padding: 3, gap: 2 }}>
                  {['daily', 'weekly'].map(f => (
                    <button
                      key={f}
                      onClick={() => setNewHabit(p => ({ ...p, freq: f }))}
                      style={{
                        flex: 1, background: newHabit.freq === f ? t.surface : 'none',
                        border: 'none', borderRadius: 7, padding: '6px 0',
                        fontSize: 12, fontWeight: 600,
                        color: newHabit.freq === f ? t.text : t.textSub,
                        cursor: 'pointer', fontFamily: font,
                        boxShadow: newHabit.freq === f ? t.shadow : 'none',
                        textTransform: 'capitalize',
                      }}
                    >{f}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 6 }}>CATEGORY</div>
                <select
                  value={newHabit.category}
                  onChange={e => setNewHabit(p => ({ ...p, category: e.target.value }))}
                  style={{
                    width: '100%', background: t.inputBg, border: `1px solid ${t.border}`,
                    borderRadius: 9, padding: '7px 10px', fontSize: 13,
                    color: t.text, fontFamily: font, cursor: 'pointer',
                  }}
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Color swatches */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: t.textMuted, marginBottom: 10 }}>COLOR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setNewHabit(p => ({ ...p, color: c.hex }))}
                    title={c.name}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c.hex,
                      border: `2px solid ${newHabit.color === c.hex ? (dark ? '#fff' : '#1e293b') : 'transparent'}`,
                      cursor: 'pointer', padding: 0,
                      transform: newHabit.color === c.hex ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s, border-color 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={closeModal}
                style={{
                  background: 'none', border: `1px solid ${t.border}`, borderRadius: 9,
                  padding: '10px 0', fontSize: 14, fontWeight: 600,
                  color: t.textSub, cursor: 'pointer', fontFamily: font,
                }}
              >Cancel</button>
              <button
                onClick={saveHabit}
                style={{
                  background: '#6366f1', border: 'none', borderRadius: 9,
                  padding: '10px 0', fontSize: 14, fontWeight: 600,
                  color: '#fff', cursor: 'pointer', fontFamily: font,
                }}
              >{editId ? 'Save Changes' : 'Add Habit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
