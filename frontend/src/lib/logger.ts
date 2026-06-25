type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private logs: LogEntry[] = [];

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    this.logs.push(entry);
    
    const prefix = `[LexStellar][${level.toUpperCase()}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, context || '');
        break;
      case 'warn':
        console.warn(prefix, message, context || '');
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(prefix, message, context || '');
        }
        break;
      default:
        console.log(prefix, message, context || '');
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  transaction(hash: string, status: string, details?: Record<string, unknown>) {
    this.log('info', `Transaction ${status}: ${hash}`, { ...details, hash, status });
  }

  contractEvent(eventType: string, contractId: string, details?: Record<string, unknown>) {
    this.log('info', `Contract Event [${eventType}]: ${contractId}`, { ...details, eventType, contractId });
  }

  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }
}

export const logger = new Logger();
