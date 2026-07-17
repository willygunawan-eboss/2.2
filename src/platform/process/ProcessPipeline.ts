import { IProcessCoordinator } from './IProcessCoordinator';
import { ProcessContext } from './ProcessContext';
import { ProcessResult } from './ProcessResult';
import { ProcessExecutionResult } from './ProcessExecutionResult';

export class ProcessPipeline {
  public async run<TRequest, TResponse>(
    coordinator: IProcessCoordinator<TRequest, TResponse>,
    request: TRequest,
    context: ProcessContext
  ): Promise<ProcessExecutionResult<TResponse>> {
    const startTime = Date.now();
    try {
      const result = await coordinator.execute(request, context);
      const durationMs = Date.now() - startTime;
      return new ProcessExecutionResult(coordinator.constructor.name, result, durationMs);
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      const failureResult = ProcessResult.failure<TResponse>(error.message || 'Unknown error occurred in pipeline');
      return new ProcessExecutionResult(coordinator.constructor.name, failureResult, durationMs);
    }
  }
}
