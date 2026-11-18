import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../auth/auth.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  const projectsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'CloudOps' }]),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: projectsServiceMock }],
    })
      // Le guard JWT est testé à part (auth.guard.spec.ts)
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /projects renvoie la liste des projets', async () => {
    await expect(controller.findAll()).resolves.toEqual([
      { id: 1, name: 'CloudOps' },
    ]);
  });
});