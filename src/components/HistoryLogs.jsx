import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/HistoryLogs.css";
import { LogCard } from "./LogCard";

export const HistoryLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .order("date", { ascending: true });

      if (!error) setLogs(data);
      setLoading(false);
    }

    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <section className="history-section">
      <h2 className="section-title">Sleep log</h2>
      <ul className="history-list">
        {logs.length === 0 && <p className="empty-log">Your sleep logs are empty! Add your first!</p>}
        {logs.map((log) => (
          <LogCard key={log.id} log={log} />
        ))}
      </ul>
    </section>
  );
};
