import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { router } from "../main";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [dailySleepGoal, setDailySleepGoal] = useState(8);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, daily_goal")
        .eq("id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const newProfile = {
          id: userId,
          full_name:
            user?.user_metadata?.full_name || user?.email?.split("@")[0],
          avatar_url: user?.user_metadata?.avatar_url || "",
          daily_goal: 8.0,
        };

        const { error: insertError } = await supabase
          .from("profiles")
          .insert(newProfile);

        if (!insertError) {
          setUsername(newProfile.full_name);
          setAvatarUrl(newProfile.avatar_url);
          setDailySleepGoal(newProfile.daily_goal);
        }
        return;
      }

      if (error) throw error;

      if (data) {
        setUsername(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
        setDailySleepGoal(data.daily_goal || 8);
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUsername("");
        setAvatarUrl("");
        setDailySleepGoal(8);
      }
      setLoading(false);

      if (_event === "SIGNED_IN") router.navigate("/");
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

  const updateProfile = async (updates) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      await supabase.auth.updateUser({ data: updates });

      if (updates.full_name !== undefined) setUsername(updates.full_name);
      if (updates.avatar_url !== undefined) setAvatarUrl(updates.full_name);
      if (updates.daily_goal !== undefined)
        setDailySleepGoal(updates.daily_goal);

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
        username,
        avatarUrl,
        dailySleepGoal,
        signOut,
        updateProfile,
        updateAvatar,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
