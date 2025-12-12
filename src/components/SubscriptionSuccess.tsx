import { CheckCircle, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import type { Subscription, UserData } from '../App';

interface SubscriptionSuccessProps {
  subscription: Subscription;
  userData: UserData;
  onStartOver: () => void;
}

export function SubscriptionSuccess({ subscription, userData, onStartOver }: SubscriptionSuccessProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-4 py-6 md:px-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2" style={{ color: '#00bfa5' }}>
            <Smartphone className="w-8 h-8" />
            <h1>SubTrack</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#e0f7f4' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#00bfa5' }} />
            </div>
            <h2 className="mb-2">Subscription Successful!</h2>
            <p className="text-gray-600">
              Your subscription has been activated. Welcome to {subscription.name}!
            </p>
          </div>

          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Your plan information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="mt-1">{subscription.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data Allowance</p>
                  <p className="mt-1">
                    {subscription.data === 0 ? 'Unlimited' : `${subscription.data} GB/month`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Cost</p>
                  <p className="mt-1 text-2xl" style={{ color: '#00bfa5' }}>
                    ${subscription.price}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Features</p>
                  <ul className="mt-2 space-y-1">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">• {feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your registered details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1">{userData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1">{userData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1">{userData.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={onStartOver}
              variant="outline"
              className="border-2"
              style={{
                borderColor: '#00bfa5',
                color: '#00bfa5',
              }}
            >
              Browse Other Plans
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
