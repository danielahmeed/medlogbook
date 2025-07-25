import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, Save, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OperationFormProps {
  onBack: () => void;
  onSave: (operation: any) => void;
}

export const OperationForm = ({ onBack, onSave }: OperationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientId: "",
    dateOfBirth: "",
    age: "",
    operationDate: new Date().toISOString().split('T')[0],
    operatorName: "",
    operatorLevel: "",
    urgency: "",
    asaGrade: "",
    operation: "",
    hospital: "",
    notes: "",
    complications: "",
    isPrivate: false
  });

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate age when DOB changes
      if (field === "dateOfBirth") {
        updated.age = calculateAge(value);
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.patientId || !formData.operation || !formData.hospital) {
      toast({
        title: "Missing Information",
        description: "Please fill in Patient ID, Operation, and Hospital fields.",
        variant: "destructive"
      });
      return;
    }

    const operation = {
      id: Date.now().toString(),
      ...formData,
      age: parseInt(formData.age) || 0,
      date: formData.operationDate
    };

    onSave(operation);
    
    toast({
      title: "Operation Saved",
      description: "Operation has been saved to local storage.",
    });
    
    onBack();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-[var(--shadow-card)] sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Add Operation</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="p-4 space-y-6">
        <div className="text-sm text-center text-primary font-medium bg-primary/10 p-2 rounded-lg">
          Trauma and Orthopaedic Surgery
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) => handleInputChange("patientId", e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (Years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Auto-calculated"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Operation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operationDate">Operation Date</Label>
              <Input
                id="operationDate"
                type="date"
                value={formData.operationDate}
                onChange={(e) => handleInputChange("operationDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorLevel">Operator Level</Label>
              <Select onValueChange={(value) => handleInputChange("operatorLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performing-consultant">Performing Consultant</SelectItem>
                  <SelectItem value="joint-consultant">Joint Consultant</SelectItem>
                  <SelectItem value="supporting-consultant">Supporting Consultant</SelectItem>
                  <SelectItem value="performing-non-consultant">Performing Non-Consultant</SelectItem>
                  <SelectItem value="assisting-non-consultant">Assisting Non-Consultant</SelectItem>
                  <SelectItem value="observing-in-theatre">Observing - In Theatre</SelectItem>
                  <SelectItem value="under-my-care">Under My Care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select onValueChange={(value) => handleInputChange("urgency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="immediate">Immediate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asaGrade">ASA Grade</Label>
              <Select onValueChange={(value) => handleInputChange("asaGrade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ASA grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ASA 1 - Normal healthy patient</SelectItem>
                  <SelectItem value="2">ASA 2 - Mild systemic disease</SelectItem>
                  <SelectItem value="3">ASA 3 - Severe systemic disease</SelectItem>
                  <SelectItem value="4">ASA 4 - Life-threatening disease</SelectItem>
                  <SelectItem value="5">ASA 5 - Moribund patient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operation">Operation</Label>
              <Input
                id="operation"
                value={formData.operation}
                onChange={(e) => handleInputChange("operation", e.target.value)}
                placeholder="Enter operation (SNOMED based)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Select onValueChange={(value) => handleInputChange("hospital", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="royal-london">Royal London Hospital</SelectItem>
                  <SelectItem value="st-bartholomews">St Bartholomew's Hospital</SelectItem>
                  <SelectItem value="kings-college">King's College Hospital</SelectItem>
                  <SelectItem value="guys-hospital">Guy's Hospital</SelectItem>
                  <SelectItem value="other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleInputChange("isPrivate", checked.toString())}
              />
              <Label htmlFor="private" className="text-sm">Private</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complications">Complications</Label>
              <Textarea
                id="complications"
                value={formData.complications}
                onChange={(e) => handleInputChange("complications", e.target.value)}
                placeholder="Enter any complications"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="pb-8">
          <Button
            onClick={handleSave}
            variant="medical"
            size="lg"
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Operation
          </Button>
        </div>
      </main>
    </div>
  );
};