/* eslint-disable */
//using stripe in frontend
/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Ensure Proper Stripe Initialization:// Add this line at the top of the file
// import { loadStripe } from '@stripe/stripe-js';

// const st = Stripe('pk_test_51R0gZ8PPG7IVz228E2zc4UPAsOGYKxehEzQIZN5rapfGxF7GTfFXvVNUb4BTrbsbRsZGHRnIMGkxIGjNjiYRoOHs00jqmWAgQ3')

const stripe = Stripe('pk_test_51R0gZ8PPG7IVz228E2zc4UPAsOGYKxehEzQIZN5rapfGxF7GTfFXvVNUb4BTrbsbRsZGHRnIMGkxIGjNjiYRoOHs00jqmWAgQ3');

export const bookTour = async tourId => {
    try {
      // 1) Get checkout session from API
      const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
