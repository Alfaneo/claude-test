/** Seed verisi için sade Lexical zengin metin JSON'u üretir. */
type Blok = { p: string } | { h2: string } | { h3: string } | { ul: string[] } | { ol: string[] }

const metin = (text: string) => ({
  type: 'text',
  text,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const ortak = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

function blokDugumu(b: Blok) {
  if ('p' in b) return { ...ortak, type: 'paragraph', textFormat: 0, children: [metin(b.p)] }
  if ('h2' in b) return { ...ortak, type: 'heading', tag: 'h2', children: [metin(b.h2)] }
  if ('h3' in b) return { ...ortak, type: 'heading', tag: 'h3', children: [metin(b.h3)] }
  const sirali = 'ol' in b
  const maddeler = sirali ? b.ol : b.ul
  return {
    ...ortak,
    type: 'list',
    listType: sirali ? 'number' : 'bullet',
    tag: sirali ? 'ol' : 'ul',
    start: 1,
    children: maddeler.map((m, i) => ({ ...ortak, type: 'listitem', value: i + 1, children: [metin(m)] })),
  }
}

export function zenginMetin(bloklar: Blok[]) {
  return { root: { ...ortak, type: 'root', children: bloklar.map(blokDugumu) } }
}
