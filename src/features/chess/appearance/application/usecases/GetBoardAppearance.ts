
import type { BoardAppearanceRepository } from "../../domain/repositories/BoardAppearanceRepository";

export class GetBoardAppearance {
  constructor(private readonly repository: BoardAppearanceRepository) {}

  execute() {
    return this.repository.get();
  }
}
