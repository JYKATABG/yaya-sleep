import { useSleep } from "../contexts/SleepContext";
import "../styles/Stats.css";

export const Stats = () => {
  const { avgHours, avgMinutes } = useSleep();
  return (
    <section className="stats-summary">
      <div className="stats-circle">
        <div className="stats-value">
          <span className="hours">{avgHours}h</span>
          <span className="minutes">{avgMinutes}m</span>
        </div>
        <h2 className="stats-label">Avg. sleep</h2>
      </div>
    </section>
  );
};
