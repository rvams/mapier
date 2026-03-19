export type Aircraft = {
  id: string
  callsign: string
  country: string
  longitude: number
  latitude: number
  altitude: number
  velocity: number
  heading: number
  verticalRate: number
  onGround: boolean
  squawk: string | null
  category: number | null
}

export function parseStates(states: any[]): Aircraft[] {
  return states
    .filter((s) => s[5] != null && s[6] != null && !s[8])
    .map((s) => ({
      id: s[0],
      callsign: s[1]?.trim() || "Unknown",
      country: s[2] || "—",
      longitude: s[5],
      latitude: s[6],
      altitude: s[7] ? Math.round(s[7] * 3.281) : 0,       // m → ft
      velocity: s[9] ? Math.round(s[9] * 1.944) : 0,        // m/s → knots
      heading: s[10] ?? 0,
      verticalRate: s[11] ? Math.round(s[11] * 196.85) : 0, // m/s → ft/min
      onGround: s[8],
      squawk: s[14] || null,
      category: s[17] ?? null,
    }))
}

const CATEGORY_LABELS: Record<number, string> = {
  2: "Light", 3: "Small", 4: "Large", 5: "Heavy (757)",
  6: "Heavy", 7: "High Performance", 8: "Rotorcraft",
  9: "Glider", 10: "Lighter-than-air", 14: "UAV",
}

export function categoryLabel(cat: number | null) {
  if (!cat) return "—"
  return CATEGORY_LABELS[cat] ?? "—"
}

export async function fetchAllStates(): Promise<Aircraft[]> {
  const res = await fetch("https://opensky-network.org/api/states/all")
  if (!res.ok) throw new Error(`OpenSky ${res.status}`)
  const data = await res.json()
  return data.states ? parseStates(data.states) : []
}