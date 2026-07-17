export interface CostCenterProps {
  id: string;
  code: string;
  name: string;
  departmentId?: string;
  isActive: boolean;
}

export class CostCenter {
  constructor(private props: CostCenterProps) {}

  get id(): string { return this.props.id; }
  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get departmentId(): string | undefined { return this.props.departmentId; }
  get isActive(): boolean { return this.props.isActive; }
}
