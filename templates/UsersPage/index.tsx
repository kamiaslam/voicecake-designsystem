"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { users, type User } from "@/lib/data";

const statusOptions = [
    { id: "all", name: "All Status" },
    { id: "active", name: "Active" },
    { id: "trial", name: "Trial" },
    { id: "inactive", name: "Inactive" },
];

const planOptions = [
    { id: "all", name: "All Plans" },
    { id: "Starter", name: "Starter" },
    { id: "Pro", name: "Pro" },
    { id: "Business", name: "Business" },
    { id: "Enterprise", name: "Enterprise" },
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
    const [planFilter, setPlanFilter] = useState(planOptions[0]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter.id === "all" || user.status === statusFilter.id;
            const matchesPlan = planFilter.id === "all" || user.plan === planFilter.id;
            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [searchTerm, statusFilter, planFilter]);

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: "bg-green-100 text-green-800",
            trial: "bg-yellow-100 text-yellow-800",
            inactive: "bg-red-100 text-red-800",
        };
        return statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
    };

    const getPlanBadge = (plan: string) => {
        const planClasses = {
            Starter: "bg-blue-100 text-blue-800",
            Pro: "bg-purple-100 text-purple-800",
            Business: "bg-indigo-100 text-indigo-800",
            Enterprise: "bg-orange-100 text-orange-800",
        };
        return planClasses[plan as keyof typeof planClasses] || "bg-gray-100 text-gray-800";
    };

    return (
        <Layout title="Users & Accounts">
            <div className="space-y-6">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-6" title="Total Users">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Users</p>
                                <p className="text-2xl font-bold text-t-primary">{users.length}</p>
                            </div>
                            <Icon name="profile" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Active Users">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Active Users</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {users.filter(u => u.status === "active").length}
                                </p>
                            </div>
                            <Icon name="check" className="w-8 h-8 fill-green-500" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Total MRR">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total MRR</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    ${users.reduce((sum, user) => sum + user.mrr, 0).toLocaleString()}
                                </p>
                            </div>
                            <Icon name="wallet" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                    <Card className="p-6" title="Total Seats">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-t-secondary">Total Seats</p>
                                <p className="text-2xl font-bold text-t-primary">
                                    {users.reduce((sum, user) => sum + user.seats, 0)}
                                </p>
                            </div>
                            <Icon name="users" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="p-6" title="Users & Accounts">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 fill-t-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-s-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter.id}
                                onChange={(e) => setStatusFilter(statusOptions.find(opt => opt.id === e.target.value) || statusOptions[0])}
                                className="px-4 py-2 border border-s-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            <select
                                value={planFilter.id}
                                onChange={(e) => setPlanFilter(planOptions.find(opt => opt.id === e.target.value) || planOptions[0])}
                                className="px-4 py-2 border border-s-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {planOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-s-stroke">
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Company</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Plan</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Seats</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">MRR</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Auto Renew</th>
                                    <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={index} className="border-b border-s-stroke hover:bg-b-depth2 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                                    {user.company.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-t-primary">{user.company}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(user.plan)}`}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-t-primary">{user.seats}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-medium text-t-primary">${user.mrr}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full ${user.autoRenew ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="ml-2 text-sm text-t-secondary">
                                                    {user.autoRenew ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <Button isStroke>
                                                    <Icon name="edit" className="w-4 h-4" />
                                                </Button>
                                                <Button isStroke>
                                                    <Icon name="more" className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-t-secondary">No users found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default UsersPage;