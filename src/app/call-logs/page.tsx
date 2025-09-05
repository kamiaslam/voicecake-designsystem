"use client";

import { useState, useMemo, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import { callLogsAPI } from "@/services/api";
import { toast } from "sonner";

// Call log data type
type CallLog = {
  session_id: string;
  agent_id: string;
  status: string;
  created_at: string;
  last_accessed: string;
  call_sid: string | null;
  from_number: string | null;
  to_number: string | null;
  participant_name: string;
  participant_identity: string;
  agent_instructions: string;
};

type CallLogsResponse = {
  success: boolean;
  message: string;
  data: {
    total_calls: number;
    calls: CallLog[];
  };
};

const CallLogsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [assistantFilter, setAssistantFilter] = useState({ id: 0, name: "All Assistants" });
    const [typeFilter, setTypeFilter] = useState({ id: 0, name: "All Types" });
    const [statusFilter, setStatusFilter] = useState({ id: 0, name: "All Status" });
    const [dateRange, setDateRange] = useState("last-7-days");
    const [callLogsData, setCallLogsData] = useState<CallLog[]>([]);
    const [totalCalls, setTotalCalls] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCallLogs = async () => {
            setLoading(true);
            try {
                const data: CallLogsResponse = await callLogsAPI.getCallLogs(50, 0);
                
                if (data.success) {
                    setCallLogsData(data.data.calls);
                    setTotalCalls(data.data.total_calls);
                } else {
                    toast.error(data.message || 'Failed to load call logs');
                }
            } catch (error: any) {
                console.error('Error loading call logs:', error);
                toast.error(error.response?.data?.message || 'Failed to load call logs');
            } finally {
                setLoading(false);
            }
        };

        loadCallLogs();
    }, []);

    const refreshCallLogs = async () => {
        setLoading(true);
        try {
            const data: CallLogsResponse = await callLogsAPI.getCallLogs(50, 0);
            
            if (data.success) {
                setCallLogsData(data.data.calls);
                setTotalCalls(data.data.total_calls);
                toast.success('Call logs refreshed successfully');
            } else {
                toast.error(data.message || 'Failed to refresh call logs');
            }
        } catch (error: any) {
            console.error('Error refreshing call logs:', error);
            toast.error(error.response?.data?.message || 'Failed to refresh call logs');
        } finally {
            setLoading(false);
        }
    };

    const filteredCallLogs = useMemo(() => {
        return callLogsData.filter(log => {
            const matchesSearch = 
                log.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.agent_id.includes(searchTerm) ||
                (log.from_number && log.from_number.includes(searchTerm)) ||
                (log.to_number && log.to_number.includes(searchTerm));
            
            const matchesAssistant = assistantFilter.id === 0 || log.agent_id === assistantFilter.name;
            const matchesType = typeFilter.id === 0; // We'll determine type based on from_number/to_number
            const matchesStatus = statusFilter.id === 0 || log.status === statusFilter.name;
            
            return matchesSearch && matchesAssistant && matchesType && matchesStatus;
        });
    }, [searchTerm, assistantFilter, typeFilter, statusFilter, callLogsData]);

    const getTypeBadge = (log: CallLog) => {
        const hasFromNumber = log.from_number && log.from_number.trim() !== '';
        const hasToNumber = log.to_number && log.to_number.trim() !== '';
        
        if (hasFromNumber && hasToNumber) {
            return "bg-blue-100 text-blue-800 border border-blue-200";
        } else if (hasFromNumber) {
            return "bg-green-100 text-green-800 border border-green-200";
        } else if (hasToNumber) {
            return "bg-purple-100 text-purple-800 border border-purple-200";
        } else {
            return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    const getTypeText = (log: CallLog) => {
        const hasFromNumber = log.from_number && log.from_number.trim() !== '';
        const hasToNumber = log.to_number && log.to_number.trim() !== '';
        
        if (hasFromNumber && hasToNumber) {
            return "Two-way";
        } else if (hasFromNumber) {
            return "Inbound";
        } else if (hasToNumber) {
            return "Outbound";
        } else {
            return "Unknown";
        }
    };

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: "bg-primary-02/20 text-primary-02 border border-primary-02/30",
            completed: "bg-green-500/20 text-green-500 border border-green-500/30",
            expired: "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30"
        };
        return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border border-gray-200";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    const getDuration = (createdAt: string, lastAccessed: string) => {
        const start = new Date(createdAt);
        const end = new Date(lastAccessed);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        return `${diffMins}m ${diffSecs}s`;
    };

    // Skeleton loader component
    const SkeletonTableRow = () => (
        <TableRow>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            </td>
        </TableRow>
    );

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

                {/* Call Logs Table */}
                <Card title="Call Logs" className="p-6">
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Search
                                    placeholder="Search calls..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-64"
                                    isGray
                                />
                                <Select
                                    value={assistantFilter}
                                    onChange={setAssistantFilter}
                                    options={[
                                        { id: 0, name: "All Assistants" },
                                        { id: 1, name: "34" },
                                        { id: 2, name: "53" },
                                        { id: 3, name: "84" },
                                        { id: 4, name: "100" }
                                    ]}
                                    className="w-full sm:w-40"
                                />
                                <Select
                                    value={typeFilter}
                                    onChange={setTypeFilter}
                                    options={[
                                        { id: 0, name: "All Types" },
                                        { id: 1, name: "Inbound" },
                                        { id: 2, name: "Outbound" },
                                        { id: 3, name: "Two-way" }
                                    ]}
                                    className="w-full sm:w-40"
                                />
                                <Select
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { id: 0, name: "All Status" },
                                        { id: 1, name: "active" },
                                        { id: 2, name: "completed" },
                                        { id: 3, name: "expired" }
                                    ]}
                                    className="w-full sm:w-40"
                                />
                                <Button className="w-full sm:w-auto" onClick={refreshCallLogs}>
                                    <Icon name="refresh" className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <Table
                            cellsThead={
                                <>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Session ID</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Agent</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Participant</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Phone Numbers</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Duration</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Created</th>
                                </>
                            }
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <SkeletonTableRow key={i} />
                            ))}
                        </Table>
                    ) : (
                        <Table
                            cellsThead={
                                <>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Session ID</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Agent</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Participant</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Phone Numbers</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Duration</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Created</th>
                                </>
                            }
                        >
                            {filteredCallLogs.map((log) => (
                                <TableRow key={log.session_id}>
                                    <td className="py-4 px-4">
                                        <span className="font-medium text-t-primary text-xs">
                                            {log.session_id.substring(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-01 to-[#8B5CF6] rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                                                {log.agent_id.charAt(0)}
                                            </div>
                                            <span className="text-t-primary">Agent {log.agent_id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-t-primary">{log.participant_name}</td>
                                    <td className="py-4 px-4 text-t-secondary">
                                        <div className="text-xs">
                                            {log.from_number && <div>From: {log.from_number}</div>}
                                            {log.to_number && <div>To: {log.to_number}</div>}
                                            {!log.from_number && !log.to_number && <div className="text-gray-400">No numbers</div>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className={`px-2 py-1 text-xs font-medium ${getTypeBadge(log)}`}>
                                            {getTypeText(log)}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4 text-t-primary text-sm">
                                        {getDuration(log.created_at, log.last_accessed)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className={`px-2 py-1 text-xs font-medium ${getStatusBadge(log.status)}`}>
                                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4 text-t-secondary text-xs">
                                        {formatDate(log.created_at)}
                                    </td>
                                </TableRow>
                            ))}
                        </Table>
                    )}
                    
                    {filteredCallLogs.length === 0 && !loading && (
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

