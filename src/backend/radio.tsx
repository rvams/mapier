import { useEffect, useRef, useState } from "react"
import { Play, Pause, Loader2, X, GripVertical } from "lucide-react"
import { type RadioStation, registerClick } from "./api/radio"

export { useRadioStations } from "./hooks/useRadioStations"
export type { RadioStation }

export function RadioPlayer({ station, onClose }: { station: RadioStation | null; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  

  const [pos, setPos] = useState({ x: 20, y: 20 }) 
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (station) {
      setIsLoading(true)
      registerClick(station.id)
    }
  }, [station])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
    }

    const onMouseUp = () => {
      isDragging.current = false
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  if (!station) return null

  return (
    <div
      className="fixed z-50 touch-none select-none transition-shadow active:shadow-2xl"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="flex items-center gap-2 px-2 py-1.5 bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-xl text-white">
        
        <div 
          onMouseDown={handleMouseDown}
          className="cursor-grab active:cursor-grabbing p-1 text-white/20 hover:text-white/50 transition-colors"
        >
          <GripVertical size={16} />
        </div>

        <audio
          ref={audioRef}
          src={station.url}
          autoPlay
          onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />


        <div className="flex items-center gap-2 min-w-[100px] max-w-[160px]">
          {station.favicon && (
            <img src={station.favicon} className="w-5 h-5 rounded object-cover" alt="" 
                 onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
          <span className="text-[11px] font-medium truncate opacity-80">{station.name}</span>
        </div>

        <div className="flex items-center gap-1 ml-1 border-l border-white/5 pl-2">
          <button
            onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin text-white/40" /> : 
             isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}