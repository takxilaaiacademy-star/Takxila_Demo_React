import { memo, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Box } from '@mui/material';
import type { DocEntry, DocSection, ResumeDoc } from './model';
import { cssFont, PAGE, type ResumeTheme } from './themes';

/**
 * The A4 preview. Uses the same theme config and the same document model as
 * the PDF renderer, measured in `pt`, so it matches the download closely.
 * Plain elements with inline styles (no CSS-in-JS) keep re-renders cheap, and
 * each section is memoised so editing one section repaints only that one.
 * Always light, whatever the app theme is.
 */

const PX_PER_PT = 96 / 72;
const PAGE_W_PX = PAGE.w * PX_PER_PT;
const PAGE_H_PX = PAGE.h * PX_PER_PT;

const Heading = ({ title, t }: { title: string; t: ResumeTheme }) => {
  const label = t.headingUpper ? title.toUpperCase() : title;
  const base: CSSProperties = { fontSize: `${t.size.heading}pt`, color: t.color.heading, fontWeight: 700, margin: 0, lineHeight: 1.2 };
  switch (t.heading) {
    case 'rule':
      return <h2 style={{ ...base, borderBottom: `0.8pt solid ${t.color.rule}`, paddingBottom: '2pt', marginBottom: '5pt' }}>{label}</h2>;
    case 'accent':
      return <h2 style={{ ...base, marginBottom: '4pt' }}>{label}</h2>;
    case 'smallcaps':
      return <h2 style={{ ...base, borderBottom: `0.6pt solid ${t.color.rule}`, paddingBottom: '2.5pt', marginBottom: '5pt' }}>{label}</h2>;
    case 'hairline':
      return <h2 style={{ ...base, fontWeight: 400, borderBottom: `0.4pt solid ${t.color.rule}`, paddingBottom: '4pt', marginBottom: '7pt' }}>{label}</h2>;
    case 'twotone':
      return (
        <h2 style={{ ...base, paddingBottom: '3pt', marginBottom: '6pt', backgroundImage: `linear-gradient(${t.color.rule}, ${t.color.rule}), linear-gradient(${t.color.rule2}, ${t.color.rule2})`, backgroundSize: '40pt 2.2pt, 100% 0.6pt', backgroundPosition: 'left bottom, left bottom', backgroundRepeat: 'no-repeat' }}>
          {label}
        </h2>
      );
  }
};

const Bullets = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
    {items.map((b, i) => (
      <li key={i} style={{ position: 'relative', paddingLeft: '12pt', overflowWrap: 'anywhere' }}>
        <span aria-hidden style={{ position: 'absolute', left: '2pt' }}>
          •
        </span>
        {b}
      </li>
    ))}
  </ul>
);

const Entry = ({ e, t }: { e: DocEntry; t: ResumeTheme }) => (
  <div>
    {(e.title || e.date) && (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12pt' }}>
        <div style={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: `${t.size.title}pt`, lineHeight: t.lh, overflowWrap: 'anywhere' }}>{e.title || <i style={{ fontWeight: 400, fontSize: `${t.size.body}pt`, color: t.color.sub }}>{e.sub}</i>}</div>
        {e.date && <div style={{ flex: 'none', fontSize: `${t.size.meta}pt`, color: t.color.muted }}>{e.date}</div>}
      </div>
    )}
    {e.sub && e.title && <div style={{ fontStyle: 'italic', color: t.color.sub, overflowWrap: 'anywhere' }}>{e.sub}</div>}
    {e.bullets.length > 0 && (
      <div style={{ marginTop: '1.5pt' }}>
        <Bullets items={e.bullets} />
      </div>
    )}
  </div>
);

const PreviewSection = memo(
  function PreviewSection({ s, t, first }: { s: DocSection; t: ResumeTheme; first: boolean; sig: string }) {
    const b = s.block;
    return (
      <section style={{ marginTop: `${first ? t.sectionGap * 0.9 : t.sectionGap}pt` }}>
        <Heading title={s.title} t={t} />
        {b.kind === 'text' &&
          b.text.split(/\n+/).map((p, i) => (
            <p key={i} style={{ margin: i ? '0.35em 0 0' : 0, overflowWrap: 'anywhere' }}>
              {p}
            </p>
          ))}
        {b.kind === 'bullets' && <Bullets items={b.items} />}
        {b.kind === 'labelled' &&
          b.items.map((it) => (
            <p key={it.label} style={{ margin: '0 0 1.5pt', overflowWrap: 'anywhere' }}>
              <b>{it.label}:</b> {it.text}
            </p>
          ))}
        {b.kind === 'entries' &&
          b.items.map((e, i) => (
            <div key={i} style={{ marginTop: i ? `${t.entryGap}pt` : 0 }}>
              <Entry e={e} t={t} />
            </div>
          ))}
      </section>
    );
  },
  // Re-render a section only when its content (or the theme) changed.
  (a, b) => a.t === b.t && a.first === b.first && a.sig === b.sig,
);

