import { Injectable } from '@nestjs/common';

export interface StoredEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
}

@Injectable()
export class EventStore {
  private events: StoredEvent[] = [];

  append(aggregateId: string, eventType: string, eventData: any): void {
    const event: StoredEvent = {
      eventId: this.generateId(),
      aggregateId,
      eventType,
      eventData,
      timestamp: new Date(),
    };
    this.events.push(event);
  }

  getEventsByAggregateId(aggregateId: string): StoredEvent[] {
    return this.events.filter((event) => event.aggregateId === aggregateId);
  }

  getAllEvents(): StoredEvent[] {
    return [...this.events];
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
