import type { BoardAppearance } from "../entities/BoardAppearance";

export interface BoardAppearanceRepository {
  get(): Promise<BoardAppearance>;
  save(appearance: BoardAppearance): Promise<void>;
}