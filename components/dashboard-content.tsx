"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Zap,
  TestTube2,
  CheckCircle,
  Plus,
  Play,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useState } from "react";

export default function DashboardContent() {
  const [loading, setLoading] = useState(false);

  const metrics = [
    {
      title: "Total Mock APIs",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Test Suites",
      value: "12",
      change: "+2",
      trend: "up",
      icon: TestTube2,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Success Rate",
      value: "98.5%",
      change: "+1.2%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      title: "CI Integrations",
      value: "8",
      change: "0",
      trend: "neutral",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "api_created",
      title: "Created new mock",
      description: "User Service API v2.0",
      time: "2 hours ago",
      icon: "✨",
    },
    {
      id: 2,
      type: "test_passed",
      title: "Test suite passed",
      description: "Payment Integration - 45/45 tests",
      time: "4 hours ago",
      icon: "✓",
    },
    {
      id: 3,
      type: "ci_deployed",
      title: "Deployed to staging",
      description: "Auth Endpoints - PR #234",
      time: "1 day ago",
      icon: "🚀",
    },
    {
      id: 4,
      type: "test_failed",
      title: "Test suite failed",
      description: "Legacy API - 1/50 tests failed",
      time: "2 days ago",
      icon: "⚠️",
    },
  ];

  const handleQuickAction = (action: string) => {
    if (action === "create_mock") {
      window.location.href = "/create-mock";
      return;
    }

    setLoading(true);
    setTimeout(() => {
      console.log(`Action triggered: ${action}`);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome to API TITAN</h1>
        <p className="text-blue-100 text-lg">Your intelligent API mocking and testing platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === "up";
          const TrendIcon =
            isPositive ? ArrowUpRight : metric.trend === "neutral" ? null : ArrowDownRight;

          return (
            <Card
              key={metric.title}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200 group"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-12 -mt-12 group-hover:opacity-20 transition-opacity duration-300`}
              />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {metric.value}
                    </div>
                    <p className="text-xs text-gray-500">
                      {metric.trend === "neutral" ? "No change" : "vs last week"}
                    </p>
                  </div>
                  {TrendIcon && (
                    <div
                      className={`flex items-center gap-1 ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{metric.change}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Fast access to common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => handleQuickAction("create_mock")}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Mock API
            </Button>
            <Button
              onClick={() => handleQuickAction("run_tests")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Test Suite
            </Button>
            <Button
              onClick={() => handleQuickAction("view_docs")}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Usage Statistics</CardTitle>
            <CardDescription>Request volume over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-end justify-around gap-2 pb-4">
              {[
                { height: 45, requests: "1.2K" },
                { height: 52, requests: "1.5K" },
                { height: 48, requests: "1.3K" },
                { height: 61, requests: "2.1K" },
                { height: 55, requests: "1.8K" },
                { height: 68, requests: "2.4K" },
                { height: 72, requests: "2.7K" },
              ].map((day, i) => (
                <div key={i} className="flex-1 group relative flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{ height: `${day.height * 2}px` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {day.requests}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Day {i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="text-lg flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}