import { FigureType, MoveType } from "@/enums/figure";
import type { Figure } from "@/types/chessTypes";

export function saveChessHistory(history:any, figure: Figure, moveType: MoveType)
{
    let move = getPieceData(figure) + getSquareData(moveType);
}

export function parseHistoryToJSON(history)
{
}

export function getPieceData(figure: Figure): string
{
    switch(figure.type)
    {
        case FigureType.Knight: return "N";
        case FigureType.Queen: return "Q";
        case FigureType.Rook: return "R";
        case FigureType.Bishop: return "B";
        case FigureType.King: return "K";
        case FigureType.Pawn: return "";
        default: return "";
    }
}

export function getSquareData(moveType: MoveType): string
{
    switch(moveType)
    {
        case MoveType.Move: return "";
        case MoveType.Attack: return "x";
        case MoveType.Castling: return "";
        case MoveType.Promotion: return "";
        default: return "";
    }
}