import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import CategoryManagement from './CategoryManagement'
import DocumentManagement from './DocumentManagement'
import { LayoutDashboard, FolderTree, Files, LogOut, TrendingUp, Clock } from 'lucide-react'
import type { Document, Category } from '../types'
import { format } from 'date-fns'

type Tab = 'overview' | 'categories' | 'documents'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [stats, setStats] = useState({ docs: 0, cats: 0 })
  const [recentDocs, setRecentDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverviewData()
    }
  }, [activeTab])

  const fetchOverviewData = async () => {
    setLoading(true)
    const [docsCount, catsCount, recent] = await Promise.all([
      supabase.from('documents').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('documents').select('*, category:categories(*)').order('created_at', { ascending: false }).limit(5)
    ])

    setStats({
      docs: docsCount.count || 0,
      cats: catsCount.count || 0
    })
    setRecentDocs(recent.data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <Files size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Archiver</h1>
          </div>

          <nav className="flex-1 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'categories'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FolderTree size={20} />
              Categories
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'documents'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Files size={20} />
              Documents
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'overview' && 'System overview and quick statistics.'}
              {activeTab === 'categories' && 'Organize your documents by managing classifications.'}
              {activeTab === 'documents' && 'Search, filter, and manage your archived files.'}
            </p>
          </div>
          {activeTab === 'overview' && (
            <button 
              onClick={fetchOverviewData}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
              title="Refresh Stats"
            >
              <TrendingUp size={20} />
            </button>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total Documents</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.docs}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.cats}</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div 
                    onClick={() => setActiveTab('categories')}
                    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                  >
                    <div className="mb-4 inline-block rounded-xl bg-orange-50 p-3 text-orange-600 transition-colors group-hover:bg-orange-100">
                      <FolderTree size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Add Category</h3>
                    <p className="mt-1 text-sm text-gray-500 text-balance">Create a new document classification.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('documents')}
                    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                  >
                    <div className="mb-4 inline-block rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100">
                      <Files size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Upload File</h3>
                    <p className="mt-1 text-sm text-gray-500 text-balance">Archive a new document with metadata.</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Documents</h3>
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  {recentDocs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 italic">No recent activity</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-50 p-2 text-gray-400">
                              <Files size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                              <p className="text-xs text-gray-500">{doc.category?.name || 'Uncategorized'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={12} />
                            {format(new Date(doc.created_at), 'MMM dd')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'documents' && <DocumentManagement />}
      </main>
    </div>
  )
}
