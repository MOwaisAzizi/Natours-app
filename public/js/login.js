/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts';

export const login = async (email,password) =>{
 try{
  //in frontend
    const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password
        }
      });

      if(res.data.status === 'success'){
      showAlert('success', 'Logged In Successfully!')
       window.setTimeout(() => {
       location.assign('/')
       }, 1500);
      }
      
 }catch(error){
  showAlert('error', error.response.data.message)
 }
}

export const logout = async () => {
  try{
    //in front end
     const res = await axios({
         method: 'GET',
         url: 'http://127.0.0.1:3000/api/v1/users/logout',
       });
       if(res.data.status === 'success') location.reload(true)

  }catch(error){
    console.log(error);
    showAlert('error','Fail to Logout. please try again!')
  }
 }
 


 