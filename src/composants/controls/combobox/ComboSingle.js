/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useField, ErrorMessage} from 'formik';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ComboSingle(props) {
  const [field, meta] = useField(props);
    const [data, setData]= useState([])
    useEffect(()=>{
        setData(props.data)
    },[])
  const classes = useStyles();

   
  return (
    <div className={classes.root}>
       
      
      <Autocomplete
       style={{marginTop:15}}
        id={props.name} 
        fullWidth={true}
        size="small"
        options={data}
        getOptionLabel={(option) => option.profil_libelle || option[props.code] }
        multiple={props.multiple || false }
        defaultValue={props.defaut}
       {...props}
        renderInput={(params) => (
          <>
          <TextField  
          fullWidth={true} {...params} variant="outlined" 
          label={props.name ||"Profil"} 
          placeholder={props.name || "Profil" }
          helperText={meta.touched && meta.error ? props.thelperText : ''}
        error={meta.touched && meta.error ? props.terror : false}
          {...field}
          />
         
          </>

        )}
      />
       
      
       
    </div>
  );
}

