"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, CheckCircle, AlertCircle, ChevronDown, Loader2, Plus, Copy } from "lucide-react"

// 👇 use your real project id (from the JSON you pasted)
const DEFAULT_PROJECT_ID = "5ee437a1-d48c-4d85-bafa-f0cda9302aff"

export default function TestSuitesContent() {
  const [activeTab, setActiveTab] = useState("suites")
  const [selectedSuite, setSelectedSuite] = useState<number | string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [loadingSuites, setLoadingSuites] = useState(false)
  const [creatingSuite, setCreatingSuite] = useState(false)

  const [testCases] = useState([
    { id: 1, method: "GET", endpoint: "/users", status: 200, expected: '{"users": []}' },
    { id: 2, method: "POST", endpoint: "/users", status: 201, expected: '{"id": 1, "created": true}' },
  ])

  const [suites, setSuites] = useState<
    {
      id: string | number
      name: string
      tests: number
      passed: number
      failed: number
      lastRun: string
      status: string
    }[]
  >([
    // fallback demo data until real data loads
    {
      id: 1,
      name: "Authentication Flow",
      tests: 12,
      passed: 12,
      failed: 0,
      lastRun: "2 hours ago",
      status: "pass",
    },
    {
      id: 2,
      name: "Payment Processing",
      tests: 8,
      passed: 7,
      failed: 1,
      lastRun: "5 hours ago",
      status: "fail",
    },
    {
      id: 3,
      name: "User Management",
      tests: 15,
      passed: 15,
      failed: 0,
      lastRun: "1 hour ago",
      status: "pass",
    },
  ])

  // 🔹 Load suites from backend
  useEffect(() => {
    async function loadSuites() {
      try {
        setLoadingSuites(true)
        const res = await fetch(`/api/test-suites?projectId=${DEFAULT_PROJECT_ID}`)
        if (!res.ok) {
          console.error("Failed to load suites")
          setLoadingSuites(false)
          return
        }
        const rows = await res.json() // array from Supabase
        const mapped = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          tests: 0,
          passed: 0,
          failed: 0,
          lastRun: row.last_run_at ? new Date(row.last_run_at).toLocaleString() : "Never run",
          status: row.status || "never_run",
        }))
        if (mapped.length > 0) {
          setSuites(mapped)
        }
      } catch (err) {
        console.error("Error loading suites", err)
      } finally {
        setLoadingSuites(false)
      }
    }

    loadSuites()
  }, [])

  const handleRunTest = async (suiteId: string | number) => {
  try {
    setIsRunning(true);

    const res = await fetch("/api/test-suites/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: suiteId }),
    });

    if (!res.ok) {
      console.error("Failed to run test suite");
      setIsRunning(false);
      return;
    }

    const updated = await res.json();

    // update UI with new status + last_run_at
    setSuites((prev) =>
      prev.map((suite) =>
        suite.id === updated.id
          ? {
              ...suite,
              status: updated.status || "pass",
              lastRun: updated.last_run_at
                ? new Date(updated.last_run_at).toLocaleString()
                : suite.lastRun,
            }
          : suite
      )
    );
  } catch (err) {
    console.error("Error running test suite", err);
  } finally {
    setIsRunning(false);
  }
};


  // 🔹 Create new test suite via backend
  const handleCreateSuite = async () => {
    try {
      setCreatingSuite(true)
      const res = await fetch("/api/test-suites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: DEFAULT_PROJECT_ID,
          name: `Suite - ${new Date().toLocaleTimeString()}`,
          description: "Created from UI",
        }),
      })

      if (!res.ok) {
        console.error("Failed to create test suite")
        setCreatingSuite(false)
        return
      }

      const row = await res.json()
      const newSuite = {
        id: row.id,
        name: row.name,
        tests: 0,
        passed: 0,
        failed: 0,
        lastRun: "Never run",
        status: row.status || "never_run",
      }

      setSuites((prev) => [newSuite, ...prev])
    } catch (err) {
      console.error("Error creating suite", err)
    } finally {
      setCreatingSuite(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testing & CI Integration</h1>
          <p className="text-gray-600">Manage test suites and CI/CD integrations for your APIs.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("suites")}
          className={`px-6 py-3 font-medium text-sm transition-all duration-200 ${
            activeTab === "suites" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Test Suites
        </button>
        <button
          onClick={() => setActiveTab("ci")}
          className={`px-6 py-3 font-medium text-sm transition-all duration-200 ${
            activeTab === "ci" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          CI Integration
        </button>
      </div>

      {/* Test Suites Tab */}
      {activeTab === "suites" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            {loadingSuites ? (
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading suites from Supabase...
              </span>
            ) : (
              <span className="text-xs text-gray-500">
                {suites.length} suite{SuitesPlural(suites.length)} loaded
              </span>
            )}

            <Button
              onClick={handleCreateSuite}
              disabled={creatingSuite}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all duration-200 hover:shadow-lg"
            >
              {creatingSuite ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Test Suite
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4">
            {suites.map((suite) => (
              <div key={suite.id}>
                <Card
                  onClick={() => setSelectedSuite(selectedSuite === suite.id ? null : suite.id)}
                  className={`bg-white border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-md ${
                    selectedSuite === suite.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-sm"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            selectedSuite === suite.id ? "rotate-180" : ""
                          }`}
                        />
                        <span className="text-lg font-semibold text-gray-900">{suite.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                            suite.status === "pass"
                              ? "bg-green-100 text-green-700"
                              : suite.status === "fail"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {suite.status === "never_run"
                            ? "Not run yet"
                            : `${suite.passed}/${suite.tests} passed`}
                        </span>
                        <span className="text-sm text-gray-500">{suite.lastRun}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  {selectedSuite === suite.id && (
                    <CardContent className="space-y-4 pt-4 border-t border-gray-100">
                      {/* Test Cases List */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Test Cases</h4>
                        {testCases.map((testCase, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded text-white ${
                                testCase.method === "GET"
                                  ? "bg-blue-500"
                                  : testCase.method === "POST"
                                    ? "bg-green-500"
                                    : testCase.method === "PUT"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                            >
                              {testCase.method}
                            </span>
                            <span className="text-sm text-gray-700 flex-1 font-mono">{testCase.endpoint}</span>
                            <span className="text-sm text-gray-600">Status: {testCase.status}</span>
                          </div>
                        ))}
                      </div>

                      {/* Test Controls */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleRunTest(suite.id)}
                          disabled={isRunning}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all duration-200 disabled:opacity-50 flex-1"
                        >
                          {isRunning ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Run Tests
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 transition-all duration-200 hover:shadow-sm bg-transparent"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {selectedSuite !== suite.id && (
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {suite.status === "never_run" ? (
                          <span className="text-sm text-gray-600 flex items-center gap-1 font-medium">
                            Not run yet
                          </span>
                        ) : (
                          <>
                            <span className="text-sm text-green-600 flex items-center gap-1 font-medium">
                              <CheckCircle className="w-4 h-4" />
                              {suite.passed} passed
                            </span>
                            {suite.failed > 0 && (
                              <span className="text-sm text-red-600 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-4 h-4" />
                                {suite.failed} failed
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRunTest(suite.id)}
                      disabled={isRunning}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-2 transition-all duration-200"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Run
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CI Integration Tab */}
      {activeTab === "ci" && <CIIntegrationPanel />}
    </div>
  )
}

function SuitesPlural(count: number) {
  return count === 1 ? "" : "s"
}

// CIIntegrationPanel stays the same as before
function CIIntegrationPanel() {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "GitHub Actions",
      icon: "🐙",
      status: "connected",
      lastSync: "5 minutes ago",
      webhook: "https://api.apititan.dev/webhooks/github",
    },
    { id: 2, name: "GitLab CI", icon: "🦊", status: "disconnected", lastSync: "Never", webhook: null },
    {
      id: 3,
      name: "Jenkins",
      icon: "⚙️",
      status: "connected",
      lastSync: "2 hours ago",
      webhook: "https://api.apititan.dev/webhooks/jenkins",
    },
    { id: 4, name: "CircleCI", icon: "◯", status: "pending", lastSync: "Syncing...", webhook: null },
  ])

  const [connectingId, setConnectingId] = useState<number | null>(null)
  const [copiedWebhook, setCopiedWebhook] = useState<string | number | null>(null)

  const handleConnect = async (id: number) => {
  try {
    setConnectingId(id);

    const integration = integrations.find((int) => int.id === id);
    if (!integration) return;

    // hit dummy backend so CI connections are stored in Supabase
    await fetch("/api/ci-integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: integration.name,
        status: "connected",
        webhookUrl: integration.webhook || null,
      }),
    });

    // update local UI
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id
          ? { ...int, status: "connected", lastSync: "just now" }
          : int
      )
    );
  } catch (err) {
    console.error("Failed to connect CI integration", err);
  } finally {
    setConnectingId(null);
  }
};

  const handleCopyWebhook = (webhook: string, id: string | number) => {
    navigator.clipboard.writeText(webhook)
    setCopiedWebhook(id)
    setTimeout(() => setCopiedWebhook(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Webhook Configuration Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🔗 Webhook Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            Connect API TITAN webhooks to your CI/CD platform to automatically trigger tests on API changes.
          </p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Base Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://api.apititan.dev/webhooks"
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-700"
                />
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => handleCopyWebhook("https://api.apititan.dev/webhooks", "base")}
                >
                  <Copy className="w-3 h-3" />
                  {copiedWebhook === "base" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CI Platform Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card
              key={integration.id}
              className={`bg-white border transition-all duration-300 ${
                integration.status === "connected"
                  ? "border-green-200 bg-green-50 hover:shadow-lg"
                  : integration.status === "pending"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-gray-200 hover:shadow-md"
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <span className="text-base font-semibold text-gray-900">{integration.name}</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                      integration.status === "connected"
                        ? "bg-green-200 text-green-800"
                        : integration.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {integration.status === "pending" ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {integration.status}
                      </span>
                    ) : (
                      integration.status
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last Sync: </span>
                  <span>{integration.lastSync}</span>
                </div>

                {integration.webhook && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Webhook URL</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={integration.webhook}
                        readOnly
                        className="flex-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded font-mono text-gray-700"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyWebhook(integration.webhook!, integration.id)}
                        className="px-2 h-8"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleConnect(integration.id)}
                  disabled={connectingId === integration.id || integration.status === "connected"}
                  className={`w-full transition-all duration-200 ${
                    integration.status === "connected"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } disabled:opacity-50 gap-2`}
                >
                  {connectingId === integration.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : integration.status === "connected" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}