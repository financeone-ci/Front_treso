/** @format */

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../composants/PageHeader";
import TableData from "../../../composants/tableaux/TableData";
import { Paper, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import Controls from "../../../composants/controls/Controls";
import BarreButtons from "../../../composants/BarreButtons";
import Buttons from "../../../composants/controls/Buttons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import ModalOuiNon from "../../../composants/controls/modal/ModalOuiNon";
import axios from "../../../api/axios";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import FormBanque from "./FormBanque";
import AddIcon from "@material-ui/icons/Add";
import { Notification } from "../../../composants/controls/toast/MyToast";
import CryptFunc from "../../../functions/CryptFunc";
import GroupBy from "../../../functions/GroupBy";
import ReadCookie from "../../../functions/ReadCookie";
import { useMutation, useQuery, useQueryClient } from "react-query";
// Style
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

function VueBanque(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  const DroitsUser = leMenu.group["Eléments paiements"][1];
  // droits insuffisants
  const noRightFunc = () => {
    setNotify({
      type: "error",
      message: "Droits insuffisants",
    });
    setOpenNotif(true);
  };

  // Stats
  const [initialModal, setInitialModal] = useState({
    data: {},
  });
  const [notify, setNotify] = useState({
    type: "",
    message: "",
  });
  const [openNotif, setOpenNotif] = useState(false);
  const [openModal, setOpenModal] = useState(false); // statut du modal suppression
  const [title, setTitle] = useState("");
  const [openOuiNon, setOpenOuiNon] = useState(false); // statut du modal suppression
  const [idSuppr, setIdSuppr] = useState(""); // id  à editer ou supprimer ?

  // Variables
  const Api = "banque/ReadBanque.php";
  const Query = ["listeBanque"];
  const cookieInfo = ReadCookie();

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseModalOuiNon = () => {
    setOpenOuiNon(false);
  };

  // ouverture du modal
  const handleOpenModal = (data = {}) => {
    setInitialModal({ data: data });
    //Mise à jour du titre
    !data.id
      ? setTitle("Nouvelle banque ")
      : setTitle(`Modifier ${data.CODE_BANQUE}`);
    setOpenModal(true);
  };

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true);
    setIdSuppr(id);
  };

  // suppression d'une  devise
  const supprBanque = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    response = await axios.post(
      `banque/DeleteBanque.php?id=${values}`,
      { values },
      { headers }
    );
    handleCloseModalOuiNon();

    return response.data;
  };

  // suppression d'une devise
  const supBanque = useMutation(supprBanque, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("listeBanque");
      setNotify({
        type: data.reponse,
        message: data.message,
      });
      setOpenNotif(true);
    },
    onError: (error) => {
      console.error(error);
      props.setNotify({
        message: "Service indisponible",
        type: "error",
      });
      props.setOpenNotif(true);
    },
  });

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient();

  // Entetes du tableau
  const tableHeader = [
    {
      field: "Actions",
      width: 125,
      align: "center",
      renderCell: (e) => (
        <>
          <IconButton
            aria-label="update"
            size="small"
            onClick={() => {
              if (DroitsUser.droits_modifier == 1) {
                handleOpenModal(e.row);
              }
            }}
          >
            <CreateIcon
              fontSize="inherit"
              color="default"
              className="CreateIcon"
            />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              DroitsUser.droits_supprimer == 1
                ? FuncSuppr(e.row.id)
                : noRightFunc();
            }}
          >
            <DeleteSweepIcon
              color="default"
              fontSize="inherit"
              className="DeleteSweepIcon"
            />
          </IconButton>
        </>
      ),
    },
    {
      field: "id",
      hide: true,
      editable: false,
      headerName: "id",
      width: 20,
      columnResizeIcon: true,
    },
    {
      field: "CODE_BANQUE",
      hide: false,
      editable: false,
      headerName: "Code",
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "LIBELLE_BANQUE",
      hide: false,
      editable: false,
      headerName: "Description",
      width: 280,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "GESTIONNAIRE",
      hide: false,
      editable: false,
      headerName: "Gestionnaire",
      width: 250,
      columnResizeIcon: true,
    },
    {
      field: "ADRESSE_BANQUE",
      hide: false,
      editable: false,
      headerName: "Adresse",
      width: 150,
      columnResizeIcon: true,
      // resizable: 'true',
    },

    {
      field: "ADRESSE_WEB_BANQUE",
      hide: false,
      editable: false,
      headerName: "site Web",
      width: 300,
      columnResizeIcon: true,
      // resizable: 'true',
    },
  ];

  // Classe de style
  const classes = new useStyles();

  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />
      <BarreButtons
        buttons={
          <>
            <Buttons
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                DroitsUser.droits_creer == 1
                  ? handleOpenModal()
                  : noRightFunc();
              }}
              className={classes.button}
              startIcon={<AddIcon />}
            >
              Créer
            </Buttons>
          </>
        }
      />
      <Grid container>
        <Grid item xs={12}>
          <TableData
            columns={tableHeader}
            useQuery={Query}
            api={Api}
            Authorization={ReadCookie()}
          />
        </Grid>
      </Grid>
      <FormBanque
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre="Supprimer?"
        message={"Voulez vous Supprimer cette banque ?"}
        non="Annuler"
        oui="Oui"
        deconnect={() => supBanque.mutate(idSuppr)}
      />
      <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  );
}

export default VueBanque;
