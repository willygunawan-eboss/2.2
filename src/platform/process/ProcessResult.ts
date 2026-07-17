export class ProcessResult<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly data?: T,
    public readonly error?: string
  ) {}

  public static success<T>(data: T): ProcessResult<T> {
    return new ProcessResult<T>(true, data);
  }

  public static failure<T>(error: string): ProcessResult<T> {
    return new ProcessResult<T>(false, undefined, error);
  }
}
