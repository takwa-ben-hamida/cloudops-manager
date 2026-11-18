import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { AuthGuard } from '../auth/auth.guard';

describe('TeamsController', () => {
  let controller: TeamsController;

  const teamsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Backend' }]),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [{ provide: TeamsService, useValue: teamsServiceMock }],
    })
      // Le guard JWT est testé à part (auth.guard.spec.ts)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /teams renvoie la liste des équipes', async () => {
    await expect(controller.findAll()).resolves.toEqual([
      { id: 1, name: 'Backend' },
    ]);
  });
});