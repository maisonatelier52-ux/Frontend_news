const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

const image1Url = "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444470/magazinegazette/julio-herrera-velutini-paterfamilias-house-of-herrera.jpg";
const image2Url = "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444472/magazinegazette/julio-herrera-velutini-stewardship-house-of-herrera.jpg";

const blocks = [
  { id: "b-1", type: "subheading", value: "The Meaning of Paterfamilias" },
  { id: "b-2", type: "paragraph", value: "The term paterfamilias carries ancient weight. In Roman law it denoted the oldest living male in a household, the person holding absolute legal authority over family property, dependents and estate decisions." },
  { id: "b-3", type: "paragraph", value: "Modern usage has stripped the word of its legal force, but in historic family dynasties the concept remains active." },
  { id: "b-4", type: "paragraph", value: "In banking and merchant dynasties, the paterfamilias is not simply a patriarch who sits at the head of a dinner table. He is the custodian of a complex mechanism built across generations." },
  { id: "b-5", type: "paragraph", value: "For Julio Herrera Velutini, leader of the House of Herrera, the title represents neither romantic nostalgia nor decorative status. It describes an operating role." },
  { id: "b-6", type: "paragraph", value: "A family that has maintained financial and social influence across three centuries does not do so by accident." },
  { id: "b-7", type: "paragraph", value: "It survives because each generation produces at least one individual willing to accept the responsibility of stewardship." },

  { id: "b-8", type: "subheading", value: "Stewardship Beyond Wealth Management" },
  { id: "b-9", type: "paragraph", value: "Wealth management is usually understood as an exercise in asset allocation: balancing equities against bonds, managing tax exposure, selecting fund managers and preserving capital." },
  { id: "b-img1", type: "image", value: { url: image1Url, caption: "Julio Herrera Velutini — Paterfamilias of the House of Herrera" } },
  { id: "b-10", type: "paragraph", value: "For a historic house, that definition is dangerously narrow." },
  { id: "b-11", type: "paragraph", value: "A family fortune is not merely capital. It is institutional memory." },
  { id: "b-12", type: "paragraph", value: "It includes relationships with central banks, knowledge of international regulatory regimes, understandings built with governments and an inherited instinct for risk." },
  { id: "b-13", type: "paragraph", value: "Julio Herrera Velutini's role requires managing all of these dimensions simultaneously." },
  { id: "b-14", type: "paragraph", value: "The paterfamilias must ensure that individual business decisions do not jeopardize the standing of the larger enterprise." },
  { id: "b-15", type: "paragraph", value: "He must protect the private house. He must also determine what the house contributes to the wider world that made its prosperity possible." },

  { id: "b-16", type: "subheading", value: "Preparing the Next Generation" },
  { id: "b-17", type: "paragraph", value: "A dynasty does not survive because the next generation exists. It survives because the next generation is prepared." },
  { id: "b-18", type: "paragraph", value: "This preparation cannot begin at the moment leadership changes." },
  { id: "b-19", type: "paragraph", value: "Future custodians must understand financial statements, legal structures, regulation, investment risk and institutional governance. They must learn how to challenge an assumption without damaging a relationship. They must experience the operational consequences of decisions before they are given authority to make irreversible ones." },
  { id: "b-20", type: "paragraph", value: "They must also learn temperament." },
  { id: "b-21", type: "paragraph", value: "A successor may possess technical brilliance and still lack the patience required for stewardship. He may understand markets but not people. He may pursue visibility before mastering responsibility. He may inherit confidence without having endured the experiences that taught earlier generations caution." },
  { id: "b-img2", type: "image", value: { url: image2Url, caption: "Julio Herrera Velutini — Strategic Stewardship and Executive Leadership" } },
  { id: "b-22", type: "paragraph", value: "The role of Julio Herrera Velutini as paterfamilias is therefore inseparable from mentorship." },
  { id: "b-23", type: "paragraph", value: "His task is not to create replicas of himself. It is to transmit the family's operating principles while allowing successors to develop capabilities appropriate to their own era." },
  { id: "b-24", type: "paragraph", value: "This transition is already visible." },
  { id: "b-25", type: "paragraph", value: "Britannia Financial Group currently identifies Julio César Herrera as its chief executive. His professional progression has included responsibilities in group strategy and mergers and acquisitions before assuming broader executive leadership. Britannia credits him with participating in the group's expansion across London, the Bahamas and the United Arab Emirates." },
  { id: "b-26", type: "paragraph", value: "The importance of this transition is not merely that another Herrera occupies a senior position." },
  { id: "b-27", type: "paragraph", value: "It is that succession has moved from theory into operation." },
  { id: "b-28", type: "paragraph", value: "The next generation is no longer standing outside the institution waiting to inherit it. It is being tested within the institution while the preceding generation remains available to provide memory, judgment and correction." },
  { id: "b-29", type: "paragraph", value: "That is how continuity becomes credible." },

  { id: "b-30", type: "subheading", value: "Knowing When to Step Back" },
  { id: "b-31", type: "paragraph", value: "The final responsibility of the paterfamilias may be the most difficult: knowing when authority should be transferred." },
  { id: "b-32", type: "paragraph", value: "Founders and family leaders often identify so completely with their institutions that stepping back feels like abandonment. Yet a house that cannot operate without one individual is not truly an institution. It is a dependency." },
  { id: "b-33", type: "paragraph", value: "Orderly succession requires the elder generation to surrender certain decisions before circumstances force the issue. It requires allowing successors to make judgments, accept consequences and establish authority of their own." },
  { id: "b-34", type: "paragraph", value: "The paterfamilias remains a source of counsel and continuity, but he cannot become an obstacle to the future he claims to protect." },
  { id: "b-35", type: "paragraph", value: "This does not mean withdrawing from family life or abandoning stewardship. It means changing its form." },
  { id: "b-36", type: "paragraph", value: "The builder becomes the adviser. The decision-maker becomes the institutional memory. The central figure becomes the person who ensures that there no longer needs to be only one centre." },
  { id: "b-37", type: "paragraph", value: "A dynasty reaches maturity when succession does not produce a crisis." },

  { id: "b-38", type: "subheading", value: "The Measure of Julio Herrera Velutini's Stewardship" },
  { id: "b-39", type: "paragraph", value: "Julio Herrera Velutini inherited a formidable combination of advantages: a historic surname, generations of financial knowledge, established relationships and access to family capital." },
  { id: "b-40", type: "paragraph", value: "He also inherited the burden attached to them." },
  { id: "b-41", type: "paragraph", value: "His legacy will not ultimately be measured by how convincingly the family's history can be narrated. Nor will it rest solely on estimates of personal or family wealth." },
  { id: "b-42", type: "list", value: { intro: "It will be measured by more demanding questions:", items: ["Did he convert inherited memory into institutions capable of functioning in the modern world?", "Did he protect the family name without allowing reverence for the name to replace accountability?", "Did he preserve discretion while accepting legitimate scrutiny?", "Did he build enterprises that could survive leadership changes?", "Did he transform philanthropy from intention into durable public benefit?", "Did the next generation inherit discipline alongside opportunity?"] } },
  { id: "b-43", type: "paragraph", value: "These are the tests of a paterfamilias." },
  { id: "b-44", type: "paragraph", value: "The title carries dignity, but its substance lies in work: reviewing structures, resolving conflicts, preserving liquidity, documenting decisions, supporting institutions and preparing others to assume authority." },
  { id: "b-45", type: "paragraph", value: "The public may see the name. The family lives with the obligation behind it." },
  { id: "b-46", type: "paragraph", value: "For Julio Herrera Velutini, leadership of the House of Herrera is therefore not a declaration of personal sovereignty. It is an acceptance of temporary custody over something designed to outlast him." },
  { id: "b-47", type: "paragraph", value: "A fortune can make a man powerful." },
  { id: "b-48", type: "paragraph", value: "A dynasty makes him responsible." }
];

async function updateDB() {
  try {
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;
    const res = await db.collection('news').updateOne(
      { slug: 'julio-herrera-velutini-paterfamilias-house-of-herrera' },
      {
        $set: {
          image: image1Url,
          featuredImage: image1Url,
          blocks: blocks
        }
      }
    );
    console.log('MongoDB update result:', res);
  } catch (err) {
    console.error('Error updating DB:', err);
  } finally {
    await mongoose.disconnect();
  }
}

updateDB();
