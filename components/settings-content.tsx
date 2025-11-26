"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsContent() {
  const router = useRouter();

  const sections = [
    {
      title: "Account Settings",
      description: "Manage your profile and personal information",
      items: ["Profile", "Email", "Password"],
    },
    {
      title: "Workspace",
      description: "Configure workspace settings and team members",
      items: ["Workspace Info", "Members", "API Keys"],
    },
    {
      title: "Integrations",
      description: "Manage connected services and tools",
      items: ["Connected Apps", "Webhooks", "API Tokens"],
    },
    {
      title: "Billing",
      description: "View and manage your subscription",
      items: ["Plan", "Invoices", "Payment Method"],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and workspace preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 bg-transparent"
                    onClick={() => {
                      if (section.title === "Account Settings" && item === "Profile") {
                        router.push("/profile");
                      }
                      // other buttons can get actions later
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}