export interface UnitOfMeasureProps {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export class UnitOfMeasure {
  constructor(private props: UnitOfMeasureProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get isActive(): boolean { return this.props.isActive; }
}
