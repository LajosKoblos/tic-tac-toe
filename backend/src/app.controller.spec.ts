import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldState } from './fieldState.enum';
import { RandomService } from './random.service';
import { UpdateGameDto } from './updateGameDto';

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

    it('should return unique game id when the newly generated one is already taken', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "32cb8958-51a1-462f-b705-66bedce73f5f")
        .mockImplementationOnce(() => "32cb8958-51a1-462f-b705-66bedce73f5f")
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      appService.createGame();

      expect(appController.createGame()).toBe("7bd817b8-797d-4a70-bb97-6c59bdb82c72");
    });
  });

  describe('getGame', () => {
    it('should return 404 when game does not exist', () => {
      expect.assertions(1);

      try {
        appController.getGame("32cb8958-51a1-462f-b705-66bedce73f5f")
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return state of a new game when game exists', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "32cb8958-51a1-462f-b705-66bedce73f5f")
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.O)
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();
      appService.createGame();

      expect(appController.getGame("32cb8958-51a1-462f-b705-66bedce73f5f")).toStrictEqual(
        [
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.getGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72")).toStrictEqual(
        [
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
    });
  });

  describe('updateGame', () => {
    it('should return 404 when game does not exist', () => {
      expect.assertions(1);

      try {
        appController.updateGame("32cb8958-51a1-462f-b705-66bedce73f5f", {field: 3, state: FieldState.X})
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return 400 when wrong player moves', () => {
      expect.assertions(1);
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();
      
      try {
        appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 3, state: FieldState.O})
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return 400 when field out of range', () => {
      expect.assertions(2);
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();
      
      try {
        appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: -1, state: FieldState.X})
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
      try {
        appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 9, state: FieldState.X})
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return 400 when field is played', () => {
      expect.assertions(2);
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();
      
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 0, state: FieldState.X})).toStrictEqual(
        [
          FieldState.X, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);

      try {
        appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 0, state: FieldState.O})
      } catch (error) {
        console.log(error);
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return new state of the game when game exists', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();

      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 2, state: FieldState.X})).toStrictEqual(
        [
          FieldState.Empty, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 3, state: FieldState.O})).toStrictEqual(
        [
          FieldState.Empty, FieldState.Empty, FieldState.X,
          FieldState.O, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
    });

    it('should return new state with winner when X wins horizontally', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();

      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 0, state: FieldState.X})).toStrictEqual(
        [
          FieldState.X, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 3, state: FieldState.O})).toStrictEqual(
        [
          FieldState.X, FieldState.Empty, FieldState.Empty,
          FieldState.O, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 1, state: FieldState.X})).toStrictEqual(
        [
          FieldState.X, FieldState.X, FieldState.Empty,
          FieldState.O, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 4, state: FieldState.O})).toStrictEqual(
        [
          FieldState.X, FieldState.X, FieldState.Empty,
          FieldState.O, FieldState.O, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 2, state: FieldState.X})).toStrictEqual(
        [
          FieldState.X, FieldState.X, FieldState.X,
          FieldState.O, FieldState.O, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.X
        ]);
    });

    it('should return new state with winner when O wins vertically', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.O);
      appService.createGame();

      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 1, state: FieldState.O})).toStrictEqual(
        [
          FieldState.Empty, FieldState.O, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 2, state: FieldState.X})).toStrictEqual(
        [
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 4, state: FieldState.O})).toStrictEqual(
        [
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 5, state: FieldState.X})).toStrictEqual(
        [
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 7, state: FieldState.O})).toStrictEqual(
        [
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.Empty,
          FieldState.X,
          FieldState.O
        ]);
    });

    it('should return new state with winner when O wins diagonally (left to right)', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.O);
      appService.createGame();

      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 0, state: FieldState.O})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 2, state: FieldState.X})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 4, state: FieldState.O})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 5, state: FieldState.X})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 8, state: FieldState.O})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.O, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.O,
          FieldState.X,
          FieldState.O
        ]);
    });

    it('should return new state with winner when X wins diagonally (right to left)', () => {
      jest.spyOn(randomService, 'getUUID')
        .mockImplementationOnce(() => "7bd817b8-797d-4a70-bb97-6c59bdb82c72");
      jest.spyOn(randomService, 'getPlayer')
        .mockImplementationOnce(() => FieldState.X);
      appService.createGame();

      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 2, state: FieldState.X})).toStrictEqual(
        [
          FieldState.Empty, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 0, state: FieldState.O})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 4, state: FieldState.X})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.Empty, FieldState.X, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 3, state: FieldState.O})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.O, FieldState.X, FieldState.Empty,
          FieldState.Empty, FieldState.Empty, FieldState.Empty,
          FieldState.X,
          FieldState.Empty
        ]);
      expect(appController.updateGame("7bd817b8-797d-4a70-bb97-6c59bdb82c72", {field: 6, state: FieldState.X})).toStrictEqual(
        [
          FieldState.O, FieldState.Empty, FieldState.X,
          FieldState.O, FieldState.X, FieldState.Empty,
          FieldState.X, FieldState.Empty, FieldState.Empty,
          FieldState.O,
          FieldState.X
        ]);
    });
  });
});
