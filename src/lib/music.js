// Music catalogue layer.
// Songs, album art and 30-second audio previews come from the public iTunes Search API
// (country=IN so that Hindi & Bengali catalogue is returned). Responses are cached in localStorage.
import { load, save } from './storage.js'

const API = 'https://itunes.apple.com'
const CACHE_PREFIX = 'sp_cache_v1:'
const CACHE_TTL = 1000 * 60 * 60 * 24 * 3 // 3 days

export const LANGUAGES = {
  hindi: {
    key: 'hindi',
    name: 'Hindi',
    emoji: '🎬',
    tagline: 'Bollywood chartbusters, romantic melodies and timeless classics',
    gradient: 'from-orange-600 to-amber-400',
  },
  bengali: {
    key: 'bengali',
    name: 'Bengali',
    emoji: '🎶',
    tagline: 'Rabindra Sangeet, Tollywood hits and modern Bangla favourites',
    gradient: 'from-emerald-700 to-lime-500',
  },
}

export const ARTISTS = [
  // Hindi
  { key: 'arijit-singh', name: 'Arijit Singh', lang: 'hindi', term: 'Arijit Singh' },
  { key: 'shreya-ghoshal', name: 'Shreya Ghoshal', lang: 'hindi', term: 'Shreya Ghoshal' },
  { key: 'atif-aslam', name: 'Atif Aslam', lang: 'hindi', term: 'Atif Aslam' },
  { key: 'kishore-kumar', name: 'Kishore Kumar', lang: 'hindi', term: 'Kishore Kumar' },
  { key: 'lata-mangeshkar', name: 'Lata Mangeshkar', lang: 'hindi', term: 'Lata Mangeshkar' },
  { key: 'ar-rahman', name: 'A. R. Rahman', lang: 'hindi', term: 'A. R. Rahman' },
  { key: 'sonu-nigam', name: 'Sonu Nigam', lang: 'hindi', term: 'Sonu Nigam' },
  { key: 'jubin-nautiyal', name: 'Jubin Nautiyal', lang: 'hindi', term: 'Jubin Nautiyal' },
  // Bengali
  { key: 'kumar-sanu', name: 'Kumar Sanu', lang: 'bengali', term: 'Kumar Sanu' },
  { key: 'anupam-roy', name: 'Anupam Roy', lang: 'bengali', term: 'Anupam Roy' },
  { key: 'hemanta-mukherjee', name: 'Hemanta Mukherjee', lang: 'bengali', term: 'Hemanta Mukherjee' },
  { key: 'srikanta-acharya', name: 'Srikanta Acharya', lang: 'bengali', term: 'Srikanta Acharya' },
  { key: 'nachiketa', name: 'Nachiketa', lang: 'bengali', term: 'Nachiketa' },
  { key: 'lopamudra-mitra', name: 'Lopamudra Mitra', lang: 'bengali', term: 'Lopamudra Mitra' },
  { key: 'indraadip-dasgupta', name: 'Indraadip Dasgupta', lang: 'bengali', term: 'Indraadip Dasgupta' },
  { key: 'anjan-dutta', name: 'Anjan Dutta', lang: 'bengali', term: 'Anjan Dutta' },
]

export const artistsByLang = (lang) => ARTISTS.filter((a) => a.lang === lang)
export const getArtist = (key) => ARTISTS.find((a) => a.key === key)

// ---------- helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const hiRes = (url, size = 600) => (url ? url.replace('100x100bb', `${size}x${size}bb`) : '')

export function fmtTime(sec = 0) {
  const s = Number.isFinite(sec) && sec > 0 ? sec : 0
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}

