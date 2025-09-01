"use client";

import { useState } from "react";
import { Element } from "react-scroll";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import Search from "@/components/Search";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import Badge from "@/components/Badge";
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

const PhoneNumbersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("phone-numbers");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [phoneNumberData, setPhoneNumberData] = useState({
        label: "",
        smsEnabled: true,
        inboundAssistant: { id: 1, name: "UXPENDIT-Male" },
        inboundWorkflow: { id: 1, name: "Default Workflow" },
        fallbackDestination: "",
        outboundType: "one-number",
        outboundNumber: "",
        outboundAssistant: { id: 1, name: "UXPENDIT-Male" },
        outboundWorkflow: { id: 1, name: "Default Workflow" }
    });

    const navigation = [
        {
            title: "Phone Number Details",
            icon: "phone",
            description: "Basic phone number information",
            to: "phone-details",
        },
        {
            title: "Inbound Settings",
            icon: "inbox",
            description: "Configure incoming call settings",
            to: "inbound-settings",
        },
        {
            title: "Outbound Settings",
            icon: "outbox",
            description: "Configure outgoing call settings",
            to: "outbound-settings",
        },
    ];

    const handleSave = () => {
        // Handle save logic
        console.log("Saving phone number data:", phoneNumberData);
    };

    const handleMakeCall = () => {
        // Handle make call logic
        console.log("Making call...");
    };

    const handleScheduleCall = () => {
        // Handle schedule call logic
        console.log("Scheduling call...");
    };

    return (
        <Layout title="Phone Numbers">
            <div className="flex items-start max-lg:block">
                {/* Custom Left Sidebar */}
                <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden">
                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6">
                        <button
                            onClick={() => setActiveTab("phone-numbers")}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === "phone-numbers"
                                    ? "bg-primary-01 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Phone Numbers
                        </button>
                        <button
                            onClick={() => setActiveTab("docs")}
                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === "docs"
                                    ? "bg-primary-01 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Docs
                        </button>
                    </div>

                    {/* Create Phone Number Button */}
                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full mb-4"
                    >
                        <Icon name="plus" className="w-4 h-4 mr-2" />
                        Create Phone Number
                    </Button>

                    {/* Search */}
                    <Search
                        className="mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search phone numbers..."
                        isGray
                    />

                    {/* Navigation Menu */}
                    <div className="flex flex-col gap-1">
                        {navigation.map((item, index) => (
                            <Link
                                className="group relative flex items-center h-18 px-3 cursor-pointer"
                                activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
                                key={index}
                                to={item.to}
                                smooth={true}
                                duration={500}
                                isDynamic={true}
                                spy={true}
                                offset={-5.5}
                            >
                                <div className="box-hover"></div>
                                <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
                                    <Icon
                                        className="fill-t-secondary"
                                        name={item.icon}
                                    />
                                </div>
                                <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
                                    <div className="text-button">{item.title}</div>
                                    <div className="mt-1 truncate text-caption text-t-secondary">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Phone Numbers List */}
                    <div className="mt-6 space-y-2">
                        <div className="text-sm text-gray-500 text-center py-8">
                            No phone numbers found
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-3 w-[calc(100%-30rem)] pl-3 max-3xl:w-[calc(100%-25rem)] max-2xl:w-[calc(100%-18.5rem)] max-lg:w-full max-lg:pl-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-t-primary mb-1">
                                    +1 (908) 680 8723
                                </h1>
                                <p className="text-sm text-t-secondary">
                                    This number was imported from your Twilio account.
                                </p>
                            </div>
                            <Icon name="warning" className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-t-secondary">
                                <span>126ad19-1768-..</span>
                                <button className="hover:text-t-primary">
                                    <Icon name="copy" className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-md">
                                <Icon name="more" className="w-4 h-4 text-t-secondary" />
                            </button>
                            <Button onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* Phone Number Details Section */}
                    <ElementWithOffset name="phone-details">
                        <Card title="Phone Number Details" className="p-6">
                            <p className="text-sm text-t-secondary mb-4">
                                Give your phone number a descriptive name to help identify it in your list.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-2">
                                        Phone Number Label
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter a name for this phone number..."
                                        value={phoneNumberData.label}
                                        onChange={(e) => setPhoneNumberData({...phoneNumberData, label: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-t-primary">SMS Enabled</label>
                                        <p className="text-xs text-t-secondary">Enable or disable SMS messaging for this Twilio phone number</p>
                                    </div>
                                    <Switch
                                        checked={phoneNumberData.smsEnabled}
                                        onChange={(checked) => setPhoneNumberData({...phoneNumberData, smsEnabled: checked})}
                                    />
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Inbound Settings Section */}
                    <ElementWithOffset name="inbound-settings">
                        <Card title="Inbound Settings" className="p-6">
                            <p className="text-sm text-t-secondary mb-4">
                                You can assign an assistant to the phone number so that whenever someone calls this phone number, the assistant will automatically be assigned to the call.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-2">
                                        Inbound Phone Number
                                    </label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                        <span className="text-t-primary">+19086808723</span>
                                        <Icon name="check" className="w-4 h-4 text-green-500" />
                                    </div>
                                </div>
                                
                                <Select
                                    label="Assistant"
                                    value={phoneNumberData.inboundAssistant}
                                    onChange={(value) => setPhoneNumberData({...phoneNumberData, inboundAssistant: value})}
                                    options={[
                                        { id: 1, name: "UXPENDIT-Male" },
                                        { id: 2, name: "UXPENDIT-Female" }
                                    ]}
                                />
                                
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-2">
                                        Squad
                                    </label>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                        <div className="flex items-center gap-2">
                                            <Icon name="warning" className="w-4 h-4 text-yellow-600" />
                                            <span className="text-sm text-yellow-800">
                                                No squads available. Create a squad to assign to this phone number.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Select
                                    label="Workflow"
                                    value={phoneNumberData.inboundWorkflow}
                                    onChange={(value) => setPhoneNumberData({...phoneNumberData, inboundWorkflow: value})}
                                    placeholder="Select Workflow..."
                                    options={[
                                        { id: 1, name: "Default Workflow" },
                                        { id: 2, name: "Support Workflow" }
                                    ]}
                                />
                                
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-2">
                                        Fallback Destination
                                    </label>
                                    <p className="text-sm text-t-secondary mb-2">
                                        Set a fallback destination for inbound calls when the assistant or squad is not available.
                                    </p>
                                    <div className="flex">
                                        <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                            <span className="text-sm">🇺🇸</span>
                                            <span className="text-sm text-t-secondary">+1</span>
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Enter a phone number"
                                            value={phoneNumberData.fallbackDestination}
                                            onChange={(e) => setPhoneNumberData({...phoneNumberData, fallbackDestination: e.target.value})}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>

                    {/* Outbound Settings Section */}
                    <ElementWithOffset name="outbound-settings">
                        <Card title="Outbound Settings" className="p-6">
                            <p className="text-sm text-t-secondary mb-4">
                                You can assign an outbound phone number, set up a fallback and set up a squad to be called if the assistant is not available.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-3">
                                        Call Type
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="outboundType"
                                                value="one-number"
                                                checked={phoneNumberData.outboundType === "one-number"}
                                                onChange={(e) => setPhoneNumberData({...phoneNumberData, outboundType: e.target.value})}
                                                className="text-primary-01 focus:ring-primary-01"
                                            />
                                            <span className="text-sm text-t-primary">Call One Number</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="outboundType"
                                                value="many-numbers"
                                                checked={phoneNumberData.outboundType === "many-numbers"}
                                                onChange={(e) => setPhoneNumberData({...phoneNumberData, outboundType: e.target.value})}
                                                className="text-primary-01 focus:ring-primary-01"
                                            />
                                            <span className="text-sm text-t-primary">Call Many Numbers (Upload CSV)</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-2">
                                        Outbound Phone Number
                                    </label>
                                    <div className="flex">
                                        <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                            <span className="text-sm">🇺🇸</span>
                                            <span className="text-sm text-t-secondary">+1</span>
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Enter a phone number"
                                            value={phoneNumberData.outboundNumber}
                                            onChange={(e) => setPhoneNumberData({...phoneNumberData, outboundNumber: e.target.value})}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-01 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                
                                <Select
                                    label="Assistant"
                                    value={phoneNumberData.outboundAssistant}
                                    onChange={(value) => setPhoneNumberData({...phoneNumberData, outboundAssistant: value})}
                                    placeholder="Select Assistant..."
                                    options={[
                                        { id: 1, name: "UXPENDIT-Male" },
                                        { id: 2, name: "UXPENDIT-Female" }
                                    ]}
                                />
                                
                                <div>
                                    <label className="block text-sm font-medium text-t-primary mb-2">
                                        Workflow
                                    </label>
                                    <p className="text-sm text-t-secondary mb-2">
                                        Route to the specified workflow.
                                    </p>
                                    <Select
                                        value={phoneNumberData.outboundWorkflow}
                                        onChange={(value) => setPhoneNumberData({...phoneNumberData, outboundWorkflow: value})}
                                        placeholder="Select Workflow..."
                                        options={[
                                            { id: 1, name: "Default Workflow" },
                                            { id: 2, name: "Support Workflow" }
                                        ]}
                                    />
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button onClick={handleMakeCall}>
                                        <Icon name="phone" className="w-4 h-4 mr-2" />
                                        Make a Call
                                    </Button>
                                    <Button isStroke onClick={handleScheduleCall}>
                                        <Icon name="calendar" className="w-4 h-4 mr-2" />
                                        Schedule Call
                                        <Icon name="chevron-down" className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </ElementWithOffset>
                </div>
            </div>

            {/* Create Phone Number Modal will be added here */}
            {/* Modal component will be implemented once you provide the details */}
        </Layout>
    );
};

export default PhoneNumbersPage;
