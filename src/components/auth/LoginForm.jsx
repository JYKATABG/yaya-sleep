import { supabase } from "../../supabaseClient";
import "../../styles/AuthForms.css";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import toast from "react-hot-toast";

export default function LoginForm() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) toast.error(error.message);
    else toast.success("Login successfully");
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="auth-form">
      <Stack>
        <TextInput
          label="Email"
          placeholder="test@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password..."
          {...form.getInputProps("password")}
        />
        <Button type="submit">Login</Button>
      </Stack>
    </form>
  );
}
