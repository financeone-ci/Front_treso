/** @format */

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Controls from '../controls/Controls'
import axios from '../../api/axios'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
})

export default function TableauSimple(props) {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const columns = props.columns
  const rows = props.rows
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const editDroit = (_id, _type, _value) => {
    axios({
      method: 'post',
      url: 'droits.php?type=U',
      data: { id: _id, column: _type, value: _value },
    })
      .then((response) => {
        if (response.data.reponse == 'success') {
          props.fonctionOK()
        } else {
          /*
        setNotify({
          type: 'error',
          message: ' response.data.message',
        })
        setOpenNotif(true)
        */
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <TableContainer className={classes.container}>
        {rows != [] && (
          <Table stickyHeader aria-label='sticky table' size='small'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.code}
                      rowH>
                      {columns.map((column) => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? (
                              value == 1 ? (
                                <Controls.SwitchIos
                                  edit={editDroit}
                                  checked={{
                                    checkedB: true,
                                  }}
                                  data={{
                                    id: row.droits_id,
                                    column: column.id,
                                    value: value,
                                  }}
                                  fonctionOK={props.fonctionOK}
                                />
                              ) : (
                                <Controls.SwitchIos
                                  edit={editDroit}
                                  checked={{
                                    checkedB: false,
                                  }}
                                  data={{
                                    id: row.droits_id,
                                    column: column.id,
                                    value: value,
                                  }}
                                  fonctionOK={props.fonctionOK}
                                />
                              )
                            ) : (
                              value
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}
