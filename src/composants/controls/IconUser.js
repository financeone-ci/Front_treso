/** @format */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ModalOuiNon from "./modal/ModalOuiNon";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useHistory } from "react-router";
import { useCookies } from "react-cookie";
import Constantes from "../../api/Constantes";
import jwt from "jsonwebtoken";
import { useMutation } from "react-query";
import ReadCookie from "../../functions/ReadCookie";
import axios from "../../api/axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function IconUser() {
  const [cookies, setCookie, removeCookie] = useCookies(["_Jst"]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [opens, setOpens] = React.useState(false);
  const open = Boolean(anchorEl);
  var b = document.cookie.match("(^|;)\\s*_Jst\\s*=\\s*([^;]+)");

  let history = useHistory();
  let login = "";
  let id = "";
  let nom = "";

  // lire les infos du cookie
  const cookieInfo = ReadCookie();

  // Création de la ligne de déconnexion
  // Création d'une nouvelle user
  const deco = async (values) => {
    let response = "";
    const headers = {
      Authorization: cookieInfo,
    };

    response = await axios.post(
      "audits-connexion/CreateAudit.php",
      { values },
      { headers }
    );

    return response.data;
  };
  const decoMutation = useMutation(deco, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: () => {
      console.log("ee");
    },
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setOpens(false);
  };

  const StopCnx = () => {
    removeCookie("_Jst", {
      expires: new Date(2021, 1, 1),
      path: "/",
    });
    // fetch(Constantes.URL + '/auditCnx.php?type=C&deconnexion&user_id='+id+'&user_nom='+nom+'&raison=deconnexion')
    decoMutation.mutate(
      { id: "" },
      {
        onSuccess: (e) => {
          console.log(e);
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );

    history.push("/");
    setOpens(false);
  };

  const handleClickOpen = () => {
    setOpens(true);
  };
  try {
    var infos = cookies._Jst;
    var donneesUser = jwt.verify(infos, Constantes.token);
    login = donneesUser.user_login;
    id = donneesUser.user_id;
    nom =
      donneesUser.user_nom + " " + donneesUser.user_prenom + " (" + login + ")";
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Mon profile</MenuItem>
        <MenuItem onClick={handleClickOpen}>Déconnexion</MenuItem>
      </Menu>

      <ModalOuiNon
        open={opens}
        onClose={handleCloseModal}
        titre="Déconnexion"
        message={"Voulez vous quitter l'application ?"}
        non="Annuler"
        oui="Oui"
        deconnect={StopCnx}
      />
    </>
  );
}

export default IconUser;
