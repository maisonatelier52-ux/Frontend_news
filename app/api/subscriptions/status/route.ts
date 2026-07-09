import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { SubscriptionModel } from '@/models/Subscription';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_news_admin_jwt_key_2026_change_me_in_production';

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Check subscriber session cookie
    const subscriberSession = cookieStore.get('subscriber_session');
    if (subscriberSession && subscriberSession.value) {
      try {
        const decoded = jwt.verify(subscriberSession.value, JWT_SECRET) as any;
        if (decoded && decoded.email) {
          await connectToDatabase();
          
          // Verify with database to check if the subscription was updated or deleted
          const subscription = await SubscriptionModel.findOne({ 
            email: decoded.email.toLowerCase() 
          });

          if (subscription && subscription.status === 'accepted') {
            const response = NextResponse.json({ isSubscribed: true, email: decoded.email });
            response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
            return response;
          } else {
            // Subscription deleted or not accepted anymore, clear the cookie
            const response = NextResponse.json({ isSubscribed: false });
            response.cookies.set('subscriber_session', '', { maxAge: 0, path: '/' });
            response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
            return response;
          }
        }
      } catch (jwtError) {
        // invalid jwt, clear the cookie
        const response = NextResponse.json({ isSubscribed: false });
        response.cookies.set('subscriber_session', '', { maxAge: 0, path: '/' });
        response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        return response;
      }
    }

    const response = NextResponse.json({ isSubscribed: false });
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('Check subscription status error:', error);
    const response = NextResponse.json({ isSubscribed: false, error: 'Internal server error' }, { status: 500 });
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  }
}
