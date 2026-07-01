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
          { id: 'breaking-news', title: 'Breaking News Ticker', isVisible: true, categorySource: 'All', order: 0, limit: 5 },
          { id: 'date-section', title: 'Date & Info Header', isVisible: true, categorySource: 'All', order: 1, limit: 1 },
          { id: 'domain-header', title: 'Domain Logo Header', isVisible: true, categorySource: 'All', order: 2, limit: 1 },
          { id: 'category-nav', title: 'Categories Navigation', isVisible: true, categorySource: 'All', order: 3, limit: 1 },
          { id: 'first-hero', title: 'Main Hero Story', isVisible: true, categorySource: 'All', order: 4, limit: 5 },
          { id: 'us-politics', title: 'U.S. News & Politics', isVisible: true, categorySource: 'Politics', order: 5, limit: 4 },
          { id: 'finance-markets', title: 'Finance & Markets', isVisible: true, categorySource: 'Business', order: 6, limit: 4 },
          { id: 'opinion-column', title: 'Opinions & Perspectives', isVisible: true, categorySource: 'All', order: 7, limit: 3 },
          { id: 'technology-section', title: 'Tech Pulse', isVisible: true, categorySource: 'Technology', order: 8, limit: 4 },
          { id: 'trending-columns', title: 'Trending Columns', isVisible: true, categorySource: 'All', order: 9, limit: 5 },
          { id: 'world-affairs', title: 'World Affairs', isVisible: true, categorySource: 'World', order: 10, limit: 5 },
          { id: 'arts-marketing-pr', title: 'Culture & Press Spotlight', isVisible: true, categorySource: 'Entertainment,Sports', order: 11, limit: 6 },
          { id: 'latest-news', title: 'The Latest Chronicle Feed', isVisible: true, categorySource: 'All', order: 12, limit: 10 }
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
