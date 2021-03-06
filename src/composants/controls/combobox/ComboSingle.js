/**
 * /* eslint-disable no-use-before-define
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { useQuery } from "react-query";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useField, ErrorMessage } from "formik";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ComboSingle(props) {
  const [field, meta] = useField(props);

  const [defaultV, setDefaultV] = useState();

  useEffect(() => {
    setDefaultV(props.defaut);
  }, [props.defaut]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autocomplete
        style={{ marginTop: 15 }}
        id={props.name}
        fullWidth={true}
        size="small"
        options={props.data}
        getOptionLabel={(option) => option[props.code]}
        multiple={props.multiple || false}
        defaultValue={props.defaut}
        {...props}
        renderInput={(params) => (
          <>
            <TextField
              fullWidth={true}
              {...params}
              variant="outlined"
              label={props.label || props.name}
              placeholder={props.name}
              helperText={meta.touched && meta.error ? props.thelperText : ""}
              error={meta.touched && meta.error ? props.terror : false}
              {...field}
            />
          </>
        )}
      />
    </div>
  );
}
