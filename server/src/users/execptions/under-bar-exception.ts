import { BadRequestException } from '@nestjs/common';

export class UnderBarException extends BadRequestException {
  constructor(error?: string) {
    super('Under-Bar used exception', error);
  }
}
