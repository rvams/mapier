import { Map, MapControls, useMap } from "@/components/ui/map"

function Loader() {
  const { isLoaded } = useMap()

  if (isLoaded) return null

  return (
    <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-blue-400 text-xs tracking-widest uppercase animate-pulse">
        Initializing map...
      </span>
    </div>
  )
}

export function App() {
  return (
    <div className="w-screen h-screen relative">
      <Map center={[-74.006, 40.7128]} zoom={11} theme="dark">
        <MapControls showZoom showCompass />
        <Loader />
      </Map>
    </div>
  )
}

export default App