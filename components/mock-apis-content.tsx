"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Search, Filter, Edit, Trash2, Play, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface MockAPI {
  id: string
  name: string
  baseUrl: string
  status: "active" | "inactive"
  lastUpdated: string
  methods: string[]
  endpointCount: number
  successRate: number
}

export default function MockAPIsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
  const [mockAPIs, setMockAPIs] = useState<MockAPI[]>([
    {
      id: "1",
      name: "User Service API",
      baseUrl: "https://mock.apititan.dev/users",
      status: "active",
      lastUpdated: "2 hours ago",
      methods: ["GET", "POST", "PUT", "DELETE"],
      endpointCount: 12,
      successRate: 99.8,
    },
    {
      id: "2",
      name: "Payment Gateway",
      baseUrl: "https://mock.apititan.dev/payments",
      status: "active",
      lastUpdated: "1 hour ago",
      methods: ["GET", "POST"],
      endpointCount: 8,
      successRate: 99.5,
    },
    {
      id: "3",
      name: "Notification Service",
      baseUrl: "https://mock.apititan.dev/notifications",
      status: "inactive",
      lastUpdated: "5 hours ago",
      methods: ["GET", "POST", "DELETE"],
      endpointCount: 6,
      successRate: 98.2,
    },
  ])

  const itemsPerPage = 10
  const filteredAPIs = mockAPIs.filter((api) => {
    const matchesSearch =
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.baseUrl.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || api.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredAPIs.length / itemsPerPage)
  const paginatedAPIs = filteredAPIs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedAPIs.length) {
      setSelectedIds(new Set())
    } else {
      const newSelected = new Set(paginatedAPIs.map((api) => api.id))
      setSelectedIds(newSelected)
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleStatus = (id: string) => {
    setMockAPIs(
      mockAPIs.map((api) =>
        api.id === id ? { ...api, status: api.status === "active" ? "inactive" : "active" } : api,
      ),
    )
  }

  const handleDelete = (id: string) => {
    setMockAPIs(mockAPIs.filter((api) => api.id !== id))
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-100 text-blue-700",
      POST: "bg-green-100 text-green-700",
      PUT: "bg-yellow-100 text-yellow-700",
      DELETE: "bg-red-100 text-red-700",
    }
    return colors[method] || "bg-gray-100 text-gray-700"
  }

  const handleRowClick = (api: MockAPI) => {
    console.log("[v0] Viewing details for:", api.name)
    // In a real app, this would navigate to a detail page or open a modal
  }

  if (mockAPIs.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock APIs</h1>
          <p className="text-gray-600">Manage and monitor your mock API endpoints.</p>
        </div>

        <div className="flex justify-center items-center min-h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create your first mock API</h3>
              <p className="text-gray-600 mb-6 max-w-xs">
                Start building powerful mock API endpoints for your testing needs.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Create New Mock
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mock APIs</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and monitor your mock API endpoints</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md hover:shadow-lg transition-shadow">
            <Plus className="w-4 h-4" />
            Create New Mock
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                {filterStatus === "all" && <Check className="w-4 h-4 mr-2" />}
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                {filterStatus === "active" && <Check className="w-4 h-4 mr-2" />}
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                {filterStatus === "inactive" && <Check className="w-4 h-4 mr-2" />}
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedAPIs.length && paginatedAPIs.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    API Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Base URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Methods
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Endpoints
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAPIs.map((api, index) => (
                  <tr
                    key={api.id}
                    onMouseEnter={() => setHoveredRowId(api.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    onClick={() => handleRowClick(api)}
                    className={`transition-colors duration-200 cursor-pointer ${
                      hoveredRowId === api.id ? "bg-blue-50" : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td
                      className="px-6 py-4"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(api.id)}
                        onChange={() => toggleSelect(api.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                        {api.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-sm text-gray-600 truncate max-w-xs block hover:text-clip"
                        title={api.baseUrl}
                      >
                        {api.baseUrl}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {api.methods.map((method) => (
                          <span
                            key={method}
                            className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 transform hover:scale-105 ${getMethodColor(method)}`}
                            title={method}
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{api.endpointCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              api.successRate >= 99
                                ? "bg-green-500"
                                : api.successRate >= 95
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${api.successRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{api.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStatus(api.id)
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                          api.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title={`Click to toggle status`}
                      >
                        {api.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{api.lastUpdated}</span>
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="More actions"
                          >
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer" title="Test this API">
                            <Play className="w-4 h-4" />
                            Test
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" title="Edit API configuration">
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(api.id)
                            }}
                            className="gap-2 cursor-pointer text-red-600 hover:text-red-700"
                            title="Delete this API"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAPIs.length)}</span> of{" "}
          <span className="font-medium">{filteredAPIs.length}</span> results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="gap-1 transition-all hover:shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-10 transition-all hover:shadow-sm"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="gap-1 transition-all hover:shadow-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
