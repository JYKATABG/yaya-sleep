import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import "../../styles/AuthForms.css";
import { useState } from "react";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 2 ? "Username must be at least 2 characters long" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values) => {
    const { username, email, password } = values;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      if (error.code === "user_already_exists") {
        toast.error("Email is already used. Try loging in");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success(
        "Register successfully! Please check your email for verification.",
      );
      form.reset();
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="auth-form">
      <Stack>
        <TextInput
          label="Username"
          placeholder="Your username..."
          {...form.getInputProps("username")}
        />
        <TextInput
          label="Email"
          placeholder="Your email..."
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password..."
          style={{
            border: "none",
          }}
          visibilityToggleIcon={({ revealed }) =>
            revealed ? <IconEyeOff size={22} /> : <IconEye size={22} />
          }
          {...form.getInputProps("password")}
        />
      </Stack>
      <Button type="submit" loading={loading}>
        Register
      </Button>
    </form>
  );
}
