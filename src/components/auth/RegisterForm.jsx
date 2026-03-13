import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

export default function RegisterForm() {
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        username: username,
      },
    });

    if (error) toast.error(error.message);
    else toast.success("Register successfully");
  };

  return (
    <form>
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
          visibilityToggleButtonProps={{
            title: "Hidde/Show password",
            icon: (revealed) => (revealed ? <IconEyeOff /> : <IconEye />),
          }}
          {...form.getInputProps("password")}
        />
      </Stack>
      <Button type="submit">Register</Button>
    </form>
  );
}
