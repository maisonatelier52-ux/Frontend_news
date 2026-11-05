const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Read env
const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const mongoMatch = env.match(/MONGODB_URI=(.*)/);
const cloudNameMatch = env.match(/NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=(.*)/);
const apiKeyMatch = env.match(/CLOUDINARY_API_KEY=(.*)/);
const apiSecretMatch = env.match(/CLOUDINARY_API_SECRET=(.*)/);

const uri = mongoMatch ? mongoMatch[1].trim() : '';
const cloudName = cloudNameMatch ? cloudNameMatch[1].trim() : '';
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';
const apiSecret = apiSecretMatch ? apiSecretMatch[1].trim() : '';

const imagePath = path.join(__dirname, '../public/images/trump-admin-social-media-election-inflammatory-posts.jpg');

// Upload to Cloudinary via REST API
async function uploadToCloudinary(filePath, publicId) {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, {
      folder: 'magazinegazette',
      public_id: publicId,
      overwrite: true,
      resource_type: 'image'
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

async function run() {
  console.log('Uploading image to Cloudinary...');
  const imgPublicId = 'trump-admin-social-media-election-inflammatory-posts';
  let imageUrl = '';

  try {
    const result = await uploadToCloudinary(imagePath, imgPublicId);
    imageUrl = result.secure_url;
    console.log('✅ Image uploaded to Cloudinary:', imageUrl);
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    // Fallback to local path
    imageUrl = '/images/trump-admin-social-media-election-inflammatory-posts.jpg';
    console.log('Using local image path as fallback.');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));

  const slug = 'trump-admin-social-media-posts-election-criticized-inflammatory';

  // Check for duplicate
  const existing = await News.findOne({ slug });
  if (existing) {
    console.log('⚠️  Article already exists with slug:', slug);
    await mongoose.disconnect();
    return;
  }

  const now = new Date();
  const dateStr = 'Nov. 05, 2026';

  const article = {
    title: "Trump Administration's Social Media Posts Ahead of Elections Criticized for Being Inflammatory",
    slug,
    category: 'politics',
    author: 'Staff Reporter',
    readTime: '6 mins',
    status: 'published',
    date: now,
    excerpt: "Critics and watchdog groups have raised alarm over a series of social media posts by Trump administration officials in the lead-up to elections, calling the messaging divisive, misleading, and an abuse of government platforms to influence voters.",
    featuredImage: imageUrl,
    imageAltText: "Trump administration official speaking at a press briefing ahead of elections",
    featuredVideoUrl: '',
    cardLabel: 'Politics',
    options: {
      featuredArticle: false,
      editorsPick: false,
      breakingNews: true,
      allowComments: true
    },
    blocks: [
      {
        id: 'b-p1',
        type: 'paragraph',
        value: "In the weeks and days leading up to the November elections, a wave of social media posts from Trump administration officials and affiliated government accounts has sparked intense criticism from political analysts, civil society organizations, and opposition lawmakers. Critics argue that the content — ranging from unverified claims about voter fraud to pointed attacks on Democratic candidates — crosses ethical and legal lines separating government communication from partisan electioneering."
      },
      {
        id: 'b-h2',
        type: 'subheading',
        value: 'A Pattern of Divisive Messaging'
      },
      {
        id: 'b-p2',
        type: 'paragraph',
        value: "Watchdog groups tracking social media activity from federal officials say the administration has ramped up the frequency and intensity of its posts in the final stretch before Election Day. Posts shared on platforms including X (formerly Twitter), Truth Social, and Facebook have included unsubstantiated allegations of ballot-rigging, fear-based rhetoric targeting immigrant communities, and direct calls to action urging supporters to 'fight back' against what officials described as a 'rigged system.' Experts in election law say some of these posts may violate the Hatch Act, which restricts federal employees from engaging in partisan political activity while on duty or using government resources."
      },
      {
        id: 'b-h3',
        type: 'subheading',
        value: 'Opposition and Civic Groups Sound the Alarm'
      },
      {
        id: 'b-p3',
        type: 'paragraph',
        value: "Democratic leaders and several nonpartisan civic organizations have formally called on the Office of Special Counsel (OSC) to investigate the posts and hold officials accountable. Senate Minority Leader and House Democrats issued a joint statement condemning the messaging as 'deliberate attempts to stoke fear, undermine confidence in democratic institutions, and suppress voter participation through intimidation.' The American Civil Liberties Union (ACLU) separately warned that certain posts could have a chilling effect on minority voters who already face systemic barriers to civic participation."
      },
      {
        id: 'b-h4',
        type: 'subheading',
        value: "Administration Defends Posts as 'Protected Political Speech'"
      },
      {
        id: 'b-p4',
        type: 'paragraph',
        value: "White House communications staff pushed back against the criticism, defending the social media activity as lawful political expression protected under the First Amendment. Spokespersons argued that the posts reflected the administration's duty to inform Americans about alleged threats to election integrity and that characterizing factual concerns as 'inflammatory' was itself a form of political bias. The administration maintained that all officials were acting within their personal capacities and not in their official government roles when making such posts — a distinction critics have rejected as thin and implausible given the use of verified government-affiliated accounts."
      },
      {
        id: 'b-h5',
        type: 'subheading',
        value: 'Election Experts Warn of Real-World Consequences'
      },
      {
        id: 'b-p5',
        type: 'paragraph',
        value: "Political scientists and election security researchers have warned that inflammatory rhetoric from high-profile government officials carries disproportionate weight compared to ordinary partisan speech. Studies have shown that statements from authority figures can amplify misinformation rapidly, discourage voter turnout, and in some cases inspire confrontation at polling places. Election administrators in several battleground states have already reported increased threats and harassment in what officials say is a climate of heightened tension. Security protocols at key polling locations have been elevated in response to credible threat reports."
      },
      {
        id: 'b-h6',
        type: 'subheading',
        value: 'Social Media Platforms Face Pressure to Act'
      },
      {
        id: 'b-p6',
        type: 'paragraph',
        value: "Major social media platforms are under renewed scrutiny over their handling of inflammatory election-related content from public officials. Under Elon Musk's ownership, X has significantly relaxed its content moderation policies, allowing posts that previously would have been labeled or removed to remain visible. Meta has similarly faced criticism for inconsistent enforcement of its election integrity policies. Digital rights advocates argue that platforms bear a responsibility to apply their community standards uniformly regardless of a user's political affiliation or government status. As of publication, several posts from administration-affiliated accounts remained live and had accumulated millions of views and thousands of reshares."
      },
      {
        id: 'b-h7',
        type: 'subheading',
        value: 'Historical Context: Social Media and American Elections'
      },
      {
        id: 'b-p7',
        type: 'paragraph',
        value: "The controversy is not without precedent. The Trump administration faced similar criticism during the 2020 election cycle, when officials used social media aggressively to cast doubt on mail-in voting and promote unverified claims of electoral fraud. Those efforts culminated in the events of January 6, 2021, which many analysts directly tied to the sustained online misinformation campaign. The current pre-election period has reignited fears that history may repeat itself, with critics urging federal agencies, the courts, and civil society to draw clearer boundaries around the use of digital platforms in electoral politics."
      },
      {
        id: 'b-h8',
        type: 'subheading',
        value: 'Calls for Greater Accountability'
      },
      {
        id: 'b-p8',
        type: 'paragraph',
        value: "Legal scholars and former government ethics officials have called for a comprehensive review of how the Hatch Act and related statutes are applied in the digital age. Many note that existing rules were written before social media existed and have struggled to keep pace with the speed and reach of modern political communication. Proposals include clearer guidelines on what constitutes partisan political activity online, mandatory disclosures when government officials use personal accounts to discuss election-related matters, and stronger enforcement mechanisms for violations. As Election Day approaches, the debate over the administration's social media conduct underscores deeper tensions between free speech, government accountability, and the health of American democracy."
      },
      {
        id: 'b-topics',
        type: 'topics',
        value: ['Trump Administration', 'Social Media', 'Elections', 'Politics', 'Hatch Act', 'Election Integrity']
      }
    ],
    seoTitle: "Trump Administration Social Media Posts Ahead of Elections Criticized for Being Inflammatory",
    seoMetaDescription: "Critics and watchdog groups raise alarm over Trump administration social media posts before elections, citing divisive rhetoric, Hatch Act concerns, and threats to election integrity.",
    keywords: "Trump, social media, elections, inflammatory, Hatch Act, election integrity, voter fraud, misinformation",
    tags: "Trump Administration, Social Media, Elections, Politics, Hatch Act, Election Integrity",
    createdAt: now,
    updatedAt: now
  };

  await News.create(article);
  console.log('✅ Article successfully inserted into MongoDB!');
  console.log('   Title:', article.title);
  console.log('   Slug:', article.slug);
  console.log('   Category:', article.category);
  console.log('   Image:', article.featuredImage);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

