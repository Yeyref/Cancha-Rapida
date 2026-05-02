import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'

function SelectorFecha({ fecha, onChange }) {
  const hoy = new Date()

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-center">
      <style>{`
        .rdp {
          --rdp-accent-color: #4ade80;
          --rdp-background-color: rgba(74, 222, 128, 0.1);
          margin: 0;
          color: white;
        }
        .rdp-months { justify-content: center; }
        .rdp-day_selected { color: #111827 !important; font-weight: 700; }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background: rgba(255,255,255,0.08); color: white; }
        .rdp-head_cell { color: #6b7280; font-weight: 500; font-size: 13px; }
        .rdp-caption_label { color: white; font-weight: 600; }
        .rdp-nav_button { color: #9ca3af; }
        .rdp-day { color: #d1d5db; }
        .rdp-day_disabled { color: #374151 !important; opacity: 0.4; }
        .rdp-day_today:not(.rdp-day_selected) { color: #4ade80; font-weight: 700; border: 1px solid rgba(74,222,128,0.3); border-radius: 50%; }
      `}</style>
      <DayPicker
        mode="single"
        selected={fecha}
        onSelect={onChange}
        locale={es}
        disabled={{ before: hoy }}
        fromDate={hoy}
      />
    </div>
  )
}

export default SelectorFecha