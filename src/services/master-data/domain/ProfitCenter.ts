export interface ProfitCenterProps {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export class ProfitCenter {
  constructor(private props: ProfitCenterProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get isActive(): boolean { return this.props.isActive; }
}
