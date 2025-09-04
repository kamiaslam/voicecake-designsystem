"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import { agentsService } from "@/services/agent";
import { Agent } from "@/types/agent";
import { toast } from "sonner";
import { CreateAgentModal } from "@/components/CreateAgentModal";

const typeOptions = [
    { id: 1, name: "All Types" },
    { id: 2, name: "SPEECH" },
    { id: 3, name: "TEXT" },
];

const AgentsPage = () => {
    const router = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState({ id: 1, name: "All" });
    const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch agents from API
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                setError(null);
                const agentsData = await agentsService.getAgents();
                setAgents(agentsData);
            } catch (err: any) {
                console.error("Error fetching agents:", err);
                setError(err.message || "Failed to fetch agents");
                toast.error("Failed to load agents");
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = typeFilter.id === 1 || 
                (typeFilter.id === 2 && agent.agent_type === "SPEECH") ||
                (typeFilter.id === 3 && agent.agent_type === "TEXT");
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter, agents]);

    const getTypeColor = (type: string) => {
        return type === "SPEECH" 
            ? "bg-[#6366F1]/20 text-[#6366F1]" 
            : "bg-[#8B5CF6]/20 text-[#8B5CF6]";
    };

    const getStatusColor = (status: string) => {
        if (status === 'active') return "text-primary-02";
        if (status === 'training') return "text-[#FFB020]";
        return "text-[#FF6A55]";
    };

    const getStatusBgColor = (status: string) => {
        if (status === 'active') return "bg-primary-02";
        if (status === 'training') return "bg-[#FFB020]";
        return "bg-[#FF6A55]";
    };

    // Calculate stats from real agent data
    const totalAgents = agents.length;
    const activeAgents = agents.filter(agent => agent.status === 'active').length;
    const avgSessions = agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + agent.total_sessions, 0) / agents.length) : 0;
    const totalSessions = agents.reduce((sum, agent) => sum + agent.total_sessions, 0);

    const handleCreateAgent = (agentData: any) => {
        console.log("Agent created - Raw data:", agentData);
        console.log("Agent created - Data type:", typeof agentData);
        console.log("Agent created - Data keys:", agentData ? Object.keys(agentData) : "No data");
        
        // Check if agentData has the expected structure
        if (!agentData || typeof agentData !== 'object') {
            console.error("Invalid agent data received:", agentData);
            toast.error("Invalid agent data received");
            return;
        }
        
        // Ensure the agent has required properties for display
        const newAgent = {
            id: agentData.id || Date.now(), // Fallback ID if not provided
            name: agentData.name || "Unnamed Agent",
            description: agentData.description || "",
            agent_type: agentData.agent_type || agentData.type || "SPEECH", // Handle both field names
            status: agentData.status || "active",
            total_sessions: agentData.total_sessions || 0,
            voice_provider: agentData.voice_provider || "",
            voice_id: agentData.voice_id || "",
            model_provider: agentData.model_provider || "",
            model_resource: agentData.model_resource || "",
            custom_instructions: agentData.custom_instructions || "",
            created_at: agentData.created_at || new Date().toISOString(),
            updated_at: agentData.updated_at || new Date().toISOString(),
            last_used: agentData.last_used || null,
            tool_ids: agentData.tool_ids || []
        };
        
        console.log("Formatted agent data:", newAgent);
        
        // Add the new agent to the list
        setAgents(prev => [...prev, newAgent]);
        toast.success("Agent created successfully!");
        
        // Close the modal
        setIsCreateAgentModalOpen(false);
    };

    const handleEditAgent = (agent: Agent) => {
        setEditingAgent(agent);
        setIsCreateAgentModalOpen(true);
    };

    const handleUpdateAgent = (updatedAgentData: any) => {
        console.log("Agent updated:", updatedAgentData);
        
        // Update the agent in the list
        setAgents(prev => prev.map(agent => 
            agent.id === editingAgent?.id ? updatedAgentData : agent
        ));
        
        toast.success("Agent updated successfully!");
        setEditingAgent(null);
        setIsCreateAgentModalOpen(false);
    };

    const handleCloseEditModal = () => {
        setEditingAgent(null);
        setIsCreateAgentModalOpen(false);
    };

    return (
        <Layout title="Agents & Bots">
            <div className="space-y-3">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-6 mb-0" title="Total Agents">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Agents</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : totalAgents}
                                </p>
                            </div>
                            <Icon name="robot" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6 mb-0" title="Active Agents">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Active Agents</p>
                                <p className="text-2xl font-bold text-primary-02">
                                    {loading ? "..." : activeAgents}
                                </p>
                            </div>
                            <Icon name="check-circle" className="w-8 h-8 fill-primary-02" />
                        </div>
                    </Card>
                    <Card className="p-6 mb-0" title="Avg Sessions">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Avg Sessions</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : avgSessions}
                                </p>
                            </div>
                            <Icon name="chart" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6 mb-0" title="Total Sessions">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Sessions</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {loading ? "..." : totalSessions.toLocaleString()}
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
                                placeholder="Search agents or descriptions..."
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
                            <Button onClick={() => router.push('/add-agent')}>
                                <Icon name="plus" className="w-4 h-4 mr-2" />
                                Add Agent
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <>
                            {/* Skeleton Loading for Mobile Cards */}
                            <div className="block lg:hidden space-y-4">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        {/* Header Skeleton */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                        </div>

                                        {/* Description Skeleton */}
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                                        </div>

                                        {/* Metrics Skeleton */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            </div>
                                        </div>

                                        {/* Voice Provider and Last Used Skeleton */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            </div>
                                        </div>

                                        {/* Actions Skeleton */}
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <div className="flex-1 h-8  bg-gray-200 rounded animate-pulse"></div>
                                            <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Skeleton Loading for Desktop Table */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        {/* Table Header */}
                                        <div className="text-caption text-t-tertiary/80 border-b border-s-subtle">
                                            <div className="grid grid-cols-8 gap-4 py-3 px-4">
                                                <div className="font-medium text-t-secondary">Agent Name</div>
                                                <div className="font-medium text-t-secondary">Type</div>
                                                <div className="font-medium text-t-secondary">Description</div>
                                                <div className="font-medium text-t-secondary">Status</div>
                                                <div className="font-medium text-t-secondary">Sessions</div>
                                                <div className="font-medium text-t-secondary">Voice Provider</div>
                                                <div className="font-medium text-t-secondary">Last Used</div>
                                                <div className="font-medium text-t-secondary">Actions</div>
                                            </div>
                                        </div>
                                        
                                        {/* Table Body Skeleton */}
                                        <div className="h-80 overflow-y-auto">
                                            {[...Array(6)].map((_, index) => (
                                                <div key={index} className="grid grid-cols-8 gap-4 py-2 px-4 border-b border-s-subtle">
                                                    {/* Agent Name */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                                    </div>
                                                    {/* Type */}
                                                    <div className="flex items-center">
                                                        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                                    </div>
                                                    {/* Description */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                                    </div>
                                                    {/* Status */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                                    </div>
                                                    {/* Sessions */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                                                    </div>
                                                    {/* Voice Provider */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                                    </div>
                                                    {/* Last Used */}
                                                    <div className="flex items-center">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-3xl bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-8 h-8 rounded-3xl bg-gray-200 rounded animate-pulse"></div>
                                                        <div className="w-8 h-8 rounded-3xl bg-gray-200 rounded animate-pulse"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500 mb-2">Error loading agents</p>
                            <p className="text-sm text-t-secondary">{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card Layout */}
                            <div className="block lg:hidden space-y-4">
                                {filteredAgents.map((agent, index) => (
                                    <div key={agent.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 min-w-[25px] min-h-[25px] max-w-[25px] max-h-[25px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                                                    <Icon name="robot" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-t-primary">{agent.name}</p>
                                                    <p className="text-sm text-t-secondary">{agent.agent_type || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <Badge className={getTypeColor(agent.agent_type || 'TEXT')}>
                                                {agent.agent_type || 'TEXT'}
                                            </Badge>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <p className="text-sm text-t-secondary">Description</p>
                                            <p className="text-sm text-t-primary">
                                                {agent.description || 'No description available'}
                                            </p>
                                        </div>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-t-secondary">Status</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${getStatusBgColor(agent.status)}`}></div>
                                                    <span className="text-sm font-medium capitalize">{agent.status}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-t-secondary">Sessions</p>
                                                <p className="font-medium text-t-primary">
                                                    {agent.total_sessions}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Voice Provider and Last Used */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div>
                                                <p className="text-sm text-t-secondary">Voice Provider</p>
                                                <p className="font-medium text-t-primary">
                                                    {agent.voice_provider || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-t-secondary">Last Used</p>
                                                <p className="font-medium text-t-primary">
                                                    {agent.last_used ? new Date(agent.last_used).toLocaleDateString() : 'Never'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <Button isStroke className="flex-1">
                                                <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                                                Edit
                                            </Button>
                                            <Button 
                                                isStroke 
                                                className="flex-1"
                                                onClick={() => router.push(`/inference/${agent.id}`)}
                                            >
                                                <Icon name="play" className="w-4 h-4 fill-t-secondary" />
                                                Test
                                            </Button>
                                            <Button isStroke>
                                                <Icon name="dots" className="w-4 h-4 fill-t-secondary" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        {/* Table Header */}
                                        <div className="text-caption text-t-tertiary/80 border-b border-s-subtle">
                                            <div className="grid grid-cols-8 gap-4 py-3 px-4">
                                                <div className="font-small text-t-secondary">Agent Name</div>
                                                <div className="font-medium text-t-secondary">Type</div>
                                                <div className="font-medium text-t-secondary">Description</div>
                                                <div className="font-medium text-t-secondary">Status</div>
                                                <div className="font-medium text-t-secondary">Sessions</div>
                                                <div className="font-medium text-t-secondary">Voice Provider</div>
                                                <div className="font-medium text-t-secondary">Last Used</div>
                                                <div className="font-medium text-t-secondary">Actions</div>
                                                <div className="font-medium text-t-secondary"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Table Body with Fixed Height and Scrolling */}
                                        <div className="h-80 overflow-y-auto">
                                            {filteredAgents.map((agent) => (
                                                <div key={agent.id} className="grid grid-cols-8 gap-4 py-2 px-4 border-b border-s-subtle text-body-2 hover:bg-b-surface2 transition-colors">
                                                    {/* Agent Name */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                                                            <Icon name="robot" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-t-primary">{agent.name}</p>
                                                        </div>
                                                    </div>
                                                    {/* Type */}
                                                    <div className="flex items-center">
                                                        <Badge className={getTypeColor(agent.agent_type || 'TEXT')}>
                                                            {agent.agent_type || 'TEXT'}
                                                        </Badge>
                                                    </div>
                                                    {/* Description */}
                                                    <div className="flex items-center">
                                                        <div className="text-t-primary max-w-xs truncate">
                                                            {agent.description || 'No description available'}
                                                        </div>
                                                    </div>
                                                    {/* Status */}
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusBgColor(agent.status)}`}></div>
                                                        <span className="text-sm capitalize">{agent.status}</span>
                                                    </div>
                                                    {/* Sessions */}
                                                    <div className="flex items-center">
                                                        <div className="font-medium text-t-primary">
                                                            {agent.total_sessions}
                                                        </div>
                                                    </div>
                                                    {/* Voice Provider */}
                                                    <div className="flex items-center">
                                                        <div className="text-t-primary">
                                                            {agent.voice_provider || 'N/A'}
                                                        </div>
                                                    </div>
                                                    {/* Last Used */}
                                                    <div className="flex items-center">
                                                        <div className="text-t-primary">
                                                            {agent.last_used ? new Date(agent.last_used).toLocaleDateString() : 'Never'}
                                                        </div>
                                                    </div>
                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                          onClick={() => handleEditAgent(agent)}
                                                          className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                        >
                                                             <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                                                         </button>
                                                        <button 
                                                          onClick={() => router.push(`/inference/${agent.id}`)}
                                                          className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors"
                                                        >
                                                            <Icon name="play" className="w-4 h-4 fill-t-secondary" />
                                                        </button>
                                                        <button className="w-8 h-8 p-1 border rounded-3xl border-gray-300 rounded hover:bg-gray-100 hover:text-primary-01 flex items-center justify-center transition-colors">
                                                            <Icon name="dots" className="w-4 h-4 fill-t-secondary" />
                                                        </button>
                                                    </div>
                                                    {/* Empty column for spacing */}
                                                    <div className="flex items-center">
                                                        <div></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {filteredAgents.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-t-secondary">No agents found matching your criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </Card>

                {/* Performance Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Card className="p-6" title="Agent Performance">
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {agents.slice(0, 5).map((agent) => (
                                    <div key={agent.id} className="flex items-center justify-between p-3 bg-b-depth2 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-primary-02' : agent.status === 'training' ? 'bg-[#FFB020]' : 'bg-[#FF6A55]'}`}></div>
                                            <span className="font-medium text-t-primary">{agent.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-t-primary">{agent.total_sessions} sessions</div>
                                            <div className="text-xs text-t-secondary capitalize">{agent.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="p-6" title="Agent Types Distribution">
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-b-depth2 border border-s-stroke rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-stroke rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-[#6366F1] rounded"></div>
                                        <span className="font-medium text-t-primary">SPEECH</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-t-primary">
                                            {agents.filter(a => a.agent_type === "SPEECH").length} agents
                                        </div>
                                        <div className="text-xs text-t-secondary">
                                            {agents.filter(a => a.agent_type === "SPEECH").reduce((sum, a) => sum + a.total_sessions, 0)} sessions
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-b-depth2 border border-s-stroke rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-[#8B5CF6] rounded"></div>
                                        <span className="font-medium text-t-primary">TEXT</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-t-primary">
                                            {agents.filter(a => a.agent_type === "TEXT").length} agents
                                        </div>
                                        <div className="text-xs text-t-secondary">
                                            {agents.filter(a => a.agent_type === "TEXT").reduce((sum, a) => sum + a.total_sessions, 0)} sessions
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            <CreateAgentModal 
                    isOpen={isCreateAgentModalOpen} 
                    onClose={handleCloseEditModal}
                    onSubmit={handleCreateAgent}
                    editAgent={editingAgent}
                    onUpdate={handleUpdateAgent}
                />
        </Layout>
    );
};

export default AgentsPage;