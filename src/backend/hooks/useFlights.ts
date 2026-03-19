import { useEffect, useState } from "react"
import { type Aircraft, fetchAllStates } from "../api/flight"

const MAX_PLANES = 300

export function useFlights() {
  const [flights, setFlights] = useState<Aircraft[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllStates()
        setFlights(data.slice(0, MAX_PLANES))
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 15_000)
    return () => clearInterval(t)
  }, [])

  return { flights, loading, error }
}