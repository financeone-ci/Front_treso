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
import Constantes from "../../../api/Constantes";
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

function CompteForm(props) {
  // Stats
  const [typeSubmit, setTypeSubmit] = useState(1);
  let civilite = [
    { civ: "Monsieur", code: "M" },
    { civ: "Madame", code: "Mme" },
    { civ: "Mademoiselle", code: "Mlle" },
  ];
  const [openNotif, setOpenNotif] = useState(false);
  const [defautBank, setDefautBank] = useState({});
  const [defautDevise, setDefautDevise] = useState({});
  const [defautCivilite, setDefautCivilite] = useState({});

  // Variables
  // lire les infos du cookie
  const cookieInfo = ReadCookie();

  // Schema de validation du formulaire
  const schema = yup.object().shape({
    code: yup.string().required("Code obligatoire"),
    solde_i: yup.number().required("Solde non initialisé"),
    rib: yup.string().required("RIB obligatoire"),
    libelle: yup.string().required("Description obligatoire"),
    bank: yup.string().required("Banque obligatoire"),
    tel: yup.number("N° de tel invalide"),
    email: yup.string().email("adresse mail invalide"),
    civilite: yup.string().required("Civilité obligatoire"),
    devise: yup.string().required("devise obligatoire"),
  });

  const submitCompte = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };
    if (values.id === "") {
      // Création societe
      response = await axios.post(
        "comptes/CreateCompte.php",
        { values },
        { headers }
      );
    } else {
      // Modification societe
      response = await axios.post(
        `comptes/UpdateCompte.php?id=${values.id}`,
        { values },
        { headers }
      );
    }
    typeSubmit === 1 && props.handleClose();

    return response.data;
  };

  // Création d'une societe
  const compte = useMutation(submitCompte, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries("listecompte");
      props.setNotify({
        type: data.reponse,
        message: data.message,
      });
      props.setOpenNotif(true);
    },
    onError: () => {
      props.setNotify({
        message: "Service indisponible",
        type: "error",
      });
      props.setOpenNotif(true);
    },
  });

  const classes = useStyles();

  useEffect(() => {
    if (props.initialModal.data.id) {
      props.bank.map(
        (x) => {
          if (x.id == props.initialModal.data.banq) {
            // console.log(x);
            setDefautBank(x);
          }
        },
        [props.initialModal.id]
      );

      props.devise.map(
        (x) => {
          if (x.id == props.initialModal.data.ID_DEVISE) {
            // console.log(x);
            setDefautDevise(x);
          }
        },
        [props.initialModal.id]
      );

      props.bank.map(
        (x) => {
          if (x.id == props.initialModal.data.CIV_GESTIONNAIRE_COMPTE) {
            // console.log(x);
            setDefautCivilite(x);
          }
        },
        [props.initialModal.id]
      );
    } else {
      setDefautDevise(null);
      setDefautBank(null);
      setDefautCivilite(null);
    }
  });
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}
      >
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.data.id,
            CODE_COMPTE: props.initialModal.data.CODE_COMPTE,
            SOLDE_INITIAL_COMPTE: props.initialModal.data.SOLDE_INITIAL_COMPTE,
            COMPTE_COMPTABLE: props.initialModal.data.COMPTE_COMPTABLE,
            RIB: props.initialModal.data.RIB,
            LIBELLE_COMPTE: props.initialModal.data.LIBELLE_COMPTE,
            CIV_GESTIONNAIRE_COMPTE:
              props.initialModal.data.CIV_GESTIONNAIRE_COMPTE,
            SERVICE_GESTIONNAIRE_COMPTE:
              props.initialModal.data.SERVICE_GESTIONNAIRE_COMPTE,
            EMAIL_GESTIONNAIRE_COMPTE:
              props.initialModal.data.EMAIL_GESTIONNAIRE_COMPTE,
            banq: props.initialModal.data.banq,
            ID_DEVISE: props.initialModal.data.ID_DEVISE,
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            compte.mutate(values, {
              onSuccess: (data) => {
                data.reponse == "success" && onSubmitProps.resetForm();
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
                value={props.initialModal.id || ""}
              />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="CODE_COMPTE"
                    label="Code Compte"
                    autoFocus
                    type="text"
                    thelperText={errors.CODE_COMPTE}
                    terror={errors.CODE_COMPTE && true}
                    name="CODE_COMPTE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="SOLDE_INITIAL_COMPTE"
                    label="Solde initial"
                    type="text"
                    thelperText={errors.SOLDE_INITIAL_COMPTE}
                    terror={errors.SOLDE_INITIAL_COMPTE && true}
                    name="SOLDE_INITIAL_COMPTE"
                    style={{ textAlign: "right" }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="COMPTE_COMPTABLE"
                    label="Compte Comptable"
                    type="text"
                    thelperText={errors.COMPTE_COMPTABLE}
                    terror={errors.COMPTE_COMPTABLE && true}
                    name="COMPTE_COMPTABLE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="EMAIL_GESTIONNAIRE_COMPTE"
                    label="Email"
                    type="EMAIL_GESTIONNAIRE_COMPTE"
                    thelperText={errors.EMAIL_GESTIONNAIRE_COMPTE}
                    terror={errors.EMAIL_GESTIONNAIRE_COMPTE && true}
                    name="EMAIL_GESTIONNAIRE_COMPTE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="RIB"
                    label="RIB"
                    type="text"
                    thelperText={errors.RIB}
                    terror={errors.RIB && true}
                    name="RIB"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="LIBELLE_COMPTE"
                    label="Libellé"
                    type="text"
                    thelperText={errors.LIBELLE_COMPTE}
                    terror={errors.LIBELLE_COMPTE && true}
                    name="LIBELLE_COMPTE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="gestionnaire"
                    label="gestionnaire"
                    type="text"
                    thelperText={errors.gestionnaire}
                    terror={errors.gestionnaire && true}
                    name="gestionnaire"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingle
                    name="CIV_GESTIONNAIRE_COMPTE"
                    data={civilite}
                    defaut={defautCivilite}
                    code={"civ"}
                    label="Civilité Gestionnaire"
                    onChange={(e, value) => {
                      setFieldValue(
                        "CIV_GESTIONNAIRE_COMPTE",
                        value !== null ? value.id : value
                      );
                    }}
                    thelperText={errors.CIV_GESTIONNAIRE_COMPTE}
                    terror={errors.CIV_GESTIONNAIRE_COMPTE && true}
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="SERVICE_GESTIONNAIRE_COMPTE"
                    label="Service"
                    type="text"
                    thelperText={errors.SERVICE_GESTIONNAIRE_COMPTE}
                    terror={errors.SERVICE_GESTIONNAIRE_COMPTE && true}
                    name="SERVICE_GESTIONNAIRE_COMPTE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="SERVICE_GESTIONNAIRE_COMPTE"
                    label="Contact"
                    type="text"
                    thelperText={errors.SERVICE_GESTIONNAIRE_COMPTE}
                    terror={errors.SERVICE_GESTIONNAIRE_COMPTE && true}
                    name="SERVICE_GESTIONNAIRE_COMPTE"
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingle
                    label="Devise"
                    name="ID_DEVISE"
                    data={props.devise}
                    defaut={defautDevise}
                    code={"CODE_DEVISE"}
                    onChange={(e, value) => {
                      setFieldValue(
                        "ID_DEVISE",
                        value !== null ? value.id : value
                      );
                    }}
                    thelperText={errors.ID_DEVISE}
                    terror={errors.ID_DEVISE && true}
                  />
                </Grid>
                <Grid item xs={6} sm={6} lg={6}>
                  <Controls.ComboSingle
                    name="banq"
                    label="Banque"
                    data={props.bank}
                    defaut={defautBank}
                    code={"CODE_BANQUE"}
                    onChange={(e, value) => {
                      setFieldValue("banq", value !== null ? value.id : value);
                    }}
                    thelperText={errors.banq}
                    terror={errors.banq && true}
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
                {props.initialModal.id === "" && (
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

export default CompteForm;
