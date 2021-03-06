/** @format */

import { Switch, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Constantes from "../../api/Constantes";

import DashBoard from "../../pages/Fenetres/DashBoard";
import MenuBanque from "../../pages/Fenetres/MenuBanque";
import DefinePassword from "../../pages/Fenetres/DefinePassword";
import MenuTresorerie from "../../pages/Fenetres/MenuTresorerie";
import Administration from "../../pages/Fenetres/Administration";
import Devises from "../../pages/Fenetres/devise/VueDevises";
import CodeBudgetaire from "../../pages/Fenetres/code-budget/VueCodeBudget";
import CategoriePaiement from "../../pages/Fenetres/categorie-paiements/VueCategoriePaiements";
import StrucImport from "../../pag../../pages/Fenetres/structure-importation/VueStructure";
import VueTypeTiers from "../../pages/Fenetres/type-tiers/VueTypeTiers";
import VueProfils from "../../pages/Fenetres/profils/VueProfils";
import Tiers from "../../pages/Fenetres/tiers/VueTiers";
import CompteTiers from "../../pages/Fenetres/CompteTiers";
import Societe from "../../pages/Fenetres/societe/Societe";
import Utilisateurs from "../../pages/Fenetres/users/VueUser";
import Banque from "../../pages/Fenetres/banque/VueBanque";
import Compte from "../../pages/Fenetres/comptes/Compte";
import VueAuditUsers from "../../pages/Fenetres/audit-connexion/VueAudit";
import AuditsSystem from "../../pages/Fenetres/audit-systeme/VueAudit";
import VueSites from "../../pages/Fenetres/sites/VueSites";
import Flux from "../../pages/Fenetres/flux/VueFlux";
import Rejets from "../../pages/Fenetres/rejets/VueRejets";
import Securite from "../../pages/Fenetres/securite/VueSecurite";
import Parametrage from "../../pages/Fenetres/Parametrage";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import SecurityIcon from "@material-ui/icons/Security";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import CryptFunc from "../../functions/CryptFunc";
import AssistantPhotoIcon from "@material-ui/icons/AssistantPhoto";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ApartmentIcon from "@material-ui/icons/Apartment";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import GroupIcon from "@material-ui/icons/Group";
import PaymentIcon from "@material-ui/icons/Payment";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import SettingsIcon from "@material-ui/icons/Settings";
import BusinessIcon from "@material-ui/icons/Business";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import IntEngagements from "../../pages/Fenetres/IntEngagements";
import GestImport from "../../pages/Fenetres/gestion-importation/VueImport";
import SaisieEngagement from "../../pages/Fenetres/saisie-engagements/VueEngagements";
import Paiements from "../../pages/Fenetres/Paiements";
import Valider from "../../pages/Fenetres/Valider";
import Autoriser from "../../pages/Fenetres/Autoriser";
import Approuver from "../../pages/Fenetres/Approuver";
import Cheques from "../../pages/Fenetres/Cheques";
import Virements from "../../pages/Fenetres/Virements";
import Traites from "../../pages/Fenetres/Traites";
import VueRetrais from "../../pages/Fenetres/VueRetrais";
import VueFlux from "../../pages/Fenetres/flux/VueFlux";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

function Chemins(props) {
  const [listChemins, setListChemins] = useState([]);
  const MenuCreator = (id) => {
    const menu_admin = [];
    var MachaineDeCrypte = CryptFunc(localStorage.getItem("_Drt"), 0);
    MachaineDeCrypte.map((item) => {
      if (item.idmenu == id) {
        menu_admin.push(item.smenu_libelle);
      }
    });
    const uniqueSet = new Set(menu_admin);
    return [...uniqueSet];
  };
  const roads = {
    content: {
      body: [
        {
          _uid: "BUY6Drn9e1",
          lien: "/accueil/banque",
          component: (
            <MenuBanque
              icone={<SupervisorAccountIcon fontSize="large" />}
              titre="Banque"
              menu={MenuCreator(2)}
            />
          ),
        },
      ],
    },
  };

  return (
    <>
      <Switch>
        // Routes niveau 1
        <Route exact path="/accueil" component={DashBoard} />
        // Routes niveau 2
        <Route exact path="/accueil/dashboard" component={DashBoard} />
        <Route
          path="/accueil/definePassword"
          render={() => (
            <DefinePassword
              icone={<SupervisorAccountIcon fontSize="large" />}
              titre="Banque"
              menu={MenuCreator(2)}
            />
          )}
        />
        <Route
          path="/accueil/banque"
          render={() => (
            <MenuBanque
              icone={<SupervisorAccountIcon fontSize="large" />}
              titre="Banque"
              menu={MenuCreator(2)}
            />
          )}
        />
        <Route
          exact
          path="/accueil/tresorerie"
          render={() => (
            <MenuTresorerie
              icone={<SupervisorAccountIcon fontSize="large" />}
              titre="Tresorerie"
              menu={MenuCreator(3)}
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          exact
          path="/accueil/parametre"
          render={() => (
            <Parametrage
              icone={<SettingsIcon fontSize="large" />}
              titre="Param??trage g??n??ral"
              menu={MenuCreator(4)}
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          exact
          path="/accueil/administration"
          render={() => (
            <Administration
              icone={<SupervisorAccountIcon fontSize="large" />}
              titre="Administration"
              menu={MenuCreator(5)}
              infoCookie={props.infoCookie}
            />
          )}
        />
        // Routes niveau 3
        {/* {<Route
          path={'/accueil/administration/profils'}
          render={() => (
            <Profils
              icone={<SupervisorAccountIcon fontSize='large' />}
              titre='Profil'
              infoCookie={props.infoCookie}
            />
          )}
        />} */}
        <Route
          path={"/accueil/administration/profils"}
          render={() => (
            <VueProfils
              icone={<SyncAltIcon fontSize="large" />}
              titre="Profils"
            />
          )}
        />
        <Route
          path={"/accueil/administration/utilisateurs"}
          render={() => (
            <Utilisateurs
              icone={<SupervisedUserCircleIcon fontSize="large" />}
              titre="Utilisateurs"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/administration/securite"}
          render={() => (
            <Securite
              icone={<SecurityIcon fontSize="large" />}
              titre="S??curit??"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/administration/audits-connexions"}
          render={() => (
            <VueAuditUsers
              icone={<AssistantPhotoIcon fontSize="large" />}
              titre="Audits Utilisateurs"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/sites"}
          render={() => (
            <VueSites
              icone={<AccountTreeIcon fontSize="large" />}
              titre="Sites"
            />
          )}
        />
        <Route
          path={"/accueil/administration/audits-systemes"}
          render={() => (
            <AuditsSystem
              icone={<AccountTreeIcon fontSize="large" />}
              titre="Audits syst??me"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/devise"}
          render={() => (
            <Devises
              icone={<MonetizationOnIcon fontSize="large" />}
              titre="Devises"
            />
          )}
        />
        <Route
          path={"/accueil/parametre/societes"}
          render={() => (
            <Societe
              icone={<BusinessIcon fontSize="large" />}
              titre="Soci??t??s"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/banques"}
          render={() => (
            <Banque
              icone={<AccountBalanceIcon fontSize="large" />}
              titre="Banques"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/compte"}
          render={() => (
            <Compte
              icone={<AccountBalanceWalletIcon fontSize="large" />}
              titre="Comptes bancaires"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/flux"}
          render={() => (
            <VueFlux icone={<SyncAltIcon fontSize="large" />} titre="Flux" />
          )}
        />
        {/* <Route
          path={'/accueil/parametre/flux'}
          render={() => (
            <Flux
              icone={<SyncAltIcon fontSize='large' />}
              titre='Flux'
              infoCookie={props.infoCookie}
            />
          )}
        /> */}
        <Route
          path={"/accueil/parametre/code-budgetaire"}
          render={() => (
            <CodeBudgetaire
              icone={<AccountBalanceWalletIcon fontSize="large" />}
              titre="Code Budg??taire"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/categorie-paiements"}
          render={() => (
            <CategoriePaiement
              icone={<PaymentIcon fontSize="large" />}
              titre="Categorie Paiement"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/categorie-paiements"}
          render={() => (
            <CategoriePaiement
              icone={<PaymentIcon fontSize="large" />}
              titre="Categorie Paiement"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/type-tiers"}
          render={() => (
            <VueTypeTiers
              icone={<MergeTypeIcon fontSize="large" />}
              titre="Type tiers"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/tiers"}
          render={() => (
            <Tiers
              icone={<GroupIcon fontSize="large" />}
              titre="Tiers"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          exact
          path={"/accueil/parametre/compte-tiers"}
          render={() => (
            <Tiers
              icone={<GroupIcon fontSize="large" />}
              titre="Comptes Tiers"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/parametre/structure-d-importation"}
          render={() => (
            <StrucImport
              icone={<GroupIcon fontSize="large" />}
              titre="Structure Importation"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/integration-engagement"}
          render={() => (
            <IntEngagements
              icone={<SystemUpdateAltIcon fontSize="large" />}
              titre="Int??gration Engagement"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/rejets-importations"}
          render={() => (
            <Rejets
              icone={<SystemUpdateAltIcon fontSize="large" />}
              titre="Rejets integrations"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/gestion-importations"}
          render={() => (
            <GestImport
              icone={<SystemUpdateAltIcon fontSize="large" />}
              titre="Gestion importation"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/saisie-engagement"}
          render={() => (
            <SaisieEngagement
              icone={<SystemUpdateAltIcon fontSize="large" />}
              titre="Saisie directe"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/paiements"}
          render={() => (
            <Paiements
              icone={<SystemUpdateAltIcon fontSize="large" />}
              titre="Cr??er Paiements"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/valider"}
          render={() => (
            <Valider
              icone={<CheckCircleOutlineIcon fontSize="large" />}
              titre="Valider paiements"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/Autoriser"}
          render={() => (
            <Autoriser
              icone={<CheckCircleOutlineIcon fontSize="large" />}
              titre="Autoriser paiements"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/Approuver"}
          render={() => (
            <Approuver
              icone={<CheckCircleOutlineIcon fontSize="large" />}
              titre="Approuver paiements"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/Cheques"}
          render={() => (
            <Cheques
              icone={<AccountBalanceIcon fontSize="large" />}
              titre="Ch??ques"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/Virements"}
          render={() => (
            <Virements
              icone={<AccountBalanceIcon fontSize="large" />}
              titre="Ch??ques"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/Traites"}
          render={() => (
            <Traites
              icone={<AccountBalanceIcon fontSize="large" />}
              titre="Ch??ques"
              infoCookie={props.infoCookie}
            />
          )}
        />
        <Route
          path={"/accueil/tresorerie/retrait-paiement"}
          render={() => (
            <VueRetrais
              icone={<AccountBalanceIcon fontSize="large" />}
              titre="Retraits paiements"
              infoCookie={props.infoCookie}
            />
          )}
        />
        // Routes niveau 4
        <Route
          path={"/accueil/parametre/compte-tiers/:codeTiers"}
          render={() => (
            <CompteTiers
              icone={<GroupIcon fontSize="large" />}
              titre="Comptes tiers"
              infoCookie={props.infoCookie}
            />
          )}
        />
      </Switch>
    </>
  );
}

export default Chemins;
