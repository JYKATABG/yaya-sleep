import { calculateSleepDuration } from "./SleepForm";

const CONGRATS_MESSAGES = [
  "Great job! 🌟 Fully charged!",
  "Sleep queen! ✨ You nailed it!",
  "Energy levels: 100% 🔋",
  "Glow up in progress... Done! 💅",
  "You're a sleeping pro! 🏆",
  "Fresh and ready to conquer! 🔥",
];

const MOTIVATIONAL_MESSAGES = [
  "Small steps lead to big changes! 👣",
  "Every hour of rest counts! 🔋",
  "Consistency is the key to success! 🔑",
  "Loading energy for a great day... ⏳",
  "You're building a great habit! 🌱",
  "Keep going, you're doing great! ✨",
];

export const LogCard = ({ log }) => {
  const { hours, minutes } = calculateSleepDuration(log.bedtime, log.wake_up);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  const getPersistentMessage = (id, messagesArr) => {
    if (!id) return messagesArr[0];
    const idStr = String(id);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      const char = idStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash | 0;
    }
    const index = Math.abs(hash) % messagesArr.length;

    return messagesArr[index];
  };

  const isOptimal = hours >= 8;
  const activeMessage = isOptimal
    ? getPersistentMessage(log?.id, CONGRATS_MESSAGES)
    : getPersistentMessage(log?.id, MOTIVATIONAL_MESSAGES);

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
        <p className={isOptimal ? "congrats-msg" : "motivation-msg"}>{activeMessage}</p>
      </div>
      <div className="history-total">
        <span className={badgeClass}>
          {hours}h {minutes}m
        </span>
      </div>
    </li>
  );
};
