import { Logger } from './Logger';

export class Metrics {
  static record(metricName: string, value: number, tags?: Record<string, string>) {
    Logger.info(`Metric: ${metricName}`, { metric: true, value, tags });
  }
  
  static startTimer(metricName: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.record(metricName, duration, { unit: 'ms' });
    };
  }
}
