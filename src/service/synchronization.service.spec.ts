import { Test, TestingModule } from '@nestjs/testing';
import { SynchronizationService } from './synchronization.service';

describe('SynchronizationService', () => {
  let service: SynchronizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SynchronizationService],
    }).compile();

    service = module.get<SynchronizationService>(SynchronizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
