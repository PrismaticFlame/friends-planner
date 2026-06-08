import { useState } from "react";
import { login, register } from "./api";
import logo from "./assets/hermes_logo_white.png"

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
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="glass w-full max-w-sm p-8">
                <img src={logo} alt="Hermes" className="mx-auto mb-6 h-42" />
                <h1 className="mb-1 text-center text-2xl">{mode === "login" ? "Welcome" : "Join Olympus"}</h1>
                <p className="mb-6 text-center text-sm text-white/50">
                    {mode === "login" ? "Return to Olympus" : "Let your godly presence be known"}
                </p>
                <div className="flex flex-col gap-3">
                    <input className="field" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {mode === "register" && (
                        <input className="field" placeholder="display name" value={displayName} 
                                onChange={(e) => setDisplayName(e.target.value)} />
                    )}
                    <input className="field" type="password" placeholder="password" value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submit()} />
                    <button className="btn mt-1" onClick={submit}>{mode === "login" ? "Log in" : "Sign up"}</button>
                </div>
                {error && <p className="mt-3 text-center text-sm text-red-300">{error}</p>}
                <button onClick={() => setMode(mode === "login" ? "register" : "login")}
                        className="mt-4 block w-full text-center text-xs text-white/50 transition hover:text-white">
                    {mode === "login" ? "Require access? Create your olympic presence" : "Have an account? Log in"}
                </button>
            </div>
        </div>
    );
}