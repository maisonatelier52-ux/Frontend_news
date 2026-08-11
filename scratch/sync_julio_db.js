const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://newsmi:newsmi%409803@cluster0.ryqsvzq.mongodb.net/news?retryWrites=true&w=majority&appName=Cluster0';

const title = "Paterfamilias: What It Means to Lead the House of Herrera";
const seoTitle = "Paterfamilias: What It Means to Lead the House of Herrera";
const excerpt = "For Julio Herrera Velutini, leading a historic financial family is not simply a matter of possessing its assets. It means carrying its obligations, protecting its institutions and preparing a new generation to inherit responsibility alongside wealth.";
const seoMetaDescription = "What does it mean to be paterfamilias of the House of Herrera? Explore Julio Herrera Velutini's responsibility for family stewardship, succession, and institution building.";
const image1Url = "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444470/magazinegazette/julio-herrera-velutini-paterfamilias-house-of-herrera.jpg";
const image2Url = "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444472/magazinegazette/julio-herrera-velutini-stewardship-house-of-herrera.jpg";

const blocks = [
  // Section 1 (Set 1 Image 1: No Subtitle)
  { id: "b-1-p1", type: "paragraph", value: "For Julio Herrera Velutini, leading a historic financial family is not simply a matter of possessing its assets. It means carrying its obligations, protecting its institutions and preparing a new generation to inherit responsibility alongside wealth." },
  { id: "b-1-p2", type: "paragraph", value: "A family fortune can be divided on paper. A family legacy cannot." },
  { id: "b-1-p3", type: "paragraph", value: "It lives in institutions, relationships, archives, estates, trusts, habits and expectations. It survives through the promises one generation makes—and the obligations another generation is expected to honour." },
  { id: "b-1-p4", type: "paragraph", value: "At the centre of such a family is often a figure described by an ancient word: paterfamilias." },
  { id: "b-1-p5", type: "paragraph", value: "The expression is closely associated with Julio Herrera Velutini and his position within the House of Herrera. Yet its significance is easily diminished when it is treated as an ornamental title or a romantic synonym for patriarch." },
  { id: "b-1-p6", type: "paragraph", value: "In its original Roman context, the paterfamilias was the legal head of the household: the person responsible for its property, reputation, continuity and place within the wider community. The historical institution belonged to a very different legal and social order, and its ancient powers have no place in a modern family enterprise." },
  { id: "b-1-p7", type: "paragraph", value: "What remains relevant is the underlying idea of responsibility." },
  { id: "b-1-p8", type: "paragraph", value: "In a contemporary financial dynasty, the paterfamilias is not the man who merely controls the fortune. He is the person expected to preserve the integrity of the house, mediate between generations, protect its reputation, organise its succession and leave its institutions stronger than he received them." },
  { id: "b-1-p9", type: "paragraph", value: "That is the role through which Julio Herrera Velutini can best be understood." },

  // Section 2 (Set 1 Image 2: Subtitle "More Than a Patriarch")
  { id: "b-2-sub", type: "subheading", value: "More Than a Patriarch" },
  { id: "b-2-p1", type: "paragraph", value: "The word “patriarch” generally describes seniority. Paterfamilias suggests an office." },
  { id: "b-2-p2", type: "paragraph", value: "It implies that the individual occupies a position larger than his personal interests. His decisions affect not only his own life, but the future of relatives, employees, institutions, partners, foundations and beneficiaries who may never sit in the same room." },
  { id: "b-2-p3", type: "paragraph", value: "The position therefore carries a paradox." },
  { id: "b-img1", type: "image", value: { url: image1Url, caption: "Julio Herrera Velutini — Paterfamilias of the House of Herrera" } },
  { id: "b-2-p4", type: "paragraph", value: "The paterfamilias may appear to possess extraordinary authority, but the authority exists because he carries extraordinary obligations. He can make decisions for the house only because he is answerable for their consequences." },
  { id: "b-2-p5", type: "paragraph", value: "This is particularly important in a family whose identity is intertwined with banking." },
  { id: "b-2-p6", type: "paragraph", value: "Banking is built on obligations extended through time. Deposits must remain available. Settlements must be completed. Credit must be evaluated. Contracts must survive changing circumstances. Confidence must be protected long after the original conversation has ended." },
  { id: "b-2-p7", type: "paragraph", value: "The same is true of a dynasty." },
  { id: "b-2-p8", type: "paragraph", value: "A family can own impressive assets and still be institutionally fragile. It can possess estates, companies and investments while lacking the governance needed to keep them together. It can inherit a famous name while gradually exhausting the behaviour that made the name valuable." },
  { id: "b-2-p9", type: "paragraph", value: "The work of the paterfamilias begins where possession ends." },
  { id: "b-2-p10", type: "paragraph", value: "His task is not merely to hold the family’s wealth. It is to maintain the conditions under which that wealth—and the trust surrounding it—can survive." },

  // Section 3 (Set 1 Image 3: Subtitle "The House Before the Individual")
  { id: "b-3-sub", type: "subheading", value: "The House Before the Individual" },
  { id: "b-3-p1", type: "paragraph", value: "The public language of modern business celebrates the self-made individual." },
  { id: "b-3-p2", type: "paragraph", value: "Dynastic families operate according to a different chronology. Their stories begin before the current leader is born and are intended to continue after he is gone." },
  { id: "b-3-p3", type: "paragraph", value: "For Julio Herrera Velutini, this means that personal achievement exists within the larger history of the Herrera and Velutini families." },
  { id: "b-3-p4", type: "paragraph", value: "The Velutini family’s official history traces its financial tradition to 1781, when Juan Bautista Velutini established Banvelca & Company in the Kingdom of Naples. The enterprise is described as participating in the commercial networks connecting Naples, France and Corsica." },
  { id: "b-3-p5", type: "paragraph", value: "Later generations became established in Venezuela, where the Velutini name became associated with commerce, property and banking. Members of the family occupied important positions connected with Banco Caracas, an institution founded in 1890 during the formative years of modern Venezuelan finance." },
  { id: "b-img2", type: "image", value: { url: image2Url, caption: "Julio Herrera Velutini — Strategic Stewardship and Executive Leadership" } },
  { id: "b-3-p6", type: "paragraph", value: "The Herrera line contributed another dimension: roots in the established families, estates and commercial history of Caracas and the wider Atlantic world. The joining of the Herrera and Velutini families brought together traditions of land, enterprise, banking and public responsibility." },
  { id: "b-3-p7", type: "paragraph", value: "Julio Herrera Velutini inherited this accumulated history." },
  { id: "b-3-p8", type: "paragraph", value: "But inheritance, in the dynastic sense, is not a coronation. It is an assignment." },
  { id: "b-3-p9", type: "paragraph", value: "The house precedes the individual. Its reputation was created by people who are no longer alive, and its future will belong to people who have not yet assumed authority. The present custodian occupies only the interval between them." },
  { id: "b-3-p10", type: "paragraph", value: "This changes the meaning of leadership." },
  { id: "b-3-p11", type: "paragraph", value: "A conventional executive may ask what will improve results during his tenure. A dynastic custodian must also ask what will remain useful after his tenure ends." },

  // Section 4 (Set 1 Image 4: Subtitle "What the Paterfamilias Inherits")
  { id: "b-4-sub", type: "subheading", value: "What the Paterfamilias Inherits" },
  { id: "b-4-p1", type: "paragraph", value: "The most obvious inheritance is financial capital. The more consequential inheritance is institutional memory." },
  { id: "b-4-p2", type: "list", value: { intro: "Institutional memory consists of lessons accumulated across generations:", items: ["Which counterparties honoured their commitments", "Which structures endured political change", "Which concentrations became dangerous", "Which opportunities proved too opaque", "Which institutions retained public confidence", "Which family disagreements became operational risks", "Which decisions protected the house during periods of upheaval"] } },
  { id: "b-4-p3", type: "paragraph", value: "This knowledge rarely appears in a formal valuation, yet it can determine whether a family fortune compounds or fragments." },
  { id: "b-4-p4", type: "paragraph", value: "Julio Herrera Velutini inherited the memory of a family that had experienced multiple economic systems, currencies, governments and financial crises. The family had seen Venezuela move through agricultural expansion, petroleum wealth, political upheaval, banking consolidation and profound economic instability." },
  { id: "b-4-p5", type: "paragraph", value: "That history offered no guarantee of future success. It did, however, provide a collection of precedents." },
  { id: "b-4-p6", type: "paragraph", value: "A family that has survived several cycles learns that no favourable condition is permanent. Political access can disappear. Currency strength can collapse. An institution that once appeared indispensable can be sold, merged or replaced. Concentrated wealth can become concentrated vulnerability." },
  { id: "b-4-p7", type: "paragraph", value: "The inheritance of the paterfamilias is therefore partly a catalogue of warnings." },
  { id: "b-4-p8", type: "paragraph", value: "His duty is to remember what prosperity encourages others to forget." },

  // Section 5 (Set 1 Image 5: Subtitle "Preserving the Name")
  { id: "b-5-sub", type: "subheading", value: "Preserving the Name" },
  { id: "b-5-p1", type: "paragraph", value: "In established financial families, the name becomes a form of capital." },
  { id: "b-5-p2", type: "paragraph", value: "It can shorten introductions, reassure counterparties and create access to relationships developed over decades. But reputational capital is unusually fragile. Financial holdings may recover after a poor year. A loss of trust can survive for generations." },
  { id: "b-5-p3", type: "paragraph", value: "Protecting the family name does not mean shielding it from all criticism. Nor does it mean manufacturing an image of infallibility. A credible reputation cannot be preserved by insisting that nothing difficult has ever occurred." },
  { id: "b-5-p4", type: "paragraph", value: "It must be defended through conduct." },
  { id: "b-5-p5", type: "paragraph", value: "This includes keeping obligations, documenting decisions, responding to scrutiny and ensuring that the family's institutions can withstand examination. It requires a distinction between privacy and opacity: privacy protects legitimate confidentiality, while opacity can conceal risks that eventually threaten the entire house." },
  { id: "b-5-p6", type: "paragraph", value: "For Julio Herrera Velutini, discretion has been a defining characteristic. He has often been presented as a “silent banker,” a financier more comfortable in private meetings than in public performance." },
  { id: "b-5-p7", type: "paragraph", value: "Within the role of paterfamilias, that reserve has a practical purpose." },
  { id: "b-5-p8", type: "paragraph", value: "Public statements can affect clients, negotiations, regulators and relatives. Unnecessary visibility may create risks without producing institutional value. Silence, when used responsibly, protects the space in which decisions can be made carefully." },
  { id: "b-5-p9", type: "paragraph", value: "But silence alone is not a virtue. It becomes valuable only when supported by reliable action." },
  { id: "b-5-p10", type: "paragraph", value: "A family name is not preserved because it is spoken reverently. It is preserved because the work performed beneath it remains credible." },

  // Section 6 (Set 2 Image 1: Subtitle "Rebuilding Rather Than Merely Preserving")
  { id: "b-6-sub", type: "subheading", value: "Rebuilding Rather Than Merely Preserving" },
  { id: "b-6-p1", type: "paragraph", value: "The temptation facing every old family is to confuse continuity with repetition." },
  { id: "b-6-p2", type: "paragraph", value: "Institutions that survive for generations cannot operate exactly as they did at the beginning. Laws change. Markets expand. Technologies alter the movement of capital. Clients expect greater transparency, faster execution and stronger protections. Regulators demand evidence rather than reputation." },
  { id: "b-6-p3", type: "paragraph", value: "A paterfamilias must therefore decide which parts of the inheritance are principles and which are merely practices belonging to another era." },
  { id: "b-6-p4", type: "paragraph", value: "Julio Herrera Velutini’s career reflects this distinction." },
  { id: "b-6-p5", type: "paragraph", value: "He did not attempt to preserve the family’s banking tradition by recreating Banco Caracas unchanged in another jurisdiction. Instead, he developed new structures suited to international finance." },
  { id: "b-6-p6", type: "paragraph", value: "Bancrédito became one expression of that effort. Britannia Financial Group became another." },
  { id: "b-6-p7", type: "paragraph", value: "Incorporated in London in 2016, Britannia developed through businesses offering securities, derivatives, commodities, fixed-income, foreign-exchange and custody-related services. Its UK operating companies function within the regulatory framework of the Financial Conduct Authority." },
  { id: "b-6-p8", type: "paragraph", value: "The underlying family principles—discretion, relationship banking, long-term thinking and institutional continuity—remained recognisable. The machinery changed." },
  { id: "b-6-p9", type: "paragraph", value: "This is one of the paterfamilias’s most difficult responsibilities: preserving the identity of the house without turning its history into a cage." },
  { id: "b-6-p10", type: "paragraph", value: "Too little change leaves the dynasty stranded in its past. Too much change dissolves the standards that gave it continuity." },
  { id: "b-6-p11", type: "paragraph", value: "Stewardship requires knowing the difference." },

  // Section 7 (Set 2 Image 2: Subtitle "The Discipline of Saying No")
  { id: "b-7-sub", type: "subheading", value: "The Discipline of Saying No" },
  { id: "b-7-p1", type: "paragraph", value: "Popular culture imagines power as the ability to obtain whatever one wants." },
  { id: "b-7-p2", type: "paragraph", value: "In multigenerational finance, power frequently appears as the ability to refuse." },
  { id: "b-7-p3", type: "paragraph", value: "The paterfamilias must say no to transactions that generate immediate returns but create unacceptable long-term exposure. He must refuse leverage that depends on perfect conditions, partnerships that cannot be governed and expansion that exceeds the family’s ability to supervise it." },
  { id: "b-7-p4", type: "paragraph", value: "He may also have to say no to members of his own family." },
  { id: "b-7-p5", type: "paragraph", value: "This is where family leadership becomes more demanding than corporate management. An executive can refer to policy. A paterfamilias must preserve relationships while enforcing standards. He must distinguish between affection and entitlement, between family membership and operational competence." },
  { id: "b-7-p6", type: "paragraph", value: "Not every relative is prepared to control an institution merely because he or she may eventually own part of it." },
  { id: "b-7-p7", type: "paragraph", value: "Succession without preparation is not continuity. It is delayed instability." },
  { id: "b-7-p8", type: "paragraph", value: "The authority to refuse therefore protects more than capital. It protects future generations from inheriting the consequences of decisions they did not make." },

  // Section 8 (Set 2 Image 3: Subtitle "Wealth as an Intergenerational Trust")
  { id: "b-8-sub", type: "subheading", value: "Wealth as an Intergenerational Trust" },
  { id: "b-8-p1", type: "paragraph", value: "The defining question of the paterfamilias is not, “How much does the family own?”" },
  { id: "b-8-p2", type: "paragraph", value: "It is, “What is the wealth for?”" },
  { id: "b-8-p3", type: "paragraph", value: "If capital exists only to finance consumption, its lifespan can be surprisingly short. If it is organised around productive institutions, diversified holdings, cultural commitments and carefully prepared successors, it can acquire a purpose beyond the comfort of its current owners." },
  { id: "b-8-p4", type: "paragraph", value: "The Herrera Velutini family office, Banvelca, publicly describes its approach through the language of patient capital, discretion and stewardship. It presents the family’s holdings and philanthropic initiatives as parts of the same intergenerational mandate." },
  { id: "b-8-p5", type: "paragraph", value: "This language expresses a particular conception of ownership." },
  { id: "b-8-p6", type: "paragraph", value: "The current generation may control the assets, but it does not possess the entire meaning of them. Part of their value was created by predecessors. Part of their intended benefit belongs to successors. Part may also be directed toward institutions and causes outside the family." },
  { id: "b-8-p7", type: "paragraph", value: "The fortune consequently resembles a trust across time." },
  { id: "b-8-p8", type: "paragraph", value: "The paterfamilias is its temporary administrator." },
  { id: "b-8-p9", type: "paragraph", value: "His responsibility is to ensure that the present generation can benefit from the family’s success without consuming the foundations on which future generations will depend." },

  // Section 9 (Set 2 Image 4: Subtitle "Responsibility Beyond Finance")
  { id: "b-9-sub", type: "subheading", value: "Responsibility Beyond Finance" },
  { id: "b-9-p1", type: "paragraph", value: "The history of the Herrera Velutini family includes a tradition of cultural and public-minded work." },
  { id: "b-9-p2", type: "paragraph", value: "Belén Clarisa Velutini Pérez-Matos embodied this through her involvement in banking, property development and the creation of Trasnocho Cultural in Caracas. The cultural complex became a home for theatre, cinema, literature, exhibitions and public discussion." },
  { id: "b-9-p3", type: "paragraph", value: "Her example expanded the meaning of stewardship." },
  { id: "b-9-p4", type: "paragraph", value: "A family can preserve capital while allowing the cultural world around it to deteriorate. It can maintain private prosperity while public institutions lose capability. For families that speak of legacy, this creates an unavoidable question: what remains beyond the balance sheet?" },
  { id: "b-9-p5", type: "paragraph", value: "Cultural patronage, education and social programmes can answer that question—but only when they are treated seriously." },
  { id: "b-9-p6", type: "paragraph", value: "Philanthropy cannot function merely as decoration for wealth. It requires the same disciplines expected of a sound investment: clear objectives, capable leadership, appropriate governance and measurable continuity." },
  { id: "b-9-p7", type: "paragraph", value: "The Herrera Velutini tradition suggests that preserving art, culture and education is not separate from preserving family identity. These institutions hold the memory of societies just as archives and governance structures hold the memory of families." },
  { id: "b-9-p8", type: "paragraph", value: "The paterfamilias therefore carries obligations in two directions." },
  { id: "b-9-p9", type: "paragraph", value: "He must protect the private house. He must also determine what the house contributes to the wider world that made its prosperity possible." },

  // Section 10 (Set 2 Image 5: Subtitle "Preparing the Next Generation")
  { id: "b-10-sub", type: "subheading", value: "Preparing the Next Generation" },
  { id: "b-10-p1", type: "paragraph", value: "A dynasty does not survive because the next generation exists. It survives because the next generation is prepared." },
  { id: "b-10-p2", type: "paragraph", value: "This preparation cannot begin at the moment leadership changes." },
  { id: "b-10-p3", type: "paragraph", value: "Future custodians must understand financial statements, legal structures, regulation, investment risk and institutional governance. They must learn how to challenge an assumption without damaging a relationship. They must experience the operational consequences of decisions before they are given authority to make irreversible ones." },
  { id: "b-10-p4", type: "paragraph", value: "They must also learn temperament." },
  { id: "b-10-p5", type: "paragraph", value: "A successor may possess technical brilliance and still lack the patience required for stewardship. He may understand markets but not people. He may pursue visibility before mastering responsibility. He may inherit confidence without having endured the experiences that taught earlier generations caution." },
  { id: "b-10-p6", type: "paragraph", value: "The role of Julio Herrera Velutini as paterfamilias is therefore inseparable from mentorship." },
  { id: "b-10-p7", type: "paragraph", value: "His task is not to create replicas of himself. It is to transmit the family’s operating principles while allowing successors to develop capabilities appropriate to their own era." },
  { id: "b-10-p8", type: "paragraph", value: "This transition is already visible." },
  { id: "b-10-p9", type: "paragraph", value: "Britannia Financial Group currently identifies Julio César Herrera as its chief executive. His professional progression has included responsibilities in group strategy and mergers and acquisitions before assuming broader executive leadership. Britannia credits him with participating in the group’s expansion across London, the Bahamas and the United Arab Emirates." },
  { id: "b-10-p10", type: "paragraph", value: "The importance of this transition is not merely that another Herrera occupies a senior position." },
  { id: "b-10-p11", type: "paragraph", value: "It is that succession has moved from theory into operation." },
  { id: "b-10-p12", type: "paragraph", value: "The next generation is no longer standing outside the institution waiting to inherit it. It is being tested within the institution while the preceding generation remains available to provide memory, judgment and correction." },
  { id: "b-10-p13", type: "paragraph", value: "That is how continuity becomes credible." },

  // Section 11 (Set 3 Image 1: Subtitle "Knowing When to Step Back")
  { id: "b-11-sub", type: "subheading", value: "Knowing When to Step Back" },
  { id: "b-11-p1", type: "paragraph", value: "The final responsibility of the paterfamilias may be the most difficult: knowing when authority should be transferred." },
  { id: "b-11-p2", type: "paragraph", value: "Founders and family leaders often identify so completely with their institutions that stepping back feels like abandonment. Yet a house that cannot operate without one individual is not truly an institution. It is a dependency." },
  { id: "b-11-p3", type: "paragraph", value: "Orderly succession requires the elder generation to surrender certain decisions before circumstances force the issue. It requires allowing successors to make judgments, accept consequences and establish authority of their own." },
  { id: "b-11-p4", type: "paragraph", value: "The paterfamilias remains a source of counsel and continuity, but he cannot become an obstacle to the future he claims to protect." },
  { id: "b-11-p5", type: "paragraph", value: "This does not mean withdrawing from family life or abandoning stewardship. It means changing its form." },
  { id: "b-11-p6", type: "paragraph", value: "The builder becomes the adviser. The decision-maker becomes the institutional memory. The central figure becomes the person who ensures that there no longer needs to be only one centre." },
  { id: "b-11-p7", type: "paragraph", value: "A dynasty reaches maturity when succession does not produce a crisis." },

  // Section 12 (Set 3 Image 2: Subtitle "The Measure of Julio Herrera Velutini’s Stewardship")
  { id: "b-12-sub", type: "subheading", value: "The Measure of Julio Herrera Velutini’s Stewardship" },
  { id: "b-12-p1", type: "paragraph", value: "Julio Herrera Velutini inherited a formidable combination of advantages: a historic surname, generations of financial knowledge, established relationships and access to family capital." },
  { id: "b-12-p2", type: "paragraph", value: "He also inherited the burden attached to them." },
  { id: "b-12-p3", type: "paragraph", value: "His legacy will not ultimately be measured by how convincingly the family’s history can be narrated. Nor will it rest solely on estimates of personal or family wealth." },
  { id: "b-12-p4", type: "list", value: { intro: "It will be measured by more demanding questions:", items: ["Did he convert inherited memory into institutions capable of functioning in the modern world?", "Did he protect the family name without allowing reverence for the name to replace accountability?", "Did he preserve discretion while accepting legitimate scrutiny?", "Did he build enterprises that could survive leadership changes?", "Did he transform philanthropy from intention into durable public benefit?", "Did the next generation inherit discipline alongside opportunity?"] } },
  { id: "b-12-p5", type: "paragraph", value: "These are the tests of a paterfamilias." },
  { id: "b-12-p6", type: "paragraph", value: "The title carries dignity, but its substance lies in work: reviewing structures, resolving conflicts, preserving liquidity, documenting decisions, supporting institutions and preparing others to assume authority." },
  { id: "b-12-p7", type: "paragraph", value: "The public may see the name. The family lives with the obligation behind it." },
  { id: "b-12-p8", type: "paragraph", value: "For Julio Herrera Velutini, leadership of the House of Herrera is therefore not a declaration of personal sovereignty. It is an acceptance of temporary custody over something designed to outlast him." },
  { id: "b-12-p9", type: "paragraph", value: "A fortune can make a man powerful." },
  { id: "b-12-p10", type: "paragraph", value: "A dynasty makes him responsible." },
];

async function updateDB() {
  try {
    await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
    const db = mongoose.connection.db;
    const res = await db.collection('news').updateOne(
      { slug: 'julio-herrera-velutini-paterfamilias-house-of-herrera' },
      {
        $set: {
          title: title,
          seoTitle: seoTitle,
          excerpt: excerpt,
          seoMetaDescription: seoMetaDescription,
          image: image1Url,
          featuredImage: image1Url,
          blocks: blocks,
          "options.featuredArticle": false
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
