import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { tickets, type Ticket } from "@/lib/data.ts";

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTickets = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTicketsData(tickets);
      setLoading(false);
    };

    loadTickets();
  }, []);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const filteredTickets = ticketsData.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const openTickets = ticketsData.filter(t => t.status === "open").length;
  const inProgressTickets = ticketsData.filter(t => t.status === "in_progress").length;
  const resolvedTickets = ticketsData.filter(t => t.status === "resolved").length;
  const avgResponseTime = ticketsData.length > 0 
    ? ticketsData.reduce((sum, t) => sum + t.responseTime, 0) / ticketsData.length 
    : 0;

  return (
    <Layout title="Support">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Open Tickets</div>
            <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
            <div className="text-xs text-gray-500">need attention</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-yellow-600">{inProgressTickets}</div>
            <div className="text-xs text-gray-500">being worked on</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Resolved</div>
            <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
            <div className="text-xs text-gray-500">this month</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Avg Response</div>
            <div className="text-2xl font-bold text-purple-600">{avgResponseTime.toFixed(1)}h</div>
            <div className="text-xs text-gray-500">response time</div>
          </Card>
        </div>

        {/* Support Tickets Table */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Support Tickets</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Search
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-64"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-full sm:w-36"
              />
              <Select
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={priorityOptions}
                className="w-full sm:w-36"
              />
              <Button className="w-full sm:w-auto">
                New Ticket
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading tickets...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="text-left">Ticket ID</th>
                  <th className="text-left">Subject</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Priority</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Assigned To</th>
                  <th className="text-left">Created</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <td className="font-mono font-medium">{ticket.id}</td>
                    <td className="font-medium max-w-xs truncate">{ticket.subject}</td>
                    <td className="text-gray-600">{ticket.customer}</td>
                    <td>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </td>
                    <td className="text-gray-600">{ticket.assignedTo}</td>
                    <td className="text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {ticket.status === "open" && (
                          <Button size="sm">
                            Assign
                          </Button>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}

          {filteredTickets.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No tickets found matching your criteria.
            </div>
          )}
        </Card>

        {/* Support Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resolution Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">First Response Time</span>
                <span className="font-medium">2.3h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution Time</span>
                <span className="font-medium">18.5h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-medium">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-medium">94.2%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Categories</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Technical Issues</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Questions</span>
                <span className="font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feature Requests</span>
                <span className="font-medium">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Issues</span>
                <span className="font-medium">9%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;