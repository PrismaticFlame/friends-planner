import asyncio
import json
from collections.abc import AsyncGenerator

from fastapi import APIRouter, Depends
from sse_starlette.sse import EventSourceResponse

from .models import User
from .auth.router import get_current_user

class Broadcaster:
    def __init__(self) -> None:
        self._subscribers: set[asyncio.Queue[str]] = set()

    async def subscribe(self) -> AsyncGenerator[str, None]:
        queue: asyncio.Queue[str] = asyncio.Queue()
        self._subscribers.add(queue)
        try:
            while True:
                yield await queue.get()
        finally:
            self._subscribers.discard(queue)

    async def publish(self, event: dict) -> None:
        message = json.dumps(event)
        for queue in self._subscribers:
            queue.put_nowait(message)
    
broadcaster = Broadcaster()

router = APIRouter()

@router.get("/events")
async def events(user: User = Depends(get_current_user)):
    async def gen():
        async for message in broadcaster.subscribe():
            yield{"data": message}
    return EventSourceResponse(gen())