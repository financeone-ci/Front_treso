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
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ModalOuiNon from "../../../composants/controls/modal/ModalOuiNon";
import axios from "../../../api/axios";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import FormUser from "./FormUser";
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

function VueUser(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  const DroitsUser = leMenu.group["Profils et utilisateurs"][1];
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
  const [listProfils, setListProfils] = useState([]); // liste des profils

  // Variables
  const Api = "users/ReadUser.php";
  const Query = ["listeuser"];
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
      ? setTitle("Nouvel utilisateur ")
      : setTitle(`Modifier ${data.user_nom}`);
    setOpenModal(true);
  };

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true);
    setIdSuppr(id);
  };

  // suppression d'un user
  const supprUser = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };
    console.log(values);

    response = await axios.post(
      `users/DeleteUser.php?id=${values}`,
      { values },
      { headers }
    );
    handleCloseModalOuiNon();

    return response.data;
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

  // suppression d'un User
  const supUser = useMutation(supprUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("listeuser");
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

  // Chargement des profils
  const fetchData = async () => {
    const headers = {
      Authorization: cookieInfo,
    };
    let response = await axios("profils/ReadProfils.php", {
      headers,
    });
    return response.data;
  };

  const VueProfil = useQuery(["listeprofils"], fetchData, {
    cacheTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (VueProfil.isSuccess) {
      setListProfils(VueProfil.data.infos);
      // console.log(listProfils);
    }
  }, [VueProfil]);

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
      field: "user_nom",
      hide: false,
      editable: false,
      headerName: "Nom",
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: "user_prenom",
      hide: false,
      editable: false,
      headerName: "Prénoms",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "user_login",
      hide: false,
      editable: false,
      headerName: "Login",
      width: 120,
      columnResizeIcon: true,
    },
    {
      field: "user_email",
      hide: false,
      editable: false,
      headerName: "Email",
      width: 220,
      columnResizeIcon: true,
    },
    {
      field: "user_tel",
      hide: false,
      editable: false,
      headerName: "Téléphone",
      width: 150,
      columnResizeIcon: true,
    },
    {
      field: "user_actif",
      hide: false,
      editable: false,
      headerName: "Actif",
      width: 100,
      columnResizeIcon: true,
      renderCell: (e) => renderItem(e.row.user_actif),
    },
    {
      field: "profil",
      hide: false,
      editable: false,
      headerName: "Profil",
      width: 150,
      columnResizeIcon: true,
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
      <FormUser
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
        profil={listProfils}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre="Supprimer?"
        message={"Voulez vous Supprimer cet utilisateur ?"}
        non="Annuler"
        oui="Oui"
        deconnect={() => supUser.mutate(idSuppr)}
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

export default VueUser;
