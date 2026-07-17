import { Journal } from './Journal';
import { v4 as uuidv4 } from 'uuid';

export class AccountingFactory {
  public createJournal(code: string, name: string, description?: string): Journal {
    return new Journal({
      id: uuidv4(),
      code,
      name,
      description,
      isActive: true
    });
  }
}
