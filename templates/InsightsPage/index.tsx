import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { 
  revenueData, 
  usageSplit, 
  churnData, 
  countryUsage,
  users,
  agents,
  invoices,
  type RevenueData,
  type UsageSplit,
  type ChurnData,
  type CountryUsage
} from "@/lib/data.ts";

const InsightsPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadInsights = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };

    loadInsights();
  }, [timeRange]);

  const timeRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" }
  ];

  // Calculate key metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "active").length;
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === "paid").length;
  const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers * 100) : 0;
  const agentUtilization = totalAgents > 0 ? (activeAgents / totalAgents * 100) : 0;
  const paymentSuccess = totalInvoices > 0 ? (paidInvoices / totalInvoices * 100) : 0;

  return (
    <Layout title="Insights">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Strategic Insights</h1>
            <p className="text-gray-600">Analytics and business intelligence dashboard</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={timeRange}
              onChange={setTimeRange}
              options={timeRangeOptions}
              className="w-40"
            />
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-green-600">+12.5% vs last period</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
            <div className="text-2xl font-bold text-blue-600">{conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-blue-600">+2.3% vs last period</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Agent Utilization</div>
            <div className="text-2xl font-bold text-purple-600">{agentUtilization.toFixed(1)}%</div>
            <div className="text-xs text-purple-600">+5.1% vs last period</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Payment Success</div>
            <div className="text-2xl font-bold text-orange-600">{paymentSuccess.toFixed(1)}%</div>
            <div className="text-xs text-orange-600">+1.8% vs last period</div>
          </Card>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading chart...</div>
            ) : (
              <div className="space-y-4">
                {revenueData.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(item.revenue / Math.max(...revenueData.map(r => r.revenue))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium w-20 text-right">${item.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Distribution</h3>
            <div className="space-y-4">
              {usageSplit.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Churn Analysis & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Churn Analysis</h3>
            <div className="space-y-4">
              {churnData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${item.churnRate * 10}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-12 text-right">{item.churnRate}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Churn Rate</span>
                <span className="font-medium">
                  {(churnData.reduce((sum, item) => sum + item.churnRate, 0) / churnData.length).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="space-y-4">
              {countryUsage.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-gray-600">{item.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${(item.users / Math.max(...countryUsage.map(c => c.users))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-16 text-right">{item.users.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Business Intelligence Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Business Intelligence Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Growth Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Growth Rate</span>
                  <span className="font-medium text-green-600">+8.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Acquisition Cost</span>
                  <span className="font-medium">$45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Lifetime Value</span>
                  <span className="font-medium">$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-medium">3.2 months</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Operational Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Uptime</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Response Time</span>
                  <span className="font-medium">145ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-medium text-red-600">0.02%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Support Resolution</span>
                  <span className="font-medium">18.5h</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Financial Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Margin</span>
                  <span className="font-medium text-green-600">78.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Margin</span>
                  <span className="font-medium">23.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Flow</span>
                  <span className="font-medium text-green-600">Positive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Burn Rate</span>
                  <span className="font-medium">$125K/month</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default InsightsPage;