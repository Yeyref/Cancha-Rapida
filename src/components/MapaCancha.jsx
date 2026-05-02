import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const iconoVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function MapaCancha({ cancha }) {
  const abrirEnGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${cancha.lat},${cancha.lng}`, '_blank')
  }

  return (
    // position relative + z-index 0 evita que Leaflet se superponga al navbar sticky
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: '220px', position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={[cancha.lat, cancha.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[cancha.lat, cancha.lng]} icon={iconoVerde}>
          <Popup>
            <div style={{ fontFamily: 'Outfit, sans-serif', minWidth: '160px' }}>
              <p style={{ fontWeight: '700', marginBottom: '4px' }}>{cancha.nombre}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{cancha.direccion}</p>
              <button
                onClick={abrirEnGoogleMaps}
                style={{
                  background: '#4ade80', color: '#111827', border: 'none',
                  borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
                  fontWeight: '600', cursor: 'pointer', width: '100%',
                }}
              >
                Abrir en Google Maps
              </button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default MapaCancha