const PreviewHeader = memo(function PreviewHeader({ d, t }: { d: Pick<ResumeDoc, 'name' | 'role' | 'contact' | 'links'>; t: ResumeTheme }) {
  const name = d.name || 'Your Name';
  const contactColor = t.band ? t.color.bandText : t.color.muted;
  const inner = (
    <div style={{ textAlign: t.align }}>
      <div style={{ fontSize: `${t.size.name}pt`, fontWeight: t.nameBold ? 700 : 400, color: t.color.name, lineHeight: 1.12, textTransform: t.nameUpper ? 'uppercase' : 'none', opacity: d.name ? 1 : 0.35, overflowWrap: 'anywhere' }}>{name}</div>
      {d.role && <div style={{ fontSize: `${t.size.role}pt`, color: t.color.role, marginTop: '3pt', lineHeight: t.lh }}>{d.role}</div>}
      {d.contact.length > 0 && <div style={{ fontSize: `${t.size.contact}pt`, color: contactColor, marginTop: '2pt', lineHeight: t.lh, overflowWrap: 'anywhere' }}>{d.contact.join('  |  ')}</div>}
      {d.links.length > 0 && (
        <div style={{ fontSize: `${t.size.contact}pt`, color: contactColor, lineHeight: t.lh, overflowWrap: 'anywhere' }}>
          {d.links.map((l, i) => (
            <span key={i}>
              {i > 0 && <span style={{ whiteSpace: 'pre' }}>{'  |  '}</span>}
              <a href={l.href} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                {l.url}
              </a>
            </span>
          ))}
        </div>
      )}
    </div>
  );
  if (!t.band) return inner;
  return <div style={{ background: t.color.band, margin: `-${t.margin.top}pt -${t.margin.x}pt 6pt`, padding: `${t.margin.top + 4}pt ${t.margin.x}pt 22pt` }}>{inner}</div>;
});

export const ResumePaper = memo(function ResumePaper({ doc, theme: t }: { doc: ResumeDoc; theme: ResumeTheme }) {
  const outer = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, h: PAGE_H_PX });

  // Scale the fixed-width A4 sheet down to fit narrow screens.
  useLayoutEffect(() => {
    const o = outer.current;
    const p = paper.current;
    if (!o || !p) return;
    const measure = () => {
      const scale = Math.min(1, o.clientWidth / PAGE_W_PX);
      const h = p.offsetHeight;
      setBox((b) => (Math.abs(b.scale - scale) < 0.001 && b.h === h ? b : { scale, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(p);
    return () => ro.disconnect();
  }, []);

  const pages = Math.max(1, Math.ceil((box.h - 4) / PAGE_H_PX));
  const empty = !doc.sections.length;

  return (
    <Box ref={outer} sx={{ width: '100%', height: box.h * box.scale, position: 'relative' }}>
      <div
        ref={paper}
        id="tx-resume"
        style={{
          width: PAGE_W_PX, minHeight: PAGE_H_PX, transform: `scale(${box.scale})`, transformOrigin: 'top left', position: 'absolute', left: 0, top: 0,
          background: '#fff', color: t.color.text, fontFamily: cssFont(t.font), fontSize: `${t.size.body}pt`, lineHeight: t.lh,
          padding: `${t.margin.top}pt ${t.margin.x}pt ${t.margin.bottom}pt`, boxSizing: 'border-box', borderRadius: 6, boxShadow: '0 24px 70px rgba(8,12,40,.35)',
          overflow: 'hidden', transition: 'font-family .2s',
        }}
      >
        <PreviewHeader d={doc} t={t} />
        {doc.sections.map((s, i) => (
          <PreviewSection key={s.id} s={s} t={t} first={i === 0} sig={JSON.stringify(s)} />
        ))}
        {empty && <p style={{ marginTop: '24pt', color: '#9AA0B4', fontStyle: 'italic', textAlign: 'center' }}>Start typing on the left. Empty sections are left out of the PDF.</p>}
        {/* Approximate page breaks */}
        {Array.from({ length: pages - 1 }, (_, i) => (
          <div key={i} aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * PAGE_H_PX, borderTop: '1.5px dashed #A5ADCF', pointerEvents: 'none' }}>
            <span style={{ position: 'absolute', right: 8, top: 4, fontFamily: 'system-ui, sans-serif', fontSize: 11, color: '#7A83A8', background: '#fff', padding: '0 6px' }}>Page {i + 2}</span>
          </div>
        ))}
      </div>
    </Box>
  );
});
