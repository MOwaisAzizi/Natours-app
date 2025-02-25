/* eslint-disable */
//for supporting in older browser
import '@babel/polyfill'
import { login, logout } from "../js/login";
// import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const form = document.querySelector('.form')
const logOutBtn = document.querySelector('.nav__el--logout')
console.log(logOutBtn);


if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    // displayMap(locations)
}

if (form) {
    window.addEventListener('DOMContentLoaded',function(){
        form.addEventListener('submit', function (e) {
            e.preventDefault()
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            login(email, password);
        });
    })
}


if(logOutBtn){
    logOutBtn.addEventListener('click', logout)
}