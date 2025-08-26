import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import Badge from "@/components/Badge";
import Search from "@/components/Search";
import Select from "@/components/Select";
import { API, hasPerm, type StaffMember, type Role } from "@/lib/data.ts";

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        const staff = await API.listStaff();
        setStaffData(staff);
      } catch (error) {
        console.error('Failed to load staff:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, []);

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "agent", label: "Agent" },
    { value: "viewer", label: "Viewer" }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  const filteredStaff = staffData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "agent": return "bg-green-100 text-green-800";
      case "viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeMembers = staffData.filter(m => m.status === "active").length;
  const pendingMembers = staffData.filter(m => m.status === "pending").length;
  const adminCount = staffData.filter(m => m.role === "admin").length;

  return (
    <Layout title="Team & Permissions">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total Members</div>
            <div className="text-2xl font-bold text-blue-600">{staffData.length}</div>
            <div className="text-xs text-gray-500">team members</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Active Members</div>
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
            <div className="text-xs text-gray-500">currently active</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Pending Invites</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingMembers}</div>
            <div className="text-xs text-gray-500">awaiting response</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Administrators</div>
            <div className="text-2xl font-bold text-red-600">{adminCount}</div>
            <div className="text-xs text-gray-500">with admin access</div>
          </Card>
        </div>

        {/* Team Members Table */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Search
                placeholder="Search members..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-64"
              />
              <Select
                value={roleFilter}
                onChange={setRoleFilter}
                options={roleOptions}
                className="w-full sm:w-32"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                className="w-full sm:w-32"
              />
              <Button className="w-full sm:w-auto">
                Invite Member
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading team members...</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Last Active</th>
                  <th className="text-left">Permissions</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <td className="font-medium">{member.name}</td>
                    <td className="text-gray-600">{member.email}</td>
                    <td>
                      <Badge className={getRoleColor(member.role)}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-gray-600">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.slice(0, 2).map((perm) => (
                          <Badge key={perm} className="bg-blue-50 text-blue-700 text-xs">
                            {perm.replace('_', ' ')}
                          </Badge>
                        ))}
                        {member.permissions.length > 2 && (
                          <Badge className="bg-gray-50 text-gray-700 text-xs">
                            +{member.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        {member.status === "active" && member.role !== "admin" && (
                          <Button size="sm" variant="outline">
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}

          {filteredStaff.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No team members found matching your criteria.
            </div>
          )}
        </Card>

        {/* Permissions Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Permission Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {staffData.filter(m => hasPerm(m, 'user_management')).length}
              </div>
              <div className="text-sm text-gray-600">User Management</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {staffData.filter(m => hasPerm(m, 'billing_access')).length}
              </div>
              <div className="text-sm text-gray-600">Billing Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {staffData.filter(m => hasPerm(m, 'system_config')).length}
              </div>
              <div className="text-sm text-gray-600">System Config</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {staffData.filter(m => hasPerm(m, 'audit_logs')).length}
              </div>
              <div className="text-sm text-gray-600">Audit Logs</div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamPage;