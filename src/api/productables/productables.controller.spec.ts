import { Test, TestingModule } from '@nestjs/testing';
import { ProductablesController } from './productables.controller';
import { ProductablesService } from './productables.service';

describe('ProductablesController', () => {
  let controller: ProductablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductablesController],
      providers: [ProductablesService],
    }).compile();

    controller = module.get<ProductablesController>(ProductablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
