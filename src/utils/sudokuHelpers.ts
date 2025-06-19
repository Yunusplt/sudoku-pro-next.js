import { sudokuBlocks } from "@/data/sudokuData";
import { SudokuBlocksType } from "@/types/sudokuTypes";

//* Identify the IDs of cells with a value of 0 (empty cells)
export const getEmptySquares = (currentSudoku: number[][]): string[] => {
  const emptySquareIDs: string[] = [];
  currentSudoku.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) {
        emptySquareIDs.push(`${rowIndex}-${colIndex}`);
      }
    });
  });
  return emptySquareIDs;
};

//* Focus the input square element with the given id
export const focusSquareById = async (id: string) => {
  const square = document.getElementById(id) as HTMLInputElement | null;
  if (!square) return;
  square.focus();
  //* Set a timeout to be sure to focus on the UI properly
  await new Promise((res) => setTimeout(res, 200));
};

export const getAllSquaresToCompare = (
  row: number,
  col: number,
  id: string
) => {
  const rowSquares = Array.from({ length: 9 }, (_, i) => `${row}-${i}`); //* get the all square IDs in the row of the selected square
  const colSquares = Array.from({ length: 9 }, (_, i) => `${i}-${col}`); //* get the all square IDs in the col of the selected square
  const selectedBlock = findBlock(id);
  const blockSquares = sudokuBlocks[selectedBlock!]; //* get the all square IDs in the block of the selected square

  return [...rowSquares, ...colSquares, ...blockSquares];
};

//* Find which block the selected square belongs to
const findBlock = (selectedSquareID: string): keyof SudokuBlocksType | null => {
  for (const block in sudokuBlocks) {
    if (
      sudokuBlocks[block as keyof SudokuBlocksType].includes(selectedSquareID)
    ) {
      return block as keyof SudokuBlocksType;
    }
  }
  return null;
};

//* Find all possible numbers for the selected square.
export const getPossibleNumbers = (
  allSquaresToCompare: string[] | null,
  sudokuValues: number[][]
): number[] => {
  if (!allSquaresToCompare) return [];

  const valuesToCompare = getValues(allSquaresToCompare, sudokuValues);
  const uniqueValues = Array.from(new Set(valuesToCompare));
  const sudokuDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const impossibleNumbers = uniqueValues.filter((item) => item !== 0);
  const possibleNumbers = sudokuDigits.filter(
    (item) => !impossibleNumbers.includes(item)
  );

  return possibleNumbers;
};

//* Take the values from the given squares' IDs
const getValues = (squares: string[], sudokuValues: number[][]): number[] => {
  return squares.map((id) => {
    const [r, c] = id.split("-").map(Number);
    return sudokuValues[r][c];
  });
};
