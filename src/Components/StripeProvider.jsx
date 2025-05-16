// components/StripeProvider.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RNBdePO8aWyW42oAYMVgDjOaufFIL8fZAKYhwVO7IswncauS1irbFwM9vk1YO7ywF7aHaUMcn0nVt3tVlIGmToZ00IRTyXJP4"); // Replace with your Stripe public key

const StripeProvider = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
