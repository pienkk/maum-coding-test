import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from 'src/graphql';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockRepository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe('유저 생성', () => {
    it('존재하는 유저를 생성 요청할 경우 에러를 발생시킨다.', async () => {
      const userId = 1;
      const createUserInput: CreateUserInput = {
        name: '기석',
        email: 'kkk@gmail.com',
        password: 'Qwer1234!@',
      };

      const userInfo = UserEntity.of({
        id: userId,
        name: '기석',
        password: 'qwer1234!@',
        deleted_at: null,
      });

      const userRepositoryFineOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userInfo);

      const result = async () => {
        await userService.createUser(createUserInput);
      };

      await expect(result).rejects.toThrowError(
        new HttpException('User already exists', HttpStatus.CONFLICT),
      );
    });
  });
});
