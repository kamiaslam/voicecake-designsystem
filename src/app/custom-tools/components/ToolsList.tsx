import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { Tool } from "../types";

interface ToolsListProps {
  tools: Tool[];
  loading: boolean;
  searchTerm: string;
  onCreateTool: () => void;
  onEditTool: (tool: Tool) => void;
  onDeleteTool: (toolId: string | number) => void;
}

export const ToolsList = ({
  tools,
  loading,
  searchTerm,
  onCreateTool,
  onEditTool,
  onDeleteTool
}: ToolsListProps) => {
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="card p-6">
        <div className="space-y-4">
          {/* Skeleton Table Header */}
          <div className="flex gap-4 pb-3 border-b border-s-subtle w-full">
            <div className="w-100 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-60 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-30 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-30 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Skeleton Table Rows */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-4 py-4 border-b border-s-subtle">
              {/* Tool Name & Webhook */}
              <div className="w-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Description */}
              {/* <div className="w-32">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              </div> */}
              
              {/* Status */}
              <div className="w-60 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Success Rate */}
              <div className="w-30 space-y-1">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Actions */}
              <div className="w-30 flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center py-12">
          <Icon name="tools" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tools Created Yet</h3>
          <p className="text-gray-500 mb-6">Create your first custom tool to get started</p>
          <Button onClick={onCreateTool}>
            <Icon name="plus" className="w-4 h-4 mr-2" />
            Create Your First Tool
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Tools Overview */}
      <div>
        <h3 className="text-xl font-semibold text-t-primary mb-4">Your Custom Tools</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-caption text-t-tertiary/80 border-b border-s-subtle">
              <tr className="border-b border-s-stroke">
                <th className="text-left py-3 px-4 font-medium text-t-secondary w-30">Tool Name</th>
                {/* <th className="text-left py-3 px-4 font-medium text-t-secondary">Description</th> */}
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Success Rate</th>
                <th className="text-left py-3 px-4 font-medium text-t-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="border-b border-s-subtle hover:bg-b-surface2 transition-colors">
                  <td className="py-4 px-4 w-30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                        <Icon name="tools" className="w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] fill-white" />
                      </div>
                      <div>
                        <p className="font-medium text-t-primary">{tool.name}</p>
                        <p className="text-sm text-t-secondary">{tool.webhook_url || 'No webhook'}</p>
                      </div>
                    </div>
                  </td>
                  {/* <td className="py-4 px-4 text-body-2 max-w-xs">
                    <p className="truncate">{tool.description}</p>
                  </td> */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        tool.is_healthy ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm capitalize">
                        {tool.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-t-primary">{tool.success_rate || 0}%</span>
                      <span className="text-sm text-t-secondary">({tool.successful_calls || 0}/{tool.total_calls || 0})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button 
                        isStroke 
                        className="h-1"
                        onClick={() => onEditTool(tool)}
                      >
                        <Icon name="edit" className="w-4 h-4 fill-t-secondary" />
                      </Button>
                      <Button 
                        isStroke 
                        className="p-2 text-red-600 hover:text-red-700"
                        onClick={() => onDeleteTool(tool.id!)}
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      {tools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-stroke">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Total Tools</p>
                <p className="text-2xl font-bold text-t-primary">{tools.length}</p>
              </div>
              <Icon name="tools" className="w-8 h-8 fill-t-secondary" />
            </div>
          </div>
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-stroke">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Active Tools</p>
                <p className="text-2xl font-bold text-primary-02">
                  {tools.filter(t => t.is_active).length}
                </p>
              </div>
              <Icon name="check-circle" className="w-8 h-8 fill-primary-02" />
            </div>
          </div>
          <div className="p-4 bg-b-surface2 rounded-lg border border-s-stroke">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-t-secondary">Avg Success Rate</p>
                <p className="text-2xl font-bold text-t-primary">
                  {tools.length > 0 ? Math.round(tools.reduce((sum, t) => sum + (t.success_rate || 0), 0) / tools.length) : 0}%
                </p>
              </div>
              <Icon name="chart" className="w-8 h-8 fill-primary-02" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
