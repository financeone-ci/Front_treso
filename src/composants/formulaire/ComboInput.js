/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ComboInput(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
       
      <Autocomplete
      
        multiple
        id={props.id}
        size={props.size || "small"}
        options={props.data}
        getOptionLabel={(option) => option.title}
        defaultValue={ props.value || "" }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={props.label || "Sélection"} placeholder={props.placeholder || "Choisissez un élément"} />
        )}
      />
     
     
    </div>
  );
}

