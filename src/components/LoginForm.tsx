import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fingerprint, Lock, Shield, Stethoscope } from "lucide-react";

interface LoginFormProps {
  onLogin: (userId: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded credentials
  const VALID_USERID = "Yaser jabbar";
  const VALID_PASSWORD = "12345";

  const handleLogin = async (method: "password" | "biometric") => {
    setError("");
    if (!userId.trim() || !password.trim()) return;

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);

    // Check hardcoded credentials
    if (userId === VALID_USERID && password === VALID_PASSWORD) {
      onLogin(userId);
    } else {
      setError("Invalid User ID or Password");
    }
  };

  const handleBiometricLogin = async () => {
    setError("");
    setIsLoading(true);

    // Simulate biometric authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);

    // For demo, allow biometric only for the hardcoded user
    if (userId === VALID_USERID) {
      onLogin(userId);
    } else {
      setError("Biometric authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-medical)] border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Medical eLogbook
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Secure access to your surgical logbook
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium">
              User ID / Registration Number
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder="e.g., GMC Number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-12"
            />
          </div>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </TabsTrigger>
              <TabsTrigger value="biometric" className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Biometric
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                onClick={() => handleLogin("password")}
                disabled={!userId.trim() || !password.trim() || isLoading}
                variant="medical"
                size="lg"
                className="w-full"
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="biometric" className="space-y-4">
              <div className="text-center py-8">
                <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Use your fingerprint or Face ID to sign in securely
                </p>
                <Button
                  onClick={handleBiometricLogin}
                  disabled={!userId.trim() || isLoading}
                  variant="medical"
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? "Authenticating..." : "Authenticate"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Version 2.0.0.316</p>
            <p>GDPR & HIPAA Compliant</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};