import React, { useState, useEffect } from 'react';
import {
	PaymentRequestButtonElement,
	useStripe,
} from '@stripe/react-stripe-js';
import { handlePaymentMethodReceived } from './functions/functions';

const App = () => {
	// alert('HEY THERE');

	const stripe = useStripe();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [shippingAddress, setShippingAddress] = useState('');
	const [paymentRequest, setPaymentRequest] = useState(null);

	useEffect(() => {
		if (stripe) {
			const pr = stripe.paymentRequest({
				country: 'US',
				currency: 'usd',
				total: {
					label: 'Demo total',
					amount: 1350,
				},
				requestPayerName: true,
				requestPayerEmail: true,
				requestShipping: true,
				shippingOptions: [
					{
						id: 'standard-global',
						label: 'Global shipping',
						detail: 'Arrives in 5 to 7 days',
						amount: 350,
					},
				],
			});
			// Check the availability of the Payment Request API first.
			pr.canMakePayment().then((result) => {
				if (result) {
					pr.on('paymentmethod', handlePaymentMethodReceived);
					setPaymentRequest(pr);
					alert(pr);
				}
			});
		}
	}, [stripe]);

	if (paymentRequest) {
		return <PaymentRequestButtonElement options={{ paymentRequest }} />;
	}

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleShippingAddressChange = (e) => {
		setShippingAddress(e.target.value);
	};

	const handleSubmit = (e) => {
		// e.preventDefault();
		const pr = stripe.paymentRequest({
			country: 'US',
			currency: 'usd',
			total: {
				label: 'Demo total',
				amount: 1350,
			},
			requestPayerName: true,
			requestPayerEmail: true,
			requestShipping: true,
			shippingOptions: [
				{
					id: 'standard-global',
					label: 'Global shipping',
					detail: 'Arrives in 5 to 7 days',
					amount: 350,
				},
			],
		});
		// Check the availability of the Payment Request API first.
		pr.canMakePayment().then((result) => {
			if (result) {
				pr.on('paymentmethod', handlePaymentMethodReceived);
				setPaymentRequest(pr);
				alert(pr);
			}
		});
	};

	// Use a traditional checkout form.
	return (
		<form onSubmit={handleSubmit}>
			<label>
				Name:
				<input type='text' value={name} onChange={handleNameChange} />
			</label>
			<label>
				Email:
				<input type='email' value={email} onChange={handleEmailChange} />
			</label>
			<label>
				Shipping Address:
				<textarea
					value={shippingAddress}
					onChange={handleShippingAddressChange}
				/>
			</label>
			<button type='submit'>Submit</button>
		</form>
	);
};

export default App;
