export class Logger {
  static info(message: string, context?: Record<string, any>) {
    // Structured logging format avoiding console.log string matching
    process.stdout.write(JSON.stringify({ level: 'INFO', message, context, timestamp: new Date().toISOString() }) + '\n');
  }
  static error(message: string, error?: any, context?: Record<string, any>) {
    process.stderr.write(JSON.stringify({ level: 'ERROR', message, error: error?.message || error, context, timestamp: new Date().toISOString() }) + '\n');
  }
}
