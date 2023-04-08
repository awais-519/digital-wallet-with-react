const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// import { useHistory } from 'react-router-dom';

export const handlePaymentMethodReceived = async (event) => {
	// Send the payment details to our function.
	const paymentDetails = {
		payment_method: event.paymentMethod.id,
		shipping: {
			name: event.shippingAddress.recipient,
			phone: event.shippingAddress.phone,
			address: {
				line1: event.shippingAddress.addressLine[0],
				city: event.shippingAddress.city,
				postal_code: event.shippingAddress.postalCode,
				state: event.shippingAddress.region,
				country: event.shippingAddress.country,
			},
		},
	};
	const response = await fetch('/.netlify/functions/create-payment-intent', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ paymentDetails }),
	}).then((res) => {
		return res.json();
	});
	if (response.error) {
		// Report to the browser that the payment failed.
		console.log(response.error);
		event.complete('fail');
	} else {
		// Report to the browser that the confirmation was successful, prompting
		// it to close the browser payment method collection interface.
		event.complete('success');
		// Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
		const { error, paymentIntent } = await stripe.confirmCardPayment(
			response.paymentIntent.client_secret
		);
		if (error) {
			console.log(error);
			return;
		}
		if (paymentIntent.status === 'succeeded') {
			// const history = useHistory();
			// history.push('/success');

			event.complete('COMPLETED');
		} else {
			console.warn(
				`Unexpected status: ${paymentIntent.status} for ${paymentIntent}`
			);
		}
	}
};
