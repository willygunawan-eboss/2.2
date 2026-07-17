export class AssignmentNotFoundError extends Error {
  constructor(id: string) {
    super(`Assignment with id ${id} not found.`);
    this.name = "AssignmentNotFoundError";
  }
}

export class DuplicateActiveAssignmentError extends Error {
  constructor(employmentId: string) {
    super(`Active assignment already exists for employment ${employmentId}.`);
    this.name = "DuplicateActiveAssignmentError";
  }
}

export class InvalidAssignmentDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAssignmentDateError";
  }
}

export class InvalidAssignmentReferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAssignmentReferenceError";
  }
}
