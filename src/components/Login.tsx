import { useState } from "react";
import { Smartphone, LogIn } from "lucide-react";
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

interface LoginProps {
  onLogin: (email: string) => Promise<{ success: boolean; error?: string }>;
  onGoToPlans: () => void;
}

export function Login({ onLogin, onGoToPlans }: LoginProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      const result = await onLogin(email);

      if (!result.success) {
        setError(result.error || "Invalid email");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="px-4 py-6 md:px-8"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2"
              style={{ color: "#00bfa5" }}
            >
              <Smartphone className="w-8 h-8" />
              <h1>SubTrack</h1>
            </div>
            <Button
              variant="outline"
              onClick={onGoToPlans}
              className="border-2"
              style={{
                borderColor: "#00bfa5",
                color: "#00bfa5",
              }}
            >
              Browse Plans
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12 md:px-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-sm">
            <CardHeader className="text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4"
                style={{ backgroundColor: "#e0f7f4" }}
              >
                <LogIn className="w-6 h-6" style={{ color: "#00bfa5" }} />
              </div>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Login to view your subscription status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#00bfa5",
                    color: "#ffffff",
                  }}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onGoToPlans}
                    className="underline"
                    style={{ color: "#00bfa5" }}
                  >
                    Subscribe to a plan
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
