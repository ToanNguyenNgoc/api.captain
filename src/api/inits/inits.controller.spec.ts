import { Test, TestingModule } from '@nestjs/testing';
import { InitsController } from './inits.controller';
import { InitsService } from './inits.service';

describe('InitsController', () => {
  let controller: InitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitsController],
      providers: [InitsService],
    }).compile();

    controller = module.get<InitsController>(InitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
