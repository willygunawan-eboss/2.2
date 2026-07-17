import { ProcessContext } from './ProcessContext';
import { ProcessResult } from './ProcessResult';

export interface IProcessCoordinator<TRequest, TResponse> {
  execute(request: TRequest, context: ProcessContext): Promise<ProcessResult<TResponse>>;
}
