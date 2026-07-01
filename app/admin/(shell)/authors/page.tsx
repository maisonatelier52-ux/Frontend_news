'use client'

import { useState, useEffect } from 'react'

interface Author {
  _id: string
  name: string
  slug: string
  gender: string
  role: string
  email: string
  category: string
  bio: string
  profileImage?: string
  socialLinks: {
    twitter?: string
    quora?: string
    reddit?: string
    medium?: string
    substack?: string
  }
  articlesCount: number
}

const categoryColors: Record<string, string> = {
  Politics: '#3b82f6', // blue
  Technology: '#8b5cf6', // purple
  Business: '#f59e0b', // amber
  World: '#10b981', // emerald
  Sports: '#ef4444', // red
  Entertainment: '#ec4899', // pink
  Science: '#06b6d4', // cyan
  Health: '#84cc16' // lime
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [categoriesList, setCategoriesList] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [gender, setGender] = useState('Not Chosen')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageWarning, setExistingImageWarning] = useState<{ url: string; filename: string } | null>(null)
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isUploadingOnSave, setIsUploadingOnSave] = useState(false)

  // Social Links state
  const [twitter, setTwitter] = useState('')
  const [quora, setQuora] = useState('')
  const [reddit, setReddit] = useState('')
  const [medium, setMedium] = useState('')
  const [substack, setSubstack] = useState('')

  // Fetch Authors and Categories
  useEffect(() => {
    async function loadData() {
      try {
        const authorsRes = await fetch('/api/authors')
        if (authorsRes.ok) {
          const data = await authorsRes.json()
          setAuthors(data)
        }

        const categoriesRes = await fetch('/api/categories')
        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          setCategoriesList(data.map((c: any) => c.name))
        }
      } catch (err) {
        console.error('Failed to load author data:', err)
      }
    }
    loadData()
  }, [])

  const handleNameChange = (val: string) => {
    setName(val)
  }

  // Handle slug change manually to enforce hyphens and lowercase
  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  // Verification/Checking of duplicate image on server
  async function handleImageSelect(file: File) {
    setUploading(true)
    setExistingImageWarning(null)
    setPendingUploadFile(null)

    const filename = file.name.replace(/\s+/g, '-').toLowerCase()
    const fileUrl = `/authors/${filename}`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'authors')
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
          setProfileImage(fileUrl)
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
      setProfileImage(existingImageWarning.url)
      setExistingImageWarning(null)
      setPendingUploadFile(null)
    }
  }

  function forceUploadImage() {
    if (pendingUploadFile) {
      const filename = pendingUploadFile.name.replace(/\s+/g, '-').toLowerCase()
      const fileUrl = `/authors/${filename}`
      const objectUrl = URL.createObjectURL(pendingUploadFile)
      setImagePreview(objectUrl)
      setProfileImage(fileUrl)
      setExistingImageWarning(null)
    }
  }

  const openAddModal = () => {
    setEditingAuthorId(null)
    setName('')
    setSlug('')
    setGender('Not Chosen')
    setRole('')
    setEmail('')
    setCategory('')
    setBio('')
    setProfileImage('')
    setImagePreview(null)
    setPendingUploadFile(null)
    setExistingImageWarning(null)
    setTwitter('')
    setQuora('')
    setReddit('')
    setMedium('')
    setSubstack('')
    setValidationErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (author: Author) => {
    setEditingAuthorId(author._id)
    setName(author.name)
    setSlug(author.slug)
    setGender(author.gender)
    setRole(author.role || '')
    setEmail(author.email)
    setCategory(author.category)
    setBio(author.bio)
    setProfileImage(author.profileImage || '')
    setImagePreview(author.profileImage || null)
    setPendingUploadFile(null)
    setExistingImageWarning(null)
    setTwitter(author.socialLinks?.twitter || '')
    setQuora(author.socialLinks?.quora || '')
    setReddit(author.socialLinks?.reddit || '')
    setMedium(author.socialLinks?.medium || '')
    setSubstack(author.socialLinks?.substack || '')
    setValidationErrors({})
    setIsModalOpen(true)
  }

  const deleteAuthor = async (id: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      try {
        const res = await fetch(`/api/authors/${id}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          setAuthors((prev) => prev.filter((a) => a._id !== id))
        }
      } catch (err) {
        console.error('Delete author error:', err)
      }
    }
  }

  const saveAuthor = async () => {
    // Basic validation
    const errors: Record<string, string> = {}
    const trimmedName = name.trim()
    const trimmedSlug = slug.trim()
    const trimmedRole = role.trim()
    const trimmedBio = bio.trim()

    if (!trimmedName) {
      errors.name = 'Author name is required.'
    } else if (trimmedName.length < 3 || trimmedName.length > 50) {
      errors.name = 'Author name must be between 3 and 50 characters.'
    } else if ((trimmedName.match(/[a-zA-Z]/g) || []).length < 3) {
      errors.name = 'Author name must contain at least 3 letters.'
    }
    
    const duplicateSlug = authors.find(
      a => a.slug.trim().toLowerCase() === trimmedSlug.toLowerCase() && a._id !== editingAuthorId
    )
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!trimmedSlug) {
      errors.slug = 'Slug is required.'
    } else if (trimmedSlug.length < 3 || trimmedSlug.length > 50) {
      errors.slug = 'Slug must be between 3 and 50 characters.'
    } else if (!slugRegex.test(trimmedSlug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and single hyphens, with no leading/trailing/consecutive hyphens.'
    } else if ((trimmedSlug.match(/[a-z]/g) || []).length < 3) {
      errors.slug = 'Slug must contain at least 3 letters.'
    } else if (duplicateSlug) {
      errors.slug = 'This slug is already taken by another author.'
    }

    if (!trimmedRole) {
      errors.role = 'Role is required.'
    } else if (trimmedRole.length < 3 || trimmedRole.length > 50) {
      errors.role = 'Role must be between 3 and 50 characters.'
    } else if ((trimmedRole.match(/[a-zA-Z]/g) || []).length < 3) {
      errors.role = 'Role must contain at least 3 letters.'
    }
    
    if (!email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email address.'
    }

    if (!category) {
      errors.category = 'Primary category is required.'
    }

    if (!trimmedBio) {
      errors.bio = 'Author bio/biography is required.'
    } else if (trimmedBio.length < 20 || trimmedBio.length > 300) {
      errors.bio = 'Author bio must be between 20 and 300 characters.'
    } else if ((trimmedBio.match(/[a-zA-Z]/g) || []).length < 3) {
      errors.bio = 'Author bio must contain at least 3 letters.'
    } else if (!/[.!?]$/.test(trimmedBio)) {
      errors.bio = 'Author bio must end with a punctuation mark (., !, or ?) to be a complete sentence.'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setTimeout(() => {
        const errorEl = document.querySelector('.border-red-500, .text-red-500')
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const inputEl = errorEl.closest('div')?.querySelector('input, textarea, select') as HTMLElement
          if (inputEl) inputEl.focus()
        }
      }, 100)
      return
    }

    let finalImageUrl = profileImage || '/authors/placeholder.webp'
    if (pendingUploadFile) {
      setIsUploadingOnSave(true)
      const formData = new FormData()
      formData.append('file', pendingUploadFile)
      formData.append('folder', 'authors')
      formData.append('overwrite', 'true')

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json()
          alert(uploadErr.error || 'Failed to upload profile image to server.')
          setIsUploadingOnSave(false)
          return
        }
        const uploadData = await uploadRes.json()
        finalImageUrl = uploadData.url
      } catch (err) {
        console.error('Profile image upload on save failed:', err)
        alert('Failed to upload profile image to server.')
        setIsUploadingOnSave(false)
        return
      } finally {
        setIsUploadingOnSave(false)
      }
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      gender,
      role: role.trim(),
      email: email.trim(),
      category,
      bio: bio.trim(),
      profileImage: finalImageUrl,
      socialLinks: {
        ...(twitter.trim() && { twitter: twitter.trim() }),
        ...(quora.trim() && { quora: quora.trim() }),
        ...(reddit.trim() && { reddit: reddit.trim() }),
        ...(medium.trim() && { medium: medium.trim() }),
        ...(substack.trim() && { substack: substack.trim() })
      }
    }

    try {
      if (editingAuthorId) {
        const res = await fetch(`/api/authors/${editingAuthorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          const data = await res.json()
          setAuthors((prev) => prev.map((a) => (a._id === editingAuthorId ? data : a)))
          setSavedMessage('updated')
        }
      } else {
        const res = await fetch('/api/authors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          const data = await res.json()
          setAuthors((prev) => [...prev, data])
          setSavedMessage('added')
        } else {
          const errData = await res.json()
          alert(errData.error || 'Failed to create author')
          return
        }
      }

      setIsModalOpen(false)
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (err) {
      console.error('Save author error:', err)
    }
  }

  // Filter Authors
  const filteredAuthors = authors.filter((author) => {
    const matchesSearch =
      author.name.toLowerCase().includes(search.toLowerCase()) ||
      author.email.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'all' || author.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const isFormComplete = 
    name.trim().length > 0 &&
    slug.trim().length > 0 &&
    role.trim().length > 0 &&
    email.trim().includes('@') &&
    category !== '' &&
    bio.trim().length > 0

  return (
    <>
      <div className="max-w-[1200px] mx-auto animate-[admin-fade-in_0.4s_ease_both] pb-16 font-sans text-slate-800">
        
        {/* Header section */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[28px] font-sans font-extrabold text-[#0f172a] tracking-tight m-0">
              Authors
            </h1>
            <p className="text-[13px] text-[#64748b] mt-1 font-semibold">
              Manage the profile information, primary category, and social presence of publication authors
            </p>
          </div>
          <button 
            onClick={openAddModal}
            className="p-2.5 px-5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-extrabold text-[13px] rounded-xl cursor-pointer btn-3d-indigo self-end md:self-center"
          >
            + Add Author
          </button>
        </div>

        {savedMessage && (
          <div className="bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] rounded-xl p-3 px-5 text-[13px] font-bold shadow-sm mb-6 animate-[admin-scale-in_0.2s_ease_both]">
            ✓ Author {savedMessage === 'added' ? 'added' : 'updated'} successfully
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-2.5 px-4 shadow-[0_2px_4px_rgba(15,23,42,0.01)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              placeholder="Search by name or email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder-slate-400"
            />
          </div>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-200 rounded-xl p-2.5 px-4 text-[13px] text-slate-700 bg-white cursor-pointer outline-none shadow-[0_2px_4px_rgba(15,23,42,0.01)] min-w-[170px]"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Authors List Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-extrabold text-[14.5px] text-[#0f172a] tracking-tight uppercase flex items-center gap-2">
              ✍️ Authors <span className="text-[12px] text-slate-400 font-bold">({filteredAuthors.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Author', 'Role', 'Primary Category', 'Social Links', 'Articles', 'Actions'].map((h) => (
                    <th key={h} className="p-4 px-5 text-left text-[11px] text-slate-400 font-extrabold tracking-wider uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuthors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-[13px] font-semibold">
                      No authors found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredAuthors.map((author) => (
                    <tr key={author._id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1e1b4b] text-white flex items-center justify-center font-extrabold text-[13.5px] shadow-sm shrink-0 uppercase select-none">
                            {author.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[13.5px] font-bold text-[#0f172a]">{author.name}</div>
                            <div className="text-[11.5px] text-slate-400 font-semibold mt-0.5">
                              /{author.slug} · <span className="text-slate-500">{author.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-4 px-5 text-[12.5px] font-bold text-slate-600">
                        <div className="flex flex-col gap-0.5">
                          <span>{author.role}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 px-5">
                        <span 
                          className="text-[11px] text-white font-extrabold rounded-md p-1 px-2.5 shadow-sm inline-block"
                          style={{ backgroundColor: categoryColors[author.category] || '#6366f1' }}
                        >
                          {author.category}
                        </span>
                      </td>

                      {/* Social links */}
                      <td className="p-4 px-5">
                        <div className="flex gap-2.5 items-center">
                          {author.socialLinks?.twitter && (
                            <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="Twitter/X">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            </a>
                          )}

                          {author.socialLinks?.quora && (
                            <a href={author.socialLinks.quora} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-700 transition-colors font-serif font-black text-[13px] leading-none shrink-0" title="Quora">
                              Q
                            </a>
                          )}
                          
                          {author.socialLinks?.reddit && (
                            <a href={author.socialLinks.reddit} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-orange-600 transition-colors shrink-0 animate-[fade-in_0.2s_ease]" title="Reddit">
                              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="8" r="1"/><path d="M7 11c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5"/><circle cx="7" cy="11" r="0.5"/><circle cx="13" cy="11" r="0.5"/></svg>
                            </a>
                          )}

                          {author.socialLinks?.medium && (
                            <a href={author.socialLinks.medium} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-black transition-colors font-mono font-black text-[11.5px] leading-none shrink-0" title="Medium">
                              M
                            </a>
                          )}

                          {author.socialLinks?.substack && (
                            <a href={author.socialLinks.substack} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#ff6719] transition-colors font-sans font-black text-[12px] leading-none shrink-0" title="Substack">
                              S
                            </a>
                          )}

                          {(!author.socialLinks || (!author.socialLinks.twitter && !author.socialLinks.quora && !author.socialLinks.reddit && !author.socialLinks.medium && !author.socialLinks.substack)) && (
                            <span className="text-slate-200 select-none text-[12px]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Articles Count */}
                      <td className="p-4 px-5 text-[13px] font-extrabold text-[#0f172a]">
                        {author.articlesCount}
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 px-5">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(author)}
                            className="p-1.5 px-3.5 border border-slate-200 bg-white text-[11.5px] text-slate-700 rounded-lg cursor-pointer btn-3d-white font-bold"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteAuthor(author._id)}
                            className="p-1.5 px-3.5 border border-red-100 bg-white hover:bg-red-50 text-[11.5px] text-red-600 rounded-lg cursor-pointer font-bold active:translate-y-[1px] transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Author Modal - Styled Light Theme to match Category modal styling */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-[650px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden animate-[admin-scale-in_0.2s_ease_both]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-[18px] font-extrabold text-[#0f172a] font-sans tracking-tight">
                {editingAuthorId ? 'Edit Author' : 'Add Author'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto no-scrollbar text-[#0f172a] bg-[#f8fafc]">
              
              {/* Row 1: Name and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => {
                      handleNameChange(e.target.value)
                      setValidationErrors(prev => { const c = { ...prev }; delete c.name; return c })
                    }}
                    className={`w-full bg-white border ${
                      validationErrors.name ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-[#6366f1]'
                    } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d transition-all`}
                  />
                  {validationErrors.name && (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.name}</span>
                  )}
                </div>
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      placeholder="john-doe"
                      value={slug}
                      onChange={(e) => {
                        handleSlugChange(e.target.value)
                        setValidationErrors(prev => { const c = { ...prev }; delete c.slug; return c })
                      }}
                      className={`w-full bg-white border ${
                        validationErrors.slug ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-[#6366f1]'
                      } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-9 text-[13px] outline-none input-3d transition-all`}
                    />
                  </div>
                  {validationErrors.slug ? (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.slug}</span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                      Only lowercase letters and hyphens allowed (e.g., "john-doe")
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Gender and Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Gender</label>
                  <div className="relative">
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-[#0f172a] rounded-xl p-3 text-[13px] outline-none cursor-pointer appearance-none input-3d"
                    >
                      <option value="Not Chosen">Not Chosen</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Writer"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value)
                      setValidationErrors(prev => { const c = { ...prev }; delete c.role; return c })
                    }}
                    className={`w-full bg-white border ${
                      validationErrors.role ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-[#6366f1]'
                    } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d transition-all`}
                  />
                  {validationErrors.role && (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.role}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Email and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="author@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setValidationErrors(prev => { const c = { ...prev }; delete c.email; return c })
                    }}
                    className={`w-full bg-white border ${
                      validationErrors.email ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-[#6366f1]'
                    } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d transition-all`}
                  />
                  {validationErrors.email && (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.email}</span>
                  )}
                </div>
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value)
                        setValidationErrors(prev => { const c = { ...prev }; delete c.category; return c })
                      }}
                      className={`w-full bg-white border ${
                        validationErrors.category ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-[#6366f1]'
                      } text-[#0f172a] rounded-xl p-3 text-[13.5px] outline-none cursor-pointer appearance-none input-3d`}
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </div>
                  {validationErrors.category && (
                    <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.category}</span>
                  )}
                </div>
              </div>


              {/* Row 5: Bio */}
              <div>
                <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  placeholder="Short author biography..."
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value)
                    setValidationErrors(prev => { const c = { ...prev }; delete c.bio; return c })
                  }}
                  className={`w-full bg-white border ${
                    validationErrors.bio ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-[#6366f1]'
                  } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none resize-none input-3d transition-all`}
                />
                {validationErrors.bio && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.bio}</span>
                )}
              </div>

              {/* Row 6: Profile Image custom file upload */}
              <div>
                <label className="text-[12.5px] font-bold text-[#334155] block mb-0.5">Profile Image</label>
                <span className="text-[10.5px] text-slate-400 font-semibold block mb-2">
                  Only .webp format · Under 100 KB
                </span>

                {imagePreview && (
                  <div className="mb-3 relative w-20 h-20 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setProfileImage('')
                        setPendingUploadFile(null)
                      }}
                      className="absolute inset-0 bg-black/45 hover:bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-[11px] font-extrabold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2.5 px-3.5 input-3d">
                  <label 
                    htmlFor="profile-image-upload" 
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-[12px] font-bold py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors select-none btn-3d-white"
                  >
                    {uploading ? 'Checking...' : 'Choose File'}
                  </label>
                  <input 
                    id="profile-image-upload"
                    type="file"
                    accept=".webp"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageSelect(e.target.files[0])
                      }
                    }}
                    className="hidden"
                  />
                  <span className="text-[12.5px] text-slate-500 truncate max-w-[400px]">
                    {pendingUploadFile ? pendingUploadFile.name : (profileImage ? profileImage.split('/').pop() : 'No file chosen')}
                  </span>
                </div>

                {existingImageWarning && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col gap-2.5 animate-[admin-scale-in_0.2s_ease_both]">
                    <div className="text-[12.5px] text-amber-800 font-bold flex items-center gap-2">
                      ⚠️ Duplicate Image Warning
                    </div>
                    <div className="text-[11.5px] text-amber-700 font-semibold leading-relaxed">
                      An image named <span className="font-extrabold font-mono text-amber-900">"{existingImageWarning.filename}"</span> already exists under the author profiles folder.
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={acceptExistingImage}
                        className="p-1.5 px-3 border border-amber-300 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all"
                      >
                        Use Existing Image
                      </button>
                      <button
                        type="button"
                        onClick={forceUploadImage}
                        className="p-1.5 px-3 border border-amber-300 bg-white hover:bg-amber-50 text-amber-800 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all"
                      >
                        Replace / Overwrite
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExistingImageWarning(null)
                          setPendingUploadFile(null)
                        }}
                        className="p-1.5 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-[11px] font-extrabold cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 7: Social Links */}
              <div className="flex flex-col gap-3.5">
                <div className="text-amber-500 font-extrabold text-[12px] tracking-wider uppercase mb-0.5">
                  SOCIAL LINKS
                </div>
                
                {/* Twitter */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="https://x.com/..."
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-10 text-[13px] outline-none input-3d focus:border-[#6366f1] transition-all"
                  />
                </div>

                {/* Quora */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-black text-slate-400 font-serif leading-none select-none">
                    Q
                  </span>
                  <input 
                    type="text" 
                    placeholder="https://quora.com/..."
                    value={quora}
                    onChange={(e) => setQuora(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-10 text-[13px] outline-none input-3d focus:border-[#6366f1] transition-all"
                  />
                </div>

                {/* Reddit */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="10" cy="10" r="8"/>
                      <circle cx="10" cy="8" r="1"/>
                      <path d="M7 11c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5"/>
                      <circle cx="7" cy="11" r="0.5"/>
                      <circle cx="13" cy="11" r="0.5"/>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="https://reddit.com/..."
                    value={reddit}
                    onChange={(e) => setReddit(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-10 text-[13px] outline-none input-3d focus:border-[#6366f1] transition-all"
                  />
                </div>

                {/* Medium */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-black text-slate-400 font-mono select-none">
                    M
                  </span>
                  <input 
                    type="text" 
                    placeholder="https://medium.com/..."
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-10 text-[13px] outline-none input-3d focus:border-[#6366f1] transition-all"
                  />
                </div>

                {/* Substack */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12.5px] font-bold text-slate-400 font-sans select-none">
                    S
                  </span>
                  <input 
                    type="text" 
                    placeholder="https://substack.com/..."
                    value={substack}
                    onChange={(e) => setSubstack(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-10 text-[13px] outline-none input-3d focus:border-[#6366f1] transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 px-5 bg-white text-slate-700 rounded-xl font-bold text-[13px] cursor-pointer btn-3d-white"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={saveAuthor}
                className="p-2.5 px-6 bg-[#6366f1] hover:bg-[#4f46e5] text-white border-transparent rounded-xl font-extrabold text-[13px] cursor-pointer btn-3d-indigo flex items-center gap-2 transition-all active:translate-y-[1px]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {editingAuthorId ? 'Update Author' : 'Save Author'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
