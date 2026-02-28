import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types'
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react'

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName.trim() }])

    if (error) {
      alert(error.message)
    } else {
      setNewCategoryName('')
      setIsAdding(false)
      fetchCategories()
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return

    const { error } = await supabase
      .from('categories')
      .update({ name: editingName.trim() })
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      setEditingId(null)
      fetchCategories()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This may affect documents in this category.')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      fetchCategories()
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />}
          {isAdding ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <input
            autoFocus
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Save
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No categories found. Add one to get started.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between py-4">
              {editingId === category.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button onClick={() => handleUpdate(category.id)} className="text-green-600">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-gray-700">{category.name}</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditingId(category.id)
                        setEditingName(category.name)
                      }}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
