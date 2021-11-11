/** @format */

import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import Deroule from './Deroule'
import Constantes from '../../api/Constantes'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    height: 400,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    border: 'solid rgba(200,200,200,0.2) 2px',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nestedlist: {
    backgroundColor: ' rgba(200,200,200,0.2) ',
    fontSize: '16px',
    fontWeight: 'bold',
  }

}))

export default function NestedList(props) {
  if (props.donnees != {}) {
    {
      Object.keys(props.donnees).map(function (smenu_libelle, keyIndex) {
        {
          // console.log(props.donnees[smenu_libelle])
        }
      })
    }
  }

  const classes = useStyles()
  const [esmenu, setEsmenu] = useState([])
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    fetch(Constantes.URL + '/smenu.php?type=R')
      .then((response) => response.json())
      .then((data) => setEsmenu(data.infos))
    setLoader(true)
  }, [])
  const regr = (abc) => {
    const Arr = []
    Object.entries(props.donnees).map(([key, value], i) => {
      if (value.idsmenu == abc) {
        Arr.push(value)
      }
      return abc
    })
    return Arr
  }

  return (
    <List
      component='nav'
      aria-labelledby={props.titre}
      subheader={
        <ListSubheader component='div' id='nested-list-subheader' className={classes.nestedlist} >
         {props.titre}
        </ListSubheader>
      }
      dense={true}
      className={classes.root}>
      {loader &&
        esmenu.map((item) => (
          <>
            <Deroule
              clax={classes.nested}
              libelle={item.smenu_libelle}
              datax={regr(item.smenu_id)}
              lib={item.smenu_libelle}
            />
          </>
        ))}
    </List>
  )
}
