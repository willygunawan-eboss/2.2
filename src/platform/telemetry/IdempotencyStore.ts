export class IdempotencyStore {
  private store = new Map<string, any>();
  
  has(key: string): boolean {
    return this.store.has(key);
  }
  
  get(key: string): any {
    return this.store.get(key);
  }
  
  set(key: string, value: any): void {
    this.store.set(key, value);
    // In production, configure TTL
  }
}
