 /* eslint-disable */
import '@babel/polyfill'
import { login } from "../js/login";
import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const form = document.querySelector('.form')

//Values
const password = document.getElementById('password').value;
const email = document.getElementById('email').value;

if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}

    if(form){
        form.addEventListener('submit', function(e) {
            console.log('submitting1');
            login(email, password);
        });
    }


