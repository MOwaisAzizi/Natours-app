/* eslint-disable */

import axios from "axios";
import { showAlert } from "./alerts";

export const updateData = async (name, email) => {
    try{
        const res = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
          data: {
            name,
            email
          }
        });
    
        if(res.data.status === 'success'){
        showAlert('success', 'Logged In Successfully!')
        }
      }
        catch(err){
        showAlert(err)
      }
}