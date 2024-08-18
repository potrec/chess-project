import type { FenNotationType } from '../../types/chessTypes';
import { FigureType} from '../../enums/figure'

export const pieceTypeFromSymbol: FenNotationType[] = [
  { figure: FigureType.ClearBoard, string: '' },
  { figure: FigureType.King, string: 'k' },
  { figure: FigureType.Knight, string: 'n' },
  { figure: FigureType.Pawn, string: 'p' },
  { figure: FigureType.Bishop, string: 'b' },
  { figure: FigureType.Rook, string: 'r' },
  { figure: FigureType.Queen, string: 'q' }
]

/** 
 * directionIndex: 
 * 0 - up
 * 1 - down
 * 2 - left
 * 3 - right
 * 4 - left up
 * 6 - right up
 * 5 - right down
 * 7 - left down
*/ 
export const directionOffsets: number[] = [8, -8, -1, 1, 7, -7, 9, -9]