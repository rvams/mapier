export type RadioStation = {
  id: string
  name: string
  url: string
  countrycode: string
  codec: string
  bitrate: number
  favicon: string
  latitude: number | null
  longitude: number | null
}

let cachedServer: string | null = null

export async function getServer(): Promise<string> {
  if (cachedServer) return cachedServer
  try {
    const res = await fetch("https://all.api.radio-browser.info/json/servers")
    const servers: { name: string }[] = await res.json()
    cachedServer = `https://${servers[Math.floor(Math.random() * servers.length)].name}`
  } catch {
    cachedServer = "https://de1.api.radio-browser.info"
  }
  return cachedServer
}

export async function registerClick(id: string) {
  const base = await getServer()
  fetch(`${base}/json/url/${id}`, { headers: { "User-Agent": "mapier/1.0" } }).catch(() => {})
}

export async function getTopStations(limit = 1000): Promise<RadioStation[]> {
  const base = await getServer()
  const res = await fetch(
    `${base}/json/stations/search?limit=${limit}&hidebroken=true&order=votes&reverse=true&has_geo_info=true`,
    { headers: { "User-Agent": "mapier/1.0" } }
  )
  const data = await res.json()
  return data.map((s: any) => ({
    id: s.stationuuid,
    name: s.name,
    url: s.url_resolved || s.url,
    countrycode: s.countrycode,
    codec: s.codec,
    bitrate: s.bitrate,
    favicon: s.favicon,
    latitude: s.geo_lat ? parseFloat(s.geo_lat) : null,
    longitude: s.geo_long ? parseFloat(s.geo_long) : null,
  }))
}