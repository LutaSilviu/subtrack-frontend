import { useState } from "react";
import { ArrowLeft, Smartphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Subscription, UserData } from "../App";

interface SubscriptionFormProps {
  subscription: Subscription;
  onSubmit: (data: UserData) => void;
  onBack: () => void;
  existingUser?: UserData;
}

export function SubscriptionForm({
  subscription,
  onSubmit,
  onBack,
  existingUser,
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState<UserData>(
    existingUser || {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.address &&
    formData.dateOfBirth;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="px-4 py-6 md:px-8"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2" style={{ color: "#00bfa5" }}>
            <Smartphone className="w-8 h-8" />
            <h1>SubTrack</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to plans
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selected Plan Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Selected Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Plan Name</p>
                    <p className="mt-1">{subscription.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="mt-1">
                      {subscription.data === 0
                        ? "Unlimited"
                        : `${subscription.data} GB`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="mt-1 text-2xl" style={{ color: "#00bfa5" }}>
                      ${subscription.price}/mo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>
                    {existingUser
                      ? "Confirm your details to complete the subscription"
                      : "Fill in your details to complete the subscription and create your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth || ""}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="123 Main St, City, State, ZIP"
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!isFormValid}
                      style={{
                        backgroundColor: isFormValid ? "#00bfa5" : undefined,
                        color: isFormValid ? "#ffffff" : undefined,
                      }}
                    >
                      Complete Subscription
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
