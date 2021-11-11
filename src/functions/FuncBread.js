/** @format */

import { NavLink, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles, Typography, Breadcrumbs, Link } from '@material-ui/core'

const FuncBread = () => {
  let location = useLocation()
  const Isplit = (str) => {
    return str.split('/')
  }

  const url = location.pathname
  const bread = Isplit(url)
  const last = bread[bread.length - 1]
  const fbread = bread.filter((item) => {
    return item !== last && item !== bread[0]
  })

  let lien = fbread[0]
  const lien_tab = []
  for (let i = 0; i < fbread.length; i++) {
    lien_tab[i] = lien
    // if(i!=fbread.length)
    lien = lien + '/' + fbread[i + 1]
  }

  const useStyle = makeStyles((theme) => ({
    root: {},

    breadStyle: {
      fontSize: '12px',
      '& .MuiBreadcrumbs-separator': { margin: '3px' },
    },
  }))
  const classes = useStyle()

  return (
    <>
      <Breadcrumbs aria-label='breadcrumb' className={classes.breadStyle}>
        {fbread.map((item, index) => (
          <NavLink
            key={uuidv4()}
            to={'/' + lien_tab[index]}
            style={{ textTransform: 'capitalize' }}>
            {item}
          </NavLink>
        ))}
        <Typography color='textPrimary' className={classes.breadStyle}>
          <span style={{ textTransform: 'capitalize' }}>{last}</span>
        </Typography>
      </Breadcrumbs>
    </>
  )
}

export default FuncBread
