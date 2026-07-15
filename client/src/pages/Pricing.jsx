import React, { useState } from "react";
import { FaArrowLeft, FaCheck, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ServerUrl } from "./../App";
import axios from "axios";

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      amount: 0, // Added for backend calculation
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview credits",
        "Basic performance reports",
        "Voice interview access",
        "Limited history tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      amount: 100, // Added for backend calculation
      credits: 150,
      description: "Everything you need to ace your upcoming interviews.",
      features: [
        "150 AI Interview credits",
        "Detailed PDF reports",
        "Performance analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      amount: 500, // Added for backend calculation
      credits: 650,
      description: "Best value for serious job seekers.",
      features: [
        "650 AI Interview credits",
        "Unlimited history tracking",
        "Resume parsing & gap analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      // 1. Create order on the backend via Axios
      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: plan.amount, // FIX: reference plan.amount, not naked amount
          credits: plan.credits,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Change to your token key
          },
          withCredentials: true,
        },
      );

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "SmartMock.AI",
        description: `Upgrading to ${plan.name}`,
        order_id: result.data.id,
        handler: async (response) => {
          // 3. Verify Payment on success
          try {
            // FIX: Extract variables from Razorpay's callback response object
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;

            const verifyRes = await axios.post(
              ServerUrl + "/api/payment/verify",
              { razorpay_order_id, razorpay_payment_id, razorpay_signature },
              { withCredentials: true }, // Keeps auth state aligned if needed
            );

            // FIX: Axios maps response bodies to .data immediately
            if (verifyRes.status === 200 || verifyRes.data.success) {
              alert("Payment successful! Your credits have been added.");
              navigate("/"); 
            } else {
              alert(verifyRes.data.message || "Payment verification failed.");
            }
          } catch (verifyError) {
            console.error("Verification Error:", verifyError);
            const errMsg =
              verifyError.response?.data?.message || "Error verifying payment.";
            alert(errMsg);
          }
        },
        theme: {
          color: "#10b981",
        },
      };
      if (!window.Razorpay) {
        alert(
          "Razorpay SDK failed to load. Please check your internet connection.",
        );
        setLoadingPlan(null);
        return;
      }

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("Payment failed or was cancelled. Please try again.");
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Order Creation Error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Something went wrong initializing the payment.";
      alert(errMsg);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6">
      <div className="max-w-6xl mx-auto mb-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
        <button
          onClick={() => navigate("/")}
          className="p-3 rounded-full bg-white shadow hover:shadow-md transition text-gray-600 absolute sm:static top-0 left-0"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <div className="text-center w-full mt-12 sm:mt-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Choose your plan
          </h1>
          <p className="text-gray-500 mt-3 text-base md:text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isLoading = loadingPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={!plan.default ? { y: -5 } : {}}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 border 
                  ${
                    isSelected
                      ? "border-emerald-500 shadow-xl bg-white scale-[1.02]"
                      : "border-gray-200 bg-white shadow-sm hover:shadow-md"
                  }
                  ${plan.default ? "cursor-default opacity-90" : "cursor-pointer"}
                `}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-emerald-500 text-white px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </div>
                <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <FaCheck className="flex-shrink-0 h-5 w-5 text-emerald-500 mt-0.5" />
                    <span className="ml-3 text-sm text-gray-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Fixed syntax error here
                  if (!isSelected) {
                    setSelectedPlan(plan.id);
                  } else {
                    handlePayment(plan);
                  }
                }}
                disabled={plan.default || loadingPlan !== null}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex justify-center items-center gap-2 ${
                  plan.default
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected
                      ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing...
                  </>
                ) : plan.default ? (
                  "Current Plan"
                ) : isSelected ? (
                  "Pay Now" // Changed text when the plan is selected and ready to pay
                ) : (
                  "Select Plan"
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
