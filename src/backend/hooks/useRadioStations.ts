import { useEffect, useState } from "react"
import { type RadioStation, getTopStations } from "../api/radio"

export function useRadioStations(limit = 200) {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopStations(limit).then(setStations).finally(() => setLoading(false))
  }, [limit])

  return {
    stations,
    loading,
    mappable: stations.filter((s) => s.latitude != null && s.longitude != null),
  }
}