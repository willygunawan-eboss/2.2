import { CoordinatorRegistry } from './CoordinatorRegistry';
import { IProcessCoordinator } from './IProcessCoordinator';

export class CoordinatorResolver {
  constructor(private registry: CoordinatorRegistry) {}

  public resolve<TRequest, TResponse>(name: string): IProcessCoordinator<TRequest, TResponse> {
    const coordinator = this.registry.get(name);
    if (!coordinator) {
      throw new Error(`Coordinator not found: ${name}`);
    }
    return coordinator as IProcessCoordinator<TRequest, TResponse>;
  }
}
