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
import FormStructure from "./FormStructure";
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

function VueStructure(props) {
  ////////////// Droits de l'utilisateur
  var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
  const leMenu = GroupBy(MachaineDeCrypte);
  const DroitsUser = leMenu.group["interfaces"][0];
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
  const Api = "structure-importation/ReadStructureImport.php";
  const Query = ["listeStr"];
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
      ? setTitle("Nouvelle structure ")
      : setTitle(`Modifier ${data.code_structure_fichier}`);
    setOpenModal(true);
  };

  // Modal Supression
  const FuncSuppr = (id) => {
    setOpenOuiNon(true);
    setIdSuppr(id);
  };

  // suppression d'une  devise
  const supprStruc = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    response = await axios.post(
      `devises/DeleteDevise.php?id=${values}`,
      { values },
      { headers }
    );
    handleCloseModalOuiNon();

    return response.data;
  };

  // suppression d'une devise
  const supDevise = useMutation(supprStruc, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("listeStr");
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
      field: "id",
      hide: true,
      editable: false,
      headerName: "id",
      width: 20,
      columnResizeIcon: true,
    },
    {
      field: "",
      width: 100,
      align: "center",
      renderCell: (e) => (
        <>
          <IconButton
            title="Modifier"
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
            title="Supprimer"
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
      field: "code",
      hide: false,
      editable: false,
      headerName: "Code Structure",
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "description",
      hide: false,
      editable: false,
      headerName: "Description",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_taxe",
      hide: false,
      editable: false,
      headerName: "Taxe",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_benef",
      hide: false,
      editable: false,
      headerName: "Bénéficiaire",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_ref_benef",
      hide: false,
      editable: false,
      headerName: "Référence Bénéf",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_montant",
      hide: false,
      editable: false,
      headerName: "Montant",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_num",
      hide: false,
      editable: false,
      headerName: "N° Engagement",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_num_bon",
      hide: false,
      editable: false,
      headerName: "N° bon commande",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_motif",
      hide: false,
      editable: false,
      headerName: "Motif",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_echeance",
      hide: false,
      editable: false,
      headerName: "Echéance",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_budget",
      hide: false,
      editable: false,
      headerName: "Budget",
      width: 200,
      columnResizeIcon: true,
    },
    {
      field: "pos_date",
      hide: false,
      editable: false,
      headerName: "Date",
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "pos_marche",
      hide: false,
      editable: false,
      headerName: "Marche",
      width: 200,
      columnResizeIcon: true,
      // resizable: 'true',
    },
    {
      field: "pos_retenue",
      hide: false,
      editable: false,
      headerName: "Retenue",
      width: 200,
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
      <FormStructure
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
        message={"Voulez vous Supprimer cette structure ?"}
        non="Annuler"
        oui="Oui"
        deconnect={() => supDevise.mutate(idSuppr)}
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

export default VueStructure;
