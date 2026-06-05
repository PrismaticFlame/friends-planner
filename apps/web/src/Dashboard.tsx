import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listItems, createItem, deleteItem, clearToken, type Item } from "./api";
import { useRealtime } from "./useRealtime";

export function Dashboard({ onLogout }: { onLogout: () => void }) {
    const qc = useQueryClient();
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState("task");

    useRealtime();

    const { data: items = [], isLoading } = useQuery<Item[]>({
        queryKey: ["items"],
        queryFn: () => listItems(),
    });

    const invalidate = () => qc.invalidateQueries({ queryKey: ["items"] });
    const create = useMutation({ mutationFn: createItem, onSuccess: invalidate });
    const remove = useMutation({ mutationFn: deleteItem, onSuccess: invalidate });

    function add() {
        if (!title.trim()) return;
        create.mutate({ kind, title });
        setTitle("");
    }

    if (isLoading) return <p>Loading...</p>;

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
                        <button onClick={() => remove.mutate(item.id)}>x</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}