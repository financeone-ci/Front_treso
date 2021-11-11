/** @format */

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import SettingsIcon from '@material-ui/icons/Settings';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { NavLink } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 'bold',
  },
}));

export default function MenuPrincipal() {
  const classe = useStyles();
  return (
    <div>
      <NavLink
        to="/accueil/dashboard"
        className={classe.link}
        activeClassName="activeClass"
      >
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon className="anime" />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
      </NavLink>
      <NavLink
        to="/accueil/banque"
        className={classe.link}
        activeClassName="activeClass"
      >
        <ListItem button>
          <ListItemIcon>
            <AccountBalanceIcon className="anime" />
          </ListItemIcon>
          <ListItemText primary="Banque" />
        </ListItem>
      </NavLink>
      <NavLink
        to="/accueil/tresorerie"
        className={classe.link}
        activeClassName="activeClass"
      >
        <ListItem button>
          <ListItemIcon>
            <AccountBalanceWalletIcon className="anime" />
          </ListItemIcon>
          <ListItemText primary="Trésorerie" />
        </ListItem>
      </NavLink>
      <Divider />
      <NavLink
        to="/accueil/parametre"
        className={classe.link}
        activeClassName="activeClass"
      >
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon className="anime" />
          </ListItemIcon>
          <ListItemText primary="Paramétrage général" />
        </ListItem>
      </NavLink>
      <NavLink
        to="/accueil/administration"
        className={classe.link}
        activeClassName="activeClass"
      >
        <ListItem button>
          <ListItemIcon>
            <SupervisorAccountIcon className="anime" />
          </ListItemIcon>
          <ListItemText primary="Administration" />
        </ListItem>
      </NavLink>
    </div>
  );
}
