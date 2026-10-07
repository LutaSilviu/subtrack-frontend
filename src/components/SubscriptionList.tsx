import {
  Smartphone,
  Check,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Subscription } from "../App";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onSelect: (subscription: Subscription) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onGoToDashboard?: () => void;
}

export function SubscriptionList({
  subscriptions,
  onSelect,
  isLoggedIn,
  onLogout,
  onGoToDashboard,
}: SubscriptionListProps) {
  // Sort subscriptions by price (ascending)
  const sortedSubscriptions = [...subscriptions].sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="px-4 py-6 md:px-8"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div
                className="flex items-center gap-2"
                style={{ color: "#00bfa5" }}
              >
                <Smartphone className="w-8 h-8" />
                <h1>SubTrack</h1>
              </div>
              <p className="mt-2 text-gray-600">
                Choose the perfect mobile data plan for you
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={onGoToDashboard}
                    className="hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={onGoToDashboard}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-12 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedSubscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                className="shadow-sm relative flex flex-col"
                style={{
                  borderColor: subscription.popular ? "#00bfa5" : undefined,
                  borderWidth: subscription.popular ? "2px" : undefined,
                }}
              >
                {subscription.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge
                      style={{
                        backgroundColor: "#00bfa5",
                        color: "#ffffff",
                      }}
                    >
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle>{subscription.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl" style={{ color: "#00bfa5" }}>
                      ${subscription.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    {subscription.data === 0
                      ? "Unlimited"
                      : `${subscription.data} GB`}{" "}
                    data
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: "#00bfa5" }}
                        />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => onSelect(subscription)}
                    className="w-full"
                    style={{
                      backgroundColor: subscription.popular
                        ? "#00bfa5"
                        : "#ffffff",
                      color: subscription.popular ? "#ffffff" : "#00bfa5",
                      borderColor: "#00bfa5",
                      borderWidth: "1px",
                    }}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
