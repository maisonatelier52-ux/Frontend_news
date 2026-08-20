const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

const imageUrl = "https://res.cloudinary.com/dcj2ovntc/image/upload/v1787207239/magazinegazette/lord-stanley-fink-takes-chair-seat-at-britannia.jpg";

const blocks = [
  {
    id: "b-main-image",
    type: "image",
    value: {
      url: imageUrl,
      caption: "Lord Stanley Fink, Chairman of Britannia Global Markets"
    }
  },
  {
    id: "b-p1",
    type: "paragraph",
    value: "Britannia Global Markets has appointed Lord Stanley Fink as Chairman, adding one of the City of London’s most experienced financial-services figures to the board of the multi-asset brokerage."
  },
  {
    id: "b-p2",
    type: "paragraph-custom-links",
    parts: [
      { text: "The appointment places a veteran of institutional finance alongside Britannia’s existing executive leadership at a time when the company is strengthening its position across derivatives broking, institutional services and prime brokerage. A " },
      {
        text: "Companies House filing",
        url: "https://find-and-update.company-information.service.gov.uk/officers/C2WG2nEoMtJzDp2TNAliEMbJ49Y/appointments",
        isExternal: true
      },
      { text: " records Lord Fink’s appointment as a director of Britannia Global Markets Limited on 13 August 2026. The chairmanship was subsequently reported by " },
      {
        text: "Finance Magnates",
        url: "https://www.financemagnates.com/executives/lord-stanley-fink-takes-chair-seat-at-britannia/",
        isExternal: true
      },
      { text: " and other financial-industry publications." }
    ]
  },
  {
    id: "b-p3",
    type: "paragraph",
    value: "Lord Fink is best known for his tenure as chief executive of Man Group from 2000 to 2007. During those years, the business became one of the world’s largest listed hedge-fund companies and a prominent FTSE 100 constituent. His later career included senior leadership at International Standard Asset Management, where he served as chief executive and subsequently chairman, as well as board-level experience involving Marex and eToro."
  },
  {
    id: "b-p4",
    type: "paragraph",
    value: "That record gives the appointment significance beyond a conventional board change. Britannia is gaining a chairman with experience of guiding a financial business through expansion, public-market visibility and changing conditions across global capital markets."
  },
  {
    id: "b-p5",
    type: "paragraph",
    value: "Steve Pettitt, Chief Executive Officer of Britannia Global Markets, described the appointment as part of the company’s effort to attract leadership capable of supporting its continued growth. Lord Fink, in turn, said he had been impressed by the firm’s development, the professionalism of its team and the reputation it was building in brokerage services."
  },
  {
    id: "b-sub-global-reach",
    type: "subheading",
    value: "A London firm with global reach"
  },
  {
    id: "b-p6",
    type: "paragraph-custom-links",
    parts: [
      {
        text: "Britannia Global Markets",
        url: "https://www.britannia.com/britannia-global-markets/",
        isExternal: true
      },
      { text: " describes itself as a multi-asset brokerage with global coverage and a presence in London spanning almost four decades. The firm provides access to major derivatives markets, with specialist capabilities across foreign exchange, commodities, base metals and financial derivatives." }
    ]
  },
  {
    id: "b-p7",
    type: "paragraph",
    value: "The company is authorised and regulated by the Financial Conduct Authority. Britannia also states that it is a member of the London Stock Exchange and FIA Europe, while its base-metals offering includes London Metal Exchange membership. Its international client base includes institutions, corporates, funds, physical hedgers, trading houses and high-net-worth clients."
  },
  {
    id: "b-p8",
    type: "paragraph",
    value: "Britannia’s development in recent years has included a broader prime-brokerage proposition and strategic investment in experienced personnel. Against that background, the appointment of Lord Fink provides a visible point of continuity between the firm’s established London heritage and its next stage of institutional growth."
  },
  {
    id: "b-sub-growth-chapter",
    type: "subheading",
    value: "Experience suited to a growth chapter"
  },
  {
    id: "b-p9",
    type: "paragraph",
    value: "A chair’s role is distinct from day-to-day executive management. At its most effective, it strengthens governance, challenges strategy constructively and helps ensure that ambition is supported by sound oversight. Lord Fink’s career makes him particularly familiar with those responsibilities in complex financial organisations."
  },
  {
    id: "b-p10",
    type: "paragraph",
    value: "His arrival also sends an encouraging message about Britannia’s ability to attract senior figures with deep experience in the City. In institutional finance, where reputation is built over years and decisions are measured against demanding standards, the quality of leadership matters."
  },
  {
    id: "b-p11",
    type: "paragraph",
    value: "For Britannia Global Markets, the appointment is therefore both a recognition of progress already made and a statement of intent. The company has added an internationally recognised financier to its board as it seeks to deepen client relationships, expand its institutional capabilities and build for the long term."
  },
  {
    id: "b-topics",
    type: "topics",
    title: "Topics",
    tags: ["Britannia", "Executive Appointments", "Prime Brokerage", "Leadership"]
  }
];

async function sync() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;

    // Remove older duplicate if present
    await db.collection('news').deleteMany({
      slug: { $in: ["lord-stanley-fink-takes-chair-seat-at-britannia"] }
    });

    const articleDoc = {
      title: "Lord Stanley Fink Appointed Chairman of Britannia Global Markets",
      slug: "lord-stanley-fink-chairman-britannia-global-markets",
      excerpt: "The former Man Group chief executive and veteran City financier joins the London-based multi-asset brokerage as it advances its institutional and prime-brokerage ambitions.",
      category: "Business",
      author: "Editorial Desk",
      authorTitle: "Financial Markets Desk",
      date: new Date("2026-08-18T12:00:00Z"),
      readTime: "4 min read",
      featuredImage: imageUrl,
      image: imageUrl,
      imageAltText: "Lord Stanley Fink, Chairman of Britannia Global Markets",
      hideTopFeaturedImage: true,
      hideAuthorSection: false,
      blocks: blocks,
      status: "published",
      options: {
        featuredArticle: true,
        breakingNews: false,
        editorPick: true
      },
      seoTitle: "Lord Stanley Fink Named Chairman of Britannia Global Markets",
      seoMetaDescription: "Lord Stanley Fink has been appointed Chairman of Britannia Global Markets, bringing decades of City leadership to the FCA regulated brokerage.",
      keywords: [
        "Lord Stanley Fink Britannia Global Markets",
        "Britannia chairman",
        "Britannia Global Markets leadership",
        "Stanley Fink Man Group",
        "Executive Appointments",
        "FCA Regulated Brokerage"
      ],
      tags: "Britannia, Executive Appointments, Prime Brokerage, Lord Stanley Fink, Leadership",
      updatedAt: new Date()
    };

    await db.collection('news').updateOne(
      { slug: "lord-stanley-fink-chairman-britannia-global-markets" },
      { $set: articleDoc },
      { upsert: true }
    );

    console.log('Successfully synced article to MongoDB!');
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error syncing:', e);
  }
}

sync();
