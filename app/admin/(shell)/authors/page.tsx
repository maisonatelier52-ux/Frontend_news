'use client'

import { useState } from 'react'

interface Author {
  id: number
  name: string
  slug: string
  gender: string
  country: string
  email: string
  category: string
  websiteUrl?: string
  bio: string
  profileImage?: string
  socialLinks: {
    twitter?: string
    quora?: string
    reddit?: string
    medium?: string
  }
  articlesCount: number
}

const initialAuthors: Author[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    slug: 'sarah-johnson',
    gender: 'Female',
    country: 'United States',
    email: 'sarah@newssite.com',
    category: 'Politics',
    websiteUrl: 'https://sarahj.com',
    bio: 'Senior political correspondent with over a decade of experience covering Washington and international relations.',
    profileImage: '/authors/sarah-johnson.webp',
    socialLinks: {
      twitter: 'https://x.com/sarah_johnson',
      quora: 'https://quora.com/profile/Sarah-Johnson',
      medium: 'https://medium.com/@sarah_j'
    },
    articlesCount: 312
  },
  {
    id: 2,
    name: 'Michael Chen',
    slug: 'michael-chen',
    gender: 'Male',
    country: 'Canada',
    email: 'michael@newssite.com',
    category: 'Technology',
    websiteUrl: 'https://chentech.io',
    bio: 'Tech analyst, developer, and former software engineering lead covering artificial intelligence, Silicon Valley, and consumer tech.',
    profileImage: '/authors/michael-chen.webp',
    socialLinks: {
      twitter: 'https://x.com/mike_chen',
      reddit: 'https://reddit.com/user/mike_chen_tech'
    },
    articlesCount: 245
  },
  {
    id: 3,
    name: 'Emily Davis',
    slug: 'emily-davis',
    gender: 'Female',
    country: 'United Kingdom',
    email: 'emily@newssite.com',
    category: 'Business',
    websiteUrl: 'https://emilydavis.co.uk',
    bio: 'Financial journalist reporting on corporate earnings, global markets, monetary policies, and entrepreneurship.',
    profileImage: '/authors/emily-davis.webp',
    socialLinks: {
      twitter: 'https://x.com/emily_davis_biz',
      medium: 'https://medium.com/@emily_davis'
    },
    articlesCount: 198
  },
  {
    id: 4,
    name: 'Lisa Park',
    slug: 'lisa-park',
    gender: 'Female',
    country: 'South Korea',
    email: 'lisa@newssite.com',
    category: 'Sports',
    websiteUrl: '',
    bio: 'Sports reporter and former college athlete covering major leagues, tournament championships, and athlete profiles.',
    profileImage: '/authors/lisa-park.webp',
    socialLinks: {
      twitter: 'https://x.com/lisa_park_sports',
      quora: 'https://quora.com/profile/Lisa-Park'
    },
    articlesCount: 143
  }
]

