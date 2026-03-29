import { Header } from "./components/Header";
import { HistoryLogs } from "./components/HistoryLogs";
import { SleepForm } from "./components/SleepForm";
import { Stats } from "./components/Stats";
import {
  AppShell,
  Container,
  Grid,
  Stack,
  useComputedColorScheme,
} from "@mantine/core";

function App() {
  return (
    <AppShell>
      <AppShell.Header header={{ height: 70 }} padding="sm" bg="#39c9bb">
        <Header />
      </AppShell.Header>
      <AppShell.Main style={{ marginTop: "6em", marginBottom: "1.5em" }}>
        <Container size="xl" fluid>
          <Stack gap="xl">
            <Grid gutter="lg" align="stretch" justify="center">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <div
                  style={{
                    backgroundColor: "dark.7",
                    padding: "20px",
                    borderRadius: "15px",
                    height: "100%",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <Stats />
                </div>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <div
                  style={{
                    backgroundColor: "dark.7",
                    padding: "20px",
                    borderRadius: "15px",
                    height: "100%",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <SleepForm />
                </div>
              </Grid.Col>
            </Grid>

            <div
              style={{
                backgroundColor: "dark.7",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              }}
            >
              <HistoryLogs />
            </div>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
