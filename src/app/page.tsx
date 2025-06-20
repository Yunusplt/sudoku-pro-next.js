"use client";
import Sudoku from "@/components/Sudoku";
import { Container, Typography } from "@mui/material";
import ActionButtons from "@/components/ActionButtons";
import { styleContainer } from "@/styles/homePageStyle";
import ExampleSelectorDialog from "@/components/ExampleSelectorDialog";

export default function Home() {
  return (
    <main>
      <Container sx={styleContainer}>
        <Typography>SUDOKU</Typography>
        <Sudoku />
        <ActionButtons />
        <ExampleSelectorDialog />
      </Container>
    </main>
  );
}
