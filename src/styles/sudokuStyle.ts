export const styleTextField = (
  rowIndex: number,
  colIndex: number,
  isSelected: boolean | undefined
) => ({
  width: 40,
  height: 40,
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    backgroundColor: isSelected ? "#d6f5ff" : "white",
    "&.Mui-focused": {
      backgroundColor: "#86eefc",
    },
    "& fieldset": {
      borderWidth: "1px",
      borderColor: "gray",
      borderTop:
        rowIndex === 0
          ? "2px solid black"
          : rowIndex % 3 === 0
          ? "2px solid black"
          : "1px solid gray",
      borderBottom: rowIndex === 8 ? "2px solid black" : "1px solid gray",
      borderLeft:
        colIndex === 0
          ? "2px solid black"
          : colIndex % 3 === 0
          ? "2px solid black"
          : "1px solid gray",
      borderRight: colIndex === 8 ? "2px solid black" : "1px solid gray",
    },
  },
  "& .MuiInputBase-input": {
    textAlign: "center",
    "&:focus": {
      caretColor: "transparent",
    },
    MozAppearance: "textfield",
    "&::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "&::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
  },
});
