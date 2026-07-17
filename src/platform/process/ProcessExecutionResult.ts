import { ProcessResult } from './ProcessResult';

export class ProcessExecutionResult<T> {
  constructor(
    public readonly processName: string,
    public readonly result: ProcessResult<T>,
    public readonly durationMs: number,
    public readonly executedAt: Date = new Date()
  ) {}
}
