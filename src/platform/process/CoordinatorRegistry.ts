import { IProcessCoordinator } from './IProcessCoordinator';

export class CoordinatorRegistry {
  private coordinators: Map<string, IProcessCoordinator<any, any>> = new Map();

  public register(name: string, coordinator: IProcessCoordinator<any, any>): void {
    this.coordinators.set(name, coordinator);
  }

  public get(name: string): IProcessCoordinator<any, any> | undefined {
    return this.coordinators.get(name);
  }
}
