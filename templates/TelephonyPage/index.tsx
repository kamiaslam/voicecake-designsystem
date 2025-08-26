import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { phoneNumbers, type PhoneNumber } from "@/lib/data.ts";

const TelephonyPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [numbersData, setNumbersData] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadNumbers = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNumbersData(phoneNumbers);
      setLoading(false);
    };

    loadNumbers();
  }, []);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "local", label: "Local" },
    { value: "toll-free", label: "Toll-Free" },
    { value: "mobile", label: "Mobile" }
  ];

  const filteredNumbers = numbersData.filter(number => {
    const matchesSearch = number.number.includes(searchTerm) ||
                         number.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (number.assignedTo && number.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || number.status === statusFilter;
    const matchesType = typeFilter === "all" || number.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "local": return "bg-blue-100 text-blue-800";
      case "toll-free": return "bg-purple-100 text-purple-800";
      case "mobile": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeNumbers = numbersData.filter(n => n.status === "active").length;
  const totalMinutes = numbersData.reduce((sum, n) => sum + n.monthlyMinutes, 0);
  const totalCost = numbersData.reduce((sum, n) => sum + n.monthlyCost, 0);

  return (
    <Layout title="Telephony">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Active Numbers</div>
            <div className="text-2xl font-bold text-green-600">{activeNumbers}</div>
            <div className="text-xs text-gray-500">of {numbersData.length} total</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Monthly Minutes</div>
            <div className="text-2xl font-bold text-blue-600">{totalMinutes.toLocaleString()}</div>
            <div className="text-xs text-gray-500">across all numbers</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Monthly Cost</div>
            <div className="text-2xl font-bold text-purple-600">${totalCost.toFixed(2)}</div>
            <div className="text-xs text-gray-500">total telephony cost</div>
          </Card>
        </div>

        {/* Phone Numbers Table */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Phone Numbers</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Search
                placeholder="Search numbers..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-64"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-full sm:w-32"
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                className="w-full sm:w-32"
              />
              <Button className="w-full sm:w-auto">
                Add Number
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading phone numbers...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="text-left">Number</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Location</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Assigned To</th>
                  <th className="text-left">Monthly Minutes</th>
                  <th className="text-left">Monthly Cost</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNumbers.map((number) => (
                  <TableRow key={number.id}>
                    <td className="font-mono font-medium">{number.number}</td>
                    <td>
                      <Badge className={getTypeColor(number.type)}>
                        {number.type.charAt(0).toUpperCase() + number.type.slice(1)}
                      </Badge>
                    </td>
                    <td>{number.location}</td>
                    <td>
                      <Badge className={getStatusColor(number.status)}>
                        {number.status.charAt(0).toUpperCase() + number.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-gray-600">
                      {number.assignedTo || "Unassigned"}
                    </td>
                    <td className="font-medium">{number.monthlyMinutes.toLocaleString()}</td>
                    <td className="font-medium">${number.monthlyCost.toFixed(2)}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                        {number.status === "active" ? (
                          <Button size="sm" variant="outline">
                            Disable
                          </Button>
                        ) : (
                          <Button size="sm">
                            Enable
                          </Button>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}

          {filteredNumbers.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No phone numbers found matching your criteria.
            </div>
          )}
        </Card>

        {/* Call Analytics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Call Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">Total Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.2m</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">$0.05</div>
              <div className="text-sm text-gray-600">Avg Cost/Min</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TelephonyPage;