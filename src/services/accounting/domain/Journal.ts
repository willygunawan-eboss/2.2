export interface JournalProps {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export class Journal {
  constructor(private props: JournalProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get isActive(): boolean { return this.props.isActive; }
}
