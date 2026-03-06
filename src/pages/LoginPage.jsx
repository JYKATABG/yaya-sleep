import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import logo from "../assets/google-icon.png"
import "../styles/LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get("token_hash");
        if (token_hash) handleVerifyOtp(token_hash);
    }, []);

    const handleVerifyOtp = async (token_hash) => {
        setVerifying(true);
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: "email" });
        if (error) setMessage({ type: "error", text: error.message });
        setVerifying(false);
    };

    // --- Google Auth ---
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) setMessage({ type: "error", text: error.message });
    };

    // --- Magic Link ---
    const handleMagicLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin },
        });

        if (error) setMessage({ type: "error", text: error.message });
        else setMessage({ type: "success", text: "Magic link sent! Check your inbox. ✨" });
        setLoading(false);
    };

    if (verifying) return <div className="auth-loading">Verifying link...</div>;

    return (
        <div className="login-page">
            <div className="login-container">
                <header className="login-header">
                    <h1>Welcome</h1>
                    <p>Track your sleep and glow up ✨</p>
                </header>

                {/* Google Login Button */}
                <button className="google-btn" onClick={handleGoogleLogin}>
                    <img src={logo} alt="Google" />
                    Continue with Google
                </button>

                <div className="divider">
                    <span>or use email</span>
                </div>

                {/* Magic Link Form */}
                <form className="login-form" onSubmit={handleMagicLink}>
                    <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send Magic Link"}
                    </button>
                </form>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}