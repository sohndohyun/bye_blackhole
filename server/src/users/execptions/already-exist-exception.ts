import { BadRequestException } from '@nestjs/common';

export class AlreadyExistException extends BadRequestException {
  constructor(error?: string) {
    super('Already exist exception', error);
  }
}
