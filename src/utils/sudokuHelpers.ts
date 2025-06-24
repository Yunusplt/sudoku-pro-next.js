import { sudokuBlocks } from "@/data/sudokuData";
import { SudokuBlocksType } from "@/types/sudokuTypes";

//* Identify the IDs of squares with a value of 0 (empty squares)
export const getEmptySquares = (currentSudoku: number[][]): string[] => {
  const emptySquareIDs: string[] = [];
  currentSudoku.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      if (square === 0) {
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

//* Get all square IDs that need to be compared with the selected square
export const getAllSquaresIdToCompare = (id: string) => {
  const [row, col] = id.split("-").map(Number);

  const rowSquares = Array.from({ length: 9 }, (_, i) => `${row}-${i}`); //* get the all square IDs in the row of the selected square
  const colSquares = Array.from({ length: 9 }, (_, i) => `${i}-${col}`); //* get the all square IDs in the col of the selected square
  const selectedBlock = findBlock(id);
  const blockSquares = sudokuBlocks[selectedBlock!]; //* get the all square IDs in the block of the selected square

  return [...rowSquares, ...colSquares, ...blockSquares];
};

//* Find which block the selected square belongs to
export const findBlock = (
  selectedSquareID: string
): keyof SudokuBlocksType | null => {
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
export const getValues = (
  squares: string[],
  sudokuValues: number[][]
): number[] => {
  return squares.map((id) => {
    const [r, c] = id.split("-").map(Number);
    return sudokuValues[r][c];
  });
};

//! For UI
export const getSquareProps = ({
  rowIndex,
  colIndex,
  sudokuValues,
  squaresToCompare,
}: {
  rowIndex: number;
  colIndex: number;
  sudokuValues: number[][];
  squaresToCompare?: string[] | null;
}) => {
  const squareID = `${rowIndex}-${colIndex}`;
  const isSelected = squaresToCompare?.includes(squareID);

  const value =
    sudokuValues[rowIndex][colIndex] === 0
      ? ""
      : sudokuValues[rowIndex][colIndex];

  return { isSelected, squareID, value };
};

//! the below functions are used for elimination process (für middle und schwer sudokus)

//* Get the values of the squares in the closest row and column of the selected square
const getRowValues = (row: number, sudokuValues: number[][]): number[] => {
  return getValues(
    Array.from({ length: 9 }, (_, col) => `${row}-${col}`),
    sudokuValues
  );
};

const getColValues = (col: number, sudokuValues: number[][]): number[] => {
  return getValues(
    Array.from({ length: 9 }, (_, row) => `${row}-${col}`),
    sudokuValues
  );
};

export const findNumbersToEliminate = (
  col: number,
  row: number,
  sudokuValues: number[][]
): {
  hasValueClosestSquaresInCol: boolean;
  hasValueClosestSquaresInRow: boolean;
  numbersInFirstRow: number[];
  numbersInSecondRow: number[];
  numbersInFirstCol: number[];
  numbersInSecondCol: number[];
} => {
  // Calculate the square ID in the block based on the row and column
  // Each block is a 3x3 grid, so we can determine the position within the block
  // by taking the modulo of the row and column indices with respect to 3.
  // For example, if row = 4 and col = 5, then:
  // colInBlock = 5 % 3 = 2
  // rowInBlock = 4 % 3 = 1
  // Thus, squareIdInBlock = "1-2"
  const colInBlock = col % 3;
  const rowInBlock = row % 3;
  const squareIdInBlock = `${rowInBlock}-${colInBlock}`;

  //* Initialize arrays to hold the closest square IDs and numbers in rows and columns
  let closestSquareIdsInCol: string[] = [];
  let closestSquareIdsInRow: string[] = [];
  let numbersInFirstRow: number[] = [];
  let numbersInSecondRow: number[] = [];
  let numbersInFirstCol: number[] = [];
  let numbersInSecondCol: number[] = [];

  switch (squareIdInBlock) {
    case "0-0":
      closestSquareIdsInCol = [`${row + 1}-${col}`, `${row + 2}-${col}`];
      closestSquareIdsInRow = [`${row}-${col + 1}`, `${row}-${col + 2}`];

      numbersInFirstRow = getRowValues(row + 1, sudokuValues);
      numbersInSecondRow = getRowValues(row + 2, sudokuValues);
      numbersInFirstCol = getColValues(col + 1, sudokuValues);
      numbersInSecondCol = getColValues(col + 2, sudokuValues);

      break;

    case "0-1":
      closestSquareIdsInCol = [`${row + 1}-${col}`, `${row + 2}-${col}`];
      closestSquareIdsInRow = [`${row}-${col - 1}`, `${row}-${col + 1}`];

      numbersInFirstRow = getRowValues(row + 1, sudokuValues);
      numbersInSecondRow = getRowValues(row + 2, sudokuValues);
      numbersInFirstCol = getColValues(col - 1, sudokuValues);
      numbersInSecondCol = getColValues(col + 1, sudokuValues);

      break;

    case "0-2":
      closestSquareIdsInCol = [`${row + 1}-${col}`, `${row + 2}-${col}`];
      closestSquareIdsInRow = [`${row}-${col - 2}`, `${row}-${col - 1}`];

      numbersInFirstRow = getRowValues(row + 1, sudokuValues);
      numbersInSecondRow = getRowValues(row + 2, sudokuValues);
      numbersInFirstCol = getColValues(col - 2, sudokuValues);
      numbersInSecondCol = getColValues(col - 1, sudokuValues);

      break;

    case "1-0":
      closestSquareIdsInCol = [`${row - 1}-${col}`, `${row + 1}-${col}`];
      closestSquareIdsInRow = [`${row}-${col + 1}`, `${row}-${col + 2}`];

      numbersInFirstRow = getRowValues(row - 1, sudokuValues);
      numbersInSecondRow = getRowValues(row + 1, sudokuValues);
      numbersInFirstCol = getColValues(col + 1, sudokuValues);
      numbersInSecondCol = getColValues(col + 2, sudokuValues);

      break;

    case "1-1":
      closestSquareIdsInCol = [`${row - 1}-${col}`, `${row + 1}-${col}`];
      closestSquareIdsInRow = [`${row}-${col - 1}`, `${row}-${col + 1}`];

      numbersInFirstRow = getRowValues(row - 1, sudokuValues);
      numbersInSecondRow = getRowValues(row + 1, sudokuValues);
      numbersInFirstCol = getColValues(col - 1, sudokuValues);
      numbersInSecondCol = getColValues(col + 1, sudokuValues);

      break;

    case "1-2":
      closestSquareIdsInCol = [`${row - 1}-${col}`, `${row + 1}-${col}`];
      closestSquareIdsInRow = [`${row}-${col - 2}`, `${row}-${col - 1}`];

      numbersInFirstRow = getRowValues(row - 1, sudokuValues);
      numbersInSecondRow = getRowValues(row + 1, sudokuValues);
      numbersInFirstCol = getColValues(col - 2, sudokuValues);
      numbersInSecondCol = getColValues(col - 1, sudokuValues);

      break;

    case "2-0":
      closestSquareIdsInCol = [`${row - 2}-${col}`, `${row - 1}-${col}`];
      closestSquareIdsInRow = [`${row}-${col + 1}`, `${row}-${col + 2}`];

      numbersInFirstRow = getRowValues(row - 2, sudokuValues);
      numbersInSecondRow = getRowValues(row - 1, sudokuValues);
      numbersInFirstCol = getColValues(col + 1, sudokuValues);
      numbersInSecondCol = getColValues(col + 2, sudokuValues);

      break;

    case "2-1":
      closestSquareIdsInCol = [`${row - 2}-${col}`, `${row - 1}-${col}`];
      closestSquareIdsInRow = [`${row}-${col - 1}`, `${row}-${col + 1}`];

      numbersInFirstRow = getRowValues(row - 2, sudokuValues);
      numbersInSecondRow = getRowValues(row - 1, sudokuValues);
      numbersInFirstCol = getColValues(col - 1, sudokuValues);
      numbersInSecondCol = getColValues(col + 1, sudokuValues);

      break;

    case "2-2":
      closestSquareIdsInCol = [`${row - 2}-${col}`, `${row - 1}-${col}`];
      closestSquareIdsInRow = [`${row}-${col - 2}`, `${row}-${col - 1}`];

      numbersInFirstRow = getRowValues(row - 2, sudokuValues);
      numbersInSecondRow = getRowValues(row - 1, sudokuValues);
      numbersInFirstCol = getColValues(col - 2, sudokuValues);
      numbersInSecondCol = getColValues(col - 1, sudokuValues);

      break;
  }

  //* Create a copy of the sudoku values to avoid mutating the original array
  const sudokuValuesCopy = sudokuValues.map((r) => [...r]);

  //* Check if the closest squares in the column and row have values
  const hasValueClosestSquaresInCol = closestSquareIdsInCol.every((id) => {
    const [r, c] = id.split("-").map(Number);
    return sudokuValuesCopy[r][c] !== 0;
  });
  const hasValueClosestSquaresInRow = closestSquareIdsInRow.every((id) => {
    const [r, c] = id.split("-").map(Number);
    return sudokuValuesCopy[r][c] !== 0;
  });

  return {
    hasValueClosestSquaresInCol,
    hasValueClosestSquaresInRow,
    numbersInFirstCol,
    numbersInFirstRow,
    numbersInSecondCol,
    numbersInSecondRow,
  };
};
