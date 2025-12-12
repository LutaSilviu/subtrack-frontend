import { ArrowLeft, Download, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

interface BillingProps {
  onNavigateToDashboard: () => void;
}

const invoices = [
  {
    id: 1,
    period: 'Oct 2024',
    basePrice: 29.99,
    overage: 0,
    total: 29.99,
    status: 'Paid',
  },
  {
    id: 2,
    period: 'Sep 2024',
    basePrice: 29.99,
    overage: 11.98,
    total: 41.97,
    status: 'Paid',
  },
  {
    id: 3,
    period: 'Aug 2024',
    basePrice: 29.99,
    overage: 5.99,
    total: 35.98,
    status: 'Paid',
  },
  {
    id: 4,
    period: 'Jul 2024',
    basePrice: 29.99,
    overage: 0,
    total: 29.99,
    status: 'Paid',
  },
  {
    id: 5,
    period: 'Jun 2024',
    basePrice: 29.99,
    overage: 17.97,
    total: 47.96,
    status: 'Paid',
  },
];

export function Billing({ onNavigateToDashboard }: BillingProps) {
  const handleDownloadInvoice = (invoiceId: number) => {
    // Simulate invoice download
    console.log(`Downloading invoice ${invoiceId}`);
    alert(`Invoice ${invoiceId} downloaded`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-4 py-6 md:px-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="flex items-center gap-2" style={{ color: '#00bfa5' }}>
            <BarChart3 className="w-8 h-8" />
            SubTrack
          </h1>
          <Button
            variant="ghost"
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your recent invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Base Price</TableHead>
                      <TableHead className="text-right">Overage</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.period}</TableCell>
                        <TableCell className="text-right">
                          ${invoice.basePrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.overage > 0 ? (
                            <span className="text-amber-600">
                              ${invoice.overage.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">$0.00</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ${invoice.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-700"
                            style={{ backgroundColor: '#e0f7f4' }}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="hover:bg-gray-100"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
