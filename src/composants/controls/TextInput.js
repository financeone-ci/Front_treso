/** @format */

import React, { useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import { useField, ErrorMessage } from "formik";

/*export default function TextInput(props) {
  return (
    <>
      <TextField
        variant='outlined'
        id={props.id}
        label={props.label}
        type={props.type || 'text'}
        fullWidth={props.fullWidth || false}
        helperText={props.helperText || ''}
        error={props.error || false}
        size='small'
        autoComplete={false}
        {...props}
      />
    </>
  )
}*/
const TextInput = function (props) {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        variant="outlined"
        id={props.id}
        label={props.label}
        type={props.type || "text"}
        fullWidth={props.fullWidth || false}
        helperText={meta.touched && meta.error ? props.thelperText : ""}
        error={meta.touched && meta.error ? props.terror : false}
        size="small"
        autoComplete={""}
        {...props}
        {...field}
      />
    </>
  );
};

export default React.memo(TextInput);
