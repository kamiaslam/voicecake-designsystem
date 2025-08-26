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
import { workflows, type Workflow } from "@/lib/data";

const WorkflowsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(1);
  const [workflowData, setWorkflowData] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadWorkflows = async () => {
      setLoading(true);
      // Add some delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkflowData(workflows);
      setLoading(false);
    };

    loadWorkflows();
  }, []);

  const statusOptions = [
    { id: 1, name: "All Status" },
    { id: 2, name: "Active" },
    { id: 3, name: "Paused" },
    { id: 4, name: "Draft" },
    { id: 5, name: "Error" },
  ];

  const statusFilterMap = {
    1: "all",
    2: "active", 
    3: "paused",
    4: "draft",
    5: "error"
  };

  const currentStatusFilter = statusFilterMap[statusFilter as keyof typeof statusFilterMap] || "all";
  
  const filteredWorkflows = workflowData.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = currentStatusFilter === "all" || workflow.status === currentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case "webhook": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "schedule": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "manual": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "event": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const activeWorkflows = workflowData.filter(w => w.status === 'active').length;
  const totalExecutions = workflowData.reduce((sum, w) => sum + w.executions, 0);
  const avgSuccessRate = workflowData.length > 0 
    ? workflowData.reduce((sum, w) => sum + w.successRate, 0) / workflowData.length 
    : 0;

  return (
    <Layout title="Workflows">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Total Workflows" className="p-6">
            <div className="text-2xl font-bold text-blue-600">{workflowData.length}</div>
            <div className="text-xs text-t-tertiary">all workflows</div>
          </Card>
          <Card title="Active Workflows" className="p-6">
            <div className="text-2xl font-bold text-green-600">{activeWorkflows}</div>
            <div className="text-xs text-t-tertiary">of {workflowData.length} total</div>
          </Card>
          <Card title="Total Executions" className="p-6">
            <div className="text-2xl font-bold text-purple-600">{totalExecutions.toLocaleString()}</div>
            <div className="text-xs text-t-tertiary">across all workflows</div>
          </Card>
          <Card title="Avg Success Rate" className="p-6">
            <div className="text-sm text-t-secondary mb-1">Avg Success Rate</div>
            <div className="text-2xl font-bold text-orange-600">{avgSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-t-tertiary">last 30 days</div>
          </Card>
        </div>

        {/* Workflows Table */}
        <Card title="Workflows" className="p-6">
          <div className="mb-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Search
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Select
                  value={statusOptions.find(option => option.id === statusFilter) || null}
                  onChange={(option) => setStatusFilter(option.id)}
                  options={statusOptions}
                  className="w-full sm:w-40"
                />
                <Button className="w-full sm:w-auto">
                  Create Workflow
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-t-secondary">Loading workflows...</div>
          ) : (
            <Table 
              cellsThead={
                <>
                  <th className="text-left">Name</th>
                  <th className="text-left">Description</th>
                  <th className="text-left">Trigger</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Executions</th>
                  <th className="text-left">Success Rate</th>
                  <th className="text-left">Last Run</th>
                  <th className="text-left">Actions</th>
                </>
              }
            >
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <td className="font-medium">{workflow.name}</td>
                  <td className="text-t-secondary max-w-xs truncate">{workflow.description}</td>
                  <td>
                    <Badge className={getTriggerColor(workflow.trigger)}>
                      {workflow.trigger.charAt(0).toUpperCase() + workflow.trigger.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="font-medium">{workflow.executions.toLocaleString()}</td>
                  <td>
                    <span className={`font-medium ${
                      workflow.successRate >= 95 ? 'text-green-600' :
                      workflow.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {workflow.successRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-t-secondary">
                    {new Date(workflow.lastRun).toLocaleString()}
                  </td>
                  <td>
                     <div className="flex gap-2">
                       <Button isStroke>
                         Edit
                       </Button>
                       {workflow.status === "active" ? (
                         <Button isStroke>
                           Pause
                         </Button>
                       ) : (
                         <Button>
                           Start
                         </Button>
                       )}
                     </div>
                   </td>
                </TableRow>
              ))}
            </Table>
          )}

          {filteredWorkflows.length === 0 && !loading && (
            <div className="text-center py-8 text-t-secondary">
              No workflows found matching your criteria.
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default WorkflowsPage;