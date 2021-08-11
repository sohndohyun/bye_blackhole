import { BadRequestException } from '@nestjs/common';

export class SafeException extends BadRequestException {
  constructor(error?: string) {
    super('Safe exception', error);
  }
}
