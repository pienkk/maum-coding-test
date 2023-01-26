import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { Repository } from 'typeorm';
import { CreateUpdateUserDto, SignInUserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: MockRepository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe('createUser', () => {
    const createUserInput: CreateUpdateUserDto = {
      name: '기석',
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
    };

    const createUser = UserEntity.of({
      name: '기석',
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
    });

    const userInfo = UserEntity.of({
      id: 1,
      name: '기석',
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
      deleted_at: null,
    });

    it('유저 생성에 성공 시 유저 정보를 반환한다.', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(undefined);
      const userRepositoryCreateSpy = jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(createUser);
      const userRepositorySaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(userInfo);

      const result = await userService.createUser(createUserInput);

      expect(result).toEqual(userInfo);
    });

    it('존재하는 유저를 생성 요청 시 유저가 존재하다는 예외를 던진다.', async () => {
      const userRepositoryFindOneSpy = jest
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

  describe('updateUser', () => {
    const updateUserInput: CreateUpdateUserDto = {
      name: '기석',
      email: 'kkk333@gmail.com',
      password: 'QQwer1234!@',
    };
    const userInfo = UserEntity.of({
      id: 1,
      name: '기석',
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
      deleted_at: null,
    });
    const savedUser = UserEntity.of({ ...userInfo, ...updateUserInput });

    it('유저 정보 업데이트 성공 시 유저 정보를 반환한다.', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userInfo);
      const userRepositoryCreateSpy = jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(savedUser);
      const userRepositorySaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(savedUser);

      const result = await userService.updateUser(updateUserInput);

      expect(result).toEqual(savedUser);
    });

    it('존재하지 않는 유저 업데이트 요청 시 유저가 존재하지 않다는 예외를 던진다.', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        await userService.updateUser(updateUserInput);
      };

      await expect(result).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('removeUser', () => {
    const jwtPayload: JwtPayload = {
      id: 1,
      email: 'kkk@gmail.com',
    };
    const userInfo = UserEntity.of({
      id: 1,
      name: '기석',
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
      deleted_at: null,
    });
    const deletedUser = UserEntity.of({
      ...userInfo,
      deleted_at: new Date(),
    });

    it('비밀번호가 일치하지 않을 시 비밀번호가 올바르지 않다는 예외를 던진다', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userInfo);
      const userEntityComparePasswordSpy = jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation((password, hashPassword) => false);

      const result = async () => {
        await userService.removeUser(jwtPayload, 'Qwer123!@');
      };

      await expect(result).rejects.toThrowError(
        new HttpException('Invalid password', HttpStatus.BAD_REQUEST),
      );
    });

    it('유저 삭제 성공 시 true 값을 반환한다.', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userInfo);
      const userEntityComparePasswordSpy = jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation((password, hashPassword) => true);
      const userRepositorySaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(deletedUser);

      const result = await userService.removeUser(jwtPayload, 'Qwer1234!@');

      expect(result).toBe(true);
    });

    it('존재하지 않는 유저 삭제 요청 시 유저가 존재하지 않다는 예외를 던진다', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        await userService.removeUser(jwtPayload, 'Qwer1234!@');
      };

      await expect(result).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('signIn', () => {
    const loginDto: SignInUserDto = {
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
    };
    const userInfo = UserEntity.of({
      id: 1,
      name: '기석',
      email: 'kkk@gmail.com',
      password: 'Qwer1234!@',
      deleted_at: null,
    });
    const jwtPayload: JwtPayload = {
      id: 1,
      email: 'kkk@gmail.com',
    };

    it('올바른 이메일과 비밀번호를 입력 시 JWT토큰을 발급한다.', async () => {
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(userInfo);
      const userEntityComparePasswordSpy = jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation((password, hashPassword) => true);
      const jwtServiceSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation((jwtPayload) => 'accessToken');

      const result = await userService.signIn(loginDto);

      expect(result).toEqual({ accessToken: 'accessToken' });
    });
  });
});
