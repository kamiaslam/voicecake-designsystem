"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";

// Mock data for call logs
const mockCallLogs = [
    {
        id: "CL-001",
        assistant: "UXPENDIT-Male",
        assistantPhone: "+1 (908) 680 8723",
        customerPhone: "+1 (555) 123 4567",
        type: "Inbound",
        endedReason: "Completed",
        successEvaluation: "Successful",
        startTime: "2024-01-15 14:30:25",
        duration: "5m 32s",
        cost: "$2.45"
    },
    {
        id: "CL-002",
        assistant: "UXPENDIT-Female",
        assistantPhone: "+1 (908) 680 8724",
        customerPhone: "+1 (555) 987 6543",
        type: "Outbound",
        endedReason: "No Answer",
        successEvaluation: "Failed",
        startTime: "2024-01-15 15:15:10",
        duration: "1m 45s",
        cost: "$0.85"
    },
    {
        id: "CL-003",
        assistant: "UXPENDIT-Male",
        assistantPhone: "+1 (908) 680 8723",
        customerPhone: "+1 (555) 456 7890",
        type: "Inbound",
        endedReason: "Completed",
        successEvaluation: "Successful",
        startTime: "2024-01-15 16:00:45",
        duration: "8m 12s",
        cost: "$3.20"
    },
    {
        id: "CL-004",
        assistant: "UXPENDIT-Female",
        assistantPhone: "+1 (908) 680 8724",
        customerPhone: "+1 (555) 321 0987",
        type: "Outbound",
        endedReason: "Busy",
        successEvaluation: "Failed",
        startTime: "2024-01-15 17:30:20",
        duration: "0m 15s",
        cost: "$0.25"
    },
    {
        id: "CL-005",
        assistant: "UXPENDIT-Male",
        assistantPhone: "+1 (908) 680 8723",
        customerPhone: "+1 (555) 654 3210",
        type: "Inbound",
        endedReason: "Completed",
        successEvaluation: "Successful",
        startTime: "2024-01-15 18:45:30",
        duration: "12m 05s",
        cost: "$4.80"
    }
];

const CallLogsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [assistantFilter, setAssistantFilter] = useState({ id: 0, name: "All Assistants" });
    const [typeFilter, setTypeFilter] = useState({ id: 0, name: "All Types" });
    const [statusFilter, setStatusFilter] = useState({ id: 0, name: "All Status" });
    const [dateRange, setDateRange] = useState("last-7-days");

    const filteredCallLogs = useMemo(() => {
        return mockCallLogs.filter(log => {
            const matchesSearch = 
                log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.assistant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.customerPhone.includes(searchTerm) ||
                log.assistantPhone.includes(searchTerm);
            
            const matchesAssistant = assistantFilter.id === 0 || log.assistant === assistantFilter.name;
            const matchesType = typeFilter.id === 0 || log.type === typeFilter.name;
            const matchesStatus = statusFilter.id === 0 || log.successEvaluation === statusFilter.name;
            
            return matchesSearch && matchesAssistant && matchesType && matchesStatus;
        });
    }, [searchTerm, assistantFilter, typeFilter, statusFilter]);

    const getTypeBadge = (type: string) => {
        const typeClasses = {
            Inbound: "bg-green-100 text-green-800 border border-green-200",
            Outbound: "bg-blue-100 text-blue-800 border border-blue-200"
        };
        return typeClasses[type as keyof typeof typeClasses] || "bg-gray-100 text-gray-800 border border-gray-200";
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            Successful: "bg-green-100 text-green-800 border border-green-200",
            Failed: "bg-red-100 text-red-800 border border-red-200"
        };
        return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border border-gray-200";
    };

    const getEndedReasonBadge = (reason: string) => {
        const reasonClasses = {
            Completed: "bg-green-100 text-green-800 border border-green-200",
            "No Answer": "bg-yellow-100 text-yellow-800 border border-yellow-200",
            Busy: "bg-orange-100 text-orange-800 border border-orange-200"
        };
        return reasonClasses[reason as keyof typeof reasonClasses] || "bg-gray-100 text-gray-800 border border-gray-200";
    };

    return (
        <Layout title="Call Logs">
            <div className="space-y-3">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-t-primary">Call Logs</h1>
                        <p className="text-sm text-t-secondary mt-1">
                            Monitor and analyze all call activities and performance metrics
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button isStroke>
                            <Icon name="download" className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button>
                            <Icon name="refresh" className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card title="Filters" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Search
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search call ID, assistant, phone..."
                        />
                        
                        <Select
                            label="Assistant"
                            value={assistantFilter}
                            onChange={setAssistantFilter}
                            options={[
                                { id: 0, name: "All Assistants" },
                                { id: 1, name: "UXPENDIT-Male" },
                                { id: 2, name: "UXPENDIT-Female" }
                            ]}
                        />
                        
                        <Select
                            label="Call Type"
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={[
                                { id: 0, name: "All Types" },
                                { id: 1, name: "Inbound" },
                                { id: 2, name: "Outbound" }
                            ]}
                        />
                        
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { id: 0, name: "All Status" },
                                { id: 1, name: "Successful" },
                                { id: 2, name: "Failed" }
                            ]}
                        />
                    </div>
                    
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-t-primary mb-2">
                            Date Range
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: "last-7-days", label: "Last 7 Days" },
                                { value: "last-30-days", label: "Last 30 Days" },
                                { value: "last-90-days", label: "Last 90 Days" },
                                { value: "custom", label: "Custom" }
                            ].map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => setDateRange(range.value)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        dateRange === range.value
                                            ? "bg-primary-01 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Call Logs Table */}
                <Card title={`Call Logs (${filteredCallLogs.length} results)`} className="p-6">
                    <Table
                        headers={
                            <>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Call ID</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Assistant</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Assistant Phone Number</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Customer Phone Number</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Type</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Ended Reason</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Success Evaluation</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Start Time</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Duration</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Cost</th>
                            </>
                        }
                    >
                        {filteredCallLogs.map((log, index) => (
                            <TableRow key={index}>
                                <td className="py-4 px-4">
                                    <span className="font-medium text-t-primary">{log.id}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-01 to-[#8B5CF6] rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                                            {log.assistant.charAt(0)}
                                        </div>
                                        <span className="text-t-primary">{log.assistant}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-t-primary">{log.assistantPhone}</td>
                                <td className="py-4 px-4 text-t-primary">{log.customerPhone}</td>
                                <td className="py-4 px-4">
                                    <Badge className={`px-2 py-1 text-xs font-medium ${getTypeBadge(log.type)}`}>
                                        {log.type}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge className={`px-2 py-1 text-xs font-medium ${getEndedReasonBadge(log.endedReason)}`}>
                                        {log.endedReason}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge className={`px-2 py-1 text-xs font-medium ${getStatusBadge(log.successEvaluation)}`}>
                                        {log.successEvaluation}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4 text-t-secondary text-sm">{log.startTime}</td>
                                <td className="py-4 px-4 text-t-primary">{log.duration}</td>
                                <td className="py-4 px-4 font-medium text-t-primary">{log.cost}</td>
                            </TableRow>
                        ))}
                    </Table>
                    
                    {filteredCallLogs.length === 0 && (
                        <div className="text-center py-8">
                            <Icon name="search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-t-secondary">No call logs found matching your criteria.</p>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default CallLogsPage;

