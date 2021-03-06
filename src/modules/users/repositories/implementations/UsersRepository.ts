import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        id: user_id
      },
      relations: ['games']
    });

    if (!user) {
      throw new Error('User does not exists');
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.find({
      order: {
        first_name: 'ASC'
      }
    })
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository
      .createQueryBuilder("user")
      .where("LOWER(user.first_name) = LOWER(:first_name)", { first_name })
      .andWhere("LOWER(user.last_name) = LOWER(:last_name)", { last_name })
      .getMany()
  }
}
