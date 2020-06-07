import { Test, TestingModule } from '@nestjs/testing';
import { SynchronizationController } from './synchronization.controller';

describe('Synchronization Controller', () => {
  let controller: SynchronizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SynchronizationController],
    }).compile();

    controller = module.get<SynchronizationController>(
      SynchronizationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
