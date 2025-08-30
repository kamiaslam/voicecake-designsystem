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
import { agents, type Agent } from "@/lib/data";

const typeOptions = [
    { id: 1, name: "All Types" },
    { id: 2, name: "Conversa" },
    { id: 3, name: "Empath" },
];

const AgentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState(typeOptions[0]);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                agent.client.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter.id === 1 || 
                (typeFilter.id === 2 && agent.type === "Conversa") ||
                (typeFilter.id === 3 && agent.type === "Empath");
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter]);

    const getTypeColor = (type: string) => {
        return type === "Conversa" 
            ? "bg-[#6366F1]/20 text-[#6366F1]" 
            : "bg-[#8B5CF6]/20 text-[#8B5CF6]";
    };

    const getLatencyColor = (latency: number) => {
        if (latency < 400) return "text-primary-02";
        if (latency < 600) return "text-[#FFB020]";
        return "text-[#FF6A55]";
    };

    const getCSATColor = (csat: number) => {
        if (csat >= 4.5) return "text-primary-02";
        if (csat >= 4.0) return "text-[#FFB020]";
        return "text-[#FF6A55]";
    };

    const avgLatency = agents.reduce((sum, agent) => sum + agent.latency, 0) / agents.length;
    const avgCSAT = agents.reduce((sum, agent) => sum + agent.csat, 0) / agents.length;
    const totalCalls = agents.reduce((sum, agent) => sum + agent.calls, 0);

    return (
        <Layout title="Agents & Bots">
            <div className="space-y-3">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-6 mb-0" title="Total Agents">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Agents</p>
                                <p className="text-2xl font-bold text-t-primary">{agents.length}</p>
                            </div>
                            <Icon name="robot" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6 mb-0" title="Avg Latency">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Avg Latency</p>
                                <p className={`text-2xl font-bold ${getLatencyColor(avgLatency)}`}>
                                    {Math.round(avgLatency)}ms
                                </p>
                            </div>
                            <Icon name="clock" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6 mb-0" title="Avg CSAT">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Avg CSAT</p>
                                <p className={`text-2xl font-bold ${getCSATColor(avgCSAT)}`}>
                                    {avgCSAT.toFixed(1)}
                                </p>
                            </div>
                            <Icon name="star" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6 mb-0" title="Total Calls">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Calls</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {totalCalls.toLocaleString()}
                                </p>
                            </div>
                            <Icon name="phone" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="p-6" title="Agents & Bots">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Search
                                placeholder="Search agents or clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                isGray
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select
                                options={typeOptions}
                                value={typeFilter}
                                onChange={setTypeFilter}
                                className="min-w-[150px]"
                            />
                            <Button>
                                <Icon name="plus" className="w-4 h-4 mr-2" />
                                Deploy Agent
                            </Button>
                        </div>
                    </div>

                    {/* Agents Table */}
                    <div className="overflow-x-auto">
                        <Table
                            cellsThead={
                                <>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Agent Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Client</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Latency</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">CSAT</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Calls</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
                                </>
                            }
                        >
                            {filteredAgents.map((agent, index) => (
                                <TableRow key={index}>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                                                <Icon name="robot" className="w-5 h-5 fill-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-t-primary">{agent.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className={getTypeColor(agent.type)}>
                                            {agent.type}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4 text-t-primary">{agent.client}</td>
                                    <td className="py-4 px-4">
                                        <span className={`font-medium ${getLatencyColor(agent.latency)}`}>
                                            {agent.latency}ms
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <Icon name="star" className={`w-4 h-4 ${getCSATColor(agent.csat)}`} />
                                            <span className={`font-medium ${getCSATColor(agent.csat)}`}>
                                                {agent.csat}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium text-t-primary">
                                        {agent.calls.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-primary-02"></div>
                                            <span className="ml-2 text-sm text-t-secondary">Active</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <Button isStroke className="p-2">
                                                <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                                            </Button>
                                            <Button isStroke className="p-2">
                                                <Icon name="profile" className="w-4 h-4 fill-t-secondary" />
                                            </Button>
                                            <Button isStroke className="p-2">
                                                <Icon name="dots" className="w-4 h-4 fill-t-secondary" />
                                            </Button>
                                        </div>
                                    </td>
                                </TableRow>
                            ))}
                        </Table>
                        {filteredAgents.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-t-secondary">No agents found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Performance Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Card className="p-6" title="Agent Performance">
                        <div className="space-y-4">
                            {agents.map((agent, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${agent.csat >= 4.5 ? 'bg-primary-02' : agent.csat >= 4.0 ? 'bg-[#FFB020]' : 'bg-[#FF6A55]'}`}></div>
                                        <span className="font-medium text-t-primary">{agent.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-t-primary">{agent.csat} CSAT</div>
                                        <div className="text-xs text-t-secondary">{agent.calls} calls</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6" title="Agent Types Distribution">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-stroke rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-[#6366F1] rounded"></div>
                                    <span className="font-medium text-t-primary">Conversa</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-t-primary">
                                        {agents.filter(a => a.type === "Conversa").length} agents
                                    </div>
                                    <div className="text-xs text-t-secondary">
                                        {agents.filter(a => a.type === "Conversa").reduce((sum, a) => sum + a.calls, 0)} calls
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-stroke rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-[#8B5CF6] rounded"></div>
                                    <span className="font-medium text-t-primary">Empath</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-t-primary">
                                        {agents.filter(a => a.type === "Empath").length} agents
                                    </div>
                                    <div className="text-xs text-t-secondary">
                                        {agents.filter(a => a.type === "Empath").reduce((sum, a) => sum + a.calls, 0)} calls
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AgentsPage;