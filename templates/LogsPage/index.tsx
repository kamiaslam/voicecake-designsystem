import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { API, type LogItem } from "@/lib/data.ts";

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [logsData, setLogsData] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const logs = await API.listLogs();
        setLogsData(logs);
      } catch (error) {
        console.error('Failed to load logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const levelOptions = [
    { value: "all", label: "All Levels" },
    { value: "error", label: "Error" },
    { value: "warn", label: "Warning" },
    { value: "info", label: "Info" },
    { value: "debug", label: "Debug" }
  ];

  const serviceOptions = [
    { value: "all", label: "All Services" },
    { value: "api", label: "API" },
    { value: "auth", label: "Authentication" },
    { value: "billing", label: "Billing" },
    { value: "workflow", label: "Workflow" },
    { value: "telephony", label: "Telephony" }
  ];

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesService = serviceFilter === "all" || log.service === serviceFilter;
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "bg-red-100 text-red-800";
      case "warn": return "bg-yellow-100 text-yellow-800";
      case "info": return "bg-blue-100 text-blue-800";
      case "debug": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case "api": return "bg-green-100 text-green-800";
      case "auth": return "bg-purple-100 text-purple-800";
      case "billing": return "bg-orange-100 text-orange-800";
      case "workflow": return "bg-indigo-100 text-indigo-800";
      case "telephony": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const errorCount = logsData.filter(log => log.level === "error").length;
  const warningCount = logsData.filter(log => log.level === "warn").length;
  const todayLogs = logsData.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.timestamp).toDateString() === today;
  }).length;

  return (
    <Layout title="Error Logs">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total Logs</div>
            <div className="text-2xl font-bold text-blue-600">{logsData.length}</div>
            <div className="text-xs text-gray-500">all time</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Errors</div>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-xs text-gray-500">require attention</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Warnings</div>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-xs text-gray-500">potential issues</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Today's Logs</div>
            <div className="text-2xl font-bold text-green-600">{todayLogs}</div>
            <div className="text-xs text-gray-500">in last 24 hours</div>
          </Card>
        </div>

        {/* Logs Table */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">System Logs</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Search
                placeholder="Search logs..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-64"
              />
              <Select
                value={levelFilter}
                onChange={setLevelFilter}
                options={levelOptions}
                className="w-full sm:w-32"
              />
              <Select
                value={serviceFilter}
                onChange={setServiceFilter}
                options={serviceOptions}
                className="w-full sm:w-36"
              />
              <Button className="w-full sm:w-auto">
                Export Logs
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading logs...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="text-left">Timestamp</th>
                  <th className="text-left">Level</th>
                  <th className="text-left">Service</th>
                  <th className="text-left">Message</th>
                  <th className="text-left">User ID</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <td className="text-sm font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <Badge className={getLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge className={getServiceColor(log.service)}>
                        {log.service.charAt(0).toUpperCase() + log.service.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-gray-600 max-w-md truncate">{log.message}</td>
                    <td className="font-mono text-sm">{log.userId || "System"}</td>
                    <td>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}

          {filteredLogs.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No logs found matching your criteria.
            </div>
          )}
        </Card>

        {/* Log Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Log Levels Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Error</span>
                <span className="font-medium text-red-600">{errorCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warning</span>
                <span className="font-medium text-yellow-600">{warningCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Info</span>
                <span className="font-medium text-blue-600">
                  {logsData.filter(log => log.level === "info").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Debug</span>
                <span className="font-medium text-gray-600">
                  {logsData.filter(log => log.level === "debug").length}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Service Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">API</span>
                <span className="font-medium">
                  {logsData.filter(log => log.service === "api").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authentication</span>
                <span className="font-medium">
                  {logsData.filter(log => log.service === "auth").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing</span>
                <span className="font-medium">
                  {logsData.filter(log => log.service === "billing").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Workflow</span>
                <span className="font-medium">
                  {logsData.filter(log => log.service === "workflow").length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LogsPage;