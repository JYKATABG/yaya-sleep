import { Button, Divider, Stack, TextInput } from "@mantine/core";
import googleIcon from "../../assets/google-icon.png";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";

export default function SocialAuth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) toast.error(error.message);
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) toast.error(error.message);
    else toast.success("Magic link sent! Check your inbox. ✨");
    setLoading(false);
  };

  return (
    <Stack style={{marginTop: "20px"}}>
      <Divider label="or continue with" labelPosition="center" />

      <Button
        variant="default"
        leftSection={<img src={googleIcon} width={18} />}
        onClick={handleGoogleLogin}
        radius={"md"}
      >
        Continue with Google
      </Button>

      <Stack>
        <TextInput
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <Button
          variant="light"
          onClick={handleMagicLink}
          loading={loading}
          fullWidth
        >
          Send magic link
        </Button>
      </Stack>
    </Stack>
  );
}
