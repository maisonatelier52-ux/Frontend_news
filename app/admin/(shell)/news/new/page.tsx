'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAdminModal } from '../../../components/AdminModalContext'

type BlockType = 'paragraph' | 'subheading' | 'pullquote' | 'image' | 'at-glance' | 'faq'

interface Block {
  id: string
  type: BlockType
  value: any
}

type TabType = 'write' | 'meta' | 'visuals' | 'seo'

function NewArticleForm() {
  const { showAlert } = useAdminModal()
  const searchParams = useSearchParams()
  const router = useRouter()
  const articleId = searchParams.get('id')

  const [activeTab, setActiveTab] = useState<TabType>('write')
  const [categoriesList, setCategoriesList] = useState<string[]>([])
  const [authorsList, setAuthorsList] = useState<string[]>([])

  // Form Fields State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    author: '',
    newsType: 'featured',
    date: '',
    readTime: '',
    status: '',
    seoTitle: '',
    seoMetaDescription: '',
    keywords: '',
    tags: '',
    excerpt: '',
    featuredImage: '',
    imageAltText: '',
    featuredVideoUrl: '',
    cardLabel: '',
  })

  // Article Options Switches
  const [options, setOptions] = useState({
    featuredArticle: false,
    editorsPick: false,
    breakingNews: false,
    allowComments: true,
  })

  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'initial-1', type: 'paragraph', value: '' }
  ])

  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageWarning, setExistingImageWarning] = useState<{ url: string; filename: string } | null>(null)
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isUploadingOnSave, setIsUploadingOnSave] = useState(false)
  const [existingArticles, setExistingArticles] = useState<{ id: string; title: string; slug: string; featuredImage?: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch options and/or existing article
  useEffect(() => {
    async function loadFormOptions() {
      try {
        const catRes = await fetch('/api/categories')
        let cats: string[] = []
        if (catRes.ok) {
          const catData = await catRes.json()
          cats = catData.map((c: any) => c.name)
          setCategoriesList(cats)
        }

        const authRes = await fetch('/api/authors')
        let auths: string[] = []
        if (authRes.ok) {
          const authData = await authRes.json()
          auths = authData.map((a: any) => a.name)
          setAuthorsList(auths)
        }

        const newsRes = await fetch('/api/news')
        if (newsRes.ok) {
          const newsData = await newsRes.json()
          setExistingArticles(newsData.map((item: any) => ({
            id: item._id,
            title: item.title,
            slug: item.slug,
            featuredImage: item.featuredImage
          })))
        }

        if (articleId) {
          const articleRes = await fetch(`/api/news/${articleId}`)
          if (articleRes.ok) {
            const art = await articleRes.json()
            setForm({
              title: art.title || '',
              slug: art.slug || '',
              category: art.category || (cats[0] || ''),
              author: art.author || (auths[0] || ''),
              newsType: 'featured',
              date: art.date ? new Date(art.date).toISOString().substring(0, 16) : new Date().toISOString().substring(0, 16),
              readTime: art.readTime || '5 mins',
              status: art.status || 'draft',
              seoTitle: art.seoTitle || '',
              seoMetaDescription: art.seoMetaDescription || '',
              keywords: art.keywords || '',
              tags: art.tags || '',
              excerpt: art.excerpt || '',
              featuredImage: art.featuredImage || '',
              imageAltText: art.imageAltText || '',
              featuredVideoUrl: art.featuredVideoUrl || '',
              cardLabel: art.cardLabel || '',
            })
            setOptions({
              featuredArticle: art.options?.featuredArticle || false,
              editorsPick: art.options?.editorsPick || false,
              breakingNews: art.options?.breakingNews || false,
              allowComments: art.options?.allowComments || true,
            })
            if (art.blocks && art.blocks.length > 0) {
              setBlocks(art.blocks)
            }
            if (art.featuredImage) {
              setImagePreview(art.featuredImage)
            }
          }
        } else {
          // Keep category and author empty so they default to "Not Chosen" placeholder
          setForm(prev => ({
            ...prev,
            category: prev.category || '',
            author: prev.author || '',
            date: prev.date || new Date().toISOString().substring(0, 16)
          }))
        }
      } catch (err) {
        console.error('Error loading options or article:', err)
      }
    }
    loadFormOptions()
  }, [articleId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsDirty(true)

    // Clear field validation error instantly when user provides a value
    if (value && value.trim()) {
      setValidationErrors((prev) => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
  }

  // Toggle Switch Handler
  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Handle Blocks addition
  function addBlock(type: BlockType) {
    const newId = `block-${Date.now()}`
    let defaultValue: any = ''
    if (type === 'pullquote') defaultValue = { quote: '', author: '' }
    else if (type === 'image') defaultValue = { url: '', caption: '' }
    else if (type === 'at-glance') defaultValue = { title: 'At a glance', subtitle: '', rows: [{ label: '', value: '' }] }
    else if (type === 'faq') defaultValue = { title: 'Frequently asked questions', items: [{ question: '', answer: '' }] }

    setBlocks(prev => [...prev, { id: newId, type, value: defaultValue }])
  }

  // Update block value
  function updateBlockValue(id: string, newValue: any) {
    setBlocks(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, value: newValue } : b)
      setIsDirty(true)
      const hasContent = updated.some(b => {
        if (b.type === 'paragraph' || b.type === 'subheading') {
          return typeof b.value === 'string' && b.value.trim().length > 0 && b.value !== 'Start writing your news article here...'
        }
        if (b.type === 'pullquote') {
          return b.value && b.value.quote && b.value.quote.trim().length > 0
        }
        return false
      })

      if (hasContent) {
        setValidationErrors(errors => {
          const copy = { ...errors }
          delete copy.content
          return copy
        })
      }
      return updated
    })
  }

  // Delete a block
  function deleteBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  // Shift block index up/down
  function moveBlock(index: number, direction: 'up' | 'down') {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= blocks.length) return
    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(index, 1)
    newBlocks.splice(nextIndex, 0, removed)
    setBlocks(newBlocks)
  }

  // Validation function
  function validateTab(tab: TabType): boolean {
    const errors: Record<string, string> = { ...validationErrors }

    if (tab === 'write') {
      const trimmedTitle = form.title.trim()
      const trimmedSlug = form.slug.trim()
      const trimmedExcerpt = form.excerpt.trim()

      const duplicateTitle = existingArticles.find(
        art => art.title.trim().toLowerCase() === trimmedTitle.toLowerCase() && art.id !== articleId
      )
      const duplicateSlug = existingArticles.find(
        art => art.slug.trim().toLowerCase() === trimmedSlug.toLowerCase() && art.id !== articleId
      )

      // Article Title
      if (!trimmedTitle) {
        errors.title = "Article Headline is required."
      } else if (trimmedTitle.length < 10) {
        errors.title = "Article Headline must be at least 10 characters."
      } else if (trimmedTitle.length > 100) {
        errors.title = "Article Headline cannot exceed 100 characters."
      } else if ((trimmedTitle.match(/[a-zA-Z]/g) || []).length < 3) {
        errors.title = "Article Headline must contain at least 3 letters."
      } else if (duplicateTitle) {
        errors.title = "A news article with this title already exists."
      } else {
        delete errors.title
      }

      // Slug
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      if (!trimmedSlug) {
        errors.slug = "URL slug is required."
      } else if (trimmedSlug.length < 5 || trimmedSlug.length > 100) {
        errors.slug = "URL slug must be between 5 and 100 characters."
      } else if (!slugRegex.test(trimmedSlug)) {
        errors.slug = "Slug must contain only lowercase letters, numbers, and single hyphens, with no leading/trailing/consecutive hyphens."
      } else if ((trimmedSlug.match(/[a-z]/g) || []).length < 3) {
        errors.slug = "Slug must contain at least 3 letters."
      } else if (duplicateSlug) {
        errors.slug = "A news article with this slug already exists."
      } else {
        delete errors.slug
      }

      // Excerpt / Short Description
      if (!trimmedExcerpt) {
        errors.excerpt = "Excerpt description is required."
      } else if (trimmedExcerpt.length < 10 || trimmedExcerpt.length > 300) {
        errors.excerpt = "Excerpt description must be between 10 and 300 characters for SEO."
      } else if ((trimmedExcerpt.match(/[a-zA-Z]/g) || []).length < 3) {
        errors.excerpt = "Excerpt description must contain at least 3 letters."
      } else if (trimmedExcerpt.toLowerCase() === trimmedTitle.toLowerCase()) {
        errors.excerpt = "Excerpt description should not repeat the headline exactly."
      } else if (!/[.!?]$/.test(trimmedExcerpt)) {
        errors.excerpt = "Excerpt description must end with a punctuation mark (., !, or ?) to be a complete sentence."
      } else {
        delete errors.excerpt
      }

      if (!form.author) {
        errors.author = "Author selection is required."
      } else {
        delete errors.author
      }

      if (!form.date) {
        errors.date = "Publish date is required."
      } else {
        delete errors.date
      }

      if (!form.status) {
        errors.status = "Article publishing status is required."
      } else {
        delete errors.status
      }

      // Content blocks validation: ensure at least one text block contains content
      const hasContent = blocks.some(b => {
        if (b.type === 'paragraph' || b.type === 'subheading') {
          return typeof b.value === 'string' && b.value.trim().length > 0 && b.value !== 'Start writing your news article here...'
        }
        if (b.type === 'pullquote') {
          return b.value && b.value.quote && b.value.quote.trim().length > 0
        }
        return false
      })
      if (!hasContent) {
        errors.content = "Article content cannot be empty. Please enter text in the editor below."
      } else {
        delete errors.content
      }
    }

    if (tab === 'meta') {
      if (!form.category) {
        errors.category = "Category selection is required."
      } else {
        delete errors.category
      }

      const trimmedReadTime = form.readTime.trim()
      if (!trimmedReadTime) {
        errors.readTime = "Read time is required."
      } else if (!/^\d+$/.test(trimmedReadTime)) {
        errors.readTime = "Read time must be a whole positive integer (no text, decimals, or negative numbers)."
      } else {
        const rt = Number(trimmedReadTime)
        if (rt < 1 || rt > 60) {
          errors.readTime = "Read time must be between 1 and 60 minutes."
        } else {
          delete errors.readTime
        }
      }

      // Comma-separated Tags validation
      if (form.tags.trim()) {
        const tagList = form.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        
        if (tagList.length > 30) {
          errors.tags = "You cannot have more than 30 tags."
        } else {
          const uniqueTags = new Set(tagList.map(t => t.toLowerCase()))
          if (uniqueTags.size !== tagList.length) {
            errors.tags = "Duplicate tags are not allowed."
          } else {
            const invalidTag = tagList.find(t => t.length < 2 || t.length > 50 || !/^[a-zA-Z0-9\s-]+$/.test(t))
            if (invalidTag) {
              errors.tags = "Each tag must be 2-50 characters and contain letters, numbers, spaces, or hyphens."
            } else {
              delete errors.tags
            }
          }
        }
      } else {
        delete errors.tags
      }
    }

    if (tab === 'visuals') {
      if (!imagePreview) {
        errors.featuredImage = "Please upload an image using the file picker above."
      } else {
        delete errors.featuredImage
      }

      const trimmedAlt = form.imageAltText.trim()
      if (!trimmedAlt) {
        errors.imageAltText = "Image Alt Text description is required."
      } else if (trimmedAlt.length < 5 || trimmedAlt.length > 150) {
        errors.imageAltText = "Image Alt Text must be between 5 and 150 characters."
      } else if ((trimmedAlt.match(/[a-zA-Z]/g) || []).length < 3) {
        errors.imageAltText = "Image Alt Text must contain at least 3 letters."
      } else {
        delete errors.imageAltText
      }
    }

    if (tab === 'seo') {
      const trimmedSeoTitle = form.seoTitle.trim()
      const trimmedSeoDesc = form.seoMetaDescription.trim()

      if (!trimmedSeoTitle) {
        errors.seoTitle = "SEO Title is required for search engines."
      } else if (trimmedSeoTitle.length < 5 || trimmedSeoTitle.length > 70) {
        errors.seoTitle = "SEO Title must be between 5 and 70 characters."
      } else if ((trimmedSeoTitle.match(/[a-zA-Z]/g) || []).length < 3) {
        errors.seoTitle = "SEO Title must contain at least 3 letters."
      } else {
        delete errors.seoTitle
      }

      if (!trimmedSeoDesc) {
        errors.seoMetaDescription = "SEO Meta Description is required."
      } else if (trimmedSeoDesc.length < 10 || trimmedSeoDesc.length > 160) {
        errors.seoMetaDescription = "SEO Meta Description must be between 10 and 160 characters."
      } else if ((trimmedSeoDesc.match(/[a-zA-Z]/g) || []).length < 3) {
        errors.seoMetaDescription = "SEO Meta Description must contain at least 3 letters."
      } else if (!/[.!?]$/.test(trimmedSeoDesc)) {
        errors.seoMetaDescription = "SEO Meta Description must end with a punctuation mark (., !, or ?) to be a complete sentence."
      } else {
        delete errors.seoMetaDescription
      }
    }

    setValidationErrors(errors)

    // Check if the current tab is valid
    let isTabValid = true
    if (tab === 'write') {
      isTabValid = !errors.title && !errors.slug && !errors.excerpt && !errors.author && !errors.date && !errors.status && !errors.content
    } else if (tab === 'meta') {
      isTabValid = !errors.category && !errors.readTime && !errors.tags
    } else if (tab === 'visuals') {
      isTabValid = !errors.featuredImage && !errors.imageAltText
    } else if (tab === 'seo') {
      isTabValid = !errors.seoTitle && !errors.seoMetaDescription
    }

    // Scroll to the first validation issue dynamically if invalid
    if (!isTabValid) {
      setTimeout(() => {
        const errorEl = document.querySelector('.border-red-500, .text-red-500')
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const inputEl = errorEl.closest('div')?.querySelector('input, textarea, select') as HTMLElement
          if (inputEl) inputEl.focus()
        }
      }, 100)
    }

    return isTabValid
  }

  function handleTabClick(targetTab: TabType) {
    const steps: TabType[] = ['write', 'meta', 'visuals', 'seo']
    const currentIndex = steps.indexOf(activeTab)
    const targetIndex = steps.indexOf(targetTab)
    
    if (targetIndex <= currentIndex) {
      setActiveTab(targetTab)
    } else {
      let isValid = true
      for (let i = currentIndex; i < targetIndex; i++) {
        if (!validateTab(steps[i])) {
          isValid = false
          break
        }
      }
      if (isValid) {
        setActiveTab(targetTab)
      }
    }
  }

  async function handleSave(e: React.FormEvent) {
    if (e) e.preventDefault()
    setSaved(false)

    // Validate all tabs
    const isWriteValid = validateTab('write')
    const isMetaValid = validateTab('meta')
    const isVisualsValid = validateTab('visuals')
    const isSeoValid = validateTab('seo')

    if (!isWriteValid || !isMetaValid || !isVisualsValid || !isSeoValid) {
      if (!isWriteValid) setActiveTab('write')
      else if (!isMetaValid) setActiveTab('meta')
      else if (!isVisualsValid) setActiveTab('visuals')
      else if (!isSeoValid) setActiveTab('seo')
      return
    }

    // Perform upload if there's a pending file selected
    let finalImageUrl = form.featuredImage
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
          setSaveError(uploadErr.error || 'Failed to upload featured image to server.')
          setIsUploadingOnSave(false)
          return
        }
        const uploadData = await uploadRes.json()
        finalImageUrl = uploadData.url
      } catch (err) {
        console.error('Image upload on save failed:', err)
        setSaveError('Failed to upload image to public/images folder.')
        setIsUploadingOnSave(false)
        return
      } finally {
        setIsUploadingOnSave(false)
      }
    }

    const payload = {
      ...form,
      featuredImage: finalImageUrl,
      options,
      blocks
    }

    try {
      const url = articleId ? `/api/news/${articleId}` : '/api/news'
      const method = articleId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setSaved(true)
        setIsDirty(false)
        
        // Reset form fields
        setForm({
          title: '',
          slug: '',
          category: '',
          author: '',
          newsType: 'featured',
          date: '',
          readTime: '',
          status: '',
          seoTitle: '',
          seoMetaDescription: '',
          keywords: '',
          tags: '',
          excerpt: '',
          featuredImage: '',
          imageAltText: '',
          featuredVideoUrl: '',
          cardLabel: '',
        })
        setOptions({
          featuredArticle: false,
          editorsPick: false,
          breakingNews: false,
          allowComments: true,
        })
        setBlocks([
          { id: 'initial-1', type: 'paragraph', value: '' }
        ])
        setImagePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        const bottomContainer = document.getElementById('form-actions-bottom')
        if (bottomContainer) {
          bottomContainer.scrollIntoView({ behavior: 'smooth' })
        }
        
        // Redirect to admin news articles page after a short delay
        setTimeout(() => {
          setSaved(false)
          router.push('/admin/news')
          router.refresh()
        }, 1500)
      } else {
        const errData = await res.json()
        setSaveError(errData.error || 'Failed to save article')
      }
    } catch (err) {
      console.error('Save article error:', err)
    }
  }

  function handleNext() {
    if (activeTab === 'write') {
      if (validateTab('write')) setActiveTab('meta')
    } else if (activeTab === 'meta') {
      if (validateTab('meta')) setActiveTab('visuals')
    } else if (activeTab === 'visuals') {
      if (validateTab('visuals')) setActiveTab('seo')
    }
  }

  function handleBack() {
    if (activeTab === 'seo') setActiveTab('visuals')
    else if (activeTab === 'visuals') setActiveTab('meta')
    else if (activeTab === 'meta') setActiveTab('write')
  }

  // Check if image exists on server before save
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
          // Keep file in pending upload, set preview and input field path
          setPendingUploadFile(file)
          const objectUrl = URL.createObjectURL(file)
          setImagePreview(objectUrl)
          setForm(prev => ({ ...prev, featuredImage: fileUrl }))
          setValidationErrors(prev => { const c = { ...prev }; delete c.featuredImage; return c })
        }
      } else {
        const err = await res.json()
        showAlert(err.error || 'Failed to check image file', 'error', 'Upload Error')
      }
    } catch (e) {
      showAlert('Error verifying image existence.', 'error', 'Upload Error')
    } finally {
      setUploading(false)
    }
  }

  function acceptExistingImage() {
    if (existingImageWarning) {
      setImagePreview(existingImageWarning.url)
      setForm(prev => ({ ...prev, featuredImage: existingImageWarning.url }))
      setValidationErrors(prev => { const c = { ...prev }; delete c.featuredImage; return c })
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
      setForm(prev => ({ ...prev, featuredImage: fileUrl }))
      setValidationErrors(prev => { const c = { ...prev }; delete c.featuredImage; return c })
      setExistingImageWarning(null)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  // Exact UI styles from screenshot: rounded-xl inputs with light border and clean font
  const fieldClass = "w-full border border-slate-200 bg-white text-[#0f172a] rounded-xl p-3 px-4 text-[13.5px] outline-none transition-all duration-150 placeholder-slate-400 input-3d"

  return (
    <div className="max-w-[1200px] mx-auto animate-[admin-fade-in_0.4s_ease_both] pb-16 font-sans">
      
      {/* Top Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-sans font-extrabold text-[#0f172a] tracking-tight m-0">
            {articleId ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-[13px] text-[#64748b] mt-1 font-semibold">
            News Articles / {articleId ? 'Edit' : 'Create New'}
          </p>
        </div>
        
        {/* Header Right Action Buttons (Save draft and preview matching screen) */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-slate-700 font-bold p-2.5 px-5 border border-slate-200 rounded-xl text-[13px] cursor-pointer btn-3d-white"
          >
            💾 Save Draft
          </button>
        </div>
      </div>

      {/* Tabs bar flow selector matching the screen */}
      <div className="bg-white rounded-xl border border-slate-100 p-1 flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-[0_2px_8px_rgba(15,23,42,0.02)] mb-6 overflow-hidden">
        {[
          { id: 'write', label: 'Content Layout', desc: 'Build your article', icon: '📝' },
          { id: 'meta', label: 'Classifications', desc: 'Categories & tags', icon: '⚙️' },
          { id: 'visuals', label: 'Visual Assets', desc: 'Images & media', icon: '🖼️' },
          { id: 'seo', label: 'SEO Optimization', desc: 'Meta & advanced', icon: '🔍' },
        ].map((tab, idx) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id as TabType)}
            className={`flex-1 flex items-center gap-3 p-4 px-6 border-none cursor-pointer transition-all text-left relative ${
              activeTab === tab.id
                ? 'text-[#6366f1]'
                : 'text-[#475569] hover:text-[#0f172a]'
            }`}
          >
            {/* Step indicator active highlight */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              activeTab === tab.id ? 'bg-indigo-50 text-[#6366f1]' : 'bg-slate-50 text-[#94a3b8]'
            }`}>
              {tab.icon}
            </div>
            
            <div>
              <div className="text-[13.5px] font-bold tracking-tight">{tab.label}</div>
              <div className="text-[11px] text-[#94a3b8] font-semibold mt-0.5">{tab.desc}</div>
            </div>

            {/* Separator chevron */}
            {idx < 3 && (
              <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 text-[14px]">
                ➔
              </span>
            )}
            
            {/* Bottom active line matching image bar */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6366f1]" />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* LEFT COLUMN: Main tab card contents (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* TAB 1: WRITE & CONTENT */}
          {activeTab === 'write' && (
            <div className="flex flex-col gap-6 animate-[admin-fade-in_0.25s_ease_both]">
              
              {/* Card - General info */}
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#6366f1] tracking-wide uppercase">
                  <span>📝</span> GENERAL INFORMATION
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-title" className="text-[13px] font-extrabold text-[#0f172a]">Article Title *</label>
                    <span className="text-[10px] text-slate-400 font-semibold">{form.title.length}/150</span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] mb-2 font-medium">Create a clear, engaging headline</div>
                  <input
                    id="art-title"
                    name="title"
                    required
                    maxLength={150}
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter article headline..."
                    className={`${fieldClass} ${validationErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.title && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.title}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-slug" className="text-[13px] font-extrabold text-[#0f172a]">Slug (URL) *</label>
                    <span className="text-[10px] text-slate-400 font-semibold">{form.slug.length}/100</span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] mb-2 font-medium">This will be used in the article URL</div>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 text-[14px]">🔗</span>
                    <input
                      id="art-slug"
                      name="slug"
                      required
                      maxLength={100}
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="slug-path-here"
                      className={`${fieldClass} pl-10 ${validationErrors.slug ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {validationErrors.slug && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.slug}
                    </div>
                  )}
                  <div className="text-[11px] text-[#94a3b8] mt-1.5 font-semibold">Example: breaking-news-headline-2025</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-excerpt" className="text-[13px] font-extrabold text-[#0f172a]">Excerpt (Short Description) *</label>
                    <span className={`text-[10px] font-semibold ${form.excerpt.length > 300 ? 'text-red-500' : 'text-slate-400'}`}>{form.excerpt.length}/300</span>
                  </div>
                  <div className="text-[11.5px] text-[#64748b] mb-2 font-medium">Brief summary for listings and SEO</div>
                  <textarea
                    id="art-excerpt"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    maxLength={300}
                    placeholder="Write a short summary of your article..."
                    rows={3}
                    className={`${fieldClass} resize-none leading-relaxed ${validationErrors.excerpt ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.excerpt && (
                    <div className="text-[11px] text-red-500 font-semibold mt-1 block">⚠️ {validationErrors.excerpt}</div>
                  )}
                  {form.excerpt.length >= 280 && (
                    <div className="text-[11px] text-amber-500 font-semibold mt-1 flex items-center gap-1">⚠️ {300 - form.excerpt.length} characters remaining</div>
                  )}
                </div>
              </div>

              {/* Card - Content Block Editor */}
              <div className={`bg-white rounded-2xl p-6.5 border shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-4 ${validationErrors.content ? 'border-red-500' : 'border-slate-100'}`}>
                <div className="text-[13px] font-extrabold text-[#0f172a] block">Content *</div>
                {validationErrors.content && (
                  <div className="text-[12px] text-red-500 font-semibold -mt-2 mb-1 flex items-center gap-1">
                    <span>⚠️</span> {validationErrors.content}
                  </div>
                )}
                <div className="text-[11.5px] text-[#64748b] -mt-1.5 mb-2 font-medium">Write your article content</div>

                <div className="flex flex-col gap-4">
                  {blocks.map((block, index) => (
                    <div key={block.id} className="bg-slate-100 rounded-xl p-4 border border-slate-300/70 relative group transition-all shadow-sm">
                      
                      {/* Control controls */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-white text-[#6366f1] border border-slate-200 tracking-wider">
                          {block.type.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveBlock(index, 'up')}
                            className="p-1 hover:bg-white rounded text-[#475569] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-slate-200"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index === blocks.length - 1}
                            onClick={() => moveBlock(index, 'down')}
                            className="p-1 hover:bg-white rounded text-[#475569] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-slate-200"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlock(block.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded ml-2 cursor-pointer transition-all border border-transparent"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Inputs */}
                      {block.type === 'paragraph' && (() => {
                        const wordCount = block.value ? block.value.trim().split(/\s+/).filter(Boolean).length : 0
                        const isOverLimit = wordCount > 4000
                        return (
                          <div className="flex flex-col gap-1">
                            <textarea
                              value={block.value}
                              rows={4}
                              onChange={(e) => updateBlockValue(block.id, e.target.value)}
                              placeholder="Write paragraph content here..."
                              className={`w-full border bg-white text-[#0f172a] rounded-lg p-2.5 px-3.5 text-[13.5px] outline-none placeholder-slate-400 input-3d ${isOverLimit ? 'border-red-400' : 'border-slate-200'}`}
                            />
                            <div className={`text-[10.5px] font-semibold text-right ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                              {wordCount.toLocaleString()} / 4,000 words{isOverLimit ? ' — over limit!' : ''}
                            </div>
                          </div>
                        )
                      })()}

                      {block.type === 'subheading' && (
                        <input
                          type="text"
                          value={block.value}
                          onChange={(e) => updateBlockValue(block.id, e.target.value)}
                          placeholder="Enter subheading..."
                          className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-lg p-2.5 px-3.5 text-[13.5px] outline-none placeholder-slate-400 font-bold input-3d"
                        />
                      )}

                      {block.type === 'pullquote' && (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={block.value.quote}
                            rows={2}
                            onChange={(e) => updateBlockValue(block.id, { ...block.value, quote: e.target.value })}
                            placeholder="“Enter the pullquote text...”"
                            className="w-full border border-slate-200 bg-white text-[#6366f1] rounded-lg p-2.5 px-3.5 text-[13.5px] outline-none placeholder-slate-400 font-bold italic input-3d"
                          />
                          <input
                            type="text"
                            value={block.value.author}
                            onChange={(e) => updateBlockValue(block.id, { ...block.value, author: e.target.value })}
                            placeholder="Author Name"
                            className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-lg p-2 px-3 text-[12.5px] outline-none placeholder-slate-400 input-3d"
                          />
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="flex gap-4">
                          <div className="flex-1 flex flex-col gap-2">
                            <input
                              type="text"
                              value={block.value.url}
                              onChange={(e) => updateBlockValue(block.id, { ...block.value, url: e.target.value })}
                              placeholder="Image URL path"
                              className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-lg p-2 px-3 text-[13px] outline-none input-3d"
                            />
                            <input
                              type="text"
                              value={block.value.caption}
                              onChange={(e) => updateBlockValue(block.id, { ...block.value, caption: e.target.value })}
                              placeholder="Image caption"
                              className="w-full border border-slate-200 bg-white text-[#64748b] rounded-lg p-2 px-3 text-[12px] outline-none input-3d"
                            />
                          </div>
                          <div className="w-[100px] h-[72px] bg-white rounded-lg flex items-center justify-center border border-slate-200 text-xl shrink-0">
                            🖼️
                          </div>
                        </div>
                      )}

                      {block.type === 'at-glance' && (
                        <div className="bg-white rounded-lg p-3 flex flex-col gap-3 border border-slate-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={block.value.title}
                              onChange={(e) => updateBlockValue(block.id, { ...block.value, title: e.target.value })}
                              placeholder="Section Title"
                              className="w-full border border-slate-200 rounded-md p-1.5 px-3 text-[13px] bg-white outline-none input-3d"
                            />
                            <input
                              type="text"
                              value={block.value.subtitle}
                              onChange={(e) => updateBlockValue(block.id, { ...block.value, subtitle: e.target.value })}
                              placeholder="Subtitle"
                              className="w-full border border-slate-200 rounded-md p-1.5 px-3 text-[13px] bg-white outline-none input-3d"
                            />
                          </div>
                          {block.value.rows.map((row: any, rIndex: number) => (
                            <div key={rIndex} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={row.label}
                                onChange={(e) => {
                                  const nextRows = [...block.value.rows]
                                  nextRows[rIndex].label = e.target.value
                                  updateBlockValue(block.id, { ...block.value, rows: nextRows })
                                }}
                                placeholder="Label"
                                className="flex-1 max-w-[200px] border border-slate-200 rounded-md p-1.5 px-3 text-[12.5px] bg-white outline-none input-3d"
                              />
                              <input
                                type="text"
                                value={row.value}
                                onChange={(e) => {
                                  const nextRows = [...block.value.rows]
                                  nextRows[rIndex].value = e.target.value
                                  updateBlockValue(block.id, { ...block.value, rows: nextRows })
                                }}
                                placeholder="Value"
                                className="flex-1 border border-slate-200 rounded-md p-1.5 px-3 text-[12.5px] bg-white outline-none input-3d"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {block.type === 'faq' && (
                        <div className="bg-white rounded-lg p-3 flex flex-col gap-3 border border-slate-200">
                          <input
                            type="text"
                            value={block.value.title}
                            onChange={(e) => updateBlockValue(block.id, { ...block.value, title: e.target.value })}
                            placeholder="FAQ Section Title"
                            className="w-full border border-slate-200 rounded-md p-1.5 px-3 text-[13px] bg-white outline-none input-3d"
                          />
                          {block.value.items.map((qa: any, qIndex: number) => (
                            <div key={qIndex} className="border border-slate-200 bg-slate-100/60 p-2.5 rounded-lg">
                              <input
                                type="text"
                                value={qa.question}
                                onChange={(e) => {
                                  const nextItems = [...block.value.items]
                                  nextItems[qIndex].question = e.target.value
                                  updateBlockValue(block.id, { ...block.value, items: nextItems })
                                }}
                                placeholder="Question"
                                className="w-full border border-slate-200 rounded-md p-1.5 px-3 text-[12.5px] mb-2 bg-white outline-none input-3d"
                              />
                              <textarea
                                value={qa.answer}
                                rows={2}
                                onChange={(e) => {
                                  const nextItems = [...block.value.items]
                                  nextItems[qIndex].answer = e.target.value
                                  updateBlockValue(block.id, { ...block.value, items: nextItems })
                                }}
                                placeholder="Answer"
                                className="w-full border border-slate-200 rounded-md p-1.5 px-3 text-[12.5px] bg-white resize-none outline-none input-3d"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                <div className="flex gap-2.5 flex-wrap border-t border-slate-100 pt-4">
                  {[
                    { type: 'paragraph', label: '+ Paragraph' },
                    { type: 'subheading', label: '+ Subheading' },
                    { type: 'pullquote', label: '+ Pullquote' },
                    { type: 'image', label: '+ Image' },
                    { type: 'at-glance', label: '+ At a Glance' },
                    { type: 'faq', label: '+ FAQ' },
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => addBlock(btn.type as BlockType)}
                      className="p-2 px-4 border border-slate-200 bg-white text-slate-700 hover:text-[#6366f1] rounded-xl cursor-pointer text-[13px] font-bold btn-3d-white"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CLASSIFICATIONS */}
          {activeTab === 'meta' && (
            <div className="flex flex-col gap-6 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#6366f1] tracking-wide uppercase">
                  <span>⚙️</span> Classifications & Tags
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="art-category" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Category</label>
                    <select
                      id="art-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`${fieldClass} ${validationErrors.category ? 'border-red-500 focus:border-red-500' : ''}`}
                    >
                      <option value="">-- Not Chosen --</option>
                      {categoriesList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {validationErrors.category && (
                      <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.category}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="art-read-time" className="text-[13px] font-extrabold text-[#0f172a]">Read Time (mins)</label>
                      {form.readTime && <span className="text-[10px] text-slate-400 font-semibold">{form.readTime} min{Number(form.readTime) !== 1 ? 's' : ''}</span>}
                    </div>
                    <input
                      id="art-read-time"
                      type="number"
                      name="readTime"
                      min={1}
                      max={60}
                      value={form.readTime}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      className={`${fieldClass} ${validationErrors.readTime ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    <div className="text-[11px] text-[#94a3b8] mt-1 font-semibold">Enter a number between 1–60</div>
                    {validationErrors.readTime && (
                      <div className="text-[12px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <span>⚠️</span> {validationErrors.readTime}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-tags" className="text-[13px] font-extrabold text-[#0f172a]">Tags</label>
                    <span className={`text-[10px] font-semibold ${form.tags.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>{form.tags.length}/500</span>
                  </div>
                  <input
                    id="art-tags"
                    name="tags"
                    value={form.tags}
                    maxLength={500}
                    onChange={handleChange}
                    placeholder="e.g. Paid CEOs, Executive Pay, Salary Comparison"
                    className={`${fieldClass} ${validationErrors.tags ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  <div className="text-[11px] text-[#94a3b8] mt-1 font-semibold">Separate with commas. Maximum 30 tags, 2-50 characters per tag (letters, numbers, spaces, hyphens).</div>
                  {validationErrors.tags && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.tags}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL ASSETS */}
          {activeTab === 'visuals' && (
            <div className="flex flex-col gap-6 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#6366f1] tracking-wide uppercase">
                  <span>🖼️</span> Visual Assets
                </div>
                
                <div>
                  <label htmlFor="art-image-url" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Featured Image URL</label>
                  <input
                    id="art-image-url"
                    name="featuredImage"
                    value={form.featuredImage || ''}
                    onChange={handleChange}
                    placeholder="e.g. /images/articles/news.jpg"
                    className={`${fieldClass} ${validationErrors.featuredImage ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.featuredImage && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.featuredImage}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-image-alt" className="text-[13px] font-extrabold text-[#0f172a]">Image Alt Text</label>
                    <span className={`text-[10px] font-semibold ${form.imageAltText.length > 150 ? 'text-red-500' : 'text-slate-400'}`}>{form.imageAltText.length}/150</span>
                  </div>
                  <input
                    id="art-image-alt"
                    name="imageAltText"
                    value={form.imageAltText}
                    maxLength={150}
                    onChange={handleChange}
                    placeholder="Describe featured image visual context..."
                    className={`${fieldClass} ${validationErrors.imageAltText ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.imageAltText && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.imageAltText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO OPTIMIZATION */}
          {activeTab === 'seo' && (
            <div className="flex flex-col gap-6 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#6366f1] tracking-wide uppercase">
                  <span>🔍</span> SEO Search Configuration
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-seo-title" className="text-[13px] font-extrabold text-[#0f172a]">SEO Title</label>
                    <span className={`text-[10px] font-semibold ${form.seoTitle.length > 60 ? 'text-red-500' : form.seoTitle.length >= 50 ? 'text-emerald-500' : 'text-slate-400'}`}>{form.seoTitle.length}/60</span>
                  </div>
                  <input
                    id="art-seo-title"
                    name="seoTitle"
                    value={form.seoTitle}
                    maxLength={60}
                    onChange={handleChange}
                    placeholder="Optimal search list title (50–60 characters)"
                    className={`${fieldClass} ${validationErrors.seoTitle ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.seoTitle && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.seoTitle}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-seo-desc" className="text-[13px] font-extrabold text-[#0f172a]">SEO Meta Description</label>
                    <span className={`text-[10px] font-semibold ${form.seoMetaDescription.length > 160 ? 'text-red-500' : form.seoMetaDescription.length >= 140 ? 'text-emerald-500' : 'text-slate-400'}`}>{form.seoMetaDescription.length}/160</span>
                  </div>
                  <textarea
                    id="art-seo-desc"
                    name="seoMetaDescription"
                    value={form.seoMetaDescription}
                    maxLength={160}
                    onChange={handleChange}
                    placeholder="Search snippet summary (150–160 characters)..."
                    rows={3}
                    className={`${fieldClass} resize-none leading-relaxed ${validationErrors.seoMetaDescription ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.seoMetaDescription && (
                    <div className="text-[12px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.seoMetaDescription}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="art-seo-keywords" className="text-[13px] font-extrabold text-[#0f172a]">Keywords</label>
                    <span className={`text-[10px] font-semibold ${form.keywords.length > 250 ? 'text-red-500' : 'text-slate-400'}`}>{form.keywords.length}/250</span>
                  </div>
                  <input
                    id="art-seo-keywords"
                    name="keywords"
                    value={form.keywords}
                    maxLength={250}
                    onChange={handleChange}
                    placeholder="infrastructure, voting, political updates"
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar parameter configurations (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-[86px] h-fit self-start">
          
          {/* TAB 1: Publishing Settings */}
          {activeTab === 'write' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#6366f1] uppercase tracking-wide">
                <span>📅</span> PUBLISHING
              </div>

              <div>
                <label htmlFor="side-status" className="text-[12.5px] font-bold text-[#475569] mb-1.5 block">Status</label>
                <div className="relative flex items-center">
                  <span className={`w-2.5 h-2.5 rounded-full absolute left-4 z-10 ${
                    form.status === 'published' ? 'bg-emerald-500' : form.status === 'draft' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                  <select
                    id="side-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`${fieldClass} pl-9 font-bold ${validationErrors.status ? 'border-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="">-- None --</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                {validationErrors.status && (
                  <div className="text-[11px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {validationErrors.status}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="side-date" className="text-[12.5px] font-bold text-[#475569] mb-1.5 block">Publish Date</label>
                <input
                  id="side-date"
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`${fieldClass} ${validationErrors.date ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {validationErrors.date && (
                  <div className="text-[11px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {validationErrors.date}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="side-author" className="text-[12.5px] font-bold text-[#475569] mb-1.5 block">Author</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-[14px]">👤</span>
                  <select
                    id="side-author"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className={`${fieldClass} pl-10 ${validationErrors.author ? 'border-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="">-- Not Chosen --</option>
                    {authorsList.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                {validationErrors.author && (
                  <div className="text-[11px] text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {validationErrors.author}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="side-card-label" className="text-[12.5px] font-bold text-[#475569]">Card Label (Optional)</label>
                  <span className={`text-[10px] font-semibold ${form.cardLabel.length > 30 ? 'text-red-500' : 'text-slate-400'}`}>{form.cardLabel.length}/30</span>
                </div>
                <input
                  id="side-card-label"
                  name="cardLabel"
                  value={form.cardLabel}
                  maxLength={30}
                  onChange={handleChange}
                  placeholder="e.g. Breaking News"
                  className={fieldClass}
                />
                <div className="text-[11px] text-[#94a3b8] mt-1.5 font-semibold">This label appears on article cards</div>
              </div>
            </div>
          )}

          {/* TAB 2: Article Options */}
          {activeTab === 'meta' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#6366f1] uppercase tracking-wide">
                <span>⚙️</span> ARTICLE OPTIONS
              </div>

              {[
                { key: 'featuredArticle', label: 'Featured Article', desc: 'Show in featured section' },
                { key: 'editorsPick', label: "Editors' Pick", desc: 'Highlight as editors choice' },
                { key: 'breakingNews', label: 'Breaking News', desc: 'Mark as breaking news' },
              ].map((opt) => (
                <div key={opt.key} className="flex justify-between items-center py-1">
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">{opt.label}</div>
                    <div className="text-[10.5px] text-[#94a3b8] font-semibold mt-0.5">{opt.desc}</div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => toggleOption(opt.key as keyof typeof options)}
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative border-none cursor-pointer outline-none ${
                      options[opt.key as keyof typeof options] ? 'bg-[#6366f1]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 ease-in-out absolute left-1 top-1 shadow-sm ${
                        options[opt.key as keyof typeof options] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Media Upload Selector */}
          {activeTab === 'visuals' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-4 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#6366f1] uppercase tracking-wide">
                <span>🖼️</span> MEDIA UPLOAD
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
                    setValidationErrors(prev => ({ ...prev, featuredImage: 'File too large. Maximum allowed size is 5 MB.' }))
                    return
                  }
                  handleImageSelect(file)
                }}
              />

              {/* Uploading loader state */}
              {uploading && (
                <div className="border border-slate-200 rounded-xl p-8 text-center bg-slate-50 flex flex-col items-center justify-center gap-2">
                  <div className="animate-spin text-3xl">⏳</div>
                  <div className="text-[13px] text-slate-700 font-bold">Uploading file to server...</div>
                </div>
              )}

              {/* Existing file warning options state */}
              {!uploading && existingImageWarning && (
                <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/50 flex flex-col gap-3.5 border-dashed">
                  <div className="text-[13.5px] text-amber-800 font-semibold flex items-start gap-2">
                    <span className="text-[16px]">⚠️</span>
                    <div>
                      An image named <span className="font-extrabold text-amber-900">"{existingImageWarning.filename}"</span> already exists in the public images folder.
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={acceptExistingImage}
                      className="flex-1 text-white bg-amber-600 hover:bg-amber-700 font-bold p-2 px-3 rounded-lg text-[12px] cursor-pointer text-center transition-colors border-none"
                    >
                      Use Existing
                    </button>
                    <button
                      type="button"
                      onClick={forceUploadImage}
                      className="flex-1 text-amber-700 bg-white border border-amber-300 hover:bg-amber-100/50 font-bold p-2 px-3 rounded-lg text-[12px] cursor-pointer text-center transition-colors"
                    >
                      Replace / Overwrite
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExistingImageWarning(null)
                        setPendingUploadFile(null)
                      }}
                      className="text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold p-2 px-3 rounded-lg text-[12px] cursor-pointer text-center transition-colors border-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Default file selection or preview states */}
              {!uploading && !existingImageWarning && (
                <>
                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-[#6366f1] rounded-xl p-8 text-center cursor-pointer transition-all bg-white hover:bg-slate-50 select-none"
                    >
                      <div className="text-4xl mb-2">🖼️</div>
                      <div className="text-[13.5px] text-slate-800 font-bold">Click to Select Media File</div>
                      <div className="text-[11px] text-[#64748b] mt-1 font-medium">PNG, JPG, WebP, GIF · up to 5MB</div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {/* Image preview */}
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Selected featured image"
                          className="w-full max-h-52 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setForm(prev => ({ ...prev, featuredImage: '' }))
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 border border-red-200 rounded-lg px-2 py-1 text-[11px] font-bold shadow cursor-pointer transition-colors"
                        >
                          ✕ Remove
                        </button>
                      </div>
                      {/* Re-select button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[12px] text-[#6366f1] font-bold border border-[#6366f1]/30 hover:bg-[#6366f1]/5 rounded-lg py-2 transition-colors cursor-pointer bg-white"
                      >
                        🔄 Change Image
                      </button>
                    </div>
                  )}
                </>
              )}

              {validationErrors.featuredImage && (
                <div className="text-[12px] text-red-500 font-semibold flex items-center gap-1">
                  <span>⚠️</span> {validationErrors.featuredImage}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Search Snippet Preview */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-5 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#6366f1] uppercase tracking-wide">
                <span>🔍</span> SEARCH PREVIEW
              </div>
              <p className="text-[11px] text-slate-400 font-semibold -mt-3">
                Preview of how this article appears in Google Search results.
              </p>

              {/* Google SERP Container */}
              <div className="bg-white border border-[#dfe1e5] rounded-2xl p-5 shadow-[0_1px_6px_rgba(32,33,36,0.12)] overflow-hidden" style={{ fontFamily: 'arial, sans-serif' }}>

                {/* Site identity row: favicon + domain + breadcrumb */}
                <div className="flex items-center gap-2 mb-1 min-w-0">
                  {/* Favicon placeholder */}
                  <div className="w-[26px] h-[26px] rounded-full bg-[#f1f3f4] border border-[#dadce0] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imagePreview
                      ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      : <span style={{ fontSize: 12 }}>🌐</span>
                    }
                  </div>
                  <div className="flex flex-col leading-tight min-w-0 flex-1">
                    <span className="text-[14px] text-[#202124] font-medium truncate block">
                      {typeof window !== 'undefined' ? window.location.hostname : 'maisonatelier.com'}
                    </span>
                    <span className="text-[12px] text-[#4d5156] truncate block">
                      {typeof window !== 'undefined' ? window.location.hostname : 'maisonatelier.com'} › news › {(form.slug || 'article-slug').substring(0, 30)}{(form.slug || '').length > 30 ? '...' : ''}
                    </span>
                  </div>
                  {/* 3-dot menu */}
                  <div className="flex-shrink-0 text-[#70757a] text-[18px] leading-none pb-1 cursor-default select-none">⋮</div>
                </div>

                {/* Blue title link — hard truncated at 60 chars */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block text-[20px] leading-[1.3] font-normal mt-1"
                  style={{
                    color: '#1a0dab',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    maxWidth: '100%',
                  }}
                  title={form.seoTitle || form.title || ''}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {(() => {
                    const t = form.seoTitle || form.title || 'Untitled Article — Your Site Name'
                    return t.length > 60 ? t.substring(0, 57) + '…' : t
                  })()}
                </a>

                {/* Description — max 160 chars, clamped to 2 lines */}
                <p
                  className="text-[14px] mt-1 line-clamp-2"
                  style={{
                    color: '#4d5156',
                    lineHeight: '1.58',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    overflow: 'hidden',
                  }}
                >
                  {(() => {
                    const desc = form.seoMetaDescription || form.excerpt || ''
                    if (!desc) return <span style={{ color: '#70757a', fontStyle: 'italic' }}>Add a meta description to see how your snippet appears.</span>
                    return desc.length > 160 ? desc.substring(0, 157) + '…' : desc
                  })()}
                </p>

                {/* Sitelinks (optional sub-links row) */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['Home', 'News', form.category || 'Category'].map((link) => (
                    <a
                      key={link}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-[13px] border border-[#dadce0] rounded-lg px-3 py-1 hover:bg-[#f8f9fa] transition-colors"
                      style={{ color: '#1a0dab', textDecoration: 'none' }}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Character count helpers */}
              <div className="flex gap-4 text-[11px] font-semibold">
                <div className={`flex items-center gap-1 ${form.seoTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                  Title: {form.seoTitle.length}/60 chars
                </div>
                <div className={`flex items-center gap-1 ${form.seoMetaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                  Description: {form.seoMetaDescription.length}/160 chars
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Action Buttons */}
          <div 
            id="form-actions-bottom"
            className="bg-white rounded-2xl p-5.5 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-4"
          >
            {saved && (
              <div className="animate-[admin-scale-in_0.2s_ease_both] bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] rounded-xl p-2.5 px-4 text-[13px] font-extrabold shadow-sm text-center">
                ✓ News Article saved successfully
              </div>
            )}
            {saveError && (
              <div className="animate-[admin-scale-in_0.2s_ease_both] bg-[#fef2f2] text-red-600 border border-red-200 rounded-xl p-2.5 px-4 text-[13px] font-extrabold shadow-sm flex items-center justify-between gap-3">
                <span>⚠️ {saveError}</span>
                <button type="button" onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600 font-black text-[15px] cursor-pointer leading-none">✕</button>
              </div>
            )}
            <div className="flex items-center gap-3">
              {activeTab === 'write' ? (
                <button 
                  type="button" 
                  onClick={() => window.history.back()}
                  className="flex-1 p-2.5 px-4 border border-slate-200 bg-white text-slate-700 rounded-xl cursor-pointer text-center btn-3d-white font-bold text-[13px]"
                >
                  Cancel
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="flex-1 p-2.5 px-4 border border-slate-200 bg-white text-slate-700 rounded-xl cursor-pointer text-center btn-3d-white font-bold text-[13px]"
                >
                  Back
                </button>
              )}

              {activeTab !== 'seo' ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-extrabold p-2.5 px-4 rounded-xl text-[13px] cursor-pointer text-center flex items-center justify-center gap-1 btn-3d-indigo"
                >
                  Next Step ➔
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isDirty}
                  className={`flex-1 font-extrabold p-2.5 px-4 rounded-xl text-[13px] text-center border transition-all ${
                    isDirty
                      ? 'bg-[#6366f1] hover:bg-[#4f46e5] text-white border-transparent cursor-pointer btn-3d-indigo'
                      : 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-not-allowed opacity-60'
                  }`}
                >
                  Save & Publish
                </button>
              )}
            </div>
          </div>

        </div>

      </form>
    </div>
  )
}

export default function AddArticlePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#64748b]">Loading editor...</div>}>
      <NewArticleForm />
    </Suspense>
  )
}
