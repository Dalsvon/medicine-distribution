import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';

export interface StoredEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
}

@Injectable()
export class EventStore {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
  ) {}

  async append(aggregateId: string, eventType: string, eventData: any): Promise<void> {
    const event = new EventEntity();
    event.eventId = this.generateId();
    event.aggregateId = aggregateId;
    event.eventType = eventType;
    event.eventData = eventData;
    event.timestamp = new Date();
    
    await this.repository.save(event);
  }

  async getEventsByAggregateId(aggregateId: string): Promise<StoredEvent[]> {
    const events = await this.repository.find({
      where: { aggregateId },
      order: { timestamp: 'ASC' },
    });
    return events;
  }

  async getAllEvents(): Promise<StoredEvent[]> {
    const events = await this.repository.find({
      order: { timestamp: 'ASC' },
    });
    return events;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}