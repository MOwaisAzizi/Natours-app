/* eslint-disable */
import axios from "axios";

window.onload =  function() {
    console.log(typeof axios);
    console.log('performing.........');
    
}

const login = async (email,password) =>{
    console.log('Running......');
    
 try{
    const res = await axios({
        method:'POST',
        url:'http://127.0.0.1:3000/api/v1/user/login',
        data: {
            email:email,
            password: password
        }
      })
      console.log(res.data);
      
 }catch(err){
    console.log(err);
 }
}

// document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form')
    console.log(form);
    
    if(!form) console.log('not found form');
    
    form.addEventListener('submit', function(e) {
        console.log('submitting1');
        e.preventDefault();
        console.log('submitting2');
        
        // const password = document.getElementById('password').value;
        // const email = document.getElementById('email').value;
        // login(email, password);
    });
// });
