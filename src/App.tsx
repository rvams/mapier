import { Map, MapControls, useMap } from "@/components/ui/map"
import { useEffect, useState } from "react"

function Loader() {
  const { isLoaded } = useMap()
  const [step, setStep] = useState(0)
  const steps = ["ESTABLISHING CONNECTION", "LOADING TILE DATA", "CALIBRATING VIEWPORT", "SYSTEM READY"]

  useEffect(() => {
    if (isLoaded) return
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 600)
    return () => clearInterval(t)
  }, [isLoaded])

  if (isLoaded) return null

  return (
    <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-6"
      style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="relative">
        <div className="w-16 h-16 border border-cyan-500/30 rounded-full animate-spin" />
        <div className="absolute inset-2 border border-cyan-400/60 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] tracking-widest"
            style={{ color: i === step ? "#22d3ee" : "#164e63" }}>
            <span>{i < step ? "✓" : i === step ? "›" : " "}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HUD() {
  const { map, isLoaded } = useMap()
  const [coords, setCoords] = useState({ lng: -74.006, lat: 40.7128, zoom: 11 })

  useEffect(() => {
    if (!map || !isLoaded) return
    const update = () => setCoords({
      lng: parseFloat(map.getCenter().lng.toFixed(4)),
      lat: parseFloat(map.getCenter().lat.toFixed(4)),
      zoom: parseFloat(map.getZoom().toFixed(1)),
    })
    map.on("move", update)
    return () => { map.off("move", update) }
  }, [isLoaded])

  if (!isLoaded) return null

  return <>
    <div className="absolute inset-0 pointer-events-none z-10"
      style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
    <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)" }} />
    {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"],
      ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]
    ].map(([pos, border], i) => (
      <div key={i} className={`absolute ${pos} w-6 h-6 ${border} border-cyan-500/50 pointer-events-none z-20`} />
    ))}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      style={{ fontFamily: "'Courier New', monospace" }}>
      <div className="bg-black/60 border border-cyan-900/60 backdrop-blur-sm px-4 py-1.5 rounded text-[10px] text-cyan-600 tracking-widest flex gap-4">
        <span>LAT <span className="text-cyan-400">{coords.lat}</span></span>
        <span className="text-cyan-900">|</span>
        <span>LNG <span className="text-cyan-400">{coords.lng}</span></span>
        <span className="text-cyan-900">|</span>
        <span>Z <span className="text-cyan-400">{coords.zoom}</span></span>
      </div>
    </div>
  </>
}

export function App() {
  // ✅ Service worker registered here, not inside Loader
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/tile-worker.js")
      .then((reg) => console.log("[tile-cache] Registered", reg.scope))
      .catch(console.error)
  }, [])

  return (
    <div className="w-screen h-screen relative bg-black">
      <Map
        center={[-74.006, 40.7128]}
        zoom={11}
        theme="dark"
        fadeDuration={0}
        maxTileCacheSize={500}
        renderWorldCopies={false}
        styles={{ dark:"https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json" }}
      >
        <MapControls showZoom showCompass />
        <Loader />
        <HUD />
      </Map>
    </div>
  )
}

export default App