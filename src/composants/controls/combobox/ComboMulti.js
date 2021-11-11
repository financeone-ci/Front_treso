import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useField, ErrorMessage} from 'formik';



const useStyles = makeStyles((theme) => ({
  root: {
     
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ComboMulti(props) {
  const classes = useStyles();
  const [field, meta] = useField(props);
  const [data, setData]= useState([])
  const [defaut, setDefaut]= useState(props.defaut)

  useEffect(()=>{
    setData(props.data)
    setDefaut(props.defaut)
  },[props])
  return (
    <div className={classes.root}>
      <Autocomplete
        multiple fullWidth={true} 
        id={props.name}
        size="small"
        {...props}
        options={data}
        getOptionLabel={(option) => option[props.code]}
        defaultValue={defaut}
        renderInput={(params) => (
          <TextField  
          fullWidth={true} {...params} variant="outlined" 
          label={props.name  } 
          placeholder={props.name   }
          helperText={meta.touched && meta.error ? props.thelperText : ''}
        error={meta.touched && meta.error ? props.terror : false}
          {...field}
          />
        )}
      />
    </div>
  );
}
