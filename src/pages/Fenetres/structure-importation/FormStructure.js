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

function FormStructure(props) {
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
    code: yup.string().required("Champs obligatoire"),
    description: yup.string().required("Champs obligatoire"),
    pos_taxe: yup.string().nullable(),
    pos_benef: yup.string().nullable(),
    pos_ref_benef: yup.string().nullable(),
    pos_montant: yup.string().nullable(),
    pos_num: yup.string().nullable(),
    pos_num_bon: yup.string().nullable(),
    pos_motif: yup.string().nullable(),
    pos_echeance: yup.string().nullable(),
    pos_budget: yup.string().nullable(),
    pos_date: yup.string().nullable(),
    pos_marche: yup.string().nullable(),
    pos_retenue: yup.string().nullable(),
  });

  // Création d'une nouvelle devise
  const submitStructure = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    if (!values.id || values.id == "") {
      response = await axios.post(
        "structure-importation/CreateStructureImport.php",
        { values },
        { headers }
      );
    } else {
      response = await axios.post(
        "structure-importation/UpdateStructureImport.php?id=" + values.id,
        { values },
        { headers }
      );
    }
    props.handleClose();

    return response.data;
  };

  // Création d'une devise
  const structure = useMutation(submitStructure, {
    onSuccess: (data) => {
      props.queryClient.invalidateQueries("listeStr");
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
        <Formik
          noValidate
          initialValues={{
            id: props.initialModal.data.id || "",
            code: props.initialModal.data.code || "",
            description: props.initialModal.data.description || "",
            pos_taxe: props.initialModal.data.pos_taxe || "",
            pos_benef: props.initialModal.data.pos_benef || "",
            pos_ref_benef: props.initialModal.data.pos_ref_benef || "",
            pos_montant: props.initialModal.data.pos_montant || "",
            pos_num: props.initialModal.data.pos_num || "",
            pos_num_bon: props.initialModal.data.pos_num_bon || "",
            pos_motif: props.initialModal.data.pos_motif || "",
            pos_echeance: props.initialModal.data.pos_echeance || "",
            pos_budget: props.initialModal.data.pos_budget || "",
            pos_date: props.initialModal.data.pos_date || "",
            pos_marche: props.initialModal.data.pos_marche || "",
            pos_retenue: props.initialModal.data.pos_retenue || "",
          }}
          validationSchema={schema}
          onSubmit={(values, onSubmitProps) => {
            structure.mutate(values, {
              onSuccess: (e) => {
                e.reponse == "success" &&
                  onSubmitProps.resetForm({
                    values: {
                      id: "",
                      code: "",
                      description: "",
                      pos_taxe: "",
                      pos_benef: "",
                      pos_ref_benef: "",
                      pos_montant: "",
                      pos_num: "",
                      pos_num_bon: "",
                      pos_motif: "",
                      pos_echeance: "",
                      pos_budget: "",
                      pos_date: "",
                      pos_marche: "",
                      pos_retenue: "",
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
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    autoFocus
                    id="code"
                    label="Code Structure"
                    type="text"
                    thelperText={errors.code}
                    terror={errors.code && true}
                    name="code"
                  />
                </Grid>
                <Grid item xs={6} sm={9} lg={9}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="description"
                    label="Description"
                    type="text"
                    thelperText={errors.description}
                    terror={errors.description && true}
                    name="description"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_taxe"
                    label="Taxe"
                    type="text"
                    thelperText={errors.pos_taxe}
                    terror={errors.pos_taxe && true}
                    name="pos_taxe"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_benef"
                    label="Bénéficiaire"
                    type="text"
                    thelperText={errors.pos_benef}
                    terror={errors.pos_benef && true}
                    name="pos_benef"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_ref_benef"
                    label="Réf. Bénéficiaire"
                    type="text"
                    thelperText={errors.pos_ref_benef}
                    terror={errors.pos_ref_benef && true}
                    name="pos_ref_benef"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_montant"
                    label="Montant"
                    type="text"
                    thelperText={errors.pos_montant}
                    terror={errors.pos_montant && true}
                    name="pos_montant"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_num"
                    label="N° Engagement"
                    type="text"
                    thelperText={errors.pos_num}
                    terror={errors.pos_num && true}
                    name="pos_num"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_num_bon"
                    label="N° Bon de commande"
                    type="text"
                    thelperText={errors.pos_num_bon}
                    terror={errors.pos_num_bon && true}
                    name="pos_num_bon"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_motif"
                    label="Motif"
                    type="text"
                    thelperText={errors.pos_motif}
                    terror={errors.pos_motif && true}
                    name="pos_motif"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_echeance"
                    label="Echéance"
                    type="text"
                    thelperText={errors.pos_echeance}
                    terror={errors.pos_echeance && true}
                    name="pos_echeance"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_budget"
                    label="Budget"
                    type="text"
                    thelperText={errors.pos_budget}
                    terror={errors.pos_budget && true}
                    name="pos_budget"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_date"
                    label="Date"
                    type="text"
                    thelperText={errors.pos_date}
                    terror={errors.pos_date && true}
                    name="pos_date"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_marche"
                    label="Marche"
                    type="text"
                    thelperText={errors.pos_marche}
                    terror={errors.pos_marche && true}
                    name="pos_marche"
                  />
                </Grid>
                <Grid item xs={6} sm={3} lg={3}>
                  <Controls.TextInput
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="pos_retenue"
                    label="Retenue"
                    type="text"
                    thelperText={errors.pos_retenue}
                    terror={errors.pos_retenue && true}
                    name="pos_retenue"
                  />
                </Grid>{" "}
              </Grid>

              <div className={classes.buton}>
                <Controls.ButtonLabel
                  color="primary"
                  onClick={() => setTypeSubmit({ type: 1 })}
                >
                  Valider
                </Controls.ButtonLabel>
                {props.initialModal.data.id == 0 && (
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

export default FormStructure;
