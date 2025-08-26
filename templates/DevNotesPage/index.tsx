import { useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Select from "@/components/Select";

const DevNotesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "api", label: "API Documentation" },
    { value: "integration", label: "Integration Guides" },
    { value: "troubleshooting", label: "Troubleshooting" },
    { value: "changelog", label: "Changelog" },
    { value: "examples", label: "Code Examples" }
  ];

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
      case "stable": return "bg-green-100 text-green-800";
      case "beta": return "bg-yellow-100 text-yellow-800";
      case "alpha": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-blue-100 text-blue-800";
      case "fix": return "bg-green-100 text-green-800";
      case "improvement": return "bg-purple-100 text-purple-800";
      case "security": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContent = () => {
    switch (selectedCategory) {
      case "api":
        return apiEndpoints;
      case "integration":
        return integrationGuides;
      case "troubleshooting":
        return troubleshootingItems;
      case "changelog":
        return changelogEntries;
      default:
        return [];
    }
  };

  return (
    <Layout title="Developer Notes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Developer Notes</h1>
            <p className="text-gray-600">Technical documentation and development resources</p>
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
              className="w-48"
            />
            <Button variant="outline">
              Download SDK
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">API Endpoints</div>
            <div className="text-2xl font-bold text-blue-600">{apiEndpoints.length}</div>
            <div className="text-xs text-gray-500">documented</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Integration Guides</div>
            <div className="text-2xl font-bold text-green-600">{integrationGuides.length}</div>
            <div className="text-xs text-gray-500">available</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Known Issues</div>
            <div className="text-2xl font-bold text-yellow-600">{troubleshootingItems.length}</div>
            <div className="text-xs text-gray-500">documented</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Latest Version</div>
            <div className="text-2xl font-bold text-purple-600">v2.1.0</div>
            <div className="text-xs text-gray-500">released Jan 22</div>
          </Card>
        </div>

        {/* API Documentation */}
        {(selectedCategory === "all" || selectedCategory === "api") && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className={`${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} font-mono`}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <Badge className={getStatusColor(endpoint.status)}>
                      {endpoint.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{endpoint.description}</p>
                  <div className="text-xs text-gray-500">Last updated: {endpoint.lastUpdated}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Integration Guides */}
        {(selectedCategory === "all" || selectedCategory === "integration") && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationGuides.map((guide, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{guide.title}</h3>
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Est. time: {guide.estimatedTime}</span>
                    <Button size="sm" variant="outline">
                      View Guide
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Troubleshooting */}
        {(selectedCategory === "all" || selectedCategory === "troubleshooting") && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              {troubleshootingItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{item.issue}</h3>
                    <Badge className={getSeverityColor(item.severity)}>
                      {item.severity}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{item.solution}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Changelog */}
        {(selectedCategory === "all" || selectedCategory === "changelog") && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Changelog</h2>
            <div className="space-y-4">
              {changelogEntries.map((entry, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.version}</span>
                      <Badge className={getTypeColor(entry.type)}>
                        {entry.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{entry.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Code Examples */}
        {selectedCategory === "examples" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Code Examples</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Basic API Request</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
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
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
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
      </div>
    </Layout>
  );
};

export default DevNotesPage;