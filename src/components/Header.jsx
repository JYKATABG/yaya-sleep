import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";

export const Header = () => {
  const { session, signOut } = useAuth();
  const nickname =
    session?.user.user_metadata.full_name ||
    session?.user.user_metadata.name ||
    session?.user.email.split("@gmail.com")[0];

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <header className="app-header">
      <h1 className="welcome-msg">Hello, {nickname}</h1>
      {session && (
        <button className="logout-btn" onClick={signOut}>
          Logout
        </button>
      )}
      <p className="current-date">🗓️ {formattedDate}</p>
    </header>
  );
};
