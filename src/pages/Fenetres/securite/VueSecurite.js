/** @format */

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../composants/PageHeader";
import TableData from "../../../composants/tableaux/TableData";
import { Paper, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import Controls from "../../../composants/controls/Controls";
import BarreButtons from "../../../composants/BarreButtons";
import Buttons from "../../../composants/controls/Buttons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";

import FormSecurite from "./FormSecurite";
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

function VueDevises(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  const DroitsUser = leMenu.group["Audits et sécurité"][1];
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

  // Variables
  const Api = "securite/ReadSecurite.php";
  const Query = ["listesecurite"];
  const cookieInfo = ReadCookie();

  // Fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // ouverture du modal
  const handleOpenModal = (data = {}) => {
    setInitialModal({
      data: data,
    });
    //Mise à jour du titre
    setTitle(`Ajuster la sécurité`);
    setOpenModal(true);
  };

  // fonction affichage en fonction du résultat
  const renderItem = (champ) => {
    return (
      <>
        {champ == 1 ? (
          <CheckCircleOutlineIcon
            fontSize="inherit"
            color="default"
            className="CheckCircleOutlineIcon"
            style={{ color: "green" }}
          />
        ) : (
          <HighlightOffIcon
            color="default"
            fontSize="inherit"
            className="HighlightOffIcon"
            style={{ color: "red" }}
          />
        )}
      </>
    );
  };

  // Mise à jour de la liste des retraits après mutation
  const queryClient = useQueryClient();

  // Entetes du tableau
  const tableHeader = [
    {
      field: "id",
      hide: true,
      editable: false,
      headerName: "id",
      width: 10,
      columnResizeIcon: true,
    },
    {
      field: "securite_taille",
      hide: false,
      editable: false,
      headerName: "Taille MDP",
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: "securite_majuscule",
      hide: false,
      editable: false,
      headerName: "Majuscule",
      width: 135,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.securite_majuscule),
    },
    {
      field: "securite_carc_speciaux",
      hide: false,
      editable: false,
      headerName: "Car. spé.",
      width: 135,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.securite_carc_speciaux),
    },
    {
      field: "securite_chiffres",
      hide: false,
      editable: false,
      headerName: "Chiffres",
      width: 135,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.securite_chiffres),
    },
    {
      field: "securite_duree_pwd",
      hide: false,
      editable: false,
      headerName: "Durée MDP",
      width: 135,
      columnResizeIcon: true,
    },
    {
      field: "valider",
      hide: false,
      editable: false,
      headerName: "Valider",
      width: 135,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.valider),
    },
    {
      field: "autoriser",
      hide: false,
      editable: false,
      headerName: "Autoriser",
      width: 135,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.autoriser),
    },
    {
      field: "approuver",
      hide: false,
      editable: false,
      headerName: "Approuver",
      width: 135,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.approuver),
    },
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
        </>
      ),
    },
  ];

  // Classe de style
  const classes = new useStyles();
  return (
    <>
      <PageHeader icone={props.icone} titrePage={props.titre} />

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
      <FormSecurite
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
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

export default VueDevises;
