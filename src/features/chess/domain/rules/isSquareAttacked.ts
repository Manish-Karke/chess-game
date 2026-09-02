import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type IsSquareAttackedInput = {
    position: BoardPosition;
    byColor: ChessPiece["color"];
    pieces: ChessPiece[];
};

export function isSquareAttacked({
    position,
    byColor,
    pieces,
}: IsSquareAttackedInput): boolean {
    return pieces
        .filter((piece) => piece.color === byColor)
        .some((piece) =>
            doesPieceAttackSquare({
                piece,
                position,
                pieces,
            }),
        );
}

type DoesPieceAttackSquareInput = {
    piece: ChessPiece;
    position: BoardPosition;
    pieces: ChessPiece[];
};

function doesPieceAttackSquare({
    piece,
    position,
    pieces,
}: DoesPieceAttackSquareInput): boolean {
    const rowDifference = position.row - piece.row;
    const columnDifference = position.column - piece.column;

    const absoluteRowDifference = Math.abs(rowDifference);
    const absoluteColumnDifference = Math.abs(columnDifference);

    // Same square
    if (rowDifference === 0 && columnDifference === 0) {
        return false;
    }

    switch (piece.type) {
        case "pawn": {
            const direction = piece.color === "white" ? -1 : 1;

            return (
                rowDifference === direction && absoluteColumnDifference === 1
            );
        }

        case "knight": {
            return (
                (absoluteRowDifference === 2 &&
                    absoluteColumnDifference === 1) ||
                (absoluteRowDifference === 1 && absoluteColumnDifference === 2)
            );
        }

        case "king": {
            return absoluteRowDifference <= 1 && absoluteColumnDifference <= 1;
        }

        case "rook": {
            const isStraight = rowDifference === 0 || columnDifference === 0;

            if (!isStraight) {
                return false;
            }

            return isPathClear({
                from: {
                    row: piece.row,
                    column: piece.column,
                },
                to: position,
                pieces,
            });
        }

        case "bishop": {
            const isDiagonal =
                absoluteRowDifference === absoluteColumnDifference;

            if (!isDiagonal) {
                return false;
            }

            return isPathClear({
                from: {
                    row: piece.row,
                    column: piece.column,
                },
                to: position,
                pieces,
            });
        }

        case "queen": {
            const isStraight = rowDifference === 0 || columnDifference === 0;

            const isDiagonal =
                absoluteRowDifference === absoluteColumnDifference;

            if (!isStraight && !isDiagonal) {
                return false;
            }

            return isPathClear({
                from: {
                    row: piece.row,
                    column: piece.column,
                },
                to: position,
                pieces,
            });
        }

        default:
            return false;
    }
}

type IsPathClearInput = {
    from: BoardPosition;
    to: BoardPosition;
    pieces: ChessPiece[];
};

function isPathClear({ from, to, pieces }: IsPathClearInput): boolean {
    const rowDirection = Math.sign(to.row - from.row);

    const columnDirection = Math.sign(to.column - from.column);

    let row = from.row + rowDirection;
    let column = from.column + columnDirection;

    // Check only the squares BETWEEN start and target.
    while (row !== to.row || column !== to.column) {
        const blockingPiece = pieces.find(
            (piece) => piece.row === row && piece.column === column,
        );

        if (blockingPiece) {
            return false;
        }

        row += rowDirection;
        column += columnDirection;
    }

    return true;
}
