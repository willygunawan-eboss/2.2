import { v4 as uuidv4 } from 'uuid';

export class Tracer {
  static generateTraceId(): string {
    return uuidv4();
  }
}
