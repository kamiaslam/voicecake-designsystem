"use client";

import { useState } from "react";
import { Element } from "react-scroll";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import BasicInfo from "./BasicInfo";
import InputSchema from "./InputSchema";
import WebhookConfig from "./WebhookConfig";
import { Link } from "react-scroll";

const ElementWithOffset = ({
    className,
    name,
    children,
}: {
    className?: string;
    name: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="relative">
            <Element
                className={`absolute -top-21 left-0 right-0 ${className || ""}`}
                name={name}
            ></Element>
            {children}
        </div>
    );
};

const CustomToolsPage = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const navigation = [
        {
            title: "Basic Info",
            icon: "settings",
            description: "Tool name, description, and basic settings",
            to: "basic-info",
            tabId: 1,
        },
        {
            title: "Input Schema",
            icon: "file",
            description: "Define input properties and types",
            to: "input-schema",
            tabId: 2,
        },
        {
            title: "Webhook Config",
            icon: "link",
            description: "Webhook settings and integration",
            to: "webhook-config",
            tabId: 3,
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 1:
                return <BasicInfo />;
            case 2:
                return <InputSchema />;
            case 3:
                return <WebhookConfig />;
            default:
                return <BasicInfo />;
        }
    };

    const handleTabClick = (tabId: number) => {
        setActiveTab(tabId);
    };

    return (
        <Layout title="Custom Tools">
            <div className="flex items-start max-lg:block">
                {/* Sidebar Navigation */}
                <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-h6 text-t-primary mb-2">Custom Tools</h2>
                        <p className="text-caption text-t-secondary">Create and manage custom tools for your AI agents.</p>
                    </div>

                    {/* Create Tool Button */}
                    <Button 
                        className="w-full mb-4"
                        onClick={() => console.log("Create tool clicked")}
                    >
                        <Icon name="plus" className="w-4 h-4 mr-2" />
                        Create Tool
                    </Button>

                    {/* Search */}
                    <Search
                        className="mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tools..."
                        isGray
                    />

                    {/* Navigation Menu */}
                    <div className="flex flex-col gap-1">
                        {navigation.map((item, index) => (
                            <button
                                key={index}
                                className={`group relative flex items-center h-18 px-3 cursor-pointer text-left ${
                                    activeTab === item.tabId 
                                        ? "[&_.box-hover]:!visible [&_.box-hover]:!opacity-100" 
                                        : ""
                                }`}
                                onClick={() => handleTabClick(item.tabId)}
                            >
                                <div className="box-hover"></div>
                                <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                                    <Icon
                                        className={`fill-t-secondary ${
                                            activeTab === item.tabId ? "fill-t-primary" : ""
                                        }`}
                                        name={item.icon}
                                    />
                                </div>
                                <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                                    <div className={`text-button ${
                                        activeTab === item.tabId ? "text-t-primary" : ""
                                    }`}>{item.title}</div>
                                    <div className="mt-1 truncate text-caption text-t-secondary">
                                        {item.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-t-primary">Custom Tools</h1>
                            <p className="text-gray-600">Create and manage custom tools for your AI agents.</p>
                        </div>
                        <Button className="flex items-center gap-2">
                            <Icon name="plus" className="w-4 h-4" />
                            Create Tool
                        </Button>
                    </div>

                    {/* Tab Content */}
                    <Card className="p-6">
                        {/* Tab Navigation (Mobile/Tablet) */}
                        <div className="flex gap-1 mb-8 lg:hidden">
                            {navigation.map((item) => (
                                <button
                                    key={item.tabId}
                                    className={`flex items-center h-12 px-5.5 rounded-full border text-button transition-colors hover:text-t-primary ${
                                        activeTab === item.tabId
                                            ? "border-s-stroke2 text-white bg-black dark:bg-white dark:text-black"
                                            : "border-transparent text-t-secondary"
                                    }`}
                                    onClick={() => handleTabClick(item.tabId)}
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="pt-3">
                            {renderTabContent()}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-s-subtle">
                            <Button isStroke>
                                Cancel
                            </Button>
                            <Button className="flex items-center gap-2">
                                <Icon name="plus" className="w-4 h-4" />
                                Create Tool
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default CustomToolsPage;
