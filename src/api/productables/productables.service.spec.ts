import { Test, TestingModule } from '@nestjs/testing';
import { ProductablesService } from './productables.service';

describe('ProductablesService', () => {
  let service: ProductablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductablesService],
    }).compile();

    service = module.get<ProductablesService>(ProductablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
