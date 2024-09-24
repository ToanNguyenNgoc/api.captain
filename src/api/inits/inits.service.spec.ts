import { Test, TestingModule } from '@nestjs/testing';
import { InitsService } from './inits.service';

describe('InitsService', () => {
  let service: InitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitsService],
    }).compile();

    service = module.get<InitsService>(InitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
