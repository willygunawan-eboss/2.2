export class Job {
  private constructor(
    private readonly _id: string,
    private _code: string,
    private _name: string,
    private _jobFamilyId: string,
    private _jobGradeId: string,
    private _description: string | null,
    private _isActive: boolean,
    private _isDeleted: boolean
  ) {}

  public static create(
    id: string,
    code: string,
    name: string,
    jobFamilyId: string,
    jobGradeId: string,
    description: string | null,
    isActive: boolean = true,
    isDeleted: boolean = false
  ): Job {
    return new Job(id, code, name, jobFamilyId, jobGradeId, description, isActive, isDeleted);
  }

  get id(): string { return this._id; }
  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get jobFamilyId(): string { return this._jobFamilyId; }
  get jobGradeId(): string { return this._jobGradeId; }
  get description(): string | null { return this._description; }
  get isActive(): boolean { return this._isActive; }
  get isDeleted(): boolean { return this._isDeleted; }

  public update(name: string, jobFamilyId: string, jobGradeId: string, description: string | null, isActive: boolean): void {
    this._name = name;
    this._jobFamilyId = jobFamilyId;
    this._jobGradeId = jobGradeId;
    this._description = description;
    this._isActive = isActive;
  }

  public delete(): void {
    this._isDeleted = true;
    this._isActive = false;
  }
}
