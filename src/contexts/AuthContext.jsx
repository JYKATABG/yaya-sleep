import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { router } from "../main";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

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

  useEffect(() => {
    if (session?.user) {
      setUsername(session?.user?.user_metadata?.full_name || "anonymous");
    }
  }, [session?.user]);

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

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      if (updates.full_name !== undefined) setUsername(updates.full_name);

      return true;
    } catch (error) {
      console.error("Error updating profile: ", error.message);
      return false;
    }
  };

  const updateAvatar = async (file, userId) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Грешка при качване:", error.message);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signOut,
        username,
        setUsername,
        updateProfile,
        updateAvatar
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
