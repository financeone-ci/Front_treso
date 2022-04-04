/** @format */

import React, { useState } from "react";
import { Formik, Form, Field, useField, ErrorMessage } from "formik";
import { Grid } from "@material-ui/core";
import Controls from "../controls/Controls";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core";

export default function Formulaire(props) {
  const useStyles = makeStyles((theme) => ({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(0),
    },
    buton: {
      textAlign: "right",
    },
  }));
  const classes = useStyles();
  console.log(props.valeurs);
  const [typeSubmit, setTypeSubmit] = useState(1);
  return (
    <Formik
      noValidate
      initialValues={props.valeurs}
      validationSchema={props.schema}
      onSubmit={(values, onSubmitProps) => {
        props.mutation.mutate(values, {
          onSuccess: (e) => {
            // console.log(e)
            e.reponse == "success" &&
              onSubmitProps.resetForm({
                values: () => {
                  for (const [key, value] of Object.entries(props.valeurs)) {
                    return { key: "" };
                  }
                },
              });
          },
          onError: (e) => {
            console.log(e);
          },
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form>
          <input
            id="id"
            name="id"
            type="hidden"
            value={props.valeurs.id || ""}
          />
          <Grid container spacing={2}>
            {props.champs.map((champ) => (
              <Grid
                item
                xs={champ.xs || 6}
                sm={champ.sm || 6}
                lg={champ.lg || 6}
                key={uuidv4()}
              >
                {champ.type == "text" && (
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id={champ.nom}
                    label={champ.label}
                    autoFocus={champ.focus || false}
                    type="text"
                    thelperText={errors[champ.nom]}
                    terror={errors[champ.nom] && true}
                    name={champ.nom}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          <div className={classes.buton}>
            <Controls.ButtonLabel
              color="primary"
              onClick={() => setTypeSubmit({ type: 1 })}
            >
              Valider
            </Controls.ButtonLabel>
            {props.valeurs.id == 0 && (
              <Controls.ButtonLabel
                color="secondary"
                onClick={() => setTypeSubmit({ type: 2 })}
              >
                Appliquer
              </Controls.ButtonLabel>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
