export class JobFamily {
  private constructor(
    private readonly _id: string,
    private _code: string,
    private _name: string,
    private _description: string | null,
    private _isActive: boolean,
    private _isDeleted: boolean
  ) {}

  public static create(
    id: string,
    code: string,
    name: string,
    description: string | null,
    isActive: boolean = true,
    isDeleted: boolean = false
  ): JobFamily {
    return new JobFamily(id, code, name, description, isActive, isDeleted);
  }

  get id(): string { return this._id; }
  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get isActive(): boolean { return this._isActive; }
  get isDeleted(): boolean { return this._isDeleted; }

  public update(name: string, description: string | null, isActive: boolean): void {
    this._name = name;
    this._description = description;
    this._isActive = isActive;
  }

  public delete(): void {
    this._isDeleted = true;
    this._isActive = false;
  }
}
