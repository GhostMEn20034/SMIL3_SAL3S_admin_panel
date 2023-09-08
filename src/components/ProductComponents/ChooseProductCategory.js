import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button } from "@mui/material";


// This is the component for the dialog window
function ChooseProductCategory(props) {
    // This is the state for the selected category
    const [category, setCategory] = useState(null);
  
    // This is the state for the current level of categories to display
    const [level, setLevel] = useState(0);
  
    // This is the state for the current list of categories to display
    const [list, setList] = useState([]);
  
    // This is the effect hook to update the list of categories based on the level and the selected category
    useEffect(() => {
      // If there is no selected category, display all categories with level 0
      if (!category) {
        setList(props.categories.filter((cat) => cat.level === 0));
      } else {
        // If there is a selected category, display its children
        setList(category.children);
      }
    }, [category, level]);
  
    // This is the handler for clicking on a category item
    const handleItemClick = (item) => {
      // If the item has no children, write it into category variable and close the dialog
      if (item.children.length === 0) {
        props.onClose(item);
      } else {
        // If the item has children, set it as the selected category and increase the level
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
        setCategory(category.parent_id ? props.categories.find((cat) => cat._id === category.parent_id) : null);
        setLevel(level - 1);
      }
    };
  
    return (
      <Dialog open={props.open} onClose={() => props.onClose(null)} fullScreen>
        <DialogTitle>
          Choose a category
          {level > 0 && (
            <Button variant="contained" size="small" onClick={handleBackClick} sx={{ml: 2}}>
              Back
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          <List>
            {list.map((item) => (
              <ListItem key={item._id} button onClick={() => handleItemClick(item)}>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    );
  }

export default ChooseProductCategory;