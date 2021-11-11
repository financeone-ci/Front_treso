/** @format */

import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { useField, ErrorMessage } from 'formik'

export default function Check(props) {
  const [field, meta] = useField(props)
  const [checked, setChecked] = React.useState(props.checked || false)

  const handleChange = (event) => {
    setChecked(event.target.checked)
    try {
      props.fonctionExec() // Fonction à exécuter en cas de changement
    } catch (error) {}
  }

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={checked}
            color={props.color || 'primary'}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            helperText={meta.touched && meta.error ? props.thelperText : ''}
            error={meta.touched && meta.error ? props.terror : false}
            {...field}
            name={props.name}
            onChange={props.onChange}
          />
        }
        label={props.label || 'Cases à cocher'}
      />

      <div></div>
    </>
  )
}
