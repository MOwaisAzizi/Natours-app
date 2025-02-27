/* eslint-disable */
//for supporting in older browser
import '@babel/polyfill'
import { login, logout } from "../js/login";
import { updateData } from './updateSettings';
// import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.login--form')
const userDataForm = document.querySelector('.form-user-data')
const logOutBtn = document.querySelector('.nav__el--logout')

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    // displayMap(locations)
}

//for login
if (loginForm) {
    loginForm.addEventListener('DOMContentLoaded',function(){
        
        form.addEventListener('submit', function (e) {
            e.preventDefault()
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            login(email, password);
        });
    })
}

//logout
if(logOutBtn){
    logOutBtn.addEventListener('click', logout)
}

//update user settings
if (updateSettingsForm) {
    userDataForm.addEventListener('DOMContentLoaded',function(){
        updateSettingsForm.addEventListener('submit', function (e) {
            e.preventDefault()
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            updateData(name, email);
        });
    })
}
