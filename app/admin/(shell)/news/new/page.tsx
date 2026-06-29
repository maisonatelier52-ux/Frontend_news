'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type BlockType = 'paragraph' | 'subheading' | 'pullquote' | 'image' | 'at-glance' | 'faq'

interface Block {
  id: string
  type: BlockType
  value: any
}

type TabType = 'write' | 'meta' | 'visuals' | 'seo'

function NewArticleForm() {
  const searchParams = useSearchParams()
  const articleId = searchParams.get('id')

  const [activeTab, setActiveTab] = useState<TabType>('write')

  // Form Fields State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Politics',
    author: 'Sarah Johnson',
    newsType: 'featured',
    date: '',
    readTime: '5 mins',
    status: 'draft',
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
    { id: 'initial-1', type: 'paragraph', value: 'Start writing your news article here...' }
  ])

  const [saved, setSaved] = useState(false)

  // Set default date client side
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      date: prev.date || new Date().toISOString().substring(0, 16)
    }))
  }, [])

  // If editing an existing article, pre-populate with mock data
  useEffect(() => {
    if (articleId) {
      setForm({
        title: 'US Senate Passes Major Infrastructure Bill',
        slug: 'us-senate-passes-major-infrastructure-bill',
        category: 'Politics',
        author: 'Sarah Johnson',
        newsType: 'featured',
        date: '2026-06-29T14:30',
        readTime: '6 mins',
        status: 'published',
        seoTitle: 'Senate Passes Major Infrastructure Bill | NewsAdmin',
        seoMetaDescription: 'The Senate has passed a historic bipartisan infrastructure bill allocating billions of dollars to roads, bridges, and public transport.',
        keywords: 'senate, bill, infrastructure, transport',
        tags: 'politics, senate, infrastructure',
        excerpt: 'A historic bipartisan bill focusing on transport, broadband, and clean energy passes the Senate.',
        featuredImage: '/article-placeholder.jpg',
        imageAltText: 'Senate house chambers voting',
        featuredVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        cardLabel: 'Breaking News',
      })
      setOptions({
        featuredArticle: true,
        editorsPick: true,
        breakingNews: true,
        allowComments: true,
      })
      setBlocks([
        { id: 'edit-1', type: 'subheading', value: 'A Historic Bipartisan Milestone' },
        { id: 'edit-2', type: 'paragraph', value: 'Following months of intensive negotiations, the United States Senate today passed the highly anticipated $1.2 trillion bipartisan infrastructure bill. The legislation aims to reconstruct national transport networks, extend high-speed broadband connections, and modernize public utilities.' },
        { id: 'edit-3', type: 'pullquote', value: { quote: 'This is a monumental victory for the American people, delivering on promises that have been delayed for decades.', author: 'Senator Robert Vance' } },
        { id: 'edit-4', type: 'at-glance', value: {
          title: 'At a Glance',
          subtitle: 'Key investments inside the bill',
          rows: [
            { label: 'Transport Networks', value: '$110 Billion for roads, bridges, and major projects' },
            { label: 'Broadband Expansion', value: '$65 Billion to supply high-speed internet nationwide' },
            { label: 'Clean Water Infrastructure', value: '$55 Billion for clean water systems and lead pipe replacement' }
          ]
        }},
        { id: 'edit-5', type: 'paragraph', value: 'Supporters emphasize that the investments will stimulate job creation and economic growth over the coming decade. Critics, however, cite concerns regarding the overall budget allocation and national debt trajectory.' },
        { id: 'edit-6', type: 'faq', value: {
          title: 'Frequently asked questions',
          items: [
            { question: 'When will the investments take effect?', answer: 'Funds will begin distribution to state departments starting next fiscal quarter, with primary project approvals starting within six months.' },
            { question: 'How is this bill funded?', answer: 'The bill utilizes unspent emergency relief funds, repurposed federal assets, and targeted corporate tax adjustments.' }
          ]
        }}
      ])
    }
  }, [articleId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') } : {}),
    }))
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
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, value: newValue } : b))
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

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    const bottomContainer = document.getElementById('form-actions-bottom')
    if (bottomContainer) {
      bottomContainer.scrollIntoView({ behavior: 'smooth' })
    }
    setTimeout(() => setSaved(false), 4000)
  }

  function handleNext() {
    if (activeTab === 'write') setActiveTab('meta')
    else if (activeTab === 'meta') setActiveTab('visuals')
    else if (activeTab === 'visuals') setActiveTab('seo')
  }

  function handleBack() {
    if (activeTab === 'seo') setActiveTab('visuals')
    else if (activeTab === 'visuals') setActiveTab('meta')
    else if (activeTab === 'meta') setActiveTab('write')
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
            onClick={() => setActiveTab(tab.id as TabType)}
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
                    className={fieldClass}
                  />
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
                      className={`${fieldClass} pl-10`}
                    />
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-1.5 font-semibold">Example: breaking-news-headline-2025</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="art-excerpt" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Excerpt (Short Description)</label>
                    <div className="text-[11.5px] text-[#64748b] mb-2 font-medium">Brief summary for listings and SEO</div>
                    <textarea
                      id="art-excerpt"
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      placeholder="Write a short summary of your article..."
                      rows={3}
                      className={`${fieldClass} resize-none leading-relaxed`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="art-video" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Featured Video URL (Optional)</label>
                    <div className="text-[11.5px] text-[#64748b] mb-2 font-medium">Add YouTube or Vimeo link</div>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 text-[14px]">▶</span>
                      <input
                        id="art-video"
                        name="featuredVideoUrl"
                        value={form.featuredVideoUrl}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className={`${fieldClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card - Content Block Editor */}
              <div className="bg-white rounded-2xl p-6.5 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-4">
                <div className="text-[13px] font-extrabold text-[#0f172a] block">Content *</div>
                <div className="text-[11.5px] text-[#64748b] -mt-2.5 mb-2 font-medium">Write your article content</div>

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
                      {block.type === 'paragraph' && (
                        <textarea
                          value={block.value}
                          rows={4}
                          onChange={(e) => updateBlockValue(block.id, e.target.value)}
                          placeholder="Write paragraph content here..."
                          className="w-full border border-slate-200 bg-white text-[#0f172a] rounded-lg p-2.5 px-3.5 text-[13.5px] outline-none placeholder-slate-400 input-3d"
                        />
                      )}

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
                      className={fieldClass}
                    >
                      {['Politics', 'Technology', 'Business', 'World', 'Sports', 'Entertainment', 'Science', 'Health'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="art-read-time" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Read Time</label>
                    <input
                      id="art-read-time"
                      type="text"
                      name="readTime"
                      value={form.readTime}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="art-tags" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Tags</label>
                  <input
                    id="art-tags"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. senate, updates, voting"
                    className={fieldClass}
                  />
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
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="art-image-alt" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Image Alt Text</label>
                  <input
                    id="art-image-alt"
                    name="imageAltText"
                    value={form.imageAltText}
                    onChange={handleChange}
                    placeholder="Describe featured image visual context..."
                    className={fieldClass}
                  />
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
                  <label htmlFor="art-seo-title" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">SEO Title</label>
                  <input
                    id="art-seo-title"
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    placeholder="Optimal search list title (50-60 characters)"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="art-seo-desc" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">SEO Meta Description</label>
                  <textarea
                    id="art-seo-desc"
                    name="seoMetaDescription"
                    value={form.seoMetaDescription}
                    onChange={handleChange}
                    placeholder="Search snippet summary details (150-160 characters)..."
                    rows={3}
                    className={`${fieldClass} resize-none leading-relaxed`}
                  />
                </div>

                <div>
                  <label htmlFor="art-seo-keywords" className="text-[13px] font-extrabold text-[#0f172a] mb-1.5 block">Keywords</label>
                  <input
                    id="art-seo-keywords"
                    name="keywords"
                    value={form.keywords}
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
                    form.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <select
                    id="side-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`${fieldClass} pl-9 font-bold`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="side-date" className="text-[12.5px] font-bold text-[#475569] mb-1.5 block">Publish Date</label>
                <input
                  id="side-date"
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={fieldClass}
                />
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
                    className={`${fieldClass} pl-10`}
                  >
                    {['Sarah Johnson', 'Michael Chen', 'Emily Davis', 'James Wilson', 'Lisa Park'].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="side-card-label" className="text-[12.5px] font-bold text-[#475569] mb-1.5 block">Card Label (Optional)</label>
                <input
                  id="side-card-label"
                  name="cardLabel"
                  value={form.cardLabel}
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
                { key: 'allowComments', label: 'Allow Comments', desc: 'Enable reader comments' },
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
              <div className="border-2 border-dashed border-slate-200 hover:border-[#6366f1] rounded-xl p-6 text-center cursor-pointer transition-all bg-white shadow-sm hover:bg-slate-50 btn-3d-white">
                <div className="text-3xl mb-1.5 font-sans">🖼️</div>
                <div className="text-[13.5px] text-slate-800 font-bold">Select Media File</div>
                <div className="text-[11px] text-[#64748b] mt-0.5 font-medium">PNG, JPG, WebP up to 5MB</div>
              </div>
            </div>
          )}

          {/* TAB 4: Search Snippet Preview */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.015)] flex flex-col gap-4 animate-[admin-fade-in_0.25s_ease_both]">
              <div className="flex items-center gap-2 text-[13.5px] font-extrabold text-[#6366f1] uppercase tracking-wide">
                <span>🔍</span> SEARCH PREVIEW
              </div>
              <p className="text-[11px] text-slate-400 font-semibold -mt-2.5">
                Here is a preview of how this article looks in Google Search results.
              </p>
              
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex flex-col gap-1.5 shadow-[inset_0_1px_2.5px_rgba(0,0,0,0.02)]">
                <div className="text-[11.5px] text-slate-600 flex items-center gap-1.5 font-medium truncate">
                  <span>news.com</span>
                  <span className="text-[9px] text-slate-400">➔</span>
                  <span className="text-slate-400 truncate">news</span>
                  <span className="text-[9px] text-slate-400">➔</span>
                  <span className="text-slate-500 font-semibold truncate">{form.slug || 'slug-url'}</span>
                </div>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-[17px] text-[#1a0dab] hover:underline font-medium leading-tight truncate block">
                  {form.seoTitle || form.title || 'Untitled Article'}
                </a>
                <p className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-3">
                  {form.seoMetaDescription || form.excerpt || 'Write an SEO description to see how your article appears.'}
                </p>
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
                  className="flex-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-extrabold p-2.5 px-4 rounded-xl text-[13px] cursor-pointer text-center btn-3d-indigo"
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
