import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { NewsModel } from '@/models/News';
import { CategoryModel } from '@/models/Category';
import { AuthorModel } from '@/models/Author';
import { CommentModel } from '@/models/Comment';
import { SubscriptionModel } from '@/models/Subscription';
import { SiteSettingsModel } from '@/models/SiteSettings';
import { AdvertisementModel } from '@/models/Advertisement';
import { VisitorLogModel } from '@/models/VisitorLog';
import { SystemLogModel } from '@/models/SystemLog';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    ensureBackupDir();
    const files = fs.readdirSync(BACKUP_DIR);
    
    const backups = files
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const filePath = path.join(BACKUP_DIR, f);
        const stats = fs.statSync(filePath);
        return {
          filename: f,
          size: stats.size,
          createdAt: stats.birthtime
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(backups);
  } catch (err: any) {
    console.error('List backups error:', err);
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    ensureBackupDir();
    const body = await req.json();
    const { action, filename } = body;

    if (action === 'backup') {
      const dbData = {
        news: await NewsModel.find(),
        categories: await CategoryModel.find(),
        authors: await AuthorModel.find(),
        comments: await CommentModel.find(),
        subscriptions: await SubscriptionModel.find(),
        settings: await SiteSettingsModel.find(),
        advertisements: await AdvertisementModel.find(),
        visitorLogs: await VisitorLogModel.find(),
        systemLogs: await SystemLogModel.find()
      };

      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const name = `backup-${dateStr}.json`;
      const filePath = path.join(BACKUP_DIR, name);
      
      fs.writeFileSync(filePath, JSON.stringify(dbData, null, 2), 'utf-8');

      // Create a system log
      await SystemLogModel.create({
        type: 'activity',
        action: 'BACKUP_CREATE',
        details: { filename: name },
        user: 'System'
      });

      return NextResponse.json({ success: true, filename: name });
    }

    if (action === 'restore') {
      if (!filename) {
        return NextResponse.json({ error: 'Filename is required for restore' }, { status: 400 });
      }

      const filePath = path.join(BACKUP_DIR, filename);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
      }

      const dataStr = fs.readFileSync(filePath, 'utf-8');
      const dbData = JSON.parse(dataStr);

      // Restore collections
      if (dbData.news) {
        await NewsModel.deleteMany({});
        await NewsModel.insertMany(dbData.news);
      }
      if (dbData.categories) {
        await CategoryModel.deleteMany({});
        await CategoryModel.insertMany(dbData.categories);
      }
      if (dbData.authors) {
        await AuthorModel.deleteMany({});
        await AuthorModel.insertMany(dbData.authors);
      }
      if (dbData.comments) {
        await CommentModel.deleteMany({});
        await CommentModel.insertMany(dbData.comments);
      }
      if (dbData.subscriptions) {
        await SubscriptionModel.deleteMany({});
        await SubscriptionModel.insertMany(dbData.subscriptions);
      }
      if (dbData.settings) {
        await SiteSettingsModel.deleteMany({});
        await SiteSettingsModel.insertMany(dbData.settings);
      }
      if (dbData.advertisements) {
        await AdvertisementModel.deleteMany({});
        await AdvertisementModel.insertMany(dbData.advertisements);
      }
      if (dbData.visitorLogs) {
        await VisitorLogModel.deleteMany({});
        await VisitorLogModel.insertMany(dbData.visitorLogs);
      }
      if (dbData.systemLogs) {
        await SystemLogModel.deleteMany({});
        await SystemLogModel.insertMany(dbData.systemLogs);
      }

      // Create a system log
      await SystemLogModel.create({
        type: 'security',
        action: 'DATABASE_RESTORE',
        details: { filename },
        user: 'System'
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Backup/Restore operation error:', err);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}
