import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { email: 'test@cmu.edu', password: 'Test1234!', role: 'student', agreedToTerms: true };
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ id: '1', ...dto });
    const result = await service.create(dto as any);
    expect(result).toEqual({ id: '1', ...dto });
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(dto);
  });
}); 