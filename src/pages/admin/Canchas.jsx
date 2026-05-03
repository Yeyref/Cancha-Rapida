import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../services/supabase";
import { useUser } from "../../hooks/useUser";
import ModalCancha from "../../components/ModalCancha";

export default function Canchas() {
  const { perfil, loading: userLoading } = useUser();
  const [canchas, setCanchas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const cargarDatos = useCallback(async () => {
    if (userLoading || !perfil) return;
    
    setLoading(true);
    try {
      // 1. Definir consultas base
      let querySedes = supabase.from("sedes").select("id, nombre");
      let queryCanchas = supabase.from("canchas").select("*, sedes(nombre)");

      // 2. Aplicar filtros solo si existen (si no, carga todo para el SuperAdmin)
      if (perfil.organizacion_id) {
        querySedes = querySedes.eq("organizacion_id", perfil.organizacion_id);
        // Filtramos canchas que pertenezcan a sedes de esa organización
        const { data: sedesIds } = await supabase
          .from("sedes")
          .select("id")
          .eq("organizacion_id", perfil.organizacion_id);
        
        const ids = sedesIds?.map(s => s.id) || [];
        queryCanchas = queryCanchas.in("sede_id", ids);
      }

      const [resSedes, resCanchas] = await Promise.all([querySedes, queryCanchas]);

      if (resSedes.error) throw resSedes.error;
      if (resCanchas.error) throw resCanchas.error;

      setSedes(resSedes.data || []);
      setCanchas(resCanchas.data || []);
    } catch (error) {
      console.error("Error cargando datos de canchas:", error.message);
    } finally {
      setLoading(false);
    }
  }, [perfil, userLoading]);

  useEffect(() => {
   if (!userLoading && perfil) {
    cargarDatos();
  }
  // USAMOS IDs PRIMITIVOS en las dependencias para evitar el bucle de objetos
}, [userLoading, perfil?.id, perfil?.organizacion_id]);

  if (loading && userLoading) {
    return <div className="p-10 text-white">Cargando panel...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Canchas</h1>
          <p className="text-gray-400 text-sm">Gestiona los espacios deportivos</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-green-400 hover:bg-green-500 text-black px-4 py-2 rounded-lg font-bold transition-colors"
        >
          + Nueva Cancha
        </button>
      </div>

      {canchas.length === 0 && !loading ? (
        <div className="bg-white/5 border border-dashed border-white/10 p-10 rounded-2xl text-center">
          <p className="text-gray-500">No se encontraron canchas registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {canchas.map(cancha => (
            <div key={cancha.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-all">
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full uppercase font-bold">
                  {cancha.deporte}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg">{cancha.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4">{cancha.sedes?.nombre || 'Sin sede asignada'}</p>
              <div className="flex justify-between items-end">
                <span className="text-xl font-mono text-white">${cancha.precio}<small className="text-gray-500 text-xs">/hr</small></span>
                <button className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalCancha 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={cargarDatos} 
        sedes={sedes}
      />
    </div>
  );
}