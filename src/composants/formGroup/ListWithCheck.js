import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from '../../api/axios'
import {useMutation, useQueryClient} from 'react-query'
import { v4 as uuidv4 } from 'uuid';
import ReadCookie from '../../functions/ReadCookie'
import { Notification } from '../controls/toast/MyToast'


export default function ListWithCheck(props) {
  const queryClient = useQueryClient()
  let initialState = {}
  props.elements.map((item, key, value)=> {
    item.value == "1" ? value = true : value = false;
   initialState = {...initialState, [item.champ]: value  }
  } )
  const [state, setState] = React.useState(initialState);
  const [openNotif, setOpenNotif] = React.useState(false)
  const [notify, setNotify] = React.useState({
    type: '',
    message: '',
  })
  const cookieInfo = ReadCookie()
  // changement de state
  const submitClick = async (id, champ, value) => {
    let response = ''
    const headers = {
      Authorization: cookieInfo,
    }
    const id_ = id[0]
    const champ_ = id[1]
    const value_ = id[2]
    
      response = await axios.post(
       // props.api+id[0],
         props.api+id_+"&champ="+champ_+"&val="+value_,
        {  val: value_ },
        { headers },
      )
     
     
       
    return response.data
  }

  // changement de state
  const validation = useMutation(submitClick, {
    onSuccess: (data) => {
      if(data.reponse == "success"){
      
      }
      queryClient.invalidateQueries(props.queryClient)
      setNotify({
        type: data.reponse,
        message: data.message,
      })
      setOpenNotif(true)
     
    },
    onError: (e) => {
      console.log(e)
      setNotify({
        message: 'Connexion au service impossible',
        type: 'error',
      })
      setOpenNotif(true)
    },
  })
  const handleChange = (event) => {
    let valeurBDD = 0
    if(state[event.target.name] == true){
      valeurBDD =0
    }else{ 
      valeurBDD =1
    }
    setState({ ...state, [event.target.name]: event.target.checked });
     validation.mutate([event.target.id, event.target.name, valeurBDD], {
       onSuccess: (e) => {
        
       },
       onError: (e) => {
         console.log(e)
       },
     })
        
  };

  return (
  <>
    <h3>{props.label}</h3>
    <FormGroup row>
    <p></p>
     
     {
       props.elements.map((item)=>(
         <FormControlLabel
         key={uuidv4()}
          control={
            <Checkbox
              id={item.id}
              checked={state[item.champ]}
              onChange={handleChange}
              name={item.champ}
              color="primary"
            />
          }
          label={item.title}
        />
       ) )
     }
      

   
    </FormGroup>
    <hr></hr>
    <Notification
        type={notify.type}
        message={notify.message}
        open={openNotif}
        setOpen={setOpenNotif}
      />
    </>
  );
}