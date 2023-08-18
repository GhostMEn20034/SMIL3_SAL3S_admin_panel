import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray({array, removeValue}) {

  const handleDelete = (index) => () => {
        removeValue(index);
  };

  return (
    <Paper
      sx={{
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {array.map((item, index) => {

        return (
          <ListItem key={index}>
            <Chip
              label={item}
              onDelete={handleDelete(index)}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}