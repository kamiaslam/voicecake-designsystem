"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { invoices, fmtMoney, type Invoice } from "@/lib/data";
import { type SelectOption } from "@/types/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { Plus, Pencil, Calculator, FileDown, Filter, History } from "lucide-react";

// Mock data from Data.tsx
const revenueData = [
  { month: "Jan", mrr: 5200, payg: 1800 },
  { month: "Feb", mrr: 6400, payg: 2200 },
  { month: "Mar", mrr: 7100, payg: 2600 },
  { month: "Apr", mrr: 7600, payg: 2800 },
];

const countryUsage = [
  { country: "United Kingdom", code: "GB", calls: 2120, minutes: 3800, revenue: 9200 },
  { country: "United States", code: "US", calls: 1580, minutes: 3400, revenue: 8400 },
  { country: "Belgium", code: "BE", calls: 420, minutes: 760, revenue: 1800 },
  { country: "United Arab Emirates", code: "AE", calls: 260, minutes: 610, revenue: 1550 },
  { country: "Pakistan", code: "PK", calls: 300, minutes: 540, revenue: 1300 },
];

const INITIAL_INVOICES = [
  { id: "INV-1042", client: "Acme Health", amount: 1249, status: "paid", period: "Apr 2025" },
  { id: "INV-1043", client: "Delta Realty", amount: 89, status: "due", period: "Apr 2025" },
  { id: "INV-1044", client: "ZenCare Homes", amount: 9860, status: "paid", period: "Apr 2025" },
];

const audit = [
  {
    at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actor: "kam@voicecake.io",
    scope: "global" as const,
    from: { conversaPerMin: 0.11, empathPerMin: 0.12 },
    to: { conversaPerMin: 0.12, empathPerMin: 0.13 }
  },
  {
    at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actor: "admin@zencare",
    scope: "account" as const,
    account: "ZenCare Homes",
    from: { empathPerMin: 0.13 },
    to: { empathPerMin: 0.11 }
  }
];

const BillingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [billingData, setBillingData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInvOpen, setNewInvOpen] = useState(false);
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false);
  const [simModalOpen, setSimModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    const loadBillingData = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBillingData(INITIAL_INVOICES);
      setLoading(false);
    };

    loadBillingData();
  }, []);

  const exportCurrentPagePDF = () => {
    // PDF export functionality placeholder
    console.log('Exporting PDF...');
  };

  const hasPerm = (perm: string) => true; // Mock permission check

  const statusOptions: (SelectOption & { value: string })[] = [
    { id: 1, name: "All Status", value: "all" },
    { id: 2, name: "Paid", value: "paid" },
    { id: 3, name: "Due", value: "due" },
    { id: 4, name: "Overdue", value: "overdue" },
    { id: 5, name: "Draft", value: "draft" }
  ];

  const filteredInvoices = billingData.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "due": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = billingData
    .filter(invoice => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pendingAmount = billingData
    .filter(invoice => invoice.status === "due")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const overdueAmount = billingData
    .filter(invoice => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Layout title="Billing & Financials">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Billing & Financials</h1>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setNewInvOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Create Invoice
            </Button>
            {hasPerm("pricing_edit") && (
              <>
                <Button onClick={() => setGlobalDialogOpen(true)}>
                  <Pencil className="w-4 h-4 mr-2" />Edit Global Pricing
                </Button>
                <Button isStroke onClick={() => setSimModalOpen(true)}>
                  <Calculator className="w-4 h-4 mr-2" />Simulate Invoice
                </Button>
              </>
            )}
            <Button isStroke onClick={exportCurrentPagePDF}>
              <FileDown className="w-4 h-4 mr-2" />Export PDF
            </Button>
            <Button isStroke>
              <Filter className="w-4 h-4 mr-2" />Filters
            </Button>
          </div>
        </div>

        {/* Revenue Chart and Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Revenue" className="lg:col-span-2 p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mrr" stroke="#4caf50" strokeWidth={2} name="MRR" />
                <Line type="monotone" dataKey="payg" stroke="#2196f3" strokeWidth={2} name="Pay-as-you-go" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          <Card title="Recent Invoices" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-500 flex items-center gap-1">
              </div>
            </div>
            <div className="space-y-3">
              {INITIAL_INVOICES.map(inv => (
                <div key={inv.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{inv.id}</div>
                    <div className="text-xs text-gray-600">{inv.client}</div>
                    <div className="text-xs text-gray-500">{inv.period}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{fmtMoney(inv.amount)}</div>
                    <Badge className={getStatusColor(inv.status)}>
                      {inv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue by Country */}
        <Card title="Revenue by Country" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countryUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="code" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4caf50" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pricing Change History */}
        <Card title="Pricing Change History" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500">{audit.length} events</span>
          </div>
          <Table
            cellsThead={
              <>
                <th className="text-left">When</th>
                <th className="text-left">Actor</th>
                <th className="text-left">Scope</th>
                <th className="text-left">Account</th>
                <th className="text-left">Change</th>
              </>
            }
          >
            {audit.map((e, i) => (
              <TableRow key={i}>
                <td>{new Date(e.at).toLocaleString()}</td>
                <td>{e.actor}</td>
                <td>
                  <Badge className={e.scope === "global" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                    {e.scope}
                  </Badge>
                </td>
                <td>{e.account || "-"}</td>
                <td className="text-xs">
                  {Object.keys(e.to).map(k => {
                    const before = e.from[k as keyof typeof e.from];
                    const after = e.to[k as keyof typeof e.to];
                    if (before === after) return null;
                    return (
                      <div key={k}>
                        <span className="uppercase">{k}</span>: {fmtMoney(Number(before))} → {fmtMoney(Number(after))}
                      </div>
                    );
                  })}
                </td>
              </TableRow>
            ))}
          </Table>
        </Card>

        {/* Detailed Invoices Table */}
        <Card title="All Invoices" className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Search
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select
                value={statusOptions.find(opt => opt.value === statusFilter) || null}
                onChange={(option) => setStatusFilter((option as SelectOption & { value: string })?.value || "all")}
                options={statusOptions}
                className="w-full sm:w-40"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading invoices...</div>
          ) : (
            <Table
              cellsThead={
                <>
                  <th className="text-left">Invoice ID</th>
                  <th className="text-left">Client</th>
                  <th className="text-left">Period</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </>
              }
            >
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <td className="font-medium">{invoice.id}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.period}</td>
                  <td className="font-medium">{fmtMoney(invoice.amount)}</td>
                  <td>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button isStroke>
                        View
                      </Button>
                      {invoice.status === "draft" && (
                        <Button>
                          Send
                        </Button>
                      )}
                    </div>
                  </td>
                </TableRow>
              ))}
            </Table>
          )}

          {filteredInvoices.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No invoices found matching your criteria.
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default BillingPage;