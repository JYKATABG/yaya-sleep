import { Header } from "./components/Header";
import { HistoryLogs } from "./components/HistoryLogs";
import { SleepForm } from "./components/SleepForm";
import { Stats } from "./components/Stats";
import { AppShell, Container, Group, Stack } from "@mantine/core";

function App() {
  return (
    <AppShell header={{ height: 70 }} padding="sm" bg="#39c9bb">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" fluid>
          <Stack gap="xl">
            <Group
              justify="space-evenly"
              align="flex-start"
              wrap="nowrap"
              gap="md"
            >
              <div style={{ flex: 1, }}>
                <Stats />
              </div>
              <div style={{ flex: 1 }}>
                <SleepForm />
              </div>
            </Group>
            <HistoryLogs />
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell >
  );
}

export default App;
