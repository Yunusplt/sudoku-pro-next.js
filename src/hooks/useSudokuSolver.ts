import { useRef, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSudokuValues, setSquaresToCompare } from "@/redux/sudokuSlice";
import {
  getEmptySquares,
  focusSquareById,
  getPossibleNumbers,
  getAllSquaresToCompare,
} from "@/utils/sudokuHelpers";

export const useSudokuSolver = () => {
  //! redux
  const dispatch = useAppDispatch();
  const { sudokuValues } = useAppSelector((state) => state.sudoku);

  //! hooks
  const sudokuValuesRef = useRef(sudokuValues);

  useEffect(() => {
    sudokuValuesRef.current = sudokuValues;
  }, [sudokuValues]);

  //! functions
  const startAutoSolve = useCallback(async () => {
    let leftEmptySquares: string[] = getEmptySquares(sudokuValuesRef.current);
    while (leftEmptySquares.length > 0) {
      //* Focus each empty square one by one and trigger handleFocus for every empty square
      for (const id of leftEmptySquares) {
        await focusSquareById(id);
      }

      //* Update after one pass
      leftEmptySquares = getEmptySquares(sudokuValuesRef.current);
    }

    //* No empty squares left!!
    alert("Sudoku wurde erfolgreich gelöst!");
  }, []);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const focusedSquareID = e.target.id;
    const [row, col] = focusedSquareID.split("-").map(Number);

    //* get the all squares which are used to compare
    const allSquaresToCompare = getAllSquaresToCompare(
      row,
      col,
      focusedSquareID
    );

    dispatch(setSquaresToCompare(allSquaresToCompare));

    //* Find possible numbers and apply valid number
    const possibleNumbers = getPossibleNumbers(
      allSquaresToCompare,
      sudokuValues
    );

    if (possibleNumbers.length === 1) {
      const copy = sudokuValues.map((r) => [...r]);
      copy[row][col] = possibleNumbers[0];
      dispatch(setSudokuValues(copy));
    }
  };

  return { startAutoSolve, handleFocus };
};
