export class PositionReadError extends Error {
  constructor(message: string = 'Cannot read position') {
    super(message);
    this.name = 'PositionReadError';
  }
}

export class VelocityReadError extends Error {
  constructor(message: string = 'Cannot read velocity') {
    super(message);
    this.name = 'VelocityReadError';
  }
}

export class PositionWriteError extends Error {
  constructor(message: string = 'Cannot write position') {
    super(message);
    this.name = 'PositionWriteError';
  }
}

export class AngleReadError extends Error {
  constructor(message: string = 'Cannot read angle') {
    super(message);
    this.name = 'AngleReadError';
  }
}

export class AngularVelocityReadError extends Error {
  constructor(message: string = 'Cannot read angular velocity') {
    super(message);
    this.name = 'AngularVelocityReadError';
  }
}

export class AngleWriteError extends Error {
  constructor(message: string = 'Cannot write angle') {
    super(message);
    this.name = 'AngleWriteError';
  }
}




