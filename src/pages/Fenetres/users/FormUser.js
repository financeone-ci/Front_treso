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
    nom: yup.string().required("Nom obligatoire"),
    email: yup.string().required("Email obligatoire"),
    login: yup.string().required("Login obligatoire"),
    profil: yup.string().required("Profil obligatoire"),
  });

  // Création d'une nouvelle user
  const submitUser = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };
    if (!values.id) {
      response = await axios.post(
        "users/CreateUser.php",
        { values },
        { headers }
      );
    } else {
      response = await axios.post(
        "users/UpdateUser.php?id=" + values.id,
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
      props.queryClient.invalidateQueries("listeuser");
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
      props.profil.map(
        (x) => {
          if (x.id == props.initialModal.data.profil_id) {
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
            nom: props.initialModal.data.user_nom,
            prenom: props.initialModal.data.user_prenom,
            login: props.initialModal.data.user_login,
            email: props.initialModal.data.user_email,
            tel: props.initialModal.data.user_tel,
            role: props.initialModal.data.user_role,
            profil: props.initialModal.data.profil_id,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            user.mutate(values, {
              onSuccess: (e) => {
                e.reponse == "success" &&
                  onSubmitProps.resetForm({
                    values: {
                      id: "",
                      nom: "",
                      prenom: "",
                      login: "",
                      email: "",
                      tel: "",
                      role: "",
                      profil: "",
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
                    id="nom"
                    label="Nom"
                    autoFocus
                    type="text"
                    thelperText={errors.nom}
                    terror={errors.nom && true}
                    name="nom"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="prenom"
                    label="Prénoms"
                    type="text"
                    thelperText={errors.prenom}
                    terror={errors.prenom && true}
                    name="prenom"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="login"
                    label="login"
                    type="text"
                    thelperText={errors.login}
                    terror={errors.login && true}
                    name="login"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="email"
                    type="text"
                    thelperText={errors.email}
                    terror={errors.email && true}
                    name="email"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="tel"
                    label="tel"
                    type="text"
                    thelperText={errors.tel}
                    terror={errors.tel && true}
                    name="tel"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="role"
                    label="role"
                    type="text"
                    thelperText={errors.role}
                    terror={errors.role && true}
                    name="role"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingle
                    name="profil"
                    data={props.profil}
                    defaut={defaut}
                    code={"profil_libelle"}
                    onChange={(e, value) => {
                      setFieldValue(
                        "profil",
                        value !== null ? value.id : value
                      );
                    }}
                    thelperText={errors.profil}
                    terror={errors.profil && true}
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
