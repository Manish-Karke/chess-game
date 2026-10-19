
import type { BoardAppearance } from "../../domain/entities/BoardAppearance";
import type { BoardAppearanceRepository } from "../../domain/repositories/BoardAppearanceRepository";

export class SaveBoardAppearance {
  constructor(private readonly repository: BoardAppearanceRepository) {}

  execute(appearance: BoardAppearance) {
    return this.repository.save(appearance);
  }
}
