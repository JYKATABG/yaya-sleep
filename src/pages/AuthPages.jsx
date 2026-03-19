import RegisterForm from "../components/auth/RegisterForm";
import LoginForm from "../components/auth/LoginForm";
import SocialAuth from "../components/auth/SocialAuth";
import { Paper, Tabs } from "@mantine/core";

export default function AuthPages() {
  return (
    <div className="login-page">
      <Paper
        withBorder
        p={50}
        radius={"md"}
        style={{
          maxWidth: 500,
          width: "100%",
          margin: "auto",
        }}
      >
        <Tabs defaultValue={"login"} color="#39c9bb">
          <Tabs.List>
            <Tabs.Tab value="login" flex={1}>Login</Tabs.Tab>
            <Tabs.Tab value="register" flex={1}>Register</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="login" pt={"xl"}>
            <LoginForm />
          </Tabs.Panel>
          <Tabs.Panel value="register" pt={"xl"}>
            <RegisterForm />
          </Tabs.Panel>
        </Tabs>
        <SocialAuth />
      </Paper>
    </div>
  );
}
