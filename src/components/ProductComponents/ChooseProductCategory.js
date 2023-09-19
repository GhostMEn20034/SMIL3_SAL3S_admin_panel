import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// This is the component for the dialog window
function ChooseProductCategory(props) {
  // This is the state for the selected category
  const [category, setCategory] = useState(null);

  // This is the state for the current level of categories to display
  const [level, setLevel] = useState(0);

  // State for tracking what categories were chosen by the user
  const [path, setPath] = useState([]);

  // This is the state for the current list of categories to display
  const [list, setList] = useState([]);

  // This is the effect hook to update the list of categories based on the level and the selected category
  useEffect(() => {
    // If there is no selected category, display all categories with level 0
    if (!category) {
      setList(props.categories.filter((cat) => cat.level === 0));
      setLevel(0);
    } else {
      // If there is a selected category, display its children
      setList(category.children);
    }
  }, [category]);

  // console.log(level);
  console.log(category);

  // This is the handler for clicking on a category item
  const handleItemClick = (item) => {
    // If the item has no children, write it into category variable and close the dialog
    if (item.children.length === 0) {
      props.onClose(item);
    } else {
      // If the item has children, set it as the selected category and increase the level
      setPath((prevArray) => [...prevArray, item]);
      setCategory(item);
      setLevel(level + 1);
    }
  };

  // This is the handler for clicking on the back button
  const handleBackClick = () => {
    // If the level is 0, close the dialog
    if (level === 0) {
      props.onClose(null);
    } else {
      // If the level is not 0, set the selected category as its parent and decrease the level

      // Remove last element from path array and set category as last element of modified array
      let clonedArray = path.map(elem => {return {...elem}});
      clonedArray.splice(-1);
      let lastElement = clonedArray[clonedArray.length - 1];


      setCategory(lastElement);
      setPath(clonedArray);
      setLevel((prevLevel) => prevLevel - 1);
    }
  };

  return (
    <div>
      <Dialog open={props.open} onClose={() => props.onClose(null)} fullScreen TransitionComponent={Transition}>
        <AppBar sx={{backgroundColor: "#292929", color: "#D5D507"}}>
          <Toolbar>
          <IconButton
              edge="start"
              color="inherit"
              onClick={() => props.setOpen(false)}
              aria-label="close"
              sx={{mr: 2}}
            >
              <CloseIcon />
            </IconButton>
          <Typography variant="h6">
          Choose a category
          </Typography>
          {level >= 1 && (
            <Button variant="contained" size="small" onClick={handleBackClick} sx={{ 
              ml: 2, backgroundColor: "#D5D507", color: "black", ":hover": {backgroundColor: "#bdbd02"}
              }}>
              Back
            </Button>
          )}
          </Toolbar>
        </AppBar>
        <DialogContent sx={{mt: "70px", padding: 0}}>
          <List>
            {list.map((item) => (
              <ListItem key={item._id} button onClick={() => handleItemClick(item)}>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChooseProductCategory;