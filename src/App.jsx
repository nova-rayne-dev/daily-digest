import { useState } from "react";

const C = {
  bg: '#0d1117',
  card: '#161b22',
  input: '#0d1117',
  border: '#30363d',
  borderFocus: '#7c68ee',
  accent: '#7c68ee',
  text: '#e6edf3',
  muted: '#8b949e',
  success: '#3fb950',
  discord: '#1e2124',
  discordMsg: '#dcddde',
};

export default function DailyDigest() {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${String(today.getFullYear()).slice(2)}`;

  const [notes, setNotes] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(dateStr);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const format = async () => {
    if (!notes.trim() || !hours.trim()) return;
    setLoading(true);
    setOutput('');
    setError('');

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Check your .env.local file.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You format daily work notes for Jamie, Operations Manager at a real estate team (BTWT). Transform her rough notes into a clean Discord status update for Nicole (team leader).

Nicole wants two things only: what was done, and where each thing is at.

Output format — EXACTLY this structure, nothing else:
${date} - ${hours} hours

• [Subject]: [what was done] — [current status or next step]
• [Subject]: [what was done] — [current status or next step]

Rules:
- Subject = property address, person's name, or project name from the notes
- Action = what Jamie actually did (past tense, brief)
- Status = where it stands right now or what happens next
- One bullet per distinct task or property
- Plain language, no filler words
- Do not add tasks that weren't mentioned
- Do not use markdown bold or any formatting beyond bullets
- Output ONLY the formatted message — no preamble, no commentary, nothing before or after`,
          messages: [{
            role: "user",
            content: `Date: ${date}\nHours worked: ${hours}\n\nRaw notes:\n${notes}`
          }]
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setOutput(text.trim());
    } catch (e) {
      setError('Something went wrong. Check your connection and try again.');
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: C.input,
    border: `1px solid ${C.border}`,
    borderRadius: '6px',
    color: C.text,
    padding: '9px 12px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: C.muted,
    marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: C.text,
      padding: '28px 24px',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: C.accent, boxShadow: `0 0 10px ${C.accent}88`
          }} />
          <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted }}>
            BTWT Ops
          </span>
        </div>
        <h1 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700' }}>
          Daily Digest
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
          Brain dump → Nicole-ready Discord message. No formatting needed on your end.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: '16px',
        alignItems: 'start',
      }}>

        {/* ── LEFT: INPUT ── */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${C.border}`,
            fontSize: '11px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.09em',
            color: C.muted,
          }}>
            Your Notes
          </div>

          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Date + Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.borderFocus}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
              <div>
                <label style={labelStyle}>Hours</label>
                <input
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  placeholder="5"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.borderFocus}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
            </div>

            {/* Notes area */}
            <div>
              <label style={labelStyle}>What you did — just type it messy</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={"No formatting needed. Examples:\n\n1810 Waco - ordered termite, waiting on report\n1404 N 18th - sent what's next email to seller, they need to respond by Friday\nsocial media - three templates done, posting schedule set for next week\nLofty migration - halfway through contacts\n901 68th Ln - emailed listing agent re: mouse issue, no response yet"}
                style={{
                  ...inputStyle,
                  minHeight: '220px',
                  resize: 'vertical',
                  lineHeight: '1.65',
                  padding: '12px',
                }}
                onFocus={e => e.target.style.borderColor = C.borderFocus}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Button */}
            <button
              onClick={format}
              disabled={loading || !notes.trim() || !hours.trim()}
              style={{
                background: (loading || !notes.trim() || !hours.trim()) ? '#1e2530' : C.accent,
                color: (loading || !notes.trim() || !hours.trim()) ? C.muted : '#fff',
                border: 'none',
                borderRadius: '7px',
                padding: '11px 16px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: (loading || !notes.trim() || !hours.trim()) ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '13px', height: '13px',
                    border: '2px solid #ffffff44',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Formatting...
                </>
              ) : (
                'Format for Nicole →'
              )}
            </button>

            {error && (
              <div style={{ fontSize: '12px', color: '#f85149', background: '#1c0a0a', border: '1px solid #6f1a1a', borderRadius: '6px', padding: '10px 12px' }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: OUTPUT ── */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.09em', color: C.muted }}>
              Ready to Post
            </span>
            {output && (
              <button
                onClick={copy}
                style={{
                  background: copied ? '#12261e' : 'transparent',
                  border: `1px solid ${copied ? C.success : C.border}`,
                  borderRadius: '5px',
                  color: copied ? C.success : C.muted,
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.15s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div style={{ padding: '18px', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
            {!output && !loading && (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: C.muted, textAlign: 'center', gap: '10px',
              }}>
                <div style={{ fontSize: '32px', opacity: 0.25 }}>💬</div>
                <div style={{ fontSize: '13px' }}>Formatted message appears here</div>
                <div style={{ fontSize: '11px', opacity: 0.6 }}>Add your notes and click Format</div>
              </div>
            )}

            {loading && (
              <div style={{
                flex: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: C.muted, fontSize: '13px', gap: '10px',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '14px', height: '14px',
                  border: `2px solid ${C.border}`,
                  borderTopColor: C.accent,
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Cleaning up your notes...
              </div>
            )}

            {output && !loading && (
              <div style={{
                background: C.discord,
                borderRadius: '8px',
                padding: '16px',
                flex: 1,
              }}>
                {/* Discord message mock */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: C.accent, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', fontWeight: '800', color: '#fff',
                  }}>J</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px', color: C.accent }}>Jamie</span>
                      <span style={{ fontSize: '11px', color: '#72767d' }}>Today</span>
                    </div>
                    <pre style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '13.5px',
                      color: C.discordMsg,
                      lineHeight: '1.65',
                      fontFamily: 'inherit',
                    }}>{output}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer tip */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        background: '#0f1a2e',
        border: '1px solid #1e3050',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#5a7fa8',
        lineHeight: '1.6',
      }}>
        <strong style={{ color: '#7aabdb' }}>Quick capture tip:</strong> Keep a voice memo or one Apple Note open all day. Drop one line per task as you finish it — no formatting. Paste it here at end of day. Copy the output to Discord. Done.
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: #3d4451; }
        input::placeholder { color: #3d4451; }
      `}</style>
    </div>
  );
}
