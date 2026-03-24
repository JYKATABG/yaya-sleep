import { useAuth } from "../contexts/AuthContext";
import { Group, Container } from "@mantine/core";
import "../styles/Header.css";
import { useDisclosure } from "@mantine/hooks";
import { UserGreeting } from "./layouts/Header/UserGreeting";
import { UserMenu } from "./layouts/Header/UserMenu";
import { UserProfileDrawer } from "./layouts/Header/UserProfileDrawer";

export const Header = () => {
  const { session, signOut, user } = useAuth();

  const [opened, { open, close }] = useDisclosure(false);
  const nickname =
    user?.user_metadata.full_name ||
    user?.user_metadata.name ||
    user?.email.split("@gmail.com")[0];

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <Container fluid h={70} px="md" w="95%">
      <Group justify="space-between" h="100%">
        <UserGreeting nickname={nickname} formattedDate={formattedDate} />

        {session && (
          <>
            <UserMenu
              userAvatarUrl={user?.user_metadata.avatar_url}
              nickname={nickname?.charAt(0).toUpperCase()}
              onOpenProfile={open}
              onSignOut={signOut}
            />
            <UserProfileDrawer opened={opened} onClose={close} />
          </>
        )}
      </Group>
    </Container>
  );
};
