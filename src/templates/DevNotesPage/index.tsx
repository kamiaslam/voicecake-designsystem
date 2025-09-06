"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Select from "@/components/Select";
import { SelectOption } from "@/types/select";
import { useFinance } from "@/context/financeContext";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import Icon from "@/components/Icon";

// Mock data types
const DevNotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<SelectOption>({ id: 1, name: "All Categories" });
  
  // API Keys state
  const { listApiKeys, rotateApiKey, revokeApiKey } = useFinance();
  const [keys, setKeys] = useState<any[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedScope, setSelectedScope] = useState("conversa");


  const categories: SelectOption[] = [
    { id: 1, name: "All Categories" },
    { id: 2, name: "API Documentation" },
    { id: 3, name: "Integration Guides" },
    { id: 4, name: "Troubleshooting" },
    { id: 5, name: "Changelog" },
    { id: 6, name: "Code Examples" },
    { id: 7, name: "API Keys" }
  ];

  // API Keys management functions
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      try {
        const items = await listApiKeys(selectedScope);
        setKeys(items.filter((k: any) => k.scope === selectedScope));
      } catch {
        setKeys([]);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [selectedScope, listApiKeys]);

  const handleRotate = async () => {
    setLoading(true);
    try {
      const data = await rotateApiKey(selectedScope);
      setRevealed(true);
      setKeys(prev => [{ id: data.id, scope: data.scope, preview: data.api_key_raw || undefined, is_active: true }, ...prev]);
      if (data.api_key_raw) toast.success("New API key generated. Copy and store it securely.");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to rotate API key");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setLoading(true);
    try {
      if (!keys[0]?.id) return;
      await revokeApiKey(keys[0].id as number);
      setKeys(prev => prev.map((k, i) => (i === 0 ? { ...k, is_active: false } : k)));
      toast.success("API key revoked");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to revoke API key");
    } finally {
      setLoading(false);
    }
  };


  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/v1/users",
      description: "Retrieve all users with pagination",
      status: "stable",
      lastUpdated: "2024-01-15"
    },
    {
      method: "POST",
      endpoint: "/api/v1/users",
      description: "Create a new user account",
      status: "stable",
      lastUpdated: "2024-01-10"
    },
    {
      method: "GET",
      endpoint: "/api/v1/agents",
      description: "List all AI agents and their configurations",
      status: "beta",
      lastUpdated: "2024-01-20"
    },
    {
      method: "POST",
      endpoint: "/api/v1/workflows",
      description: "Create and deploy new workflow automation",
      status: "alpha",
      lastUpdated: "2024-01-22"
    },
    {
      method: "GET",
      endpoint: "/api/v1/billing/invoices",
      description: "Retrieve billing information and invoices",
      status: "stable",
      lastUpdated: "2024-01-12"
    }
  ];

  const integrationGuides = [
    {
      title: "React Integration",
      description: "How to integrate our dashboard components into React applications",
      difficulty: "beginner",
      estimatedTime: "15 min",
      category: "integration"
    },
    {
      title: "Webhook Setup",
      description: "Configure webhooks for real-time event notifications",
      difficulty: "intermediate",
      estimatedTime: "30 min",
      category: "integration"
    },
    {
      title: "Authentication Flow",
      description: "Implement OAuth 2.0 and JWT token authentication",
      difficulty: "advanced",
      estimatedTime: "45 min",
      category: "integration"
    },
    {
      title: "Custom Agent Development",
      description: "Build and deploy custom AI agents using our SDK",
      difficulty: "advanced",
      estimatedTime: "2 hours",
      category: "integration"
    }
  ];

  const troubleshootingItems = [
    {
      issue: "API Rate Limiting",
      solution: "Implement exponential backoff and respect rate limit headers",
      category: "troubleshooting",
      severity: "medium"
    },
    {
      issue: "Webhook Delivery Failures",
      solution: "Check endpoint availability and implement retry logic",
      category: "troubleshooting",
      severity: "high"
    },
    {
      issue: "Agent Response Timeouts",
      solution: "Increase timeout values and optimize agent configurations",
      category: "troubleshooting",
      severity: "medium"
    },
    {
      issue: "Dashboard Loading Issues",
      solution: "Clear browser cache and check network connectivity",
      category: "troubleshooting",
      severity: "low"
    }
  ];

  const changelogEntries = [
    {
      version: "v2.1.0",
      date: "2024-01-22",
      type: "feature",
      description: "Added new workflow automation capabilities",
      category: "changelog"
    },
    {
      version: "v2.0.5",
      date: "2024-01-20",
      type: "fix",
      description: "Fixed agent response timeout issues",
      category: "changelog"
    },
    {
      version: "v2.0.4",
      date: "2024-01-18",
      type: "improvement",
      description: "Enhanced dashboard performance and loading times",
      category: "changelog"
    },
    {
      version: "v2.0.3",
      date: "2024-01-15",
      type: "security",
      description: "Updated authentication security protocols",
      category: "changelog"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable": return "bg-green-500/10 text-green-400";
      case "beta": return "bg-yellow-500/10 text-yellow-400";
      case "alpha": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/10 text-green-400";
      case "intermediate": return "bg-yellow-500/10 text-yellow-400";
      case "advanced": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-500/10 text-green-400";
      case "medium": return "bg-yellow-500/10 text-yellow-400";
      case "high": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-blue-500/10 text-blue-400";
      case "fix": return "bg-green-500/10 text-green-400";
      case "improvement": return "bg-purple-500/10 text-purple-400";
      case "security": return "bg-red-500/10 text-red-400";
      default: return "bg-[var(--backgrounds-surface2)] text-[var(--text-secondary)]";
    }
  };

  const filteredContent = () => {
    switch (selectedCategory.id) {
      case 2:
        return apiEndpoints;
      case 3:
        return integrationGuides;
      case 4:
        return troubleshootingItems;
      case 5:
        return changelogEntries;
      case 7:
        return keys;
      default:
        return [];
    }
  };

  return (
    <Layout title="Developer Notes">
                  <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold"></h1>
            <p className="text-[var(--text-secondary)]">Technical documentation and development resources</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
            />
            <Button >
              Download SDK
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card title="API Endpoints" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{apiEndpoints.length}</div>
            <div className="text-xs text-[var(--text-tertiary)]">documented</div>
          </Card>
          <Card title="Integration Guides" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{integrationGuides.length}</div>
            <div className="text-xs text-[var(--text-tertiary)]">available</div>
          </Card>
          <Card title="Known Issues" className="p-6">
            <div className="text-2xl font-bold text-t-primary">{troubleshootingItems.length}</div>
            <div className="text-xs text-[var(--text-tertiary)]">documented</div>
          </Card>
          <Card title="Latest Version" className="p-6">
            <div className="text-2xl font-bold text-t-primary">v2.1.0</div>
            <div className="text-xs text-[var(--text-tertiary)]">released Jan 22</div>
          </Card>
        </div>

        {/* API Documentation */}
        {(selectedCategory.id === 1 || selectedCategory.id === 2) && (
          <Card title="API Documentation" className="p-6">
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border border-s-subtle rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className={`${endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'} font-mono`}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm bg-[var(--backgrounds-surface2)] px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <Badge className={getStatusColor(endpoint.status)}>
                      {endpoint.status}
                    </Badge>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm mb-2">{endpoint.description}</p>
                  <div className="text-xs text-[var(--text-tertiary)]">Last updated: {endpoint.lastUpdated}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Integration Guides */}
        {(selectedCategory.id === 1 || selectedCategory.id === 3) && (
          <Card title="Integration Guides" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationGuides.map((guide, index) => (
                <div key={index} className="border border-s-subtle rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{guide.title}</h3>
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm mb-3">{guide.description}</p>
                  <div className="flex justify-between items-center text-xs text-[var(--text-tertiary)]">
                    <span>Est. time: {guide.estimatedTime}</span>
                    <Button>
                      View Guide
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Troubleshooting */}
        {(selectedCategory.id === 1 || selectedCategory.id === 4) && (
          <Card title="Troubleshooting" className="p-6">
            <div className="space-y-4">
              {troubleshootingItems.map((item, index) => (
                <div key={index} className="border border-s-subtle rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.issue}</h3>
                    <Badge className={getSeverityColor(item.severity)}>
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">{item.solution}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Changelog */}
        {(selectedCategory.id === 1 || selectedCategory.id === 5) && (
          <Card title="Changelog" className="p-6">
            <div className="space-y-4">
              {changelogEntries.map((entry, index) => (
                <div key={index} className="border-l-4 border-[var(--primary-01)] pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.version}</span>
                      <Badge className={getTypeColor(entry.type)}>
                        {entry.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-[var(--text-tertiary)]">{entry.date}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">{entry.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Code Examples */}
        {selectedCategory.id === 6 && (
          <Card title="Code Examples" className="p-6">
            <h2 className="text-xl font-semibold mb-4">Code Examples</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium mb-2">Basic API Request</h3>
                <pre className="bg-[var(--backgrounds-surface2)] p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`// JavaScript example
const response = await fetch('/api/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});

const users = await response.json();`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">React Component Integration</h3>
                <pre className="bg-[var(--backgrounds-surface2)] p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`// React component example
import { DashboardProvider } from '@your-org/dashboard';

function App() {
  return (
    <DashboardProvider apiKey="your-api-key">
      <YourDashboard />
    </DashboardProvider>
  );
}`}</code>
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* API Keys */}
        {(selectedCategory.id === 1 || selectedCategory.id === 7) && (
          <Card title="API Keys" className="p-6">
            <div className="space-y-4">
              <p className="text-[var(--text-secondary)] text-sm">
                Manage your API keys for integrations
              </p>
              
              {/* Scope Selection */}
              <div className="flex gap-2 mb-4">
                {['conversa', 'empath', 'wallet'].map(scope => (
                  <Button
                    key={scope}
                    isWhite={selectedScope !== scope}
                    isBlack={selectedScope === scope}
                    onClick={() => setSelectedScope(scope)}
                    className="px-4"
                  >
                    {scope.charAt(0).toUpperCase() + scope.slice(1)}
                  </Button>
                ))}
              </div>

              {fetching ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : (
                <>
                  <div className="flex gap-2 items-center">
                    <Button onClick={handleRotate} disabled={loading}>
                      Generate New API Key
                    </Button>
                    <Button isStroke onClick={handleRevoke} disabled={loading}>
                      Revoke Latest Key
                    </Button>
                  </div>
                  
                  {keys.length > 0 && keys[0]?.preview && keys[0].preview.length > 12 ? (
                    <div className="space-y-2">
                      <div className="text-sm text-[var(--text-secondary)]">Your new API key (visible once)</div>
                      <div className="border border-[var(--stroke-border)] rounded-lg p-3 bg-[var(--backgrounds-surface2)]">
                        <code className="font-mono text-sm">{keys[0].preview as string}</code>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-[var(--text-secondary)]">Keys are masked after creation. Generate a new one to view raw value once.</div>
                  )}
                  
                  <div className="pt-4">
                    <div className="text-sm font-medium mb-2">Your Keys</div>
                    <div className="space-y-2">
                      {keys.map(k => (
                        <div key={String(k.id)} className="flex items-center justify-between border border-[var(--stroke-border)] rounded-lg px-3 py-2">
                          <div className="text-sm">
                            <div className="font-mono">{k.preview || "************"}</div>
                            <div className="text-xs text-[var(--text-tertiary)]">scope: {k.scope} • {k.is_active ? "active" : "revoked"}</div>
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)]">{k.created_at ? new Date(k.created_at).toLocaleString() : ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

      </div>
    </Layout>
  );
};

export default DevNotesPage;