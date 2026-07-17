export class PositionCode {
  private constructor(public readonly value: string) {}

  public static create(value: string): PositionCode {
    if (!value || value.trim().length === 0) {
      throw new Error("PositionCode cannot be empty");
    }
    return new PositionCode(value.trim().toUpperCase());
  }
}

export class PositionName {
  private constructor(public readonly value: string) {}

  public static create(value: string): PositionName {
    if (!value || value.trim().length === 0) {
      throw new Error("PositionName cannot be empty");
    }
    return new PositionName(value.trim());
  }
}

export class PositionStatus {
  private static readonly VALID_STATUSES = ["ACTIVE", "INACTIVE"];

  private constructor(public readonly value: string) {}

  public static create(value: string): PositionStatus {
    const upperValue = value.toUpperCase();
    if (!PositionStatus.VALID_STATUSES.includes(upperValue)) {
      throw new Error(`Invalid PositionStatus: ${value}. Valid statuses are: ${PositionStatus.VALID_STATUSES.join(', ')}`);
    }
    return new PositionStatus(upperValue);
  }
}

export class PlatformStatus {
  private constructor(public readonly isActive: boolean, public readonly isDeleted: boolean) {}

  public static create(isActive: boolean, isDeleted: boolean = false): PlatformStatus {
    return new PlatformStatus(isActive, isDeleted);
  }
}
