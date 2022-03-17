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
import FormCodeBudget from "./FormCodeBudget";
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
  const DroitsUser = leMenu.group["Eléments paiements"][3];
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
  const [listBudget, setListBudget] = useState([]); // liste des profils

  // Variables
  const Api = "code-budget/ReadCB.php";
  const Query = ["listeCode"];
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
      ? setTitle("Nouveau code budget ")
      : setTitle(`Modifier ${data.CODE_CB}`);
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
      `code-budget/DeleteCB.php?id=${values}`,
      { values },
      { headers }
    );
    handleCloseModalOuiNon();

    return response.data;
  };

  // suppression d'un User
  const supUser = useMutation(supprUser, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("listeCode");
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
    let response = await axios("type-budget/ReadTB.php", {
      headers,
    });
    return response.data;
  };

  const VueBudget = useQuery(["listeBudget"], fetchData, {
    cacheTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (VueBudget.isSuccess) {
      setListBudget(VueBudget.data.infos);
      // console.log(listProfils);
    }
  }, [VueBudget]);

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
      field: "CODE_CB",
      hide: false,
      editable: false,
      headerName: "Code",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "LIB_CB",
      hide: false,
      editable: false,
      headerName: "Libellé",
      width: 320,
      columnResizeIcon: true,
    },
    {
      field: "CODE_TYPE_BUDGET",
      hide: false,
      editable: false,
      headerName: "Type budget",
      width: 220,
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
      <FormCodeBudget
        openModal={openModal}
        handleClose={handleCloseModal}
        initialModal={initialModal}
        titreModal={title}
        queryClient={queryClient}
        setNotify={setNotify}
        setOpenNotif={setOpenNotif}
        budget={listBudget}
      />
      <ModalOuiNon
        open={openOuiNon}
        onClose={handleCloseModalOuiNon}
        titre="Supprimer?"
        message={"Voulez vous Supprimer ce code budgétaire ?"}
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
