import { InvalidOrganizationCodeError } from "./OrganizationErrors.js";

export class OrganizationCode {
  private constructor(public readonly value: string) {}

  public static create(value: string): OrganizationCode {
    if (!value || value.trim().length === 0) {
      throw new InvalidOrganizationCodeError(value);
    }
    // Example rule: only uppercase letters, numbers, and hyphens/underscores
    if (!/^[a-zA-Z0-9\-_]+$/.test(value)) {
      throw new InvalidOrganizationCodeError(value);
    }
    return new OrganizationCode(value);
  }
}

export class OrganizationName {
  private constructor(public readonly value: string) {}

  public static create(value: string): OrganizationName {
    if (!value || value.trim().length === 0) {
      throw new Error("Organization name cannot be empty");
    }
    return new OrganizationName(value.trim());
  }
}

export enum OrganizationTypeEnum {
  COMPANY = "COMPANY",
  BRANCH = "BRANCH",
  BUSINESS_UNIT = "BUSINESS_UNIT",
  DIVISION = "DIVISION",
  DEPARTMENT = "DEPARTMENT",
  SECTION = "SECTION",
  TEAM = "TEAM",
}

export class OrganizationType {
  private constructor(public readonly value: OrganizationTypeEnum) {}

  public static create(value: string): OrganizationType {
    if (!(value in OrganizationTypeEnum)) {
      throw new Error(`Invalid organization type: ${value}`);
    }
    return new OrganizationType(value as OrganizationTypeEnum);
  }
}

export class HierarchyLevel {
  private constructor(public readonly value: number) {}

  public static create(value: number): HierarchyLevel {
    if (value < 0) {
      throw new Error("Hierarchy level must be non-negative");
    }
    return new HierarchyLevel(value);
  }
}

export class OrganizationStatus {
  private constructor(
    public readonly isActive: boolean,
    public readonly isDeleted: boolean
  ) {}

  public static create(isActive: boolean, isDeleted: boolean): OrganizationStatus {
    return new OrganizationStatus(isActive, isDeleted);
  }
}
