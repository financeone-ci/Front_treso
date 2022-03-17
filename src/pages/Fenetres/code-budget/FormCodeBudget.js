/** @format */

import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "../../../api/axios";
import ModalForm from "../../../composants/controls/modal/ModalForm";
import Controls from "../../../composants/controls/Controls";
import ReadCookie from "../../../functions/ReadCookie";
import { makeStyles } from "@material-ui/core";
import { Formik, Form, Field, useField, ErrorMessage } from "formik";
import { Grid } from "@material-ui/core";
import SpinnerForm from "../../../composants/controls/spinner/SpinnerForm";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: "right",
  },
}));

function FormUser(props) {
  const [typeSubmit, setTypeSubmit] = useState(1);

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie();

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    code: yup.string().required("Code obligatoire"),
    libelle: yup.string().required("Libellé obligatoire"),
    budget: yup.string().required("Type budget obligatoire"),
  });

  // Création d'une nouvelle user
  const submitUser = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };
    if (!values.id) {
      response = await axios.post(
        "code-budget/CreateCB.php",
        { values },
        { headers }
      );
    } else {
      response = await axios.post(
        "code-budget/UpdateCB.php?id=" + values.id,
        { values },
        { headers }
      );
    }
    typeSubmit == 1 && props.handleClose();

    return response.data;
  };

  // Création d'une user
  const user = useMutation(submitUser, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries("listeCode");
      props.setNotify({
        type: data.reponse,
        message: data.message,
      });
      props.setOpenNotif(true);
    },
    onError: () => {
      props.setNotify({
        message: "Connexion au service impossible",
        type: "error",
      });
      props.setOpenNotif(true);
    },
  });

  const [defaut, setDefaut] = useState({});
  useEffect(() => {
    if (props.initialModal.data.id) {
      props.budget.map(
        (x) => {
          if (x.id == props.initialModal.data.ID_TYPE_BUDGET) {
            // console.log(x);
            setDefaut(x);
          }
        },
        [props.initialModal.data.id]
      );
    } else setDefaut(null);
  });

  const classes = useStyles();

  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}
      >
        {user.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.data.id,
            code: props.initialModal.data.CODE_CB,
            libelle: props.initialModal.data.LIB_CB,

            budget: props.initialModal.data.ID_TYPE_BUDGET,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            user.mutate(values, {
              onSuccess: (e) => {
                e.reponse == "success" &&
                  onSubmitProps.resetForm({
                    values: {
                      id: "",
                      code: "",
                      libelle: "",
                      budget: "",
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
                value={props.initialModal.data.id || ""}
              />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="code"
                    label="code"
                    autoFocus
                    type="text"
                    thelperText={errors.code}
                    terror={errors.code && true}
                    name="code"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="libelle"
                    label="libelle"
                    type="text"
                    thelperText={errors.libelle}
                    terror={errors.libelle && true}
                    name="libelle"
                  />
                </Grid>

                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingle
                    name="budget"
                    data={props.budget}
                    defaut={defaut}
                    code={"CODE_TYPE_BUDGET"}
                    onChange={(e, value) => {
                      setFieldValue(
                        "budget",
                        value !== null ? value.id : value
                      );
                    }}
                    thelperText={errors.budget}
                    terror={errors.budget && true}
                  />
                </Grid>
              </Grid>

              <div className={classes.buton}>
                <Controls.ButtonLabel
                  color="primary"
                  onClick={() => setTypeSubmit(1)}
                >
                  Valider
                </Controls.ButtonLabel>
                {props.initialModal.data.id === "" && (
                  <Controls.ButtonLabel
                    color="secondary"
                    onClick={() => setTypeSubmit(2)}
                  >
                    Appliquer
                  </Controls.ButtonLabel>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </ModalForm>
    </>
  );
}

export default FormUser;
