import { BadRequestException } from '@nestjs/common';

export class NotExistException extends BadRequestException {
  constructor(error?: string) {
    super('Not exist exception', error);
  }
}
