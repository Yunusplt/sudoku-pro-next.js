import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { useAppDispatch } from "@/redux/hooks";
import GridOnIcon from "@mui/icons-material/GridOn";
import { setSudokuValues } from "@/redux/sudokuSlice";
import { easyExamples, hardExamples, mediumExamples } from "@/data/sudokuData";
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";

export default function ExampleTabs({
  handleClose = () => {},
}: {
  handleClose?: () => void;
}) {
  //! states
  const [value, setValue] = React.useState("1");

  //! redux
  const dispatch = useAppDispatch();

  //! functions
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleOnClick = (example: number[][]) => {
    dispatch(setSudokuValues(example));
    handleClose();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} centered>
            <Tab label="Leicht" value="1" />
            <Tab label="Mittel" value="2" />
            <Tab label="Schwer" value="3" />
          </TabList>
        </Box>
        {/* easy examples  */}
        <TabPanel value="1">
          <List component="nav">
            {easyExamples.map((example, index) => (
              <ListItemButton
                key={`easy-example-${index}`}
                onClick={() => handleOnClick(example.data)}
              >
                <ListItemIcon>
                  <GridOnIcon />
                </ListItemIcon>
                <ListItemText primary={example.name} />
              </ListItemButton>
            ))}
          </List>
        </TabPanel>
        {/* medium examples */}
        <TabPanel value="2">
          <List component="nav">
            {mediumExamples.map((example, index) => (
              <ListItemButton
                key={`medium-example-${index}`}
                onClick={() => handleOnClick(example.data)}
              >
                <ListItemIcon>
                  <GridOnIcon />
                </ListItemIcon>
                <ListItemText primary={example.name} />
              </ListItemButton>
            ))}
          </List>
        </TabPanel>
        {/* hard examples */}
        <TabPanel value="3">
          <List component="nav">
            {hardExamples.map((example, index) => (
              <ListItemButton
                key={`hard-example-${index}`}
                onClick={() => handleOnClick(example.data)}
              >
                <ListItemIcon>
                  <GridOnIcon />
                </ListItemIcon>
                <ListItemText primary={example.name} />
              </ListItemButton>
            ))}
          </List>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
