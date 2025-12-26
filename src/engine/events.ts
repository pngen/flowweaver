type EventHandler = (event: any) => void;

const eventSubscribers: Map<string, EventHandler[]> = new Map();

export function subscribeToRunEvents(runId: string, handler: EventHandler): () => void {
  if (!eventSubscribers.has(runId)) {
    eventSubscribers.set(runId, []);
  }

  const subscribers = eventSubscribers.get(runId)!;
  subscribers.push(handler);

  return () => {
    const index = subscribers.indexOf(handler);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
}

export function emitRunEvent(runId: string, event: any): void {
  const subscribers = eventSubscribers.get(runId);
  if (subscribers) {
    for (const handler of subscribers) {
      try {
        handler(event);
      } catch (err) {
        console.error('Error in event handler:', err);
      }
    }
  }
}