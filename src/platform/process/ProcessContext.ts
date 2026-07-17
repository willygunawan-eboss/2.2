export class ProcessContext {
  constructor(
    public readonly correlationId: string,
    public readonly userId: string,
    public readonly timestamp: Date = new Date(),
    public readonly metadata: Record<string, any> = {}
  ) {}
}
