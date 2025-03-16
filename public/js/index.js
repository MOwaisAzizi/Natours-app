/* eslint-disable */
import '@babel/polyfill'
import { login, logout } from "../js/login";
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { displayMap } from './mapBox';

//DOM element
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.login--form')
const userDataForm = document.querySelector('.form-user-data')
const userpasswordForm = document.querySelector('.form-user-password')
const logOutBtn = document.querySelector('.nav__el--logout')
const bookBtn = document.getElementById('book-tour')

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}

if (loginForm) {
    window.addEventListener('DOMContentLoaded', function () {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault()
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            login(email, password);
        });
    })
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout)
}

if (userDataForm) {
    window.addEventListener('DOMContentLoaded', function () {
        userDataForm.addEventListener('submit', function (e) {
            e.preventDefault()
            const form = new FormData()
            form.append('name', document.getElementById('name').value)
            form.append('email', document.getElementById('email').value)
            form.append('photo', document.getElementById('photo').files[0])
            updateSettings(form, 'data');
        });
    })
}

if (userpasswordForm) {
    window.addEventListener('DOMContentLoaded', function () {
        userpasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault()

            document.querySelector('.btn-save-password').textContent = 'Updateing...';

            const passwordCurrent = document.getElementById('password-current').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;

            await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

            document.querySelector('.btn-save-password').textContent = 'Save Password'
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';

        });
    })
}

if (bookBtn) {
    window.addEventListener('DOMContentLoaded', function () {
        bookBtn.addEventListener('click', async e => {
            e.target.textContent = 'Processing...'
            const { tourId } = e.target.dataset
            bookTour(tourId)
        })
    })
}