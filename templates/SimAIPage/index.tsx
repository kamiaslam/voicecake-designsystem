"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import SimAIOverview from "./SimAIOverview";
import SimAIWorkspace from "./SimAIWorkspace";
import SimAIEmbed from "./SimAIEmbed";
import Tabs from "@/components/Tabs";

const SimAIPage = () => {
    const [activeTab, setActiveTab] = useState("embed");
    
    const tabs = [
        { id: "embed", title: "SIM AI Studio", icon: "🤖" },
        { id: "overview", title: "Overview", icon: "📊" },
        { id: "workspace", title: "Workspace Manager", icon: "🏢" },
    ];

    return (
        <Layout title="Sim AI - Powered by VoiceCake">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-shade-09">
                            SIM AI Integration
                        </h2>
                        <p className="text-shade-06 mt-1">
                            Access powerful AI agents and workflow automation directly from VoiceCake
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-01/10 rounded-lg">
                        <span className="text-xs text-primary-04">VC-Agent Active</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>
            
            <div className="space-y-6">
                {activeTab === "embed" && (
                    <div className="bg-shade-02 rounded-lg p-1">
                        <SimAIEmbed height="calc(100vh - 300px)" />
                    </div>
                )}
                {activeTab === "overview" && <SimAIOverview />}
                {activeTab === "workspace" && <SimAIWorkspace />}
            </div>
        </Layout>
    );
};

export default SimAIPage;
