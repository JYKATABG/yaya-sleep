import { Header } from "./components/Header";
import { HistoryLogs } from "./components/HistoryLogs";
import { SleepForm } from "./components/SleepForm";
import { Stats } from "./components/Stats";
import { AppShell, Container, Group, Stack } from "@mantine/core";

function App() {
  return (
    <AppShell header={{ height: 70 }} padding="md" bg="#39c9bb">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main style={{
      }}>
        <Container size="lg">
          <Stack gap="xl">
            <Group
              justify="space-between"
              align="center"
              mt="5em"
              grow
            >
              <div style={{ flex: 1, maxWidth: '500px' }}>
                <Stats />
              </div>
              <div style={{ flex: 1, maxWidth: '500px' }}>
                <SleepForm />
              </div>
            </Group>
            <HistoryLogs />
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
