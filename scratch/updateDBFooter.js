const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0";

const defaultFooter = {
  logoText: 'The Domain Name',
  description: 'An independent, employee-owned publication covering national policy, international affairs, global markets, technology, and arts. Headquartered in Washington, D.C.',
  copyright: '© 2026 The Domain Name. All rights reserved.',
  bgColor: '#09090b',
  textColorPrimary: '#ffffff',
  textColorSecondary: '#a1a1aa',
  paddingY: '40px',
  borderTopColor: '#27272a',
  columns: [
    {
      id: 1,
      heading: 'Categories',
      isVisible: true,
      links: [
        { id: 1, label: 'U.S. News & Politics', url: '/Politics', isVisible: true },
        { id: 2, label: 'Technology & Science', url: '/Technology', isVisible: true },
        { id: 3, label: 'Marketing & Strategy', url: '/Business', isVisible: true }
      ]
    },
    {
      id: 2,
      heading: '',
      isVisible: true,
      links: [
        { id: 1, label: 'Finance & Markets', url: '/Business', isVisible: true },
        { id: 2, label: 'World Affairs', url: '/World', isVisible: true },
        { id: 3, label: 'Arts & Entertainment', url: '/Entertainment', isVisible: true }
      ]
    },
    {
      id: 3,
      heading: 'Other Sections',
      isVisible: true,
      links: [
        { id: 1, label: 'About Us', url: '/about', isVisible: true },
        { id: 2, label: 'Contact Us', url: '/contact', isVisible: true },
        { id: 3, label: 'Our Team', url: '/our-team', isVisible: true },
        { id: 4, label: 'Privacy Policy', url: '/privacy', isVisible: true },
        { id: 5, label: 'Terms & Conditions', url: '/terms', isVisible: true },
        { id: 6, label: 'Correction Policy', url: '/correction-policy', isVisible: true }
      ]
    },
    {
      id: 4,
      heading: '',
      isVisible: true,
      links: [
        { id: 1, label: 'Source Methodology', url: '/source-methodology', isVisible: true },
        { id: 2, label: 'Advertising & Sponsored Policy', url: '/advertising-policy', isVisible: true },
        { id: 3, label: 'Ownership & Funding', url: '/ownership-funding', isVisible: true },
        { id: 4, label: 'Right of Reply Policy', url: '/right-of-reply-policy', isVisible: true },
        { id: 5, label: 'Legal Policy', url: '/legal-policy', isVisible: true }
      ]
    }
  ]
};

async function run() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log("Connected successfully!");

    const db = mongoose.connection.db;
    const settingsCol = db.collection('site_settings');
    
    console.log("Updating site settings footer data...");
    const result = await settingsCol.updateOne(
      { key: 'site_settings' },
      { $set: { footer: defaultFooter } },
      { upsert: true }
    );
    console.log("Update result:", result);

  } catch (err) {
    console.error("Error encountered:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from Database.");
  }
}

run();
