import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { SubscriptionList } from "./components/SubscriptionList";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { SubscriptionSuccess } from "./components/SubscriptionSuccess";
import { UserDashboard } from "./components/UserDashboard";
import {
  authApi,
  subscriptionApi,
  type BackendUser,
  type UserSubscription,
} from "./services/api";

export interface Subscription {
  id: number;
  name: string;
  price: number;
  data: number;
  features: string[];
  popular?: boolean;
}

// Backend plan response
export interface PlanResponse {
  planId: number;
  name: string;
  price: number;
  includedGb: number;
  overagePrice: number;
  createdAt: string;
  active: boolean;
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
}

export interface UserAccount {
  id?: string;
  email: string;
  userData: UserData;
  subscription: Subscription;
  startDate: string;
  dataUsed: number;
}

const availableSubscriptions: Subscription[] = [
  {
    id: 1,
    name: "Basic",
    price: 9.99,
    data: 5,
    features: ["5 GB data", "Standard speed", "Email support"],
  },
  {
    id: 2,
    name: "Standard",
    price: 19.99,
    data: 15,
    features: ["15 GB data", "High speed", "Priority support", "Free roaming"],
    popular: true,
  },
  {
    id: 3,
    name: "Premium",
    price: 29.99,
    data: 30,
    features: [
      "30 GB data",
      "Ultra-fast speed",
      "24/7 support",
      "Free roaming",
      "Unlimited calls",
    ],
  },
  {
    id: 4,
    name: "Unlimited",
    price: 49.99,
    data: 0,
    features: [
      "Unlimited data",
      "Ultra-fast speed",
      "24/7 VIP support",
      "Global roaming",
      "Unlimited calls & SMS",
    ],
  },
];

export default function App() {
  const [step, setStep] = useState<
    "login" | "select" | "form" | "success" | "dashboard"
  >("login");
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  // User state from localStorage
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<
    UserSubscription[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const subscriptions = availableSubscriptions;
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as BackendUser;
        setCurrentUser(user);
        loadUserSubscriptions(user.userId);
        setStep("dashboard");
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const loadUserSubscriptions = async (userId: number) => {
    try {
      const subs = await subscriptionApi.getUserSubscriptions(userId);
      setUserSubscriptions(subs);
    } catch (error) {
      console.error("Failed to load user subscriptions:", error);
      setUserSubscriptions([]);
    }
  };

  const handleLogin = async (email: string) => {
    try {
      console.log("=== Login Request ===");
      console.log("Email:", email);

      const user = await authApi.login({ email });

      console.log("=== Login Success ===");
      console.log("User:", user);

      // Save user to localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Load user subscriptions
      await loadUserSubscriptions(user.userId);

      // Update state
      setCurrentUser(user);
      setStep("dashboard");
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error);

      // Return error message to display in login form
      return {
        success: false,
        error: error.message || "Login failed. Please try again.",
      };
    }
  };

  const handleLogout = async () => {
    console.log("=== Logout ===");

    // Clear user from localStorage
    localStorage.removeItem("currentUser");

    // Clear state
    setCurrentUser(null);
    setUserSubscriptions([]);
    setStep("login");
  };

  const handleSelectSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setStep("form");
  };

  const handleSubmitForm = async (data: UserData) => {
    if (!selectedSubscription) return;

    console.log("=== Creating Subscription ===");
    console.log("Selected Plan ID:", selectedSubscription.id);
    console.log("User Data:", data);

    try {
      const result = await subscriptionApi.create({
        planId: selectedSubscription.id,
        userData: data,
        phoneNumber: data.phone,
      });
      console.log("Subscription created successfully:", result);

      setStep("login");
    } catch (err) {
      const error = err as any;
      if (error?.response?.status === 409) {
        alert("A user with this email already exists. Please log in.");
        setStep("login");
        return;
      }

      console.error("Failed to create subscription:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : "Unknown error"
      );
      alert("Failed to create subscription. Please try again.");
    }
  };

  const handleGoToPlans = () => {
    setStep("select");
  };

  const handleStartOver = () => {
    setStep(isLoggedIn ? "dashboard" : "select");
    setSelectedSubscription(null);
  };

  const handleUpdateDataUsage = async (newDataUsed: number) => {
    if (!currentUser) return;

    console.log("=== Update Data Usage ===");
    console.log("User ID:", currentUser.userId);
    console.log("New Data Used:", newDataUsed);

    // TODO: Implement API call to update data usage in database
    // For now, just log it
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "#00bfa5" }}
          ></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      {step === "login" && (
        <Login onLogin={handleLogin} onGoToPlans={handleGoToPlans} />
      )}
      {step === "select" && (
        <SubscriptionList
          subscriptions={subscriptions}
          onSelect={handleSelectSubscription}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onGoToDashboard={() => setStep(isLoggedIn ? "dashboard" : "login")}
        />
      )}
      {step === "form" && selectedSubscription && (
        <SubscriptionForm
          subscription={selectedSubscription}
          onSubmit={handleSubmitForm}
          onBack={() => setStep("select")}
          existingUser={
            currentUser
              ? {
                  fullName: currentUser.name,
                  email: currentUser.email,
                  phone: "",
                  address: currentUser.address,
                  dateOfBirth: currentUser.dateOfBirth,
                }
              : undefined
          }
        />
      )}
      {step === "success" && selectedSubscription && currentUser && (
        <SubscriptionSuccess
          subscription={selectedSubscription}
          userData={{
            fullName: currentUser.name,
            email: currentUser.email,
            phone: "",
            address: currentUser.address,
            dateOfBirth: currentUser.dateOfBirth,
          }}
          onStartOver={handleStartOver}
        />
      )}
      {step === "dashboard" && currentUser && (
        <UserDashboard
          user={{
            id: currentUser.userId.toString(),
            email: currentUser.email,
            userData: {
              fullName: currentUser.name,
              email: currentUser.email,
              phone: "",
              address: currentUser.address,
              dateOfBirth: currentUser.dateOfBirth,
            },
            subscription: selectedSubscription || subscriptions[0],
            startDate: new Date().toISOString(),
            dataUsed: 0,
          }}
          userSubscriptions={userSubscriptions}
          onLogout={handleLogout}
          onUpdateDataUsage={handleUpdateDataUsage}
          onChangePlan={handleGoToPlans}
        />
      )}
    </div>
  );
}
