import { useState } from 'react'
import { getToken } from "./api";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";

export default function App() {
  const [authed, setAuthed] = useState(!!getToken());
  return (
    <>
      <div className="aurora">
        <div className="blob gold" />
        <div className="blob magenta" />
        <div className="blob cyan" />
      </div>
      <div className="grain" />
      {authed
        ? <Dashboard onLogout={() => setAuthed(false)} />
        : <Login onAuthed={() => setAuthed(true)} />}
    </>
  );
}
