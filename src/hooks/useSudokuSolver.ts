import { useRef, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSquaresToCompare, setSudokuValues } from "@/redux/sudokuSlice";
import {
  getEmptySquares,
  focusSquareById,
  getPossibleNumbers,
  findNumbersToEliminate,
  getAllSquaresIdToCompare,
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

  //! handleFocus function is triggered when a square is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const focusedSquareID = e.target.id;
    const [row, col] = focusedSquareID.split("-").map(Number);
    if (sudokuValuesRef.current[row][col] !== 0) return; // If the square already has a value, do nothing

    const allSquaresIdToCompare = getAllSquaresIdToCompare(focusedSquareID);

    dispatch(setSquaresToCompare(allSquaresIdToCompare));

    //* Find possible numbers and apply valid number
    const possibleNumbers = getPossibleNumbers(
      allSquaresIdToCompare,
      sudokuValuesRef.current
    );

    if (possibleNumbers.length === 1) {
      const copy = sudokuValues.map((r) => [...r]);
      copy[row][col] = possibleNumbers[0];
      dispatch(setSudokuValues(copy));
    } else if (possibleNumbers.length > 1) {
      //! start Elimination process
      const {
        hasValueClosestSquaresInCol,
        hasValueClosestSquaresInRow,
        numbersInFirstRow,
        numbersInSecondRow,
        numbersInFirstCol,
        numbersInSecondCol,
      } = findNumbersToEliminate(col, row, sudokuValues);

      if (hasValueClosestSquaresInRow) {
        for (const id of possibleNumbers) {
          if (
            numbersInFirstRow.includes(id) &&
            numbersInSecondRow.includes(id)
          ) {
            const copy = sudokuValues.map((r) => [...r]);
            copy[row][col] = id;
            dispatch(setSudokuValues(copy));
          }
        }
      }

      if (hasValueClosestSquaresInCol) {
        for (const id of possibleNumbers) {
          if (
            numbersInFirstCol.includes(id) &&
            numbersInSecondCol.includes(id)
          ) {
            const copy = sudokuValues.map((r) => [...r]);
            copy[row][col] = id;
            dispatch(setSudokuValues(copy));
          }
        }
      }
    }
  };

  return { startAutoSolve, handleFocus };
};
