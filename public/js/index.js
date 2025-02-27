/* eslint-disable */
//for supporting in older browser
import '@babel/polyfill'
import { login, logout } from "../js/login";
import { updateData } from './updateSettings';
// import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const form = document.querySelector('.login--form')
const updateSettingsForm = document.querySelector('.form-user-data')
const logOutBtn = document.querySelector('.nav__el--logout')

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    // displayMap(locations)
}

//for login
if (form) {
    window.addEventListener('DOMContentLoaded',function(){
        console.log('Hello from Login');
        
        form.addEventListener('submit', function (e) {
            e.preventDefault()
            const password = form.getElementById('password').value;
            const email = form.getElementById('email').value;
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
    window.addEventListener('DOMContentLoaded',function(){
        updateSettingsForm.addEventListener('submit', function (e) {
            e.preventDefault()
            const name = updateSettingsForm.getElementById('name').value;
            const email = updateSettingsForm.getElementById('email').value;
            updateData(email, password);
        });
    })
}
