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
import { users, type User } from "@/lib/data";

const statusOptions = [
    { id: 1, name: "All Status" },
    { id: 2, name: "Active" },
    { id: 3, name: "Trial" },
    { id: 4, name: "Inactive" },
];

const planOptions = [
    { id: 1, name: "All Plans" },
    { id: 2, name: "Starter" },
    { id: 3, name: "Pro" },
    { id: 4, name: "Business" },
    { id: 5, name: "Enterprise" },
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
    const [planFilter, setPlanFilter] = useState(planOptions[0]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter.name === "All Status" || user.status === statusFilter.name.toLowerCase();
            const matchesPlan = planFilter.name === "All Plans" || user.plan === planFilter.name;
            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [searchTerm, statusFilter, planFilter]);

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: "bg-primary-02/20 text-primary-02 border border-primary-02/30",
            trial: "bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/30",
            inactive: "bg-[#FF6A55]/20 text-[#FF6A55] border border-[#FF6A55]/30",
        };
        return statusClasses[status as keyof typeof statusClasses] || "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
    };

    const getPlanBadge = (plan: string) => {
        const planClasses = {
            Starter: "bg-primary-01/20 text-primary-01 border border-primary-01/30",
            Pro: "bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30",
            Business: "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30",
            Enterprise: "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30",
        };
        return planClasses[plan as keyof typeof planClasses] || "bg-t-tertiary/20 text-t-tertiary border border-t-tertiary/30";
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
                            <Icon name="check" className="w-8 h-8 fill-primary-02" />
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
                            <Icon name="profile" className="w-8 h-8 fill-t-secondary" />
                        </div>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="p-6" title="Users & Accounts">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Search
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search companies..."
                                isGray
                            />
                        </div>
                        <div className="flex gap-4">
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={statusOptions}
                                placeholder="Select status"
                            />
                            <Select
                                value={planFilter}
                                onChange={setPlanFilter}
                                options={planOptions}
                                placeholder="Select plan"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <Table
                        cellsThead={
                            <>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Company</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Plan</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Seats</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">MRR</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Auto Renew</th>
                                <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
                            </>
                        }
                    >
                        {filteredUsers.map((user, index) => (
                            <TableRow key={index}>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-01 to-[#8B5CF6] rounded-lg flex items-center justify-center text-t-light font-semibold">
                                            {user.company.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-t-primary">{user.company}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge className={`px-2 py-1 text-xs font-medium ${getPlanBadge(user.plan)}`}>
                                        {user.plan}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4 text-t-primary">{user.seats}</td>
                                <td className="py-4 px-4">
                                    <Badge className={`px-2 py-1 text-xs font-medium ${getStatusBadge(user.status)}`}>
                                        {user.status}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4 font-medium text-t-primary">${user.mrr}</td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full ${user.autoRenew ? 'bg-primary-02' : 'bg-[#FF6A55]'}`}></div>
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
                                            <Icon name="dots" className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </TableRow>
                        ))}
                    </Table>
                    
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-t-secondary">No users found matching your criteria.</p>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default UsersPage;