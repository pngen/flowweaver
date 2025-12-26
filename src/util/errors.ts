export class FlowweaverError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'FlowweaverError';
  }
}

export class ValidationError extends FlowweaverError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}