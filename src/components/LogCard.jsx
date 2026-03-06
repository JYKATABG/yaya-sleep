import { calculateSleepDuration } from "./SleepForm";

export const LogCard = ({ log }) => {
  const { hours, minutes } = calculateSleepDuration(log.bedtime, log.wake_up);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  let badgeClass = "duration-badge";
  if (hours < 6) {
    badgeClass += " low-sleep";
  } else {
    badgeClass += " optimal-sleep";
  }

  return (
    <li className="history-item">
      <div className="history-info">
        <p className="history-day">Last sleep ({log.day_name})</p>
        <span className="history-range">
          {formatTime(log.bedtime)}ч. - {formatTime(log.wake_up)}ч.
        </span>
        {hours >= 8 && (
          <p className="congrats-msg">Great Job! 🌟 Fully charged!</p>
        )}
      </div>
      <div className="history-total">
        <span className={badgeClass}>
          {hours}h {minutes}m
        </span>
      </div>
    </li>
  );
};
