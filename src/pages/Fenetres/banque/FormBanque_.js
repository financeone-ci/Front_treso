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
import Formulaire from "../../../composants/formulaire/Formulaire";

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
    code: yup.string().required("Code obligatoire"),
    libelle: yup.string().required("Libellé obligatoire"),
    taux: yup.string().required("taux obligatoire"),
  });

  // Création d'une nouvelle devise
  const submitBanque = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };
    if (values.id === "") {
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
    typeSubmit == 1 && props.handleClose();

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
  //console.log(props.initialModal);
  const classes = useStyles();
  return (
    <>
      <ModalForm
        title={props.titreModal}
        handleClose={props.handleClose}
        open={props.openModal}
      >
        {banque.isLoading && <SpinnerForm />}
        <Formulaire
          mutation={banque}
          valeurs={props.initialModal.data}
          schema={schema}
          champs={[
            {
              nom: props.initialModal.data.CODE_BANQUE,
              label: "Code Banque",
              type: "text",
              focus: true,
            },
            {
              nom: props.initialModal.data.LIBELLE_BANQUE,
              label: "Libellé Banque",
              type: "text",
            },
          ]}
        />
      </ModalForm>
    </>
  );
}

export default FormDevise;
