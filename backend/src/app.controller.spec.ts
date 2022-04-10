import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldState } from './fieldState.enum';
import { RandomService } from './random.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let randomService: RandomService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, RandomService],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AppService);
    randomService = app.get(RandomService);
  });

  describe('createGame', () => {
    it('should return game id', () => {
      jest.spyOn(randomService, 'getUUID').mockImplementationOnce(() => "32cb8958-51a1-462f-b705-66bedce73f5f");

      expect(appController.createGame()).toBe("32cb8958-51a1-462f-b705-66bedce73f5f");
    });

    it('should return unique game id when generated UUID is already taken', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "32cb8958-51a1-462f-b705-66bedce73f5f")
        .mockImplementationOnce(() => "32cb8958-51a1-462f-b705-66bedce73f5f")
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      appService.createGame();

      expect(appController.createGame()).toBe("7bd817b8-797d-4a70-bb97-6c59bdb82c72");
    });
  });

  describe('getGame', () => {
    it('should return game state of a new game', () => {
      jest.spyOn(randomService, 'getPlayer').mockImplementationOnce(() => FieldState.X);

      expect(appController.getGame("32cb8958-51a1-462f-b705-66bedce73f5f")).toStrictEqual(
        [
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X
        ]);
    });
  });
});
