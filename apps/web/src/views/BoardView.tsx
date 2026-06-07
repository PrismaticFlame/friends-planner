import { type Item } from "../api";
import { ItemCard } from "./ItemCard";

const COLUMNS: { kind: Item["kind"]; label: string; color: string }[] = [
    { kind: "task", label: "Tasks", color: "var(--color-cyan)" },
    { kind: "event", label: "Events", color: "var(--color-magenta)" },
    { kind: "outing", label: "Outings", color: "var(--color-gold)" },
];

export function BoardView({ items, onDelete }: { items: Item[]; onDelete: (id: string) => void }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {COLUMNS.map(({ kind, label, color }) => {
                const column = items.filter((i) => i.kind === kind);
                return (
                    <div key={kind} className="rounded-2x1 border border-white/10 bg-white/5 p-3">
                        <div className="mb-3 flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                                <h3 className="text-sm font-semibold text-white/90">{label}</h3>
                            </div>
                            <span className="text-xs text-white/40">{column.length}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {column.length === 0
                              ? <p className="px-1 py-4 text-center text-xs text-white/30">Empty</p>
                              : column.map((item) => (
                                  <ItemCard key={item.id} item={item} onDelete={onDelete} showKind={false} showTime />
                              ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}