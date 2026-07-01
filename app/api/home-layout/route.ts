import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { HomeLayoutModel } from '@/models/HomeLayout'

export async function GET() {
  try {
    await connectToDatabase()
    let layout = await HomeLayoutModel.findOne()
    
    // Fallback default structure if DB lookup returns null
    if (!layout) {
      const defaultLayout = {
        templateName: 'default',
        sections: [
          { id: 'breaking-news', title: 'Breaking News Ticker', isVisible: true, categorySource: 'All', order: 0, limit: 5, designStyle: 'ticker-banner', colorTheme: 'crimson', settings: { isScrolling: true, bgColor: '#dc2626', textColor: '#ffffff', customText: '' } },
          { id: 'date-section', title: 'Date & Info Header', isVisible: true, categorySource: 'All', order: 1, limit: 1, designStyle: 'default', colorTheme: 'zinc', settings: { bgColor: '#f8fafc', textColor: '#64748b' } },
          { id: 'domain-header', title: 'Domain Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1, designStyle: 'default', colorTheme: 'zinc', settings: { logoType: 'text', alignment: 'center', logoSize: '48px', taglineText: 'Truth, Clarity, and Perspective • Independent Journalism', taglineSize: '12px', taglineColor: '#71717a', bgColor: '#ffffff', logoColor: '#000000', logoImage: '' } },
          { id: 'category-nav', title: 'Categories Navigation', isVisible: true, categorySource: 'All', order: 3, limit: 1, designStyle: 'default', colorTheme: 'indigo', settings: { bgColor: '#ffffff', alignment: 'center', activeLinkDesign: 'underline', searchPlacement: 'right', searchPlaceholder: 'Search articles...', searchBorderColor: '#e4e4e7', searchBorderThickness: '1px' } },
          { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5, designStyle: 'hero-split', colorTheme: 'indigo', settings: {} },
          { id: 'us-politics', title: 'U.S. News & Politics', isVisible: true, categorySource: 'Politics', order: 5, limit: 4, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'finance-markets', title: 'Finance & Markets', isVisible: true, categorySource: 'Business', order: 6, limit: 4, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'opinion-column', title: 'Opinions & Perspectives', isVisible: true, categorySource: 'All', order: 7, limit: 3, designStyle: 'columns', colorTheme: 'zinc', settings: {} },
          { id: 'technology-section', title: 'Tech Pulse', isVisible: true, categorySource: 'Technology', order: 8, limit: 4, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'trending-columns', title: 'Trending Columns', isVisible: true, categorySource: 'All', order: 9, limit: 5, designStyle: 'list', colorTheme: 'indigo', settings: {} },
          { id: 'world-affairs', title: 'World Affairs', isVisible: true, categorySource: 'World', order: 10, limit: 5, designStyle: 'grid', colorTheme: 'indigo', settings: {} },
          { id: 'arts-marketing-pr', title: 'Culture & Press Spotlight', isVisible: true, categorySource: 'Entertainment,Sports', order: 11, limit: 6, designStyle: 'spotlight-grid', colorTheme: 'indigo', settings: {} },
          { id: 'latest-news', title: 'The Latest Chronicle Feed', isVisible: true, categorySource: 'All', order: 12, limit: 10, designStyle: 'list', colorTheme: 'indigo', settings: {} }
        ]
      }
      layout = await HomeLayoutModel.create(defaultLayout)
    }

    return NextResponse.json(layout)
  } catch (err: any) {
    console.error('Fetch home layout error:', err)
    return NextResponse.json({ error: 'Failed to fetch home layout settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase()
    const { templateName, sections } = await req.json()

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: 'Sections array is required' }, { status: 400 })
    }

    let layout = await HomeLayoutModel.findOne()
    if (!layout) {
      layout = new HomeLayoutModel()
    }

    layout.templateName = templateName || 'custom'
    layout.sections = sections

    await layout.save()
    return NextResponse.json(layout)
  } catch (err: any) {
    console.error('Update home layout error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update home layout' }, { status: 500 })
  }
}
