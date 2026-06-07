import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type Item } from "../api";

const KIND_HEX: Record<Item["kind"], string> = {
    task: "#46c8ff", event: "#e0408a", outing: "#f5b942",
};

export function CalendarView({ items, onDelete }: { items: Item[]; onDelete: (id: string) => void }) {
    const events = items
      .filter((i) => i.start_at)
      .map((i) => ({
        id: i.id,
        title: i.title,
        start: i.start_at!,
        end: i.end_at ?? undefined,
        backgroundColor: KIND_HEX[i.kind],
        borderColor: KIND_HEX[i.kind],
      }));

    return (
        <div className="hermes-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
                events={events}
                height="auto"
                eventClick={(info) => {
                    if (window.confirm(`Delete "${info.event.title}"?`)) onDelete(info.event.id);
                }}
            />
        </div>
    );
}