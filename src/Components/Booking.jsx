import React, { useState } from "react";
import axios from "axios";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "#a0aec0"
      }
    },
    invalid: {
      color: "#e53e3e"
    }
  }
};

const Booking = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { bookedSeats = [] } = location.state || {};

  const handlePayment = async () => {
    setLoading(true);


    try {
      const res = await axios.post(
        `http://localhost:8092/User/bookSeat/${eventId}`,
        { bookedSeats },
        { withCredentials: true }
      );

      const { clientSecret,bookingDetails } = res.data;
      console.log(res);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)
        }
      });
      
      
      if (result.error) {
        toast.error(result.error.message || "Payment failed");
        navigate(`/event/${eventId}`); // Navigate back
      } else {
        toast.success("Booking successful!");
        navigate(`/ticket/${bookingDetails.bookingId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during payment.");
      navigate(`/event/${eventId}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold">Pay via Card</h2>
          <p className="text-sm opacity-80">Enter your card details below</p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Card Number</label>
          <div className="border rounded-md p-3">
            <CardNumberElement options={elementStyle} />
          </div>
        </div>

        <div className="flex gap-4 mb-5">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Expiry</label>
            <div className="border rounded-md p-3">
              <CardExpiryElement options={elementStyle} />
            </div>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">CVC</label>
            <div className="border rounded-md p-3">
              <CardCvcElement options={elementStyle} />
            </div>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full text-white bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </div>
  );
};

export default Booking;
