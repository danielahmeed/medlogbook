import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  RefreshCw,
  Search,
  Menu,
  FileText,
  Calendar,
  Building2,
  Activity
} from "lucide-react";

interface Operation {
  id: string;
  patientId: string;
  age: number;
  operation: string;
  hospital: string;
  date: string;
  operatorLevel: string;
}

interface DashboardProps {
  userId: string;
  onLogout: () => void;
  onAddOperation: () => void;
  onShowCPD: () => void;
  operations: Operation[];
}

const CPDPlaceholder = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-2xl font-bold mb-4">CPD Section</h2>
    <p className="mb-6">This section is under construction.</p>
    <Button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded">
      Back to Logbook
    </Button>
  </div>
);

export const Dashboard = ({
  userId,
  onLogout,
  onAddOperation,
  operations
}: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"logbook" | "cpd" | "reports">("logbook");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleAddOperation = () => {
    onAddOperation();
  };

  const filteredOperations = operations.filter(op =>
    op.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-[var(--shadow-card)] sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground">Mobile eLogbook</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddOperation}
              className="hover:bg-primary/10"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hover:bg-primary/10"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Local Data</p>
                  <p className="text-xl font-semibold">{operations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPD</p>
                  <p className="text-xl font-semibold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "logbook" ? "medical" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveTab("logbook")}
          >
            LOGBOOK
          </Button>
          <Button
            variant={activeTab === "cpd" ? "medical" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveTab("cpd")}
          >
            CPD
          </Button>
          <Button
            variant={activeTab === "reports" ? "medical" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setActiveTab("reports")}
          >
            REPORTS
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "logbook" && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Operations List */}
            <div className="space-y-4">
              {filteredOperations.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No operations</h3>
                    <p className="text-muted-foreground mb-6">Press + to add your first operation</p>
                    <Button variant="medical" onClick={handleAddOperation}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Operation
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredOperations.map((operation) => (
                  <Card key={operation.id} className="border-border/50 hover:shadow-[var(--shadow-card)] transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">
                            Patient ID: {operation.patientId}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Age: {operation.age} years
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {operation.operatorLevel}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="font-medium">{operation.operation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                          <span>{operation.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{operation.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {/* Bottom Status */}
            <div className="text-center py-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                {operations.length} operation(s)
              </p>
              <p className="text-xs text-muted-foreground">
                Last uploaded: Never
              </p>
            </div>
          </>
        )}

        {activeTab === "cpd" && (
          <CPDPlaceholder onBack={() => setActiveTab("logbook")} />
        )}

        {activeTab === "reports" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Reports Section</h2>
            <p className="mb-6">This section is under construction.</p>
            <Button onClick={() => setActiveTab("logbook")} className="px-4 py-2 bg-blue-600 text-white rounded">
              Back to Logbook
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};