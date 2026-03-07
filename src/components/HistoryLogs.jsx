import "../styles/HistoryLogs.css";
import { LogCard } from "./LogCard";
import { useSleep } from "../contexts/SleepContext";

export const HistoryLogs = () => {
  const { logs, loading } = useSleep();

  if (loading) return <p>Loading logs...</p>;

  return (
    <section className="history-section">
      <h2 className="section-title">Sleep log</h2>
      <ul className="history-list">
        {logs.length === 0 && (
          <p className="empty-log">
            Your sleep logs are empty! Add your first!
          </p>
        )}
        {logs.map((log) => (
          <LogCard key={log.id} log={log} />
        ))}
      </ul>
    </section>
  );
};
