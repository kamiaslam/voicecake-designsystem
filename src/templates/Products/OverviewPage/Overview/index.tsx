import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import Select from "@/components/Select";
import Item from "./Item";
import { agentsService } from "@/services/agent";
import { Agent } from "@/types/agent";
import { toast } from "sonner";
import { overview } from "@/mocks/products";

const timeOptionsShort = [
    { id: 1, name: "1D" },
    { id: 2, name: "7D" },
    { id: 3, name: "1M" },
    { id: 4, name: "6M" },
    { id: 5, name: "1Y" },
];

const timeOptionsLong = [
    { id: 1, name: "1 day" },
    { id: 2, name: "7 days" },
    { id: 3, name: "1 month" },
    { id: 4, name: "6 months" },
    { id: 5, name: "1 year" },
];

const Overview = ({}) => {
    const [timeShort, setTimeShort] = useState(timeOptionsShort[4]);
    const [timeLong, setTimeLong] = useState(timeOptionsLong[4]);
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

    // Generate dynamic stats based on real data
    const generateStats = () => {
        const activeAgents = agents.filter(agent => agent.status === 'active');
        const totalAgents = agents.length;
        
        return [
            {
                id: 1,
                title: "Total Agents",
                icon: "profile",
                tooltip: "Total number of agents in your system",
                counter: loading ? "..." : totalAgents.toString(),
                percentage: 0,
                trend: loading ? "" : "Empth 7. Conversa 5",
                iconBgColor: "#FF6692",
                cardColor: "#FFD9E4",
                dataChart: [
                    { name: "Jan", amt: Math.max(0, totalAgents - 4) },
                    { name: "Feb", amt: Math.max(0, totalAgents - 3) },
                    { name: "Mar", amt: Math.max(0, totalAgents - 2) },
                    { name: "Apr", amt: Math.max(0, totalAgents - 1) },
                    { name: "May", amt: totalAgents },
                    { name: "Jun", amt: totalAgents },
                ],
            },
            {
                id: 2,
                title: "Automation Active",
                icon: "dashboard",
                tooltip: "Number of active automation workflows",
                counter: loading ? "..." : activeAgents.length.toString(),
                percentage: 0,
                trend: loading ? "" : "Empth 7. Conversa 5",
                iconBgColor: "#8965E5",
                cardColor: "#E7E2F3",
                dataChart: [
                    { name: "Jan", amt: Math.max(0, activeAgents.length - 2) },
                    { name: "Feb", amt: Math.max(0, activeAgents.length - 1) },
                    { name: "Mar", amt: activeAgents.length },
                    { name: "Apr", amt: activeAgents.length },
                    { name: "May", amt: activeAgents.length },
                    { name: "Jun", amt: activeAgents.length },
                ],
            },
            {
                id: 3,
                title: "Minutes Remaining",
                icon: "clock",
                tooltip: "Available minutes for voice calls",
                counter: "300",
                percentage: 0,
                trend: loading ? "" : "TTS Tokens",
                iconBgColor: "#00CEB6",
                cardColor: "#BAFAF2",
                dataChart: [
                    { name: "Jan", amt: 280 },
                    { name: "Feb", amt: 290 },
                    { name: "Mar", amt: 295 },
                    { name: "Apr", amt: 300 },
                    { name: "May", amt: 300 },
                    { name: "Jun", amt: 300 },
                ],
            },
        ];
    };

    const stats = generateStats();

    return (
        <Card
            className="max-lg:overflow-hidden mb-3"
            title="Overview"
            headContent={
                <>
                    <Tabs
                        className="max-md:hidden"
                        items={timeOptionsShort}
                        value={timeShort}
                        setValue={setTimeShort}
                    />
                    <Select
                        className="hidden min-w-40 max-md:block"
                        value={timeLong}
                        onChange={setTimeLong}
                        options={timeOptionsLong}
                    />
                </>
            }
        >
            <div className="relative before:hidden after:hidden before:absolute before:-left-3 before:top-0 before:bottom-0 before:z-3 before:w-8 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-3 after:top-0 after:bottom-0 after:z-3 after:w-8 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-lg:before:block max-lg:after:block">
                <div className="flex gap-8 p-5 pt-4 pb-0 max-lg:-mx-3 max-lg:px-6 max-lg:overflow-auto max-lg:scrollbar-none">
                    {stats.map((item) => (
                        <Item value={item} key={item.id} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default Overview;
