import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Percentage from "@/components/Percentage";
import Tabs from "@/components/Tabs";
import Loader from "@/components/Loader";
import { agentsService } from "@/services/agent";
import { Agent } from "@/types/agent";
import { toast } from "sonner";

const durations = [
    { id: 1, name: "Last 2 weeks" },
    { id: 2, name: "Last month" },
    { id: 3, name: "Last year" },
];

const categories = [
    { id: 1, name: "Name" },
    { id: 2, name: "Status" },
    { id: 3, name: "Type" },
];

const ProductActivity = ({}) => {
    const [duration, setDuration] = useState(durations[0]);
    const [category, setCategory] = useState(categories[0]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <Card
            className="p-6 mb-0 h-[325px] flex flex-col"
            title="Your Agents"
            selectValue={duration}
            selectOnChange={setDuration}
            selectOptions={durations}
        >
            <Tabs
                className="hidden px-3 max-md:flex mb-4"
                classButton="flex-1"
                items={categories}
                value={category}
                setValue={setCategory}
            />
            
            {loading ? (
                <div className="flex-1 flex flex-col">
                    {/* Fixed Header */}
                    <div className="flex items-center gap-3 h-10 text-caption text-t-tertiary/80 border-b border-s-subtle">
                        <div className="flex-1 font-medium">Agent</div>
                        <div
                            className={`flex-1 font-medium ${
                                category.id === 1 ? "max-md:block" : "max-md:hidden"
                            }`}
                        >
                            Name
                        </div>
                        <div
                            className={`flex-1 font-medium ${
                                category.id === 2 ? "max-md:block" : "max-md:hidden"
                            }`}
                        >
                            Status
                        </div>
                        <div
                            className={`flex-1 font-medium ${
                                category.id === 3 ? "max-md:block" : "max-md:hidden"
                            }`}
                        >
                            Type
                        </div>
                        <div className="flex-1 max-2xl:hidden font-medium">Sessions</div>
                    </div>
                    
                    {/* Skeleton Loading Rows */}
                    <div className="h-40 overflow-hidden">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 h-12 border-b border-s-subtle"
                            >
                                <div className="flex items-center flex-1 px-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                </div>
                                <div
                                    className={`flex items-center gap-2 flex-1 px-2 ${
                                        category.id === 1
                                            ? "max-md:flex"
                                            : "max-md:hidden"
                                    }`}
                                >
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                </div>
                                <div
                                    className={`flex items-center gap-2 flex-1 px-2 ${
                                        category.id === 2
                                            ? "max-md:flex"
                                            : "max-md:hidden"
                                    }`}
                                >
                                    <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                </div>
                                <div
                                    className={`flex items-center gap-2 flex-1 px-2 ${
                                        category.id === 3
                                            ? "max-md:flex"
                                            : "max-md:hidden"
                                    }`}
                                >
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                                </div>
                                <div className="flex items-center gap-2 flex-1 px-2 max-2xl:hidden">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500">
                    <div className="text-center">
                        <p className="text-base">Error loading agents</p>
                        <p className="text-xs">{error}</p>
                    </div>
                </div>
            ) : agents.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-t-tertiary">
                    <div className="text-center">
                        <p className="text-base">No agents found</p>
                        <p className="text-xs">Create your first agent to get started</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    {/* Fixed Header */}
                    <div className="flex items-center gap-3 h-10 text-caption text-t-tertiary/80 border-b border-s-subtle">
                        <div className="flex-1 font-medium">Agent</div>
                        <div
                            className={`flex-1 font-medium ${
                                category.id === 1 ? "max-md:block" : "max-md:hidden"
                            }`}
                        >
                            Name
                        </div>
                        <div
                            className={`flex-1 font-medium ${
                                category.id === 2 ? "max-md:block" : "max-md:hidden"
                            }`}
                        >
                            Status
                        </div>
                        <div
                            className={`flex-1 font-medium ${
                                category.id === 3 ? "max-md:block" : "max-md:hidden"
                            }`}
                        >
                            Type
                        </div>
                        <div className="flex-1 max-2xl:hidden font-medium">Sessions</div>
                    </div>
                    
                    {/* Scrollable Table Body with Fixed Height */}
                    <div className="h-40 overflow-y-auto">
                        {agents.map((agent) => (
                            <div
                                className="flex items-center gap-3 h-12 border-b border-s-subtle text-body-2 hover:bg-b-surface2 transition-colors"
                                key={agent.id}
                            >
                                <div className="flex items-center flex-1 px-2">
                                    {agent.name}
                                </div>
                                <div
                                    className={`flex items-center gap-2 flex-1 px-2 ${
                                        category.id === 1
                                            ? "max-md:flex"
                                            : "max-md:hidden"
                                    }`}
                                >
                                    {agent.name}
                                </div>
                                <div
                                    className={`flex items-center gap-2 flex-1 px-2 ${
                                        category.id === 2
                                            ? "max-md:flex"
                                            : "max-md:hidden"
                                    }`}
                                >
                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                        agent.status === 'active' ? 'bg-green-100 text-green-800' :
                                        agent.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {agent.status}
                                    </span>
                                </div>
                                <div
                                    className={`flex items-center gap-2 flex-1 px-2 ${
                                        category.id === 3
                                            ? "max-md:flex"
                                            : "max-md:hidden"
                                    }`}
                                >
                                    {agent.type || 'Empth'}
                                </div>
                                <div className="flex items-center gap-2 flex-1 px-2 max-2xl:hidden">
                                    {agent.total_sessions}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ProductActivity;
