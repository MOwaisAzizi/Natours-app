/* eslint-disable */
// import axios from 'axios'

const login = async (email,password) =>{
 try{
    const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password
        }
      });
      console.log(res);
      
      
 }catch(err){
    console.log(err);
 }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form')
    console.log(form);
    
    if(!form) console.log('not found form');
    
    form.addEventListener('submit', function(e) {
        console.log('submitting1');
        e.preventDefault();
        console.log('submitting2');
        
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        login(email, password);
    });
});
