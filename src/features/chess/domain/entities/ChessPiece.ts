export type ChessPieceType =
  | 'king'
  | 'queen'
  | 'rook'
  | 'bishop'
  | 'knight'
  | 'pawn';

export type ChessPieceColor = 'white' | 'black';

export type ChessPiece = {
  id: string;
  type: ChessPieceType;
  color: ChessPieceColor;
  row: number;
  column: number;
};