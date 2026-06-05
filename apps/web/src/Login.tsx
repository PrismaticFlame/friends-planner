import { useState } from "react";
import { login, register } from "./api";

export function Login({ onAuthed }: { onAuthed: () => void }) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submit() {
        setError("");
        try {
            if (mode === "register") await register(email, displayName, password);
            await login(email, password);
            onAuthed();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    return (
        <div>
            <h2>{mode === "login" ? "Log in" : "Sign up"}</h2>
            <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            {mode === "register" && (
                <><input placeholder="display name" value={displayName}
                         onChange={(e) => setDisplayName(e.target.value)} /><br /></>
            )}
            <input type="password" placeholder="password" value={password}
                         onChange={(e) => setPassword(e.target.value)} /><br />
            <button onClick={submit}>{mode === "login" ? "Log in" : "Sign up"}</button>
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Need an account?" : "Have an account?"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}