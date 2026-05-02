import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { supabase } from "../services/supabase";

let cache = { user: null, perfil: null, loading: true };
let callbacks = new Set();

const emit = () => callbacks.forEach(cb => cb(cache));

const fetchUser = async () => {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user || null;

  let perfil = null;

  if (user) {
    const { data } = await supabase
      .from("perfiles")
      .select("nombre, email, rol")
      .eq("id", user.id)
      .maybeSingle();

    perfil = data;
  }

  cache = { user, perfil, loading: false };
  emit();
};

let initialized = false;

export const useUser = () => {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const state = useSyncExternalStore(
    (cb) => {
      callbacks.add(cb);

      if (!initialized) {
        initialized = true;
        fetchUser();
      }

      return () => callbacks.delete(cb);
    },
    () => cache,
    () => cache
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    cache = { user: null, perfil: null, loading: false };
    emit();
  };

  return {
    user: state.user,
    perfil: state.perfil,
    loading: state.loading,
    signOut
  };
};