export function dedupe(songs) {
  const seen = new Set()
  return songs.filter((s) => {
    if (seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
}

export function roundRobin(lists, n) {
  const out = []
  const max = Math.max(0, ...lists.map((l) => l.length))
  for (let i = 0; i < max && out.length < n; i++) {
    for (const l of lists) {
      if (l[i] && out.length < n) out.push(l[i])
    }
  }
  return dedupe(out)
}

export function albumsFromSongs(songs) {
  const map = new Map()
  songs.forEach((s) => {
    if (!map.has(s.albumId)) {
      map.set(s.albumId, {
        id: s.albumId,
        title: s.album,
        artist: s.artist,
        image: s.image,
        thumb: s.thumb,
        year: s.year,
      })
    }
  })
  return [...map.values()]
}

export function toSong(t, lang = null) {
  return {
    id: String(t.trackId),
    title: t.trackName,
    artist: t.artistName,
    album: t.collectionName,
    albumId: String(t.collectionId),
    duration: Math.round((t.trackTimeMillis || 0) / 1000),
    audio: t.previewUrl,
    image: hiRes(t.artworkUrl100, 600),
    thumb: t.artworkUrl100 || '',
    genre: t.primaryGenreName || '',
    year: (t.releaseDate || '').slice(0, 4),
    lang,
  }
}

// ---------- cache ----------
function cacheGet(key) {
  const entry = load(CACHE_PREFIX + key, null)
  return entry && Date.now() - entry.t < CACHE_TTL ? entry.v : null
}

function cacheSet(key, value) {
  save(CACHE_PREFIX + key, { t: Date.now(), v: value })
}

// ---------- request queue (keeps us under the iTunes rate limit) ----------
let chain = Promise.resolve()
const inflight = new Map()

async function apiGet(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url)
    if (res.ok) return res.json()
    if (res.status !== 403 && res.status !== 429) throw new Error(`Request failed (${res.status})`)
    await sleep(2000 * (attempt + 1))
  }
  throw new Error('Too many requests to the music catalogue. Please try again in a minute.')
}

function request(cacheKey, url, parse) {
  const cached = cacheGet(cacheKey)
  if (cached) return Promise.resolve(cached)
  if (inflight.has(cacheKey)) return inflight.get(cacheKey)

  const job = chain.then(async () => {
    const value = parse(await apiGet(url))
    cacheSet(cacheKey, value)
    return value
  })
  chain = job.then(
    () => sleep(300),
    () => sleep(300),
  )
  inflight.set(cacheKey, job)
  const clear = () => inflight.delete(cacheKey)
  job.then(clear, clear)
  return job
}

// ---------- public API ----------
export function getArtistSongs(artist) {
  const url = `${API}/search?term=${encodeURIComponent(artist.term)}&entity=song&attribute=artistTerm&country=IN&limit=100`
  return request(`artist:${artist.key}`, url, (data) =>
    dedupe(
      data.results
        .filter((r) => r.kind === 'song' && r.previewUrl)
        .map((r) => toSong(r, artist.lang)),
    ),
  )
}

export function searchSongs(term) {
  const url = `${API}/search?term=${encodeURIComponent(term)}&entity=song&country=IN&limit=50`
  return request(`search:${term.toLowerCase()}`, url, (data) =>
    dedupe(data.results.filter((r) => r.previewUrl).map((r) => toSong(r))),
  )
}

export function getAlbum(id) {
  const url = `${API}/lookup?id=${id}&entity=song&country=IN`
  return request(`album:${id}`, url, (data) => {
    const col = data.results.find((r) => r.wrapperType === 'collection') || {}
    const songs = data.results
      .filter((r) => r.wrapperType === 'track' && r.previewUrl)
      .map((r) => toSong(r))
    const first = songs[0] || {}
    return {
      album: {
        id: String(id),
        title: col.collectionName || first.album || 'Album',
        artist: col.artistName || first.artist || '',
        image: hiRes(col.artworkUrl100 || first.thumb, 600),
        year: (col.releaseDate || first.year || '').slice(0, 4),
        count: col.trackCount || songs.length,
      },
      songs,
    }
  })
}
