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
    const create = useMutation({
        mutationFn: createItem,
        onMutate: async (newItem) => {
            await qc.cancelQueries({ queryKey: ["items"] });   // stop races
            const previous = qc.getQueryData<Item[]>(["items"]);  //snapshot for rollback
            const optimistic: Item = {
                id: `temp-${Date.now()}`,
                kind: newItem.kind as Item["kind"],
                title: newItem.title,
                description: newItem.description ?? null,
                status: null, start_at: null, end_at: null,
                meta: {}, created_by: "me",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            qc.setQueryData<Item[]>(["items"], (old = []) => [optimistic, ...old]);
            return { previous };
        },
        onError: (_err, _newItem, context) => {
            if (context?.previous) qc.setQueryData(["items"], context.previous);  //roll back
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["items"] }),    // resync
    });

    const remove = useMutation({
        mutationFn: deleteItem,
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ["items"] });
            const previous = qc.getQueryData<Item[]>(["items"]);
            qc.setQueryData<Item[]>(["items"], (old = []) => old.filter((i) => i.id !== id))
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) qc.setQueryData(["items"], context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ["items"] }),
    });

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