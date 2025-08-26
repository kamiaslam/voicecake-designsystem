import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { securityEvents, type SecurityEvent } from "@/lib/data.ts";

const SecurityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [eventsData, setEventsData] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadSecurityEvents = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setEventsData(securityEvents);
      setLoading(false);
    };

    loadSecurityEvents();
  }, []);

  const severityOptions = [
    { value: "all", label: "All Severities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "login_attempt", label: "Login Attempt" },
    { value: "data_access", label: "Data Access" },
    { value: "permission_change", label: "Permission Change" },
    { value: "api_abuse", label: "API Abuse" },
    { value: "suspicious_activity", label: "Suspicious Activity" }
  ];

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.ip.includes(searchTerm);
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "login_attempt": return "bg-blue-100 text-blue-800";
      case "data_access": return "bg-purple-100 text-purple-800";
      case "permission_change": return "bg-indigo-100 text-indigo-800";
      case "api_abuse": return "bg-red-100 text-red-800";
      case "suspicious_activity": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const criticalEvents = eventsData.filter(e => e.severity === "critical").length;
  const todayEvents = eventsData.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.timestamp).toDateString() === today;
  }).length;
  const resolvedEvents = eventsData.filter(e => e.resolved).length;

  return (
    <Layout title="Security">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Critical Events</div>
            <div className="text-2xl font-bold text-red-600">{criticalEvents}</div>
            <div className="text-xs text-gray-500">require attention</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Today's Events</div>
            <div className="text-2xl font-bold text-blue-600">{todayEvents}</div>
            <div className="text-xs text-gray-500">in last 24 hours</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Resolved Events</div>
            <div className="text-2xl font-bold text-green-600">{resolvedEvents}</div>
            <div className="text-xs text-gray-500">of {eventsData.length} total</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Resolution Rate</div>
            <div className="text-2xl font-bold text-purple-600">
              {eventsData.length > 0 ? ((resolvedEvents / eventsData.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-500">overall rate</div>
          </Card>
        </div>

        {/* Security Events Table */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Security Events</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Search
                placeholder="Search events..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-64"
              />
              <Select
                value={severityFilter}
                onChange={setSeverityFilter}
                options={severityOptions}
                className="w-full sm:w-36"
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                className="w-full sm:w-40"
              />
              <Button className="w-full sm:w-auto">
                Export Report
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading security events...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="text-left">Timestamp</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Severity</th>
                  <th className="text-left">User</th>
                  <th className="text-left">IP Address</th>
                  <th className="text-left">Description</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <td className="text-sm">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </td>
                    <td>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                      </Badge>
                    </td>
                    <td className="font-medium">{event.user}</td>
                    <td className="font-mono text-sm">{event.ip}</td>
                    <td className="text-gray-600 max-w-xs truncate">{event.description}</td>
                    <td>
                      <Badge className={event.resolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {event.resolved ? "Resolved" : "Open"}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {!event.resolved && (
                          <Button size="sm">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No security events found matching your criteria.
            </div>
          )}
        </Card>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Threat Detection</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Malware Blocked</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phishing Attempts</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brute Force Attacks</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DDoS Attempts</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Access Control</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Failed Logins</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Successful Logins</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Password Resets</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">2FA Enabled</span>
                <span className="font-medium">89%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityPage;