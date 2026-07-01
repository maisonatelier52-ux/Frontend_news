'use client'

import { useState, useEffect, useRef } from 'react'

interface Category {
  _id: string
  name: string
  slug: string
  parent: string
  articles: number
  color: string
  description?: string
  position?: number
  isVisible?: boolean
  showInNav?: boolean
  bannerImage?: string
  bannerImageAlt?: string
  seoTitle?: string
  seoDescription?: string
}

const initialTags = [
  { id: 1, name: 'Breaking News', slug: 'breaking-news', count: 89 },
  { id: 2, name: 'Elections', slug: 'elections', count: 64 },
  { id: 3, name: 'AI', slug: 'ai', count: 58 },
  { id: 4, name: 'Economy', slug: 'economy', count: 52 },
  { id: 5, name: 'Climate', slug: 'climate', count: 47 },
  { id: 6, name: 'Ukraine', slug: 'ukraine', count: 43 },
  { id: 7, name: 'NFL', slug: 'nfl', count: 38 },
  { id: 8, name: 'Health', slug: 'health', count: 35 },
  { id: 9, name: 'Federal Reserve', slug: 'federal-reserve', count: 29 },
  { id: 10, name: 'Supreme Court', slug: 'supreme-court', count: 26 },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    description: '',
    position: 99,
    isVisible: true,
    showInNav: true,
    bannerImage: '',
    bannerImageAlt: ''
  })
  
  const [editCatId, setEditCatId] = useState<string | null>(null)
  const [saved, setSaved] = useState('')

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageWarning, setExistingImageWarning] = useState<{ url: string; filename: string } | null>(null)
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isUploadingOnSave, setIsUploadingOnSave] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Validation function
  function validateForm(): boolean {
    const errors: Record<string, string> = {}

    const nameVal = newCat.name.trim()
    const slugVal = newCat.slug.trim()
    const descVal = newCat.description.trim()
    const altVal = newCat.bannerImageAlt.trim()

    if (!nameVal) {
      errors.name = "Category Name is required."
    } else if (nameVal.length < 3 || nameVal.length > 30) {
      errors.name = "Category Name must be between 3 and 30 characters."
    } else if ((nameVal.match(/[a-zA-Z]/g) || []).length < 3) {
      errors.name = "Category Name must contain at least 3 letters."
    } else {
      const duplicateName = categories.find(
        c => c.name.trim().toLowerCase() === nameVal.toLowerCase() && c._id !== editCatId
      )
      if (duplicateName) {
        errors.name = "A category with this name already exists."
      }
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugVal) {
      errors.slug = "Slug is required."
    } else if (slugVal.length < 3 || slugVal.length > 30) {
      errors.slug = "Slug must be between 3 and 30 characters."
    } else if (!slugRegex.test(slugVal)) {
      errors.slug = "Slug must contain only lowercase letters, numbers, and single hyphens, with no leading/trailing/consecutive hyphens."
    } else if ((slugVal.match(/[a-z]/g) || []).length < 3) {
      errors.slug = "Slug must contain at least 3 letters."
    } else {
      const duplicateSlug = categories.find(
        c => c.slug.trim().toLowerCase() === slugVal.toLowerCase() && c._id !== editCatId
      )
      if (duplicateSlug) {
        errors.slug = "A category with this slug already exists."
      }
    }

    if (!descVal) {
      errors.description = "Description is required."
    } else if (descVal.length < 10 || descVal.length > 200) {
      errors.description = "Description must be between 10 and 200 characters."
    } else if ((descVal.match(/[a-zA-Z]/g) || []).length < 3) {
      errors.description = "Description must contain at least 3 letters."
    } else if (!/[.!?]$/.test(descVal)) {
      errors.description = "Description must end with a punctuation mark (., !, or ?) to be a complete sentence."
    }

    if (existingImageWarning) {
      errors.bannerImage = "Please choose whether to use the existing image or overwrite it."
    } else if (!imagePreview) {
      errors.bannerImage = "Category Banner Image is required."
    }

    if (!altVal) {
      errors.bannerImageAlt = "Image Alt Text description is required."
    } else if (altVal.length < 5 || altVal.length > 100) {
      errors.bannerImageAlt = "Image Alt Text must be between 5 and 100 characters."
    } else if ((altVal.match(/[a-zA-Z]/g) || []).length < 3) {
      errors.bannerImageAlt = "Image Alt Text must contain at least 3 letters."
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Verification/Checking of duplicate image on server
  async function handleImageSelect(file: File) {
    setUploading(true)
    setExistingImageWarning(null)
    setPendingUploadFile(null)

    const filename = file.name.replace(/\s+/g, '-').toLowerCase()
    const fileUrl = `/images/${filename}`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('checkOnly', 'true')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.exists) {
          setExistingImageWarning({ url: fileUrl, filename: file.name })
          setPendingUploadFile(file)
        } else {
          setPendingUploadFile(file)
          const objectUrl = URL.createObjectURL(file)
          setImagePreview(objectUrl)
          setNewCat(prev => ({ ...prev, bannerImage: fileUrl }))
          setIsDirty(true)
          setValidationErrors(prev => { const c = { ...prev }; delete c.bannerImage; return c })
        }
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to check image file')
      }
    } catch (e) {
      console.error('Check image error:', e)
      alert('Error verifying image existence.')
    } finally {
      setUploading(false)
    }
  }

  function acceptExistingImage() {
    if (existingImageWarning) {
      setImagePreview(existingImageWarning.url)
      setNewCat(prev => ({ ...prev, bannerImage: existingImageWarning.url }))
      setIsDirty(true)
      setValidationErrors(prev => { const c = { ...prev }; delete c.bannerImage; return c })
      setExistingImageWarning(null)
      setPendingUploadFile(null)
    }
  }

  function forceUploadImage() {
    if (pendingUploadFile) {
      const filename = pendingUploadFile.name.replace(/\s+/g, '-').toLowerCase()
      const fileUrl = `/images/${filename}`
      const objectUrl = URL.createObjectURL(pendingUploadFile)
      setImagePreview(objectUrl)
      setNewCat(prev => ({ ...prev, bannerImage: fileUrl }))
      setIsDirty(true)
      setValidationErrors(prev => { const c = { ...prev }; delete c.bannerImage; return c })
      setExistingImageWarning(null)
    }
  }

  // Unified save Category handler
  async function handleSaveCategory() {
    if (!validateForm()) {
      setTimeout(() => {
        const errorEl = document.querySelector('.border-red-500, .text-red-500')
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const inputEl = errorEl.closest('div')?.querySelector('input, textarea') as HTMLElement
          if (inputEl) inputEl.focus()
        }
      }, 100)
      return
    }

    let finalImageUrl = newCat.bannerImage
    if (pendingUploadFile) {
      setIsUploadingOnSave(true)
      const formData = new FormData()
      formData.append('file', pendingUploadFile)
      formData.append('overwrite', 'true')

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json()
          alert(uploadErr.error || 'Failed to upload image to server.')
          setIsUploadingOnSave(false)
          return
        }
        const uploadData = await uploadRes.json()
        finalImageUrl = uploadData.url
      } catch (err) {
        console.error('Image upload on save failed:', err)
        alert('Failed to upload image to public/images folder.')
        setIsUploadingOnSave(false)
        return
      } finally {
        setIsUploadingOnSave(false)
      }
    }

    if (finalImageUrl) {
      const parts = finalImageUrl.split(/[/\\]/)
      const filename = parts[parts.length - 1].toLowerCase().replace(/\s+/g, '-')
      finalImageUrl = `/images/${filename}`
    }

    const payload = {
      name: newCat.name.trim(),
      slug: newCat.slug.trim(),
      description: newCat.description.trim(),
      bannerImage: finalImageUrl,
      bannerImageAlt: newCat.bannerImageAlt.trim(),
      color: '#6366f1', // default indigo
      isVisible: newCat.isVisible,
      showInNav: newCat.showInNav,
      position: Number(newCat.position)
    }

    try {
      const url = editCatId ? `/api/categories/${editCatId}` : '/api/categories'
      const method = editCatId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json()
        if (editCatId) {
          setCategories(prev => prev.map(c => c._id === editCatId ? data : c))
        } else {
          setCategories(prev => [...prev, data])
        }
        setIsDirty(false)
        setIsModalOpen(false)
        setEditCatId(null)
        setImagePreview(null)
        setPendingUploadFile(null)
        setExistingImageWarning(null)
        setNewCat({
          name: '',
          slug: '',
          description: '',
          position: 99,
          isVisible: true,
          showInNav: true,
          bannerImage: '',
          bannerImageAlt: ''
        })
        setSaved('category')
        setTimeout(() => setSaved(''), 3000)
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to save category')
      }
    } catch (err) {
      console.error('Save category error:', err)
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id))
      }
    } catch (err) {
      console.error('Delete category error:', err)
    }
  }

  async function toggleVisibility(category: Category) {
    const newVisibility = !(category.isVisible ?? true);
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: newVisibility })
      })
      if (res.ok) {
        const updated = await res.json()
        setCategories(prev => prev.map(c => c._id === category._id ? updated : c))
      } else {
        const errData = await res.json()
        alert(errData.error || 'Failed to update visibility')
      }
    } catch (err) {
      console.error('Toggle visibility error:', err)
    }
  }




  // Pagination
  const categoriesPerPage = 10
  const indexOfLastCat = currentPage * categoriesPerPage
  const indexOfFirstCat = indexOfLastCat - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCat, indexOfLastCat)
  const leftColumnCats = currentCategories.slice(0, 5)
  const rightColumnCats = currentCategories.slice(5, 10)
  const totalPages = Math.ceil(categories.length / categoriesPerPage)

  const hasChanges = editCatId 
    ? (() => {
        const original = categories.find(c => c._id === editCatId);
        if (!original) return false;
        return (
          newCat.name !== original.name ||
          newCat.slug !== original.slug ||
          newCat.description !== (original.description || '') ||
          newCat.position !== (original.position ?? 99) ||
          newCat.isVisible !== (original.isVisible ?? true) ||
          newCat.showInNav !== (original.showInNav ?? true) ||
          newCat.bannerImage !== (original.bannerImage || '') ||
          newCat.bannerImageAlt !== (original.bannerImageAlt || '')
        );
      })()
    : (newCat.name.trim().length > 0 || newCat.slug.trim().length > 0 || newCat.description.trim().length > 0);

  return (
    <>
      <div className="max-w-[1200px] mx-auto animate-[admin-fade-in_0.4s_ease_both] pb-16 font-sans">
      
      {/* Header section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-sans font-extrabold text-[#0f172a] tracking-tight m-0">
            Categories
          </h1>
          <p className="text-[13px] text-[#64748b] mt-1 font-semibold">
            Organize and classify news articles into clean categories
          </p>
        </div>
        <button 
          onClick={() => {
            setNewCat({
              name: '',
              slug: '',
              description: '',
              position: 99,
              isVisible: true,
              showInNav: true,
              bannerImage: '',
              bannerImageAlt: ''
            })
            setImagePreview(null)
            setIsDirty(false)
            setValidationErrors({})
            setExistingImageWarning(null)
            setPendingUploadFile(null)
            setIsModalOpen(true)
          }}
          className="p-2.5 px-5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-extrabold text-[13px] rounded-xl cursor-pointer btn-3d-indigo self-end md:self-center"
        >
          + Add Category
        </button>
      </div>

      {saved && (
        <div className="bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] rounded-xl p-3 px-5 text-[13px] font-bold shadow-sm mb-6 animate-[admin-scale-in_0.2s_ease_both]">
          ✓ {saved === 'category' ? 'Category' : 'Tag'} added successfully
        </div>
      )}      {/* 2-column layout (5 left, 5 right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column Categories */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] overflow-hidden min-h-[350px]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-extrabold text-[14.5px] text-[#0f172a] tracking-tight uppercase flex items-center gap-2">
              📂 Categories
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {leftColumnCats.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-[13px] font-semibold">No categories found.</div>
            ) : (
              leftColumnCats.map((cat) => (
                <div key={cat._id} className={`p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors ${cat.isVisible === false ? 'opacity-70 bg-slate-50/30' : ''}`}>
                  <div className="flex items-center gap-3.5 min-w-[200px] flex-1">
                    <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm transition-all" style={{ background: cat.color, opacity: cat.isVisible === false ? 0.5 : 1 }} />
                    <div className="flex-1">
                      <div className={`text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2 ${cat.isVisible === false ? 'text-slate-400 font-medium' : ''}`}>
                        {cat.name}
                        {cat.isVisible === false && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1 select-none">
                            🚫 Hidden
                          </span>
                        )}

                      </div>
                      <div className="text-[11.5px] text-slate-400 font-semibold mt-0.5">
                        /{cat.slug} · <span className="text-slate-500">{cat.articles} articles</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleVisibility(cat)} 
                      className={`p-1.5 px-3 border rounded-lg cursor-pointer text-[11.5px] font-bold transition-all active:translate-y-[1px] ${
                        cat.isVisible !== false 
                          ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-650' 
                          : 'border-indigo-300 bg-indigo-100/80 hover:bg-indigo-200/90 text-indigo-800 font-extrabold shadow-sm'
                      }`}
                    >
                      {cat.isVisible !== false ? 'Hide' : 'Show'}
                    </button>
                    <button 
                      onClick={() => {
                        setEditCatId(cat._id)
                        setNewCat({
                          name: cat.name,
                          slug: cat.slug,
                          description: cat.description || '',
                          position: cat.position ?? 99,
                          isVisible: cat.isVisible ?? true,
                          showInNav: cat.showInNav ?? true,
                          bannerImage: cat.bannerImage || '',
                          bannerImageAlt: cat.bannerImageAlt || ''
                        })
                        setImagePreview(cat.bannerImage || null)
                        setValidationErrors({})
                        setExistingImageWarning(null)
                        setPendingUploadFile(null)
                        setIsDirty(false)
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 px-3.5 border border-slate-200 bg-white text-[11.5px] text-slate-700 rounded-lg cursor-pointer btn-3d-white font-bold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat._id)} 
                      className="p-1.5 px-3.5 border border-red-200 bg-white hover:bg-red-50 text-[11.5px] text-red-600 rounded-lg cursor-pointer font-bold active:translate-y-[1px] transition-all"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column Categories */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] overflow-hidden min-h-[350px]">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 h-[61px]">
            {/* Spacer to align with left header */}
          </div>
          <div className="divide-y divide-slate-100">
            {rightColumnCats.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-[13px] font-semibold">No more categories.</div>
            ) : (
              rightColumnCats.map((cat) => (
                <div key={cat._id} className={`p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors ${cat.isVisible === false ? 'opacity-70 bg-slate-50/30' : ''}`}>
                  <div className="flex items-center gap-3.5 min-w-[200px] flex-1">
                    <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm transition-all" style={{ background: cat.color, opacity: cat.isVisible === false ? 0.5 : 1 }} />
                    <div className="flex-1">
                      <div className={`text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2 ${cat.isVisible === false ? 'text-slate-400 font-medium' : ''}`}>
                        {cat.name}
                        {cat.isVisible === false && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1 select-none">
                            🚫 Hidden
                          </span>
                        )}

                      </div>
                      <div className="text-[11.5px] text-slate-400 font-semibold mt-0.5">
                        /{cat.slug} · <span className="text-slate-500">{cat.articles} articles</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleVisibility(cat)} 
                      className={`p-1.5 px-3 border rounded-lg cursor-pointer text-[11.5px] font-bold transition-all active:translate-y-[1px] ${
                        cat.isVisible !== false 
                          ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-650' 
                          : 'border-indigo-300 bg-indigo-100/80 hover:bg-indigo-200/90 text-indigo-800 font-extrabold shadow-sm'
                      }`}
                    >
                      {cat.isVisible !== false ? 'Hide' : 'Show'}
                    </button>
                    <button 
                      onClick={() => {
                        setEditCatId(cat._id)
                        setNewCat({
                          name: cat.name,
                          slug: cat.slug,
                          description: cat.description || '',
                          position: cat.position ?? 99,
                          isVisible: cat.isVisible ?? true,
                          showInNav: cat.showInNav ?? true,
                          bannerImage: cat.bannerImage || '',
                          bannerImageAlt: cat.bannerImageAlt || ''
                        })
                        setImagePreview(cat.bannerImage || null)
                        setValidationErrors({})
                        setExistingImageWarning(null)
                        setPendingUploadFile(null)
                        setIsDirty(false)
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 px-3.5 border border-slate-200 bg-white text-[11.5px] text-slate-700 rounded-lg cursor-pointer btn-3d-white font-bold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat._id)} 
                      className="p-1.5 px-3.5 border border-red-200 bg-white hover:bg-red-50 text-[11.5px] text-red-600 rounded-lg cursor-pointer font-bold active:translate-y-[1px] transition-all"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2.5 bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.01)] max-w-[400px] mx-auto">
          <button 
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 px-3 border border-slate-200 bg-white rounded-xl text-[12px] font-bold text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6366f1] transition-all"
          >
            ◀ Previous
          </button>
          
          <span className="text-[12.5px] text-slate-500 font-bold px-2">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 px-3 border border-slate-200 bg-white rounded-xl text-[12px] font-bold text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6366f1] transition-all"
          >
            Next ▶
          </button>
        </div>
      )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-[650px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden animate-[admin-scale-in_0.2s_ease_both]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[18px] font-extrabold text-[#0f172a] font-sans tracking-tight">
                {editCatId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false)
                  setEditCatId(null)
                }} 
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              
              {/* BASIC INFO */}
              <div className="flex flex-col gap-4">
                <div className="text-[12px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">
                  BASIC INFO
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  <div>
                    <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Category Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Technology"
                      value={newCat.name}
                      onChange={(e) => {
                        const val = e.target.value
                        setNewCat(prev => ({
                          ...prev,
                          name: val
                        }))
                        setIsDirty(true)
                        setValidationErrors(prev => { const c = { ...prev }; delete c.name; return c })
                      }}
                      className={`w-full border bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 input-3d ${validationErrors.name ? 'border-red-500' : 'border-slate-200'}`}
                    />
                    {validationErrors.name && (
                      <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.name}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Slug *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. technology"
                      value={newCat.slug}
                      onChange={(e) => {
                        setNewCat(prev => ({ ...prev, slug: e.target.value }))
                        setIsDirty(true)
                        setValidationErrors(prev => { const c = { ...prev }; delete c.slug; return c })
                      }}
                      className={`w-full border bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 input-3d ${validationErrors.slug ? 'border-red-500' : 'border-slate-200'}`}
                    />
                    {validationErrors.slug && (
                      <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.slug}</span>
                    )}
                  </div>
                </div>

                <div className="font-sans">
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Description *</label>
                  <textarea 
                    rows={3}
                    placeholder="Short description of this category..."
                    value={newCat.description}
                    onChange={(e) => {
                      setNewCat(prev => ({ ...prev, description: e.target.value }))
                      setIsDirty(true)
                      setValidationErrors(prev => { const c = { ...prev }; delete c.description; return c })
                    }}
                    className={`w-full border bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 resize-none input-3d ${validationErrors.description ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {validationErrors.description && (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.description}</span>
                  )}
                </div>

                {/* VISIBILITY SETTINGS */}
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 font-sans">
                  <div className="text-[12px] font-extrabold text-[#6366f1] tracking-wider uppercase">
                    VISIBILITY SETTINGS
                  </div>
                  {/* Visibility Switch */}
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50/30">
                    <div>
                      <div className="text-[12.5px] font-bold text-slate-800">Visible on Site</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Control if category is active</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={newCat.isVisible}
                        onChange={(e) => {
                          setNewCat(prev => ({ ...prev, isVisible: e.target.checked }))
                          setIsDirty(true)
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* BANNER IMAGE */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
                <div className="text-[12px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">
                  BANNER IMAGE *
                </div>

                {/* Hidden real file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 5 * 1024 * 1024) {
                      setValidationErrors(prev => ({ ...prev, bannerImage: 'File too large. Maximum allowed size is 5 MB.' }))
                      return
                    }
                    handleImageSelect(file)
                  }}
                />

                {/* Uploading loader state */}
                {uploading && (
                  <div className="border border-slate-200 rounded-xl p-6 text-center bg-slate-50 flex flex-col items-center justify-center gap-1.5">
                    <div className="animate-spin text-2xl">⏳</div>
                    <div className="text-[12.5px] text-slate-700 font-bold">Verifying image details...</div>
                  </div>
                )}

                {/* Warning prompts for existing image */}
                {!uploading && existingImageWarning && (
                  <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/50 flex flex-col gap-3 border-dashed">
                    <div className="text-[12.5px] text-amber-800 font-semibold flex items-start gap-2">
                      <span className="text-[15px]">⚠️</span>
                      <div>
                        An image named <span className="font-extrabold text-amber-900">"{existingImageWarning.filename}"</span> already exists in public images folder.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={acceptExistingImage}
                        className="flex-1 text-white bg-amber-600 hover:bg-amber-700 font-bold p-2 px-3 rounded-lg text-[11px] cursor-pointer text-center transition-colors border-none"
                      >
                        Use Existing
                      </button>
                      <button
                        type="button"
                        onClick={forceUploadImage}
                        className="flex-1 text-amber-700 bg-white border border-amber-300 hover:bg-amber-100/50 font-bold p-2 px-3 rounded-lg text-[11px] cursor-pointer text-center transition-colors"
                      >
                        Replace / Overwrite
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExistingImageWarning(null)
                          setPendingUploadFile(null)
                        }}
                        className="text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold p-2 px-3 rounded-lg text-[11px] cursor-pointer text-center transition-colors border-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Image picker or preview container */}
                {!uploading && !existingImageWarning && (
                  <>
                    {!imagePreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all bg-white hover:bg-slate-50 select-none ${validationErrors.bannerImage ? 'border-red-500' : 'border-slate-200 hover:border-[#6366f1]'}`}
                      >
                        <div className="text-3xl mb-1.5">🖼️</div>
                        <div className="text-[13px] text-slate-800 font-bold">Click to Select Banner Image File</div>
                        <div className="text-[10.5px] text-[#64748b] mt-1 font-medium">PNG, JPG, WebP, GIF · up to 5MB</div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-h-48">
                          <img
                            src={imagePreview}
                            alt="Selected banner preview"
                            className="w-full object-cover max-h-48"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null)
                              setNewCat(prev => ({ ...prev, bannerImage: '' }))
                              setIsDirty(true)
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 border border-red-200 rounded-lg px-2 py-1 text-[11px] font-bold shadow cursor-pointer transition-colors"
                          >
                            ✕ Remove
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[12px] text-[#6366f1] font-bold border border-[#6366f1]/30 hover:bg-[#6366f1]/5 rounded-lg py-1.75 transition-colors cursor-pointer bg-white"
                        >
                          🔄 Change Banner Image
                        </button>
                      </div>
                    )}
                  </>
                )}

                {validationErrors.bannerImage && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.bannerImage}</span>
                )}

                <div className="font-sans">
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Banner Image Alt Text *</label>
                  <input 
                    type="text" 
                    placeholder="Describe the banner image for accessibility"
                    value={newCat.bannerImageAlt}
                    onChange={(e) => {
                      setNewCat(prev => ({ ...prev, bannerImageAlt: e.target.value }))
                      setIsDirty(true)
                      setValidationErrors(prev => { const c = { ...prev }; delete c.bannerImageAlt; return c })
                    }}
                    className={`w-full border bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 input-3d ${validationErrors.bannerImageAlt ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {validationErrors.bannerImageAlt && (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.bannerImageAlt}</span>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/30">
              <button 
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  setEditCatId(null)
                }}
                className="p-2.5 px-5 bg-white text-slate-700 rounded-xl font-bold text-[13px] cursor-pointer btn-3d-white"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={isUploadingOnSave}
                onClick={handleSaveCategory}
                className="p-2.5 px-6 bg-[#6366f1] hover:bg-[#4f46e5] text-white border-transparent cursor-pointer btn-3d-indigo rounded-xl font-extrabold text-[13px] flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingOnSave ? '⏳ Saving...' : (editCatId ? 'Update Category' : 'Save Category')}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
