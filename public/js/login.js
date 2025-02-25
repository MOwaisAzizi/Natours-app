/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts';

export const login = async (email,password) =>{
 try{

    const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password
        }
      });

      if(res.data.status === 'success'){
        showAlert('Logged In Successfully!2', 'success' )
       window.setTimeout(() => {
       location.assign('/')
       }, 1500);
      }
      
 }catch(error){
  showAlert(error.response.data.message,'error' )
 }
}
