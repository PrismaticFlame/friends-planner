import { useEffect, useState } from "react";
import { listItems, createItem, deleteItem, clearToken, type Item } from "./api";

export function Dashboard({ onLogout }: { onLogout: () => void }) {
    const [items, setItems] = useState<Item[]>([]);
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState("task");

    const refresh = async () => setItems(await listItems());
    useEffect(() => { refresh(); }, []);

    async function add() {
        if (!title.trim()) return;
        await createItem({ kind, title });
        setTitle("");
        refresh();
    }

    return (
        <div>
            <button onClick={() => { clearToken(); onLogout(); }}>Log out</button>
            <h2>Dashboard</h2>
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="task">Task</option>
                <option value="event">Event</option>
                <option value="outing">Outing</option>
            </select>
            <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button onClick={add}>Add</button>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        [{item.kind}] {item.title}
                        <button onClick={async () => { await deleteItem(item.id); refresh(); }}>x</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}