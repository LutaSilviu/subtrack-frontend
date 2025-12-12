import { Smartphone, User, Database, LogOut, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { UserAccount } from "../App";
import type { UserSubscription, UsageRecord, Invoice } from "../services/api";
import { usageApi, invoiceApi } from "../services/api";

interface UserDashboardProps {
  user: UserAccount;
  userSubscriptions: UserSubscription[];
  onLogout: () => void;
  onUpdateDataUsage: (newDataUsed: number) => void;
  onChangePlan: () => void;
}

export function UserDashboard({
  user,
  userSubscriptions,
  onLogout,
  onUpdateDataUsage,
  onChangePlan,
}: UserDashboardProps) {
  const [usageRecords, setUsageRecords] = useState<Map<number, UsageRecord[]>>(
    new Map()
  );
  const [loadingUsage, setLoadingUsage] = useState<Set<number>>(new Set());
  const [invoices, setInvoices] = useState<Map<number, Invoice[]>>(new Map());
  const [loadingInvoices, setLoadingInvoices] = useState<Set<number>>(
    new Set()
  );

  // Fetch usage data for all subscriptions
  useEffect(() => {
    const fetchUsageForSubscriptions = async () => {
      for (const subscription of userSubscriptions) {
        if (
          !usageRecords.has(subscription.subscriptionId) &&
          !loadingUsage.has(subscription.subscriptionId)
        ) {
          setLoadingUsage((prev) =>
            new Set(prev).add(subscription.subscriptionId)
          );
          try {
            const records = await usageApi.getUsageForSubscription(
              subscription.subscriptionId
            );
            setUsageRecords((prev) =>
              new Map(prev).set(subscription.subscriptionId, records)
            );
          } catch (error) {
            console.error(
              `Failed to fetch usage for subscription ${subscription.subscriptionId}:`,
              error
            );
          } finally {
            setLoadingUsage((prev) => {
              const newSet = new Set(prev);
              newSet.delete(subscription.subscriptionId);
              return newSet;
            });
          }
        }
      }
    };

    const fetchInvoicesForSubscriptions = async () => {
      for (const subscription of userSubscriptions) {
        if (
          !invoices.has(subscription.subscriptionId) &&
          !loadingInvoices.has(subscription.subscriptionId)
        ) {
          setLoadingInvoices((prev) =>
            new Set(prev).add(subscription.subscriptionId)
          );
          try {
            const invoiceData = await invoiceApi.getHistory(
              subscription.subscriptionId
            );
            setInvoices((prev) =>
              new Map(prev).set(subscription.subscriptionId, invoiceData)
            );
          } catch (error) {
            console.error(
              `Failed to fetch invoices for subscription ${subscription.subscriptionId}:`,
              error
            );
          } finally {
            setLoadingInvoices((prev) => {
              const newSet = new Set(prev);
              newSet.delete(subscription.subscriptionId);
              return newSet;
            });
          }
        }
      }
    };

    if (userSubscriptions.length > 0) {
      fetchUsageForSubscriptions();
      fetchInvoicesForSubscriptions();
    }
  }, [userSubscriptions]);

  // Calculate total usage for a subscription
  const getTotalUsage = (subscriptionId: number): number => {
    const records = usageRecords.get(subscriptionId) || [];
    return records.reduce((sum, record) => sum + record.amountGb, 0);
  };

  // Calculate total usage and billing across all subscriptions
  const getTotalDataUsage = () => {
    let totalUsage = 0;
    let totalLimit = 0;
    let totalBaseCost = 0;
    let totalOverageCost = 0;

    userSubscriptions.forEach((subscription) => {
      const records = usageRecords.get(subscription.subscriptionId) || [];
      const usage = records.reduce((sum, record) => sum + record.amountGb, 0);
      const { includedGb, price, overagePrice } = subscription.plan;
      const overage = Math.max(0, usage - includedGb);

      totalUsage += usage;
      totalLimit += includedGb;
      totalBaseCost += price;
      totalOverageCost += overage * overagePrice;
    });

    return {
      totalUsage,
      totalLimit,
      totalBaseCost,
      totalOverageCost,
      totalCost: totalBaseCost + totalOverageCost,
      usagePercentage: totalLimit > 0 ? (totalUsage / totalLimit) * 100 : 0,
      overage: Math.max(0, totalUsage - totalLimit),
    };
  };

  const dataStats = getTotalDataUsage();

  // Add data usage for the first active subscription (demo)
  const handleAddData = async () => {
    const activeSubscription = userSubscriptions.find(
      (sub) => sub.status === "ACTIVE"
    );

    if (!activeSubscription) {
      console.error("No active subscription found");
      return;
    }

    try {
      await usageApi.addUsage(activeSubscription.subscriptionId, 1);
      // Refresh usage data after adding
      const records = await usageApi.getUsageForSubscription(
        activeSubscription.subscriptionId
      );
      setUsageRecords((prev) =>
        new Map(prev).set(activeSubscription.subscriptionId, records)
      );
    } catch (error) {
      console.error("Failed to add usage data:", error);
    }
  };

  // Create invoice for the first active subscription (demo)
  const handleCreateInvoice = async () => {
    const activeSubscription = userSubscriptions.find(
      (sub) => sub.status === "ACTIVE"
    );

    if (!activeSubscription) {
      console.error("No active subscription found");
      return;
    }

    try {
      const invoice = await invoiceApi.createInvoice(
        activeSubscription.subscriptionId
      );
      console.log("Invoice created:", invoice);

      // Refresh invoices after creating
      const invoiceData = await invoiceApi.getHistory(
        activeSubscription.subscriptionId
      );
      setInvoices((prev) =>
        new Map(prev).set(activeSubscription.subscriptionId, invoiceData)
      );

      alert(
        `Invoice created successfully! Total: $${invoice.total.toFixed(2)}`
      );
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="px-4 py-6 md:px-8"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ color: "#00bfa5" }}>
            <Smartphone className="w-8 h-8" />
            <h1>SubTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-gray-600">
              {user.userData.fullName}
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#e0f7f4" }}
            >
              <User className="w-6 h-6" style={{ color: "#00bfa5" }} />
            </div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h2 className="mb-1">
              Welcome back, {user.userData.fullName.split(" ")[0]}!
            </h2>
            <p className="text-gray-600">Here's your subscription overview</p>
          </div>

          {/* Data Usage */}
          {userSubscriptions.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Data Usage</CardTitle>
                <CardDescription>
                  Total across all subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Usage</span>
                    <span>
                      <span style={{ color: "#00bfa5" }}>
                        {dataStats.totalUsage.toFixed(2)} GB
                      </span>
                      {" / "}
                      <span className="text-gray-500">
                        {dataStats.totalLimit} GB
                      </span>
                    </span>
                  </div>
                  <div
                    className="relative h-3 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "#e0f7f4" }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.min(dataStats.usagePercentage, 100)}%`,
                        backgroundColor:
                          dataStats.usagePercentage > 100
                            ? "#ef4444"
                            : "#00bfa5",
                      }}
                    />
                  </div>
                  {dataStats.overage > 0 && (
                    <p className="text-sm text-amber-600 mt-2">
                      ⚠ Overage: {dataStats.overage.toFixed(2)} GB
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Base Price</span>
                    <span>${dataStats.totalBaseCost.toFixed(2)}</span>
                  </div>
                  {dataStats.totalOverageCost > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Overage Fees</span>
                      <span className="text-amber-600">
                        +${dataStats.totalOverageCost.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-500">
                      Estimated Total Cost
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#00bfa5" }}
                    >
                      ${dataStats.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Button
                    onClick={handleAddData}
                    className="w-full"
                    style={{
                      backgroundColor: "#00bfa5",
                      color: "#ffffff",
                    }}
                  >
                    Add 1 GB Usage (Demo)
                  </Button>
                  <Button
                    onClick={handleCreateInvoice}
                    className="w-full"
                    variant="outline"
                    style={{
                      borderColor: "#00bfa5",
                      color: "#00bfa5",
                    }}
                  >
                    Create Invoice (Test)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Subscriptions */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>My Subscriptions</CardTitle>
              <CardDescription>
                {userSubscriptions.length === 0
                  ? "No active subscriptions"
                  : `You have ${userSubscriptions.length} subscription${
                      userSubscriptions.length > 1 ? "s" : ""
                    }`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userSubscriptions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead>Data Allowance</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Cycle Dates</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userSubscriptions.map((subscription) => (
                        <TableRow key={subscription.subscriptionId}>
                          <TableCell className="font-medium, text-center">
                            {subscription.plan.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {subscription.plan.includedGb === 0
                              ? "Unlimited"
                              : `${subscription.plan.includedGb} GB`}
                          </TableCell>
                          <TableCell className="text-center">
                            ${subscription.plan.price.toFixed(2)}/mo
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              style={{
                                backgroundColor:
                                  subscription.status === "ACTIVE"
                                    ? "#00bfa5"
                                    : subscription.status === "INACTIVE"
                                    ? "#fbbf24"
                                    : "#ef4444",
                                color: "#ffffff",
                              }}
                            >
                              {subscription.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-gray-600">
                            {subscription.phoneNumber}
                          </TableCell>
                          <TableCell className="text-center text-gray-600">
                            {formatDate(subscription.currentCycleStart)} -{" "}
                            {formatDate(subscription.currentCycleStop)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No subscriptions found</p>
                  <Button
                    onClick={onChangePlan}
                    className="mt-4"
                    style={{
                      backgroundColor: "#00bfa5",
                      color: "#ffffff",
                    }}
                  >
                    Browse Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: "#00bfa5" }} />
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    Your past invoices and payment history
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const allInvoices: Invoice[] = [];
                userSubscriptions.forEach((sub) => {
                  const subInvoices = invoices.get(sub.subscriptionId) || [];
                  allInvoices.push(...subInvoices);
                });
                return allInvoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead className="text-center">
                            Base Price
                          </TableHead>
                          <TableHead className="text-center">Overage</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allInvoices.map((invoice) => (
                          <TableRow key={invoice.invoiceId}>
                            <TableCell className="text-center">
                              {formatDate(invoice.periodStart)} -{" "}
                              {formatDate(invoice.periodStop)}
                            </TableCell>
                            <TableCell className="text-center">
                              {invoice.subscription.plan.name}
                            </TableCell>
                            <TableCell className="text-center">
                              ${invoice.basePrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              ${invoice.overageCost.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center font-medium">
                              ${invoice.total.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                style={{
                                  backgroundColor:
                                    invoice.status === "PAID"
                                      ? "#00bfa5"
                                      : invoice.status === "DRAFTED"
                                      ? "#fbbf24"
                                      : "#ef4444",
                                  color: "#ffffff",
                                }}
                              >
                                {invoice.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No invoices yet</p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your registered details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1">{user.userData.email}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1">{user.userData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
