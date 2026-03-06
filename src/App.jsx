import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { HistoryLogs } from "./components/HistoryLogs";
import { SleepForm } from "./components/SleepForm";
import { Stats } from "./components/Stats";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className="container">
      <Header />
      <Stats />
      <SleepForm onSave={() => setRefreshKey((prev) => prev + 1)} />
      <HistoryLogs key={refreshKey} />
    </div>
  );
}

export default App;
