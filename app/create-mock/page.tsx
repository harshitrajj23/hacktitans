'use client';

import { useState } from 'react';

export default function CreateMockPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // for now, send one demo endpoint: GET /users
      const endpoints = [
        {
          method: 'GET',
          path: '/users',
          statusCode: 200,
          responseJson: { message: 'Mock works from UI' },
        },
      ];

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, baseUrl, endpoints }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error || 'Failed to create project'}`);
      } else {
        setMessage(
          `Created! Project ID: ${data.projectId}.
Try: /api/mock?projectId=${data.projectId}&path=/users`
        );
        setName('');
        setDescription('');
        setBaseUrl('');
      }
    } catch (err) {
      console.error(err);
      setMessage('Unexpected error while creating project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-xl bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-700">
        <h1 className="text-2xl font-bold mb-4">Create Mock API Project</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">API Name</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 focus:outline-none focus:ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="User Service Mock"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 focus:outline-none focus:ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mocks user endpoints for frontend dev..."
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Base URL</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 focus:outline-none focus:ring"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm whitespace-pre-wrap">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}