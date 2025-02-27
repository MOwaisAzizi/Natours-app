/* eslint-disable */
//for supporting in older browser
import '@babel/polyfill'
import { login, logout } from "../js/login";
import { updateSettings } from './updateSettings';
// import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.login--form')
const userDataForm = document.querySelector('.form-user-data')
const userpasswordForm = document.querySelector('.form-user-password')
const logOutBtn = document.querySelector('.nav__el--logout')



if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    // displayMap(locations)
}

//for login
if (loginForm) {
    window.addEventListener('DOMContentLoaded',function(){
        loginForm.addEventListener('submit', function (e) {
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

//update user data
if (userDataForm) {
    window.addEventListener('DOMContentLoaded',function(){
        userDataForm.addEventListener('submit', function (e) {
            e.preventDefault()
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            updateSettings({name, email}, 'data');
        });
    })
}

//update user passowrd
if (userpasswordForm) {
    window.addEventListener('DOMContentLoaded',function(){
        userpasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault()

            document.querySelector('.btn-save-password').textContent = 'Updateing...';

            const passwordCurrent = document.getElementById('password-current').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;
            //it will take some time so we await it (promise return)
            await updateSettings({passwordCurrent, password, passwordConfirm }, 'password');

            document.querySelector('.btn-save-password').textContent = 'Save Password'
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
            
        });
    })
}