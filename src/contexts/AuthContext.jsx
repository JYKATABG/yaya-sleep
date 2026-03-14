import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { router } from "../main";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleVerifyOtp = async () => {
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get("token_hash");
      const type = params.get("type") || "email";

      if (token_hash) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (error) {
          toast.error("Invalid or expired link. ❌");
        } else {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      }
    };

    handleVerifyOtp();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);

      if (_event === "SIGNED_IN") {
        router.navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!session) toast.error("Your session is expired");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("User successfully signed out! 👋");
      router.navigate("/auth");
    } catch (error) {
      console.error("Signout error: ", error);
      toast.error("Could not sign out. Try again!");
    }
  };

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
