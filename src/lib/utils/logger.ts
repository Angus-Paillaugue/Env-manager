import fs from 'fs';
import { dirname } from 'node:path';

const LOG_FILE_PATH = 'uploads/logs/log.log';
const loggerLevels = ['error', 'warn', 'debug'] as const;

function normalizeMessage(...args: unknown[]) {
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

function appendToFille(message: string, level: (typeof loggerLevels)[number]) {
  // Check if the file exists
  if (!fs.existsSync(LOG_FILE_PATH)) {
    // Create directory if it does not exist
    if (!fs.existsSync(dirname(LOG_FILE_PATH))) {
      fs.mkdirSync(dirname(LOG_FILE_PATH), { recursive: true });
    }
    fs.writeFileSync(LOG_FILE_PATH, '');
  }
  const timeStamp = new Date().toISOString();
  const levelString = '[' + level.toUpperCase() + ']';
  const logMessage = `${timeStamp} ${levelString} ${message}\n`;
  fs.appendFileSync(LOG_FILE_PATH, logMessage);
}

const loggerFactory = () => {
  return Object.fromEntries(
    loggerLevels.map((l) => {
      return [
        l,
        (...args: unknown[]) => {
          const message = normalizeMessage(...args);
          appendToFille(message, l);
          console[l](message);
        }
      ];
    })
  );
};

export const Logger = loggerFactory();
