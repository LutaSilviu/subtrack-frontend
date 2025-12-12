import { User, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface DashboardProps {
  subscription: {
    planName: string;
    basePrice: number;
    includedGB: number;
    pricePerGB: number;
  };
  dataUsage: number;
  estimatedCost: number;
  onAddDataUsage: () => void;
  onNavigateToBilling: () => void;
}

export function Dashboard({
  subscription,
  dataUsage,
  estimatedCost,
  onAddDataUsage,
  onNavigateToBilling,
}: DashboardProps) {
  const usagePercentage = (dataUsage / subscription.includedGB) * 100;
  const overage = Math.max(0, dataUsage - subscription.includedGB);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-4 py-6 md:px-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="flex items-center gap-2" style={{ color: '#00bfa5' }}>
            <BarChart3 className="w-8 h-8" />
            SubTrack
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onNavigateToBilling}
              className="hover:bg-gray-100"
            >
              Billing
            </Button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e0f7f4' }}>
              <User className="w-6 h-6" style={{ color: '#00bfa5' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Current Plan Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plan Name</p>
                  <p className="mt-1">{subscription.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Base Price</p>
                  <p className="mt-1">${subscription.basePrice.toFixed(2)}/month</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Included Data</p>
                  <p className="mt-1">{subscription.includedGB} GB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Data Usage</CardTitle>
              <CardDescription>Current billing cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Usage</span>
                  <span>
                    <span style={{ color: '#00bfa5' }}>{dataUsage.toFixed(1)} GB</span>
                    {' / '}
                    <span className="text-gray-500">{subscription.includedGB} GB</span>
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: '#e0f7f4' }}>
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      width: `${Math.min(usagePercentage, 100)}%`,
                      backgroundColor: '#00bfa5'
                    }}
                  />
                </div>
                {overage > 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Overage: {overage.toFixed(1)} GB at ${subscription.pricePerGB}/GB
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Estimated Total Cost</span>
                  <span className="text-2xl" style={{ color: '#00bfa5' }}>
                    ${estimatedCost.toFixed(2)}
                  </span>
                </div>
                <Button 
                  onClick={onAddDataUsage}
                  className="w-full"
                  style={{
                    backgroundColor: '#00bfa5',
                    color: '#ffffff',
                  }}
                >
                  Add 1 GB Usage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
