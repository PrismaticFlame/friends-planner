import { type Item } from "../api";
import { ItemCard } from "./ItemCard";

export function ListView({ items, onDelete }: { items: Item[]; onDelete: (id: string) => void}) {
    if (items.length === 0)
        return <p className="py-10 text-center text-white/40">Nothing planned yet - add something!</p>
    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => <ItemCard key={item.id} item={item} onDelete={onDelete} showTime />)}
        </div>
    );
}