'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: number
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

const initialCategories: Category[] = [
  { id: 1, name: 'Politics', slug: 'politics', parent: '', articles: 312, color: '#3b82f6', description: 'National and global political news and updates.', position: 1, isVisible: true, showInNav: true },
  { id: 2, name: 'Technology', slug: 'technology', parent: '', articles: 245, color: '#8b5cf6', description: 'Gadgets, software, internet, and industry developments.', position: 2, isVisible: true, showInNav: true },
  { id: 3, name: 'Business', slug: 'business', parent: '', articles: 198, color: '#f59e0b', description: 'Market trends, corporate updates, and financial advice.', position: 3, isVisible: true, showInNav: true },
  { id: 4, name: 'World', slug: 'world', parent: '', articles: 167, color: '#10b981', description: 'International events, global perspectives, and culture.', position: 4, isVisible: true, showInNav: true },
  { id: 5, name: 'Sports', slug: 'sports', parent: '', articles: 143, color: '#ef4444', description: 'Match reports, athlete updates, and tournament news.', position: 5, isVisible: true, showInNav: true },
  { id: 6, name: 'Entertainment', slug: 'entertainment', parent: '', articles: 98, color: '#ec4899', description: 'Celebrity gossip, movie reviews, and pop culture.', position: 6, isVisible: true, showInNav: false },
  { id: 7, name: 'Science', slug: 'science', parent: '', articles: 76, color: '#06b6d4', description: 'Discoveries, space updates, and environmental news.', position: 7, isVisible: true, showInNav: false },
  { id: 8, name: 'Health', slug: 'health', parent: '', articles: 45, color: '#84cc16', description: 'Medical research, wellness tips, and public health updates.', position: 8, isVisible: true, showInNav: false },
]

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
  const [categories, setCategories] = useState(initialCategories)
  const [tags, setTags] = useState(initialTags)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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
  
  const [newTag, setNewTag] = useState('')
  const [editCatId, setEditCatId] = useState<number | null>(null)
  const [saved, setSaved] = useState('')

  function addCategory() {
    if (!newCat.name) return
    const id = categories.length + 1
    
    const newCategoryItem: Category = {
      id,
      name: newCat.name,
      slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, '-'),
      parent: '',
      articles: 0,
      color: '#6366f1', // default theme brand color (indigo)
      description: newCat.description,
      position: newCat.position,
      isVisible: newCat.isVisible,
      showInNav: newCat.showInNav,
      bannerImage: newCat.bannerImage || '/category-placeholder.webp',
      bannerImageAlt: newCat.bannerImageAlt
    }
    
    setCategories((prev) => [...prev, newCategoryItem])
    
    // Reset form state
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
  }

  function deleteCategory(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  function addTag() {
    if (!newTag.trim()) return
    const id = tags.length + 1
    setTags((prev) => [...prev, { id, name: newTag.trim(), slug: newTag.trim().toLowerCase().replace(/\s+/g, '-'), count: 0 }])
    setNewTag('')
    setSaved('tag')
    setTimeout(() => setSaved(''), 3000)
  }

  function deleteTag(id: number) {
    setTags((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      <div className="max-w-[1200px] mx-auto animate-[admin-fade-in_0.4s_ease_both] pb-16 font-sans">
      
      {/* Header section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-sans font-extrabold text-[#0f172a] tracking-tight m-0">
            Categories & Tags
          </h1>
          <p className="text-[13px] text-[#64748b] mt-1 font-semibold">
            Organize and classify news articles and taxonomy tags
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
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Categories panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-extrabold text-[14.5px] text-[#0f172a] tracking-tight uppercase flex items-center gap-2">
              📂 Categories <span className="text-[12px] text-slate-400 font-bold">({categories.length})</span>
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3.5 min-w-[200px] flex-1">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ background: cat.color }} />
                  <div className="flex-1">
                    {editCatId === cat.id ? (
                      <input 
                        defaultValue={cat.name} 
                        onBlur={(e) => {
                          setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, name: e.target.value } : c))
                          setEditCatId(null)
                        }} 
                        autoFocus 
                        className="bg-white border border-slate-200 rounded-lg p-1 px-2.5 text-[13px] text-[#0f172a] focus:border-[#6366f1] outline-none"
                      />
                    ) : (
                      <div className="text-[13.5px] font-bold text-[#0f172a] flex items-center gap-2">
                        {cat.name}
                        {cat.position !== undefined && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 rounded-md p-0.5 px-1.5 font-semibold">
                            Pos: {cat.position}
                          </span>
                        )}
                        {cat.isVisible === false && (
                          <span className="text-[10px] bg-red-50 text-red-600 rounded-md p-0.5 px-1.5 font-semibold">
                            Hidden
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-[11.5px] text-slate-400 font-semibold mt-0.5">
                      /{cat.slug} · <span className="text-slate-500">{cat.articles} articles</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditCatId(cat.id)} 
                    className="p-1.5 px-3.5 border border-slate-200 bg-white text-[11.5px] text-slate-700 rounded-lg cursor-pointer btn-3d-white font-bold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat.id)} 
                    className="p-1.5 px-3.5 border border-red-200 bg-white hover:bg-red-50 text-[11.5px] text-red-600 rounded-lg cursor-pointer font-bold active:translate-y-[1px] transition-all"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-extrabold text-[14.5px] text-[#0f172a] tracking-tight uppercase flex items-center gap-2">
              🏷️ Tags <span className="text-[12px] text-slate-400 font-bold">({tags.length})</span>
            </h2>
          </div>

          {/* Add tag form inline */}
          <div className="p-5 bg-slate-50/30 border-b border-slate-100 flex flex-col gap-2">
            <label className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wide">Add New Tag</label>
            <div className="flex gap-2">
              <input 
                placeholder="Tag name..." 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 border border-slate-200 bg-white text-[#0f172a] rounded-xl p-2.5 px-4 text-[13px] outline-none placeholder-slate-400 input-3d"
              />
              <button 
                onClick={addTag} 
                className="p-2.5 px-5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-extrabold text-[12.5px] rounded-xl cursor-pointer btn-3d-indigo"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Tag cloud layout */}
          <div className="p-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div 
                key={tag.id}
                className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full p-1 px-3 text-[12px] text-slate-700 font-semibold"
              >
                <span>{tag.name}</span>
                <span className="text-[10px] text-slate-400">({tag.count})</span>
                <button 
                  onClick={() => deleteTag(tag.id)} 
                  className="text-slate-400 hover:text-red-500 font-bold ml-1 hover:scale-110 cursor-pointer transition-colors"
                  aria-label={`Delete ${tag.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Tag detailed table */}
          <div className="border-t border-slate-100 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {['Tag', 'Slug', 'Articles', ''].map((h) => (
                    <th key={h} className="p-3 px-5 text-left text-[11px] text-slate-400 font-extrabold tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-3 px-5 text-[13px] text-[#0f172a] font-bold">{tag.name}</td>
                    <td className="p-3 px-5 text-[12px] text-slate-400 font-medium">/{tag.slug}</td>
                    <td className="p-3 px-5 text-[12px] text-slate-500 font-bold">{tag.count}</td>
                    <td className="p-3 px-5 text-right">
                      <button 
                        onClick={() => deleteTag(tag.id)} 
                        className="text-[11.5px] text-red-600 hover:text-red-700 font-bold cursor-pointer hover:underline bg-transparent border-none"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-[650px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden animate-[admin-scale-in_0.2s_ease_both]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[18px] font-extrabold text-[#0f172a] font-sans tracking-tight">Add Category</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
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
                      onChange={(e) => setNewCat(prev => ({
                        ...prev,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      }))}
                      className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 input-3d"
                    />
                  </div>
                  <div>
                    <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Slug *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. technology"
                      value={newCat.slug}
                      onChange={(e) => setNewCat(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 input-3d"
                    />
                  </div>
                </div>

                <div className="font-sans">
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Description *</label>
                  <textarea 
                    rows={3}
                    placeholder="Short description of this category..."
                    value={newCat.description}
                    onChange={(e) => setNewCat(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 resize-none input-3d"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  <div>
                    <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Position (ordering) *</label>
                    <input 
                      type="number" 
                      value={newCat.position}
                      onChange={(e) => setNewCat(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none input-3d"
                    />
                    <span className="text-[11px] text-slate-500 font-semibold mt-1.5 block">Lower number = higher in nav (must be unique)</span>
                  </div>
                  <div>
                    <label className="text-[12.5px] font-bold text-[#334155] block mb-2">Visibility</label>
                    <div className="flex flex-col gap-2.5">
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 text-[13px] font-bold select-none">
                        <input 
                          type="checkbox"
                          checked={newCat.isVisible}
                          onChange={(e) => setNewCat(prev => ({ ...prev, isVisible: e.target.checked }))}
                          className="accent-[#6366f1] w-4.5 h-4.5 rounded"
                        />
                        <span className="text-emerald-500">👁</span> Visible on public site
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 text-[13px] font-bold select-none">
                        <input 
                          type="checkbox"
                          checked={newCat.showInNav}
                          onChange={(e) => setNewCat(prev => ({ ...prev, showInNav: e.target.checked }))}
                          className="accent-[#6366f1] w-4.5 h-4.5 rounded"
                        />
                        Show in top navigation
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* BANNER IMAGE */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
                <div className="text-[12px] font-extrabold text-[#6366f1] tracking-wider uppercase font-sans">
                  BANNER IMAGE *
                </div>
                <div className="text-[10.5px] text-slate-400 font-semibold -mt-2">
                  Only .webp · Under 100 KB · Uploaded to ImageKit CDN
                </div>
                
                <div>
                  <div className="border-2 border-dashed border-slate-200 hover:border-[#6366f1] bg-slate-50/30 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer transition-all btn-3d-white">
                    <div className="text-2xl mb-1">📤</div>
                    <div className="text-[13px] text-slate-700 font-extrabold font-sans">Upload .webp image</div>
                  </div>
                </div>

                <div className="font-sans">
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Banner Image Alt Text *</label>
                  <input 
                    type="text" 
                    placeholder="Describe the banner image for accessibility"
                    value={newCat.bannerImageAlt}
                    onChange={(e) => setNewCat(prev => ({ ...prev, bannerImageAlt: e.target.value }))}
                    className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-xl p-3 text-[13px] outline-none placeholder-slate-400 input-3d"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/30">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 px-5 bg-white text-slate-700 rounded-xl font-bold text-[13px] cursor-pointer btn-3d-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  addCategory()
                  setIsModalOpen(false)
                }}
                className="p-2.5 px-6 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-extrabold text-[13px] border-none cursor-pointer btn-3d-indigo"
              >
                Save Category
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
