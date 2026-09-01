import { GetValidMovesUseCaseImpl } from "../domain/useCases/GetValidMovesUseCase.Impl";

export function createChessFeature() {
  return {
    getValidMovesUseCase: new GetValidMovesUseCaseImpl(),
  };
}