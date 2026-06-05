import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getToken } from "./api";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function useRealtime() {
    const qc = useQueryClient();
    useEffect(() => {
        const controller = new AbortController();
        fetchEventSource(`${BASE}/events`, {
            headers: { Authorization: `Bearer ${getToken()}` },
            signal: controller.signal,
            openWhenHidden: true,
            onmessage() {
                qc.invalidateQueries({ queryKey: ["items"] });
            },
            onerror(err) {
                console.error("SSE error", err);
            },
        });
        return () => controller.abort();
    }, [qc]);
}