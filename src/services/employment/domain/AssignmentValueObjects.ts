export class AssignmentStatus {
  private static readonly VALID_STATUSES = ["ACTIVE", "INACTIVE"];

  private constructor(public readonly value: string) {}

  public static create(value: string): AssignmentStatus {
    const upperValue = value.toUpperCase();
    if (!AssignmentStatus.VALID_STATUSES.includes(upperValue)) {
      throw new Error(`Invalid AssignmentStatus: ${value}`);
    }
    return new AssignmentStatus(upperValue);
  }
}
