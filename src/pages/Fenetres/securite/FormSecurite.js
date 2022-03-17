/** @format */

import React, { useState } from "react";
import * as yup from "yup";
import axios from "../../../api/axios";
import ModalForm from "../../../composants/controls/modal/ModalForm";
import Controls from "../../../composants/controls/Controls";
import ReadCookie from "../../../functions/ReadCookie";
import { makeStyles } from "@material-ui/core";
import { Notification } from "../../../composants/controls/toast/MyToast";
import { Formik, Form, Field, useField, ErrorMessage } from "formik";
import { Grid } from "@material-ui/core";
import SpinnerForm from "../../../composants/controls/spinner/SpinnerForm";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import ListWithCheck from "../../../composants/formGroup/ListWithCheck";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  buton: {
    textAlign: "right",
  },
}));

function FormDevise(props) {
  const [typeSubmit, setTypeSubmit] = useState(1);

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie();

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    securite_taille: yup.string().required("Taille obligatoire"),
    securite_duree_pwd: yup.string().required("Durée obligatoire"),
  });

  // Création d'une nouvelle devise
  const submitDevise = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    response = await axios.post(
      "securite/UpdateSecurite.php?id=" + values.id,
      { values },
      { headers }
    );

    props.handleClose();

    return response.data;
  };

  // Création d'une devise
  const devise = useMutation(submitDevise, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries("listesecurite");
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

  const classes = useStyles();
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}
      >
        {devise.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.data.id,
            securite_duree_pwd: props.initialModal.data.securite_duree_pwd,
            securite_taille: props.initialModal.data.securite_taille,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            devise.mutate(values, {
              onSuccess: (e) => {
                // console.log(e)
                e.reponse == "error" && onSubmitProps.resetForm();
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
                    id="securite_duree_pwd"
                    label="Durée du mot de passe"
                    autoFocus
                    type="text"
                    thelperText={errors.securite_duree_pwd}
                    terror={errors.code && true}
                    name="securite_duree_pwd"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="securite_taille"
                    label="Taille du mot de passe"
                    type="text"
                    thelperText={errors.securite_taille}
                    terror={errors.securite_taille && true}
                    name="securite_taille"
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
              </div>
            </Form>
          )}
        </Formik>
        <Grid item xs={12} sm={12} lg={12}>
          <ListWithCheck
            label={"Paramètres"}
            api="securite/UpdateSecurite.php?id="
            queryClient="listesecurite"
            elements={[
              {
                id: props.initialModal.data.id,
                value: props.initialModal.data.securite_majuscule,
                champ: "securite_majuscule",
                title: "Majuscule",
              },
              {
                id: props.initialModal.data.id,
                value: props.initialModal.data.securite_carc_speciaux,
                champ: "securite_carc_speciaux",
                title: "Caractères spéciaux",
              },
              {
                id: props.initialModal.data.id,
                value: props.initialModal.data.securite_chiffres,
                champ: "securite_chiffres",
                title: "Contient des chiffres",
              },
            ]}
          />

          <ListWithCheck
            label={"Niveaux de validation"}
            api="securite/UpdateSecurite.php?id="
            queryClient="listesecurite"
            elements={[
              {
                id: props.initialModal.data.id,
                value: props.initialModal.data.valider,
                champ: "valider",
                title: "Valider",
              },
              {
                id: props.initialModal.data.id,
                value: props.initialModal.data.autoriser,
                champ: "autoriser",
                title: "Autoriser",
              },
              {
                id: props.initialModal.data.id,
                value: props.initialModal.data.approuver,
                champ: "approuver",
                title: "Approuver",
              },
            ]}
          />
        </Grid>
      </ModalForm>
    </>
  );
}

export default FormDevise;
