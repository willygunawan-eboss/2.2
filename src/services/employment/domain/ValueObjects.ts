export class EmployeeNumber {
  private constructor(public readonly value: string) {}

  public static create(value: string): EmployeeNumber {
    if (!value || value.trim().length === 0) {
      throw new Error("EmployeeNumber cannot be empty");
    }
    return new EmployeeNumber(value.trim());
  }
}

export class FullName {
  private constructor(public readonly value: string) {}

  public static create(value: string): FullName {
    if (!value || value.trim().length === 0) {
      throw new Error("FullName cannot be empty");
    }
    return new FullName(value.trim());
  }
}

export class EmploymentType {
  private static readonly VALID_TYPES = ["PERMANENT", "CONTRACT", "PROBATION", "INTERNSHIP"];

  private constructor(public readonly value: string) {}

  public static create(value: string): EmploymentType {
    const upperValue = value.toUpperCase();
    if (!EmploymentType.VALID_TYPES.includes(upperValue)) {
      throw new Error(`Invalid EmploymentType: ${value}. Valid types are: ${EmploymentType.VALID_TYPES.join(', ')}`);
    }
    return new EmploymentType(upperValue);
  }
}

export class EmploymentStatus {
  private static readonly VALID_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED"];

  private constructor(public readonly value: string) {}

  public static create(value: string): EmploymentStatus {
    const upperValue = value.toUpperCase();
    if (!EmploymentStatus.VALID_STATUSES.includes(upperValue)) {
      throw new Error(`Invalid EmploymentStatus: ${value}. Valid statuses are: ${EmploymentStatus.VALID_STATUSES.join(', ')}`);
    }
    return new EmploymentStatus(upperValue);
  }
}

export class PlatformStatus {
  private constructor(public readonly isActive: boolean, public readonly isDeleted: boolean) {}

  public static create(isActive: boolean, isDeleted: boolean = false): PlatformStatus {
    return new PlatformStatus(isActive, isDeleted);
  }
}
