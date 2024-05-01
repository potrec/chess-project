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
 * 0 - górny
 * 1 - dolny
 * 2 - lewy
 * 3 - prawy
 * 4 - lewy górny
 * 6 - prawy górny
 * 5 - prawy dolny
 * 7 - lewy dolny
*/ 
export const directionOffsets: number[] = [8, -8, -1, 1, 7, -7, 9, -9]