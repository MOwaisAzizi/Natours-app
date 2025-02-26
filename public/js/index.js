/* eslint-disable */
//for supporting in older browser
import '@babel/polyfill'
import { login, logout } from "../js/login";
// import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const form = document.querySelector('.login--form')
console.log(form);
console.log('loging form😎😋😊');


const logOutBtn = document.querySelector('.nav__el--logout')

console.log(form);

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    // displayMap(locations)
}

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


if(logOutBtn){
    logOutBtn.addEventListener('click', logout)
}