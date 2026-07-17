import { CoordinatorResolver } from './CoordinatorResolver';
import { IProcessCoordinator } from './IProcessCoordinator';

export class CoordinatorFactory {
  constructor(private resolver: CoordinatorResolver) {}

  public create<TRequest, TResponse>(name: string): IProcessCoordinator<TRequest, TResponse> {
    return this.resolver.resolve<TRequest, TResponse>(name);
  }
}
