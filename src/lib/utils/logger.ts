import fs from 'fs';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

export class Logger {
  static readonly LOG_FILE_PATH = 'uploads/logs/log.log';

  static normalizeMessage(...args: unknown[]) {
    const message = [];
    for (const arg of args) {
      if (arg instanceof Error) {
        message.push(arg.message);
      } else if (typeof arg === 'object') {
        message.push(JSON.stringify(arg, null, 2));
      } else {
        message.push(arg);
      }
    }
    return message.join(' ');
  }

  static appendToFille(message: string, level: LogLevel) {
    // Check if the file exists
    if (!fs.existsSync(Logger.LOG_FILE_PATH)) {
      // Create directory if it does not exist
      if (!fs.existsSync('uploads/logs')) {
        fs.mkdirSync('uploads/logs', { recursive: true });
      }
      fs.writeFileSync(Logger.LOG_FILE_PATH, '');
    }
    const timeStamp = new Date().toISOString();
    const levelString = '[' + level.toUpperCase() + ']';
    const logMessage = `${timeStamp} ${levelString} ${message}\n`;
    fs.appendFileSync(Logger.LOG_FILE_PATH, logMessage);
  }

  static log(...args: unknown[]) {
    const message = Logger.normalizeMessage(...args);
    console.log(message);
    Logger.appendToFille(message, 'info');
  }

  static error(...args: unknown[]) {
    const message = Logger.normalizeMessage(...args);
    console.error(message);
    Logger.appendToFille(message, 'error');
  }

  static warn(...args: unknown[]) {
    const message = Logger.normalizeMessage(...args);
    console.warn(message);
    Logger.appendToFille(message, 'warn');
  }

  static debug(...args: unknown[]) {
    const message = Logger.normalizeMessage(...args);
    console.debug(message);
  }
}
