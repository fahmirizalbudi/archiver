export interface Category {
  id: string
  name: string
  created_at: string
  user_id: string
}

export interface Document {
  id: string
  title: string
  document_number?: string
  description?: string
  document_date: string
  category_id: string
  file_path: string
  created_at: string
  user_id: string
  category?: Category
}
