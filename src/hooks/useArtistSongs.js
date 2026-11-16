import { useEffect, useState } from 'react'
import { getArtistSongs } from '../lib/music.js'

// Loads songs for a list of artists. Results are cached, so revisits are instant.
export function useArtistSongs(artists) {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({})
  const signature = artists.map((a) => a.key).join('|')

  useEffect(() => {
    let alive = true
    setData({})
    setErrors({})
    artists.forEach((artist) => {
      getArtistSongs(artist)
        .then((songs) => {
          if (alive) setData((prev) => ({ ...prev, [artist.key]: songs }))
        })
        .catch((err) => {
          if (alive) setErrors((prev) => ({ ...prev, [artist.key]: err.message }))
        })
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  const loaded = artists.filter((a) => data[a.key]).length
  return {
    data,
    errors,
    loaded,
    total: artists.length,
    loading: loaded + Object.keys(errors).length < artists.length,
  }
}
