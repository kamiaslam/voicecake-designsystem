"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { agents, type Agent } from "@/lib/data";

const typeOptions = [
    { id: "all", name: "All Types" },
    { id: "Conversa", name: "Conversa" },
    { id: "Empath", name: "Empath" },
];

const AgentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState(typeOptions[0]);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                agent.client.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter.id === "all" || agent.type === typeFilter.id;
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter]);

    const getTypeColor = (type: string) => {
        return type === "Conversa" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
    };

    const getLatencyColor = (latency: number) => {
        if (latency < 400) return "text-green-600";
        if (latency < 600) return "text-yellow-600";
        return "text-red-600";
    };

    const getCSATColor = (csat: number) => {
        if (csat >= 4.5) return "text-green-600";
        if (csat >= 4.0) return "text-yellow-600";
        return "text-red-600";
    };

    const avgLatency = agents.reduce((sum, agent) => sum + agent.latency, 0) / agents.length;
    const avgCSAT = agents.reduce((sum, agent) => sum + agent.csat, 0) / agents.length;
    const totalCalls = agents.reduce((sum, agent) => sum + agent.calls, 0);

    return (
        <Layout title="Agents & Bots">
            <div className="space-y-6">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-6" title="Total Agents">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Agents</p>
                                <p className="text-2xl font-bold text-t-primary">{agents.length}</p>
                            </div>
                            <Icon name="robot" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Avg Latency">
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
                    <Card className="p-6" title="Avg CSAT">
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
                    <Card className="p-6" title="Total Calls">
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
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 fill-t-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search agents or clients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-s-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={typeFilter.id}
                                onChange={(e) => setTypeFilter(typeOptions.find(opt => opt.id === e.target.value) || typeOptions[0])}
                                className="px-4 py-2 border border-s-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {typeOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            <Button>
                                <Icon name="plus" className="w-4 h-4 mr-2" />
                                Deploy Agent
                            </Button>
                        </div>
                    </div>

                    {/* Agents Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-s-stroke">
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Agent Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Client</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Latency</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">CSAT</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Calls</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAgents.map((agent, index) => (
                                    <tr key={index} className="border-b border-s-stroke hover:bg-b-depth2 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                                    <Icon name="robot" className="w-5 h-5 fill-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-t-primary">{agent.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(agent.type)}`}>
                                                {agent.type}
                                            </span>
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
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAgents.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-t-secondary">No agents found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Performance Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6" title="Agent Performance">
                        <h3 className="text-lg font-semibold text-t-primary mb-4">Agent Performance</h3>
                        <div className="space-y-4">
                            {agents.map((agent, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${agent.csat >= 4.5 ? 'bg-green-500' : agent.csat >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
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
                        <h3 className="text-lg font-semibold text-t-primary mb-4">Agent Types Distribution</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-stroke rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
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
                                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
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