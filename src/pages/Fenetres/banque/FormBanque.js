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
  // Stats
  // const [notify, setNotify] = useState({
  //   type: '',
  //   message: '',
  // })
  // const [openNotif, setOpenNotif] = useState(false)
  const [typeSubmit, setTypeSubmit] = useState(1);
  const [listId, setListId] = useState("");

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie();

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    CODE_BANQUE: yup.string().required("Code obligatoire"),
    LIBELLE_BANQUE: yup.string().required("Libellé obligatoire"),
  });

  // Création d'une nouvelle devise
  const submitBanque = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };
    if (!values.id || values.id === "") {
      response = await axios.post(
        "banque/CreateBanque.php",
        { values },
        { headers }
      );
    } else {
      response = await axios.post(
        "banque/UpdateBanque.php?id=" + values.id,
        { values },
        { headers }
      );
    }
    typeSubmit.type == 1 && props.handleClose();

    return response.data;
  };

  // Création d'une devise
  const banque = useMutation(submitBanque, {
    onSuccess: (data) => {
      console.log(data);
      props.queryClient.invalidateQueries("listeBanque");
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
        {banque.isLoading && <SpinnerForm />}
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.data.id,
            CODE_BANQUE: props.initialModal.data.CODE_BANQUE || "",
            LIBELLE_BANQUE: props.initialModal.data.LIBELLE_BANQUE || "",
            DG: props.initialModal.data.DG || "",
            GESTIONNAIRE: props.initialModal.data.GESTIONNAIRE || "",
            ADRESSE_WEB_BANQUE:
              props.initialModal.data.ADRESSE_WEB_BANQUE || "",
            ADRESSE_BANQUE: props.initialModal.data.ADRESSE_BANQUE || "",
            CONTACT_BANQUE: props.initialModal.data.CONTACT_BANQUE || "",
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            banque.mutate(values, {
              onSuccess: (e) => {
                // console.log(e)
                e.reponse == "success" &&
                  onSubmitProps.resetForm({
                    values: {
                      id: "",
                      CODE_BANQUE: "",
                      LIBELLE_BANQUE: "",
                      DG: "",
                      GESTIONNAIRE: "",
                      ADRESSE_WEB_BANQUE: "",
                      ADRESSE_BANQUE: "",
                      CONTACT_BANQUE: "",
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
                    id="CODE_BANQUE"
                    label="Code banque"
                    autoFocus
                    type="text"
                    thelperText={errors.CODE_BANQUE}
                    terror={errors.CODE_BANQUE && true}
                    name="CODE_BANQUE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="LIBELLE_BANQUE"
                    label="Libellé banque"
                    type="text"
                    thelperText={errors.LIBELLE_BANQUE}
                    terror={errors.LIBELLE_BANQUE && true}
                    name="LIBELLE_BANQUE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="DG"
                    label="Directeur banque"
                    type="text"
                    thelperText={errors.DG}
                    terror={errors.DG && true}
                    name="DG"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="GESTIONNAIRE"
                    label="Gestionnaire banque"
                    type="text"
                    thelperText={errors.GESTIONNAIRE}
                    terror={errors.GESTIONNAIRE && true}
                    name="GESTIONNAIRE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="CONTACT_BANQUE"
                    label="Contact banque"
                    type="text"
                    thelperText={errors.CONTACT_BANQUE}
                    terror={errors.CONTACT_BANQUE && true}
                    name="CONTACT_BANQUE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="ADRESSE_WEB_BANQUE"
                    label="Adresse web"
                    type="url"
                    thelperText={errors.ADRESSE_WEB_BANQUE}
                    terror={errors.ADRESSE_WEB_BANQUE && true}
                    name="ADRESSE_WEB_BANQUE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="ADRESSE_BANQUE"
                    label="Adresse"
                    type="text"
                    thelperText={errors.ADRESSE_BANQUE}
                    terror={errors.ADRESSE_BANQUE && true}
                    name="ADRESSE_BANQUE"
                  />
                </Grid>
              </Grid>

              <div className={classes.buton}>
                <Controls.ButtonLabel
                  color="primary"
                  onClick={() => setTypeSubmit({ type: 1 })}
                >
                  Valider
                </Controls.ButtonLabel>
                {!props.initialModal.data.id && (
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
      </ModalForm>
    </>
  );
}

export default FormDevise;
