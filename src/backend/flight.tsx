import { MapMarker, MarkerContent } from "@/components/ui/map"
import { Plane, X, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { type Aircraft } from "./api/flight"

export { useFlights } from "./hooks/useFlights"
export type { Aircraft } from "./api/flight"

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200">{value}</span>
    </div>
  )
}

type MarkersProps = {
  flights: Aircraft[]
  selectedId: string | null
  onSelect: (f: Aircraft) => void
}

export function FlightMarkers({ flights, selectedId, onSelect }: MarkersProps) {
  return (
    <>
      {flights.map((f) => (
        <MapMarker key={f.id} longitude={f.longitude} latitude={f.latitude}>
          <MarkerContent>
            <button onClick={() => onSelect(f)} className="transition-transform hover:scale-110">
              <Plane
                size={12}
                style={{
                  transform: `rotate(${f.heading}deg)`,
                  color: selectedId === f.id ? "#ffffff" : "#9ca3af",
                }}
              />
            </button>
          </MarkerContent>
        </MapMarker>
      ))}
    </>
  )
}

export function AircraftPanel({ aircraft, onClose }: { aircraft: Aircraft; onClose: () => void }) {
  const vr = aircraft.verticalRate
  const VRIcon = vr > 100 ? ArrowUp : vr < -100 ? ArrowDown : Minus

  return (
    <div className="absolute top-4 right-4 z-30 w-64">
      <div className="bg-zinc-900/90 backdrop-blur-md rounded-xl p-4 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-sm font-medium">{aircraft.callsign}</div>
            <div className="text-xs text-zinc-500">{aircraft.country}</div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={14} />
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <Row label="Alt" value={`${aircraft.altitude.toLocaleString()} ft`} />
          <Row label="Spd" value={`${aircraft.velocity} kts`} />
          <Row label="Hdg" value={`${Math.round(aircraft.heading)}°`} />
          <Row label="V/S" value={
            <span className="flex items-center gap-1 text-zinc-400">
              <VRIcon size={10} />{Math.abs(vr)}
            </span>
          } />
          <Row label="Pos" value={`${aircraft.latitude.toFixed(2)}, ${aircraft.longitude.toFixed(2)}`} />
          <Row label="ID" value={<span className="font-mono">{aircraft.id}</span>} />
        </div>
      </div>
    </div>
  )
}