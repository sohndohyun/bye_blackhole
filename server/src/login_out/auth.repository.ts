import { EntityRepository, Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';

@EntityRepository(AuthEntity)
export class AuthRepository extends Repository<AuthEntity> {}
