/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// export const updateData = async (name, email) => {
//   try{
//       const res = await axios({
//         method: 'PATCH',
//         url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
//         data: {
//           name,
//           email
//         }
//       });
  
//       if(res.data.status === 'success'){
//       showAlert('success', 'Your Data Successfully Updated!')
//       }
//     }
//       catch(err){
//       showAlert(err.response.data.message)
//     }
// }

//inorder to use it for both update data and update password

export const updateSettings = async (data, type) => {
    try{
         const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' :
                               'http://127.0.0.1:3000/api/v1/users/updateMe'
        const res = await axios({
          method: 'PATCH',
          url,
          data
        });
    console.log(res);
    
        if(res.data.status === 'success'){
        showAlert('success', `${type.toUpperCase()} Successfully Updated!`)
        }
      }
        catch(err){
        // showAlert(err.response.data.message)
        console.log(err);
        
      }
}