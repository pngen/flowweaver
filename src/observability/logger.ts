export function log(message: string, level = 'info', meta?: any) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level,
    message,
    ...meta
  };

  console.log(JSON.stringify(entry));
}