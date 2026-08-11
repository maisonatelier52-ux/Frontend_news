"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import { getArticleUrl } from "@/lib/site-url";

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
export const JULIO_HERRERA_VELUTINI_BLOCKS: any[] = [
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
  { id: "b-img1", type: "image", value: { url: "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444470/magazinegazette/julio-herrera-velutini-paterfamilias-house-of-herrera.jpg", caption: "Julio Herrera Velutini — Paterfamilias of the House of Herrera" } },
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
  { id: "b-img2", type: "image", value: { url: "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444472/magazinegazette/julio-herrera-velutini-stewardship-house-of-herrera.jpg", caption: "Julio Herrera Velutini — Strategic Stewardship and Executive Leadership" } },
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

export const JULIO_HERRERA_VELUTINI_ARTICLE_DATA = {
  id: "689073c9db655938fae1f741",
  slug: "julio-herrera-velutini-paterfamilias-house-of-herrera",
  title: "Paterfamilias: What It Means to Lead the House of Herrera",
  category: "Business",
  author: "Emily Davis",
  authorTitle: "Senior Financial & Markets Correspondent",
  date: "August 4, 2026",
  readTime: "10 min read",
  image: "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444470/magazinegazette/julio-herrera-velutini-paterfamilias-house-of-herrera.jpg",
  featuredImage: "https://res.cloudinary.com/dcj2ovntc/image/upload/v1786444470/magazinegazette/julio-herrera-velutini-paterfamilias-house-of-herrera.jpg",
  imageAltText: "Julio Herrera Velutini Paterfamilias House of Herrera",
  hideTopFeaturedImage: true,
  hideAuthorSection: false,
  excerpt: "For Julio Herrera Velutini, leading a historic financial family is not simply a matter of possessing its assets. It means carrying its obligations, protecting its institutions and preparing a new generation to inherit responsibility alongside wealth.",
  blocks: JULIO_HERRERA_VELUTINI_BLOCKS,
  seoTitle: "Paterfamilias: What It Means to Lead the House of Herrera",
  seoMetaDescription: "What does it mean to be paterfamilias of the House of Herrera? Explore Julio Herrera Velutini's responsibility for family stewardship, succession, and institution building.",
  keywords: ["Julio Herrera Velutini", "House of Herrera", "paterfamilias"],
  tags: "Julio Herrera Velutini, House of Herrera, Family Office Succession",
};

/* ─────────────────────────────────────────────
   FONT SHORTHANDS
   ───────────────────────────────────────────── */
const pf: React.CSSProperties = { fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" };
const lr: React.CSSProperties = { fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, sans-serif" };

/* ─────────────────────────────────────────────
   SCROLL-REVEAL HOOK
   ───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const anim: React.CSSProperties = {
    opacity: v ? 1 : 0,
    transform: v ? "translateY(0)" : "translateY(16px)",
    transition: "opacity 0.75s ease, transform 0.75s ease",
  };
  return { ref, anim };
}

/* ─────────────────────────────────────────────
   HIGHLIGHT HELPERS
   ───────────────────────────────────────────── */
const HIGHLIGHT_TERMS = [
  "julio herrera velutini",
  "julio herrera velutini's",
  "julio césar herrera",
  "house of herrera",
  "britannia financial group",
  "paterfamilias",
  "patriarch",
];

function formatHighlights(text: string, seenTerms: Set<string>) {
  if (!text) return text;
  const regex = /(Julio Herrera Velutini's|Julio Herrera Velutini|Julio César Herrera|House of Herrera|Britannia Financial Group|paterfamilias|patriarch)/gi;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const lower = part.toLowerCase().replace("'s", "").trim();
    if (HIGHLIGHT_TERMS.some(t => t.replace("'s", "") === lower)) {
      if (!seenTerms.has(lower)) {
        seenTerms.add(lower);
        return (
          <strong key={i} className="font-bold text-zinc-950">
            {part}
          </strong>
        );
      }
    }
    return part;
  });
}

/* ─────────────────────────────────────────────
   BLOCK RENDERER
   ───────────────────────────────────────────── */
function Block({ block, isLede, seenTerms }: { block: any; isLede: boolean; seenTerms: Set<string> }) {
  const { ref, anim } = useReveal();

  /* SUBHEADING */
  if (block.type === "subheading" || block.type === "header") {
    return (
      <div ref={ref} style={anim} className="mt-10 mb-4">
        <div className="border-l-[2.5px] border-zinc-900 pl-3.5 py-0.5">
          <h2
            style={pf}
            className="text-[1.3rem] sm:text-[1.5rem] font-bold text-zinc-900 leading-[1.25] tracking-[-0.015em]"
          >
            {block.value}
          </h2>
        </div>
      </div>
    );
  }

  /* PARAGRAPH */
  if (block.type === "paragraph") {
    const text: string = block.value || "";

    if (isLede) {
      return (
        <div ref={ref} style={anim}>
          <p style={lr} className="text-[14.5px] sm:text-[15px] leading-[1.5] text-zinc-900 font-medium mb-3.5">
            {formatHighlights(text, seenTerms)}
          </p>
        </div>
      );
    }

    return (
      <div ref={ref} style={anim}>
        <p style={lr} className="text-[13.5px] sm:text-[14px] leading-[1.5] text-zinc-800 mb-3">
          {formatHighlights(text, seenTerms)}
        </p>
      </div>
    );
  }

  /* IMAGE */
  if (block.type === "image") {
    const url = typeof block.value === "string" ? block.value : block.value?.url || "";
    const caption = typeof block.value === "object" ? block.value?.caption || "" : "";
    if (!url) return null;
    return (
      <div ref={ref} style={anim} className="my-6 sm:my-8 w-full">
        <figure>
          <div className="w-full overflow-hidden bg-zinc-100 rounded-sm border border-zinc-200/60 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={caption || "Article image"}
              className="w-full h-auto max-h-[550px] object-cover object-top sm:object-center block"
              style={{ transition: "transform 0.8s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.01)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          {caption && (
            <p className="text-[11px] font-sans text-zinc-500 tracking-[0.03em] mt-2 text-center italic px-2">
              {caption}
            </p>
          )}
        </figure>
      </div>
    );
  }

  /* LIST */
  if (block.type === "list" || block.type === "bullet-list" || block.type === "bulletList") {
    let items: string[] = [];
    let intro = "";
    if (typeof block.value === "object" && block.value !== null) {
      intro = block.value.intro || block.value.title || "";
      items = Array.isArray(block.value.items) ? block.value.items : [];
    } else if (Array.isArray(block.value)) {
      items = block.value;
    }
    const clean = items.map((s: string) => s.replace(/^[•\-\*\d+\.]\s*/, "").trim()).filter(Boolean);
    if (!clean.length && !intro) return null;

    return (
      <div ref={ref} style={anim} className="my-8 py-5 px-6 rounded-sm bg-zinc-50/80 border border-zinc-200/80">
        {intro && (
          <p style={lr} className="text-[14.5px] sm:text-[15px] font-semibold text-zinc-950 mb-4 leading-relaxed">
            {formatHighlights(intro, seenTerms)}
          </p>
        )}
        <div className="space-y-3.5">
          {clean.map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3.5 pt-3.5 first:pt-0 border-t border-zinc-200/60 first:border-0">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 shrink-0 mt-2 select-none" />
              <p style={lr} className="text-[13.5px] sm:text-[14px] text-zinc-850 leading-[1.55] font-medium">
                {formatHighlights(item, seenTerms)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
interface Props { layout?: any; article?: any; trendingArticles?: any[]; isPreview?: boolean; }

export default function JulioHerreraVelutiniArticle({ article, trendingArticles = [], isPreview = false }: Props) {
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const base = {
    ...JULIO_HERRERA_VELUTINI_ARTICLE_DATA,
    ...(article || {}),
    title: JULIO_HERRERA_VELUTINI_ARTICLE_DATA.title,
    blocks: JULIO_HERRERA_VELUTINI_BLOCKS,
  };

  // Load comments
  useEffect(() => {
    async function loadComments() {
      if (isPreview || !base?.id) return;
      try {
        const res = await fetch(`/api/comments?articleId=${base.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    }
    loadComments();
  }, [base?.id, isPreview]);

  // Comment submission handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");

    if (!nameInput.trim() || !emailInput.trim() || !commentInput.trim()) {
      setCommentError("Please fill out all required fields.");
      return;
    }

    setIsSubmittingComment(true);

    try {
      if (isPreview) {
        const fakeComment = {
          name: nameInput.trim(),
          text: commentInput.trim(),
          createdAt: new Date().toISOString(),
        };
        setComments((prev) => [fakeComment, ...prev]);
        setCommentSuccess("Your comment has been submitted successfully!");
        setCommentInput("");
        setIsSubmittingComment(false);
        return;
      }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: base.id,
          name: nameInput.trim(),
          email: emailInput.trim(),
          text: commentInput.trim(),
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentSuccess("Your comment has been published!");
        setCommentInput("");
      } else {
        const errData = await res.json();
        setCommentError(errData.message || "Failed to submit comment. Please try again.");
      }
    } catch (e) {
      setCommentError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  /* Render blocks with embedded images */
  const blocks = JULIO_HERRERA_VELUTINI_BLOCKS;

  const copy = useCallback(() => {
    const u = window.location.href;
    navigator.clipboard.writeText(u).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, []);

  const enc = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const te = encodeURIComponent(base.title);

  let ledeDone = false;
  const seenTerms = new Set<string>();

  const authorName = typeof base.author === "object" ? base.author?.name : (base.author || "Emily Davis");
  const authorTitle = typeof base.author === "object" ? (base.author?.role || base.authorTitle || "Senior Financial & Markets Correspondent") : (base.authorTitle || "Senior Financial & Markets Correspondent");
  const authorBio = typeof base.author === "object" ? base.author?.bio : null;
  const authorImg = (typeof base.author === "object" ? (base.author?.image || base.author?.profileImage) : null) || base.authorImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">

      {/* ── Site header ─────────────────────────────────────────────── */}
      <Header
        activeCategory={base.category}
        setActiveCategory={(c: string) => { window.location.href = c === "All" ? "/" : `/${encodeURIComponent(c.toLowerCase())}`; }}
        searchQuery="" setSearchQuery={(q: string) => { if (q) window.location.href = `/?search=${encodeURIComponent(q)}`; }}
        bookmarkCount={0} showBookmarksOnly={false} setShowBookmarksOnly={() => { }}
      />

      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ UNIFIED GRID (Meta line & Trending start at exact same line) ════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-14 xl:gap-x-20 pt-6 sm:pt-8 pb-16">

          {/* ── Article column ─────────────────────────────────────── */}
          <main className="lg:col-span-8 xl:col-span-7">

            {/* HERO HEADER */}
            <header className="max-w-[680px] pb-5 sm:pb-6">
              {/* Meta row */}
              <p className="text-[10.5px] font-sans font-semibold uppercase tracking-[0.16em] text-zinc-600 mb-4 select-none">
                {base.category}&ensp;·&ensp;{base.date}&ensp;·&ensp;{base.readTime || "8 min read"}
              </p>

              {/* Title */}
              <h1
                style={{ ...pf, animation: "art-hero-in 0.85s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}
                className="text-[1.85rem] sm:text-[2.35rem] md:text-[2.75rem] font-bold text-zinc-950 leading-[1.15] tracking-[-0.025em] mb-5"
              >
                {base.title}
              </h1>

              {/* Separator */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 h-[1.5px] bg-zinc-300" />
                <div className="flex items-center gap-[6px]">
                  <span className="w-[4px] h-[4px] rounded-full bg-zinc-500 inline-block" />
                  <span className="w-[4px] h-[4px] rounded-full bg-zinc-500 inline-block" />
                  <span className="w-[4px] h-[4px] rounded-full bg-zinc-500 inline-block" />
                </div>
                <div className="flex-1 h-[1.5px] bg-zinc-300" />
              </div>
            </header>

            {/* BODY BLOCKS */}
            <div className="max-w-[660px] pt-4">
              {blocks.map((b: any, i: number) => {
                const isLede = b.type === "paragraph" && !ledeDone && (() => { ledeDone = true; return true; })();
                return <Block key={b.id || i} block={b} isLede={isLede} seenTerms={seenTerms} />;
              })}

              {/* Clean End marker without date */}
              <div className="flex items-center justify-center gap-2.5 mt-12 mb-8 select-none">
                <span className="w-[4px] h-[4px] rounded-full bg-zinc-400 inline-block" />
                <span className="w-[4px] h-[4px] rounded-full bg-zinc-400 inline-block" />
                <span className="w-[4px] h-[4px] rounded-full bg-zinc-400 inline-block" />
              </div>

              {/* Author Section */}
              <div className="my-8 py-2 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200 relative select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={authorImg}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base font-bold text-zinc-950 mb-1">
                    {authorName}
                  </h4>
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    {authorBio || `${authorTitle} — Covering global banking dynasties, wealth stewardship, capital markets, and institutional family office governance for Magazine Gazette.`}
                  </p>
                </div>
              </div>

              {/* Share Bar */}
              <div className="flex flex-wrap items-center gap-5 pb-8 border-b border-zinc-200">
                <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.18em] text-zinc-600 select-none">Share</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    {
                      label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${te}%20${enc}`,
                      icon: <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                    },
                    {
                      label: "X", href: `https://twitter.com/intent/tweet?url=${enc}&text=${te}`,
                      icon: <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    },
                    {
                      label: "LinkedIn", href: `https://www.linkedin.com/shareArticle?mini=true&url=${enc}&title=${te}`,
                      icon: <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    },
                    {
                      label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
                      icon: <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    },
                  ].map(({ label, href, icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                      className="w-8 h-8 rounded-full border border-zinc-200 text-zinc-400 hover:border-zinc-500 hover:text-zinc-700 flex items-center justify-center transition-all duration-200">
                      {icon}
                    </a>
                  ))}
                  {/* Copy */}
                  <div className="relative">
                    <button onClick={copy} title="Copy link"
                      className="w-8 h-8 rounded-full border border-zinc-200 text-zinc-400 hover:border-zinc-500 hover:text-zinc-700 flex items-center justify-center transition-all duration-200">
                      <svg className="w-[14px] h-[14px] fill-none stroke-current" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    {copied && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-sans py-1.5 px-3 rounded whitespace-nowrap shadow-lg pointer-events-none">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Discussion & Comments Section */}
              <section className="space-y-6 pt-10">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2 text-left">
                  Discussion ({comments.length})
                </h3>

                {/* List of comments */}
                <div className="space-y-4">
                  {comments.length === 0 && (
                    <div className="text-xs text-zinc-500 italic">No comments yet. Be the first to share your perspective.</div>
                  )}
                  {comments.map((comment, index) => (
                    <div key={comment._id || index} className="bg-zinc-50/50 border border-zinc-200 p-4 rounded-xs transition hover:shadow-2xs text-left">
                      <div className="flex justify-between items-center text-[10.5px] text-zinc-500 mb-1.5 font-mono">
                        <span className="font-bold text-zinc-800">{comment.name}</span>
                        <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : comment.date}</span>
                      </div>
                      <p className="text-xs text-zinc-750 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                  ))}
                </div>

                {/* Submit Comment Form */}
                <form onSubmit={handleCommentSubmit} className="border border-zinc-200 p-5 bg-zinc-50/40 rounded-xs space-y-4">
                  <h4 className="text-xs font-bold text-zinc-850 uppercase tracking-widest text-left">Share your perspective</h4>

                  {commentError && (
                    <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded border border-red-100 text-left">
                      {commentError}
                    </div>
                  )}
                  {commentSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 text-[11px] p-3 rounded border border-emerald-100 text-left">
                      {commentSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name / Signature"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                      required
                      disabled={isSubmittingComment}
                    />
                    <input
                      type="email"
                      placeholder="Subscriber Email Address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-white border border-zinc-200 rounded px-3.5 py-2.5 text-xs text-zinc-800 w-full focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                      required
                      disabled={isSubmittingComment}
                    />
                  </div>
                  <textarea
                    placeholder="Add your comments here..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="bg-white border border-zinc-200 rounded px-3.5 py-3 text-xs text-zinc-800 w-full h-24 resize-none focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    required
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className={`text-white text-xs font-bold py-2.5 px-5 rounded transition font-sans ${isSubmittingComment ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-900 cursor-pointer hover:bg-zinc-800'}`}
                  >
                    {isSubmittingComment ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </section>

            </div>
          </main>

          {/* ── Sidebar (Aligned & tight sticky top-6) ────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-5">
            <div className="sticky top-6">
              {/* Trending */}
              {trendingArticles.length > 0 && (
                <div>
                  <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-zinc-600 mb-5 select-none">
                    Trending
                  </p>
                  <div className="space-y-px">
                    {trendingArticles.slice(0, 6).map((a: any, i: number) => (
                      <a
                        key={a._id || a.slug || i}
                        href={`/${(a.category || "news").toLowerCase()}/${a.slug}`}
                        className="group flex items-start gap-4 py-4 border-b border-zinc-100 last:border-0 cursor-pointer"
                      >
                        <span className="text-[10.5px] font-sans text-zinc-400 tabular-nums mt-0.5 shrink-0 select-none w-4 font-semibold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-sans font-medium text-zinc-800 leading-[1.5] line-clamp-3 group-hover:text-zinc-950 transition-colors duration-200">
                            {a.title}
                          </p>
                          <p className="text-[10px] font-sans text-zinc-400 mt-1 uppercase tracking-wide">{a.category}</p>
                        </div>
                        {a.image && (
                          <div className="w-[52px] h-[52px] shrink-0 overflow-hidden bg-zinc-100 rounded-sm">
                            <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* More News Section */}
      {trendingArticles.length > 0 && (
        <div className="w-full border-t border-zinc-200 py-10 bg-zinc-50/50">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-wide mb-6">
              More News
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingArticles.slice(0, 4).map((art, index) => (
                <Link key={art._id || art.id || index} href={getArticleUrl(art)} className="group flex flex-col gap-3 cursor-pointer">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-sm bg-zinc-100">
                    <img
                      src={art.image || art.featuredImage || '/images/magazinegazette-logo.jpg'}
                      alt={art.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      {art.category || "News"}
                    </span>
                    <h4 className="text-xs font-semibold text-zinc-800 leading-snug group-hover:underline line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
