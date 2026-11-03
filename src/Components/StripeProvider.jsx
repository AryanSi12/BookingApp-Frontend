// components/StripeProvider.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51UXcqZPVJOkd7l6vX4HUPYfbhkSQE8tuxWOzlXp0eB9ujTfdsqNtalfhnWWw6O5CtkHHVkFcePCGp1JzKlYFLapw00TPMdw5dT");

const StripeProvider = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
