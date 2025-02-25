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
        // showAlert('success', 'Logged In Successfully!2' )
       window.setTimeout(() => {
       location.assign('/')
       }, 1500);
      }
      
 }catch(error){
  // showAlert('error', error.response.data.message )
 }
}

export const logout = async () => {
  console.log('Loging out-----');
  
  try{
     const res = await axios({
         method: 'GET',
         url: 'http://127.0.0.1:3000/api/v1/users/logout',
       });
       console.log(res);
       
       if(res.data.status === 'success') location.reload(true)

  }catch(error){
    console.log(error);
    
    // showAlert('error','Fail to Logout. please try again!' )
  }
 }
 