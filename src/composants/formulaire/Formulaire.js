/** @format */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Alerts from '../controls/Alerts'
import { yupResolver } from '@hookform/resolvers/yup'
import Controls from '../controls/Controls'
import ComboInput from './ComboInput'

export default function Formulaire(props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: { libelle: '' },
    resolver: yupResolver(props.schema),
  })
  let alerte = ''
  if (props.infoAlert) alerte = props.infoAlert.reponse
  return (
    <form
      onSubmit={handleSubmit(props.onSubmit)}
      style={{ marginBottom: '20px' }}>
      {props.saisie &&
        props.saisie.map((item, index) => {
          switch (item.type) {
            case 'combo':
              return (
                <ComboInput
                  id={item.id}
                  label={item.label}
                  placeholder={item.placeholder}
                  data={item.data || []}
                  {...register(item.id)}
                />
              )

            default:
              return (
                <Controls.TextInput
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  id={item.id}
                  value={item.value || ''}
                  label={item.label || ''}
                  {...register(item.id)}
                  autoFocus={props.autoFocus || false}
                  type={item.type || 'text'}
                  helperText={errors[item.id]?.message}
                  error={errors[item.id] && true}
                />
              )
          }
        })}

      <div style={{ position: 'absolute', right: '8px' }}>
        <Controls.ButtonLabel color='primary'>
          {props.valider || 'valider'}
        </Controls.ButtonLabel>
        <Controls.ButtonLabel
          color='secondary'
          onSubmit={() => props.handleClose}>
          {' '}
          Appliquer{' '}
        </Controls.ButtonLabel>
      </div>

      {alerte != '' && (
        <Alerts
          message={props.infoAlert.message}
          severity={props.infoAlert.reponse}
        />
      )}
    </form>
  )
}
