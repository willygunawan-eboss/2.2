export class PositionNotFoundError extends Error {
  constructor(id: string) {
    super(`Position with id ${id} not found.`);
    this.name = "PositionNotFoundError";
  }
}

export class DuplicatePositionCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicatePositionCodeError";
  }
}

export class DuplicatePositionNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicatePositionNameError";
  }
}

export class InvalidCompanyReferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCompanyReferenceError";
  }
}

export class PositionInUseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PositionInUseError";
  }
}