const categoriesList = [
  'Politics',
  'Technology',
  'Business',
  'World',
  'Sports',
  'Entertainment',
  'Science',
  'Health'
]

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
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  
  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({})

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [gender, setGender] = useState('Male')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [bio, setBio] = useState('')
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [selectedFileName, setSelectedFileName] = useState('')

  // Social Links state
  const [twitter, setTwitter] = useState('')
  const [quora, setQuora] = useState('')
  const [reddit, setReddit] = useState('')
  const [medium, setMedium] = useState('')

  // Sync slug generation when name changes (only if not editing, or manually overridden)
  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingAuthorId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      )
    }
  }

  // Handle slug change manually to enforce hyphens and lowercase
  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImageFile(file)
      setSelectedFileName(file.name)
    }
  }

  const openAddModal = () => {
    setEditingAuthorId(null)
    setName('')
    setSlug('')
    setGender('Male')
    setCountry('')
    setEmail('')
    setCategory('')
    setWebsiteUrl('')
    setBio('')
    setProfileImageFile(null)
    setSelectedFileName('')
    setTwitter('')
    setQuora('')
    setReddit('')
    setMedium('')
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (author: Author) => {
    setEditingAuthorId(author.id)
    setName(author.name)
    setSlug(author.slug)
    setGender(author.gender)
    setCountry(author.country)
    setEmail(author.email)
    setCategory(author.category)
    setWebsiteUrl(author.websiteUrl || '')
    setBio(author.bio)
    setProfileImageFile(null)
    setSelectedFileName(author.profileImage ? author.profileImage.split('/').pop() || '' : '')
    setTwitter(author.socialLinks.twitter || '')
    setQuora(author.socialLinks.quora || '')
    setReddit(author.socialLinks.reddit || '')
    setMedium(author.socialLinks.medium || '')
    setFormErrors({})
    setIsModalOpen(true)
  }

  const deleteAuthor = (id: number) => {
    if (confirm('Are you sure you want to delete this author?')) {
      setAuthors((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const saveAuthor = () => {
    // Basic validation
    const errors: Record<string, boolean> = {}
    if (!name.trim()) errors.name = true
    if (!slug.trim()) errors.slug = true
    if (!country.trim()) errors.country = true
    if (!email.trim() || !email.includes('@')) errors.email = true
    if (!category) errors.category = true
    if (!bio.trim()) errors.bio = true

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const savedAuthorData: Author = {
      id: editingAuthorId ? editingAuthorId : authors.length + 1,
      name: name.trim(),
      slug: slug.trim(),
      gender,
      country: country.trim(),
      email: email.trim(),
      category,
      websiteUrl: websiteUrl.trim() || undefined,
      bio: bio.trim(),
      profileImage: selectedFileName ? `/authors/${selectedFileName}` : '/authors/placeholder.webp',
      socialLinks: {
        ...(twitter.trim() && { twitter: twitter.trim() }),
        ...(quora.trim() && { quora: quora.trim() }),
        ...(reddit.trim() && { reddit: reddit.trim() }),
        ...(medium.trim() && { medium: medium.trim() })
      },
      articlesCount: editingAuthorId ? (authors.find(a => a.id === editingAuthorId)?.articlesCount || 0) : 0
    }

    if (editingAuthorId) {
      setAuthors((prev) => prev.map((a) => (a.id === editingAuthorId ? savedAuthorData : a)))
      setSavedMessage('updated')
    } else {
      setAuthors((prev) => [...prev, savedAuthorData])
      setSavedMessage('added')
    }

    setIsModalOpen(false)
    setTimeout(() => setSavedMessage(''), 3000)
  }

  // Filter Authors
  const filteredAuthors = authors.filter((author) => {
    const matchesSearch =
      author.name.toLowerCase().includes(search.toLowerCase()) ||
      author.email.toLowerCase().includes(search.toLowerCase()) ||
      author.country.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'all' || author.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className="max-w-[1200px] mx-auto animate-[admin-fade-in_0.4s_ease_both] pb-16 font-sans text-slate-800">
        
        {/* Header section */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[28px] font-sans font-extrabold text-[#0f172a] tracking-tight m-0">
              Authors & Contributors
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
              placeholder="Search by name, email, or country..." 
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
              ✍️ Authors & Contributors <span className="text-[12px] text-slate-400 font-bold">({filteredAuthors.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Author', 'Region / Gender', 'Primary Category', 'Social Links', 'Articles', 'Actions'].map((h) => (
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
                    <tr key={author.id} className="hover:bg-slate-50/30 transition-colors">
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

                      {/* Region / Gender */}
                      <td className="p-4 px-5 text-[12.5px] font-bold text-slate-600">
                        <div className="flex flex-col gap-0.5">
                          <span>📍 {author.country}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{author.gender}</span>
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
                        <div className="flex gap-2">
                          {author.socialLinks.twitter ? (
                            <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="Twitter/X">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            </a>
                          ) : <span className="text-slate-200 select-none text-[12px]">—</span>}

                          {author.socialLinks.quora && (
                            <a href={author.socialLinks.quora} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-700 transition-colors font-serif font-black text-[13px] leading-none shrink-0" title="Quora">
                              Q
                            </a>
                          )}
                          
                          {author.socialLinks.reddit && (
                            <a href={author.socialLinks.reddit} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-orange-600 transition-colors shrink-0" title="Reddit">
                              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="8" r="1"/><path d="M7 11c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5"/><circle cx="7" cy="11" r="0.5"/><circle cx="13" cy="11" r="0.5"/></svg>
                            </a>
                          )}

                          {author.socialLinks.medium && (
                            <a href={author.socialLinks.medium} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-black transition-colors font-mono font-black text-[11px] leading-none shrink-0" title="Medium">
                              M
                            </a>
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
                            onClick={() => deleteAuthor(author.id)}
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
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full bg-white border ${
                      formErrors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#6366f1]'
                    } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d transition-all`}
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Slug <span className="text-red-500">*</span> <span className="text-[10px] text-slate-500 font-normal">(auto-generated)</span>
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
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className={`w-full bg-white border ${
                        formErrors.slug ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#6366f1]'
                      } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 pl-9 text-[13px] outline-none input-3d transition-all`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                    Only lowercase letters and hyphens allowed (e.g., "john-doe")
                  </span>
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
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. United Kingdom"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`w-full bg-white border ${
                      formErrors.country ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#6366f1]'
                    } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d transition-all`}
                  />
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
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-white border ${
                      formErrors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#6366f1]'
                    } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d transition-all`}
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full bg-white border ${
                        formErrors.category ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#6366f1]'
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
                </div>
              </div>

              {/* Row 4: Website URL */}
              <div>
                <label className="text-[12.5px] font-bold text-[#334155] block mb-1.5">Website URL</label>
                <input 
                  type="text" 
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none input-3d focus:border-[#6366f1] transition-all"
                />
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
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full bg-white border ${
                    formErrors.bio ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#6366f1]'
                  } text-[#0f172a] placeholder-slate-400 rounded-xl p-3 text-[13px] outline-none resize-none input-3d transition-all`}
                />
              </div>

              {/* Row 6: Profile Image custom file upload */}
              <div>
                <label className="text-[12.5px] font-bold text-[#334155] block mb-0.5">Profile Image</label>
                <span className="text-[10.5px] text-slate-400 font-semibold block mb-2">
                  Only .webp format · Under 100 KB · Uploaded to ImageKit CDN
                </span>
                
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2.5 px-3.5 input-3d">
                  <label 
                    htmlFor="profile-image-upload" 
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-[12px] font-bold py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors select-none btn-3d-white"
                  >
                    Choose File
                  </label>
                  <input 
                    id="profile-image-upload"
                    type="file"
                    accept=".webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-[12.5px] text-slate-500 truncate max-w-[400px]">
                    {selectedFileName || 'No file chosen'}
                  </span>
                </div>
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
                onClick={saveAuthor}
                className="p-2.5 px-6 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-extrabold text-[13px] border-none cursor-pointer btn-3d-indigo flex items-center gap-2 transition-all active:translate-y-[1px]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save Author
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
