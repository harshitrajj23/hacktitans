"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Plus, Trash2, Save, Play, Copy, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Endpoint {
  id: string
  method: string
  path: string
  statusCode: string
  headers: { key: string; value: string }[]
}

interface FormData {
  name: string
  description: string
  baseUrl: string
  project: string
  endpoints: Endpoint[]
  jsonResponse: string
  contentType: string
}

export default function CreateMockAPIContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    baseUrl: "",
    project: "default",
    endpoints: [{ id: "1", method: "GET", path: "", statusCode: "200", headers: [] }],
    jsonResponse: '{\n  "status": "success",\n  "data": {}\n}',
    contentType: "application/json",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [autoSaved, setAutoSaved] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const steps = [
    { id: 1, label: "Basic Info" },
    { id: 2, label: "Endpoints" },
    { id: 3, label: "Responses" },
    { id: 4, label: "Review" },
  ]

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "API name is required"
      if (!formData.baseUrl.trim()) newErrors.baseUrl = "Base URL is required"
    }

    if (step === 2) {
      if (formData.endpoints.length === 0) newErrors.endpoints = "At least one endpoint is required"
      formData.endpoints.forEach((ep) => {
        if (!ep.path.trim()) newErrors[`endpoint-${ep.id}`] = "Path is required"
      })
    }

    if (step === 3) {
      if (!formData.jsonResponse.trim()) newErrors.jsonResponse = "Response body is required"
      try {
        JSON.parse(formData.jsonResponse)
      } catch {
        newErrors.jsonResponse = "Invalid JSON format"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length))
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1))
  }

  const addEndpoint = () => {
    const newId = String(Math.max(...formData.endpoints.map((e) => Number.parseInt(e.id)), 0) + 1)
    setFormData({
      ...formData,
      endpoints: [...formData.endpoints, { id: newId, method: "GET", path: "", statusCode: "200", headers: [] }],
    })
  }

  const removeEndpoint = (id: string) => {
    if (formData.endpoints.length > 1) {
      setFormData({
        ...formData,
        endpoints: formData.endpoints.filter((e) => e.id !== id),
      })
    }
  }

  const updateEndpoint = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      endpoints: formData.endpoints.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    })
  }

  const addHeader = (endpointId: string) => {
    setFormData({
      ...formData,
      endpoints: formData.endpoints.map((e) =>
        e.id === endpointId ? { ...e, headers: [...e.headers, { key: "", value: "" }] } : e,
      ),
    })
  }

  const removeHeader = (endpointId: string, headerIndex: number) => {
    setFormData({
      ...formData,
      endpoints: formData.endpoints.map((e) =>
        e.id === endpointId ? { ...e, headers: e.headers.filter((_, i) => i !== headerIndex) } : e,
      ),
    })
  }

  const updateHeader = (endpointId: string, headerIndex: number, field: "key" | "value", value: string) => {
    setFormData({
      ...formData,
      endpoints: formData.endpoints.map((e) =>
        e.id === endpointId
          ? {
              ...e,
              headers: e.headers.map((h, i) => (i === headerIndex ? { ...h, [field]: value } : h)),
            }
          : e,
      ),
    })
  }

  const handlePublish = () => {
    if (validateStep(4)) {
      console.log("[v0] Mock API published:", formData)
      alert("Mock API published successfully!")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., User Service API"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your mock API..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base URL *</label>
              <input
                type="url"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="e.g., https://mock.apititan.dev/users"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.baseUrl ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                }`}
              />
              {errors.baseUrl && <p className="text-red-600 text-sm mt-1">{errors.baseUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Project</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Configure Endpoints</h3>
              <Button
                onClick={addEndpoint}
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Endpoint
              </Button>
            </div>

            {formData.endpoints.map((endpoint, index) => (
              <Card key={endpoint.id} className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Endpoint {index + 1}</CardTitle>
                    {formData.endpoints.length > 1 && (
                      <Button
                        onClick={() => removeEndpoint(endpoint.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
                      <Select
                        value={endpoint.method}
                        onValueChange={(value) => updateEndpoint(endpoint.id, "method", value)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL Path *</label>
                      <input
                        type="text"
                        value={endpoint.path}
                        onChange={(e) => updateEndpoint(endpoint.id, "path", e.target.value)}
                        placeholder="/users/:id"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors[`endpoint-${endpoint.id}`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[`endpoint-${endpoint.id}`] && (
                        <p className="text-red-600 text-sm mt-1">{errors[`endpoint-${endpoint.id}`]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Code</label>
                    <Select
                      value={endpoint.statusCode}
                      onValueChange={(value) => updateEndpoint(endpoint.id, "statusCode", value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200">200 OK</SelectItem>
                        <SelectItem value="201">201 Created</SelectItem>
                        <SelectItem value="400">400 Bad Request</SelectItem>
                        <SelectItem value="401">401 Unauthorized</SelectItem>
                        <SelectItem value="404">404 Not Found</SelectItem>
                        <SelectItem value="500">500 Server Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Headers</label>
                      <Button
                        onClick={() => addHeader(endpoint.id)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Header
                      </Button>
                    </div>
                    {endpoint.headers.map((header, headerIndex) => (
                      <div key={headerIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(endpoint.id, headerIndex, "key", e.target.value)}
                          placeholder="Header name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(endpoint.id, headerIndex, "value", e.target.value)}
                          placeholder="Header value"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button
                          onClick={() => removeHeader(endpoint.id, headerIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData({ ...formData, contentType: value })}
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application/json">JSON</SelectItem>
                  <SelectItem value="application/xml">XML</SelectItem>
                  <SelectItem value="text/plain">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Body *</label>
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <textarea
                  value={formData.jsonResponse}
                  onChange={(e) => setFormData({ ...formData, jsonResponse: e.target.value })}
                  className={`w-full p-4 bg-gray-900 text-green-400 font-mono text-sm focus:outline-none resize-none ${
                    errors.jsonResponse ? "ring-2 ring-red-500" : ""
                  }`}
                  rows={12}
                  spellCheck="false"
                />
              </div>
              {errors.jsonResponse && <p className="text-red-600 text-sm mt-2">{errors.jsonResponse}</p>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">API Details</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Base URL:</strong> {formData.baseUrl}
                    </p>
                    <p>
                      <strong>Project:</strong> {formData.project}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Endpoints ({formData.endpoints.length})</h4>
                  <div className="space-y-2">
                    {formData.endpoints.map((ep) => (
                      <div key={ep.id} className="flex items-center gap-2 text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 rounded font-medium text-white ${
                            ep.method === "GET"
                              ? "bg-blue-500"
                              : ep.method === "POST"
                                ? "bg-green-500"
                                : ep.method === "PUT"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span>{formData.baseUrl + ep.path}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Response Preview</h4>
                  <div className="bg-gray-900 rounded p-3 text-green-400 font-mono text-xs max-h-32 overflow-auto">
                    {formData.jsonResponse}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ✓ All validations passed. Review the configuration above and publish to activate your mock API.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Mock API</h1>
        <p className="text-gray-600 mt-1">Configure and deploy your mock API in just a few steps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Progress Steps - Left Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-gray-200 sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Progress</CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id}>
                  <button
                    onClick={() => {
                      if (step.id < currentStep || step.id === currentStep) {
                        setCurrentStep(step.id)
                      }
                    }}
                    disabled={step.id > currentStep}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                      currentStep === step.id
                        ? "bg-blue-600 text-white shadow-md"
                        : step.id < currentStep
                          ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep > step.id ? "bg-green-500 text-white" : "bg-current"
                      }`}
                    >
                      {currentStep > step.id ? "✓" : step.id}
                    </div>
                    <span>{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-8 ml-3 border-l-2 ${currentStep > step.id ? "border-green-500" : "border-gray-300"}`}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Auto-save Indicator */}
          {autoSaved && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
              <Check className="w-4 h-4" />
              <span>Auto-saved</span>
            </div>
          )}
        </div>

        {/* Form Content - Right */}
        <div className="lg:col-span-3">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-200">
              <CardTitle>{steps[currentStep - 1].label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">{renderStepContent()}</CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-3">
              <Button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="gap-2 hover:bg-gray-50 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              {currentStep < steps.length && (
                <Button
                  onClick={handleNextStep}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 hover:bg-gray-50 bg-transparent">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              {currentStep === steps.length && (
                <>
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 bg-transparent"
                  >
                    <Play className="w-4 h-4" />
                    Test API
                  </Button>
                  <Button
                    onClick={handlePublish}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                  >
                    Publish
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      {currentStep === 3 && (
        <Card className="bg-gray-50 border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Live Preview</CardTitle>
            <CardDescription>How your API response will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">METHOD</p>
                    <p className="font-semibold text-gray-900">
                      {formData.endpoints[0]?.method} {formData.baseUrl}
                      {formData.endpoints[0]?.path}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(formData.jsonResponse)
                      setCopiedCode(true)
                      setTimeout(() => setCopiedCode(false), 2000)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy response"
                  >
                    {copiedCode ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded p-4 text-green-400 font-mono text-sm max-h-48 overflow-auto">
                  <pre>{formData.jsonResponse}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
