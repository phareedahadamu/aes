export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 401,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class Logger {
  private static isDev = process.env.NODE_ENV !== "production";

  static log(message: string, ...args: unknown[]) {
    if (this.isDev) {
      console.log(`[LOG]: ${message}`, ...args);
    }
  }

  static info(message: string, ...args: unknown[]) {
    if (this.isDev) {
      console.info(`[INFO]: ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: unknown[]) {
    // Warnings often useful in prod to catch non-breaking issues
    console.warn(`[WARN]: ${message}`, ...args);
  }

  static error(message: string, error?: unknown) {
    // Errors should always be logged in production for debugging
    console.error(`[ERROR]: ${message}`, error);
  }
}
