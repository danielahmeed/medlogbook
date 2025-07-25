import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { Dashboard } from "./Dashboard";
import { OperationForm } from "./OperationForm";

// Add "cpd" to the View type
type View = "login" | "dashboard" | "add-operation" | "cpd";

// Simple CPD placeholder component
const CPDPlaceholder = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-2xl font-bold mb-4">CPD Section</h2>
    <p className="mb-6">This section is under construction.</p>
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={onBack}
    >
      Back to Dashboard
    </button>
  </div>
);

export const MedicalLogbook = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>("login");
  const [operations, setOperations] = useState<any[]>([]);

  const handleLogin = (userId: string) => {
    setCurrentUser(userId);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
  };

  const handleAddOperation = () => {
    setCurrentView("add-operation");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleSaveOperation = (operation: any) => {
    setOperations(prev => [...prev, operation]);
    setCurrentView("dashboard");
  };

  // Handler for CPD view
  const handleShowCPD = () => {
    setCurrentView("cpd");
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (currentView === "add-operation") {
    return (
      <OperationForm
        onBack={handleBackToDashboard}
        onSave={handleSaveOperation}
      />
    );
  }

  if (currentView === "cpd") {
    return <CPDPlaceholder onBack={handleBackToDashboard} />;
  }

  return (
    <Dashboard
      userId={currentUser}
      onLogout={handleLogout}
      onAddOperation={handleAddOperation}
      onShowCPD={handleShowCPD} // Pass the handler
      operations={operations}
    />
  );
};