export function SpiderMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="40" cy="44" rx="4" ry="10" fill="currentColor" /><circle cx="40" cy="30" r="3" fill="currentColor" /><path d="m37 36-11-9-4-9m15 23-15-6-9-8m24 19-14 5-8 12m22-12-6 11-2 10m14-34 11-9 4-9m-15 23 15-6 9-8m-24 19 14 5 8 12m-22-12 6 11 2 10" /></g></svg>;
}

export function WebPattern({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1">{Array.from({ length: 16 }, (_, i) => <path key={`r${i}`} d="M300 300V-80" transform={`rotate(${i * 22.5} 300 300)`} />)}{[50, 100, 155, 220, 300, 390].map((r) => <path key={r} d={Array.from({ length: 17 }, (_, i) => {
    const angle = (i % 16) / 16 * Math.PI * 2;
    const x = 300 + Math.cos(angle) * r;
    const y = 300 + Math.sin(angle) * r;
    if (!i) return `M ${x} ${y}`;
    const middle = ((i - 0.5) % 16) / 16 * Math.PI * 2;
    return `Q ${300 + Math.cos(middle) * r * .85} ${300 + Math.sin(middle) * r * .85} ${x} ${y}`;
  }).join(' ')} />)}</g></svg>;
}

export function CityMap({ selected }: { selected: number }) {
  const positions = [{ x: 260, y: 175 }, { x: 365, y: 360 }, { x: 422, y: 180 }];
  return <svg viewBox="0 0 600 470" className="city-map" role="img" aria-label="Mapa ilustrativo de Manhattan, Brooklyn e Queens">
    <defs><pattern id="city-grid" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><path d="M22 0H0V22" fill="none" stroke="#535c74" strokeWidth=".5" /></pattern></defs>
    <path d="m278 34 45 28-48 215-41 27-27-25 18-119z" fill="#20293d" stroke="#485774" /><path d="m353 221 79-4 58 60 65 105-35 51-140-21-58-64z" fill="#20293d" stroke="#485774" /><path d="m341 48 143 15 67 71-43 102-77-39-65-13-37-23z" fill="#20293d" stroke="#485774" /><path d="m93 41 58-2 40 55-24 195-66 71-46-41 21-112z" fill="#1a2435" stroke="#3c4c67" />
    <path d="m278 34 45 28-48 215-41 27-27-25 18-119zM353 221l79-4 58 60 65 105-35 51-140-21-58-64zM341 48l143 15 67 71-43 102-77-39-65-13-37-23z" fill="url(#city-grid)" />
    <path d="m259 278 94-57m-49-91 65 30m-39 37 72 21" stroke="#7584a0" strokeWidth="3" /><path d="M100 435Q190 345 255 285T418 172" fill="none" stroke="var(--accent)" strokeDasharray="4 8" opacity=".7" />
    <text x="213" y="324">MANHATTAN</text><text x="377" y="449">BROOKLYN</text><text x="455" y="121">QUEENS</text><text x="84" y="180" transform="rotate(-80 84 180)" className="water-label">HUDSON RIVER</text>
    {positions.map((point, i) => <g key={i} className={selected === i ? 'map-point selected' : 'map-point'}><circle cx={point.x} cy={point.y} r={selected === i ? 24 : 13} fill="var(--accent)" opacity={selected === i ? .16 : .1} /><circle cx={point.x} cy={point.y} r="5" fill={selected === i ? 'var(--accent)' : '#8794ad'} /><text x={point.x + 15} y={point.y + 5}>0{i + 1}</text></g>)}
    <g stroke="#4c5973" fill="none"><path d="M31 395v40h40M559 75V35h-40" /></g>
  </svg>;
}
