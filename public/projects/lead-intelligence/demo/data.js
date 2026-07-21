/** Fictional sanitized demo data — not connected to any live system. */

export const META = {
  asOfLabel: "Demo snapshot · Jun 6, 2026",
  lastRun: "2026-06-06 06:00 CST",
};

export const STATS = [
  { label: "Records scraped", value: "524", tone: "success" },
  { label: "Clean records", value: "498", tone: "default" },
  { label: "Categories", value: "38", tone: "default" },
  { label: "Duplicates removed", value: "26", tone: "warning" },
];

export const LEADS = [
  { name: "Bayou Auto Repair", category: "Automotive", phone: "(318) 555-0142", city: "Monroe", source: "yellowpages" },
  { name: "Cypress Dental Group", category: "Healthcare", phone: "(318) 555-0198", city: "West Monroe", source: "google_maps" },
  { name: "Delta HVAC Services", category: "Home Services", phone: "(318) 555-0211", city: "Monroe", source: "chamber_dir" },
  { name: "Magnolia Law Firm", category: "Legal", phone: "(318) 555-0267", city: "Monroe", source: "yellowpages" },
  { name: "Red River Realty", category: "Real Estate", phone: "(318) 555-0314", city: "Monroe", source: "google_maps" },
  { name: "Sterling Accounting", category: "Professional Services", phone: "(318) 555-0339", city: "Monroe", source: "chamber_dir" },
  { name: "Twin Oaks Restaurant", category: "Food & Beverage", phone: "(318) 555-0388", city: "Monroe", source: "yellowpages" },
  { name: "Ouachita IT Solutions", category: "Technology", phone: "(318) 555-0412", city: "Monroe", source: "google_maps" },
  { name: "Pine Grove Pharmacy", category: "Healthcare", phone: "(318) 555-0445", city: "Monroe", source: "chamber_dir" },
  { name: "Riverbend Fitness", category: "Fitness", phone: "(318) 555-0478", city: "West Monroe", source: "yellowpages" },
];

export const CATEGORIES = [
  { name: "Healthcare", count: 62 },
  { name: "Automotive", count: 48 },
  { name: "Home Services", count: 44 },
  { name: "Professional Services", count: 41 },
  { name: "Food & Beverage", count: 38 },
  { name: "Retail", count: 35 },
  { name: "Other", count: 230 },
];

export const PIPELINE_STEPS = [
  { step: "Scrape", status: "done", detail: "524 raw records from 3 public directories" },
  { step: "Clean", status: "done", detail: "Normalized phones, addresses, categories" },
  { step: "Dedupe", status: "done", detail: "26 duplicates removed by name + phone match" },
  { step: "Export", status: "done", detail: "leads_clean.csv + PostgreSQL table ready" },
];
