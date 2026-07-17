export class EmploymentNotFoundError extends Error {
  constructor(id: string) {
    super(`Employment with id ${id} not found.`);
    this.name = "EmploymentNotFoundError";
  }
}

export class InvalidEmployeeNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEmployeeNumberError";
  }
}

export class InvalidOrganizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOrganizationError";
  }
}
