import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Product from './models/Product.js';
import Client from './models/Client.js';
import Testimonial from './models/Testimonial.js';
import ContactMessage from './models/ContactMessage.js';
import Service from './models/Service.js';
import SiteSettings from './models/SiteSettings.js';
import HeroSlide from './models/HeroSlide.js';

/** Build a full Unsplash URL from a photo id. */
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const heroSlides = [
  {
    name: 'Building Excellence',
    heading: 'Building Excellence. Designing Experiences.',
    highlightText: 'Designing Experiences.',
    description:
      'Premium Civil Construction, Luxury Interiors, UPVC Windows, Aluminium and Glass Solutions for Modern Living.',
    image: img('1486406146926-c627a92ad1ab'),
    buttonText: 'Explore Projects',
    buttonLink: '/projects',
    order: 0,
    active: true,
    overlayOpacity: 58,
  },
  {
    name: 'Luxury Interiors',
    heading: 'Spaces Designed to Inspire.',
    highlightText: 'Designed to Inspire.',
    description:
      'Transforming residential and commercial spaces with elegant interior design and exceptional craftsmanship.',
    image: img('1600585154340-be6161a56a0c'),
    buttonText: 'Explore Projects',
    buttonLink: '/projects',
    order: 1,
    active: true,
    overlayOpacity: 58,
  },
  {
    name: 'Windows & Glass',
    heading: 'Modern Windows. Lasting Quality.',
    highlightText: 'Lasting Quality.',
    description:
      'High-quality UPVC, aluminium and glass solutions designed for durability, comfort and contemporary style.',
    image: img('1487958449943-2429e8be8625'),
    buttonText: 'View Services',
    buttonLink: '/products',
    order: 2,
    active: true,
    overlayOpacity: 58,
  },
  {
    name: 'Our Craftsmanship',
    heading: 'Your Vision. Our Craftsmanship.',
    highlightText: 'Our Craftsmanship.',
    description:
      'From construction to the finest interior details, we bring your ideas to life with precision and care.',
    image: img('1497366754035-f200968a6e72'),
    buttonText: 'Start a Project',
    buttonLink: '/contact',
    order: 3,
    active: true,
    overlayOpacity: 58,
  },
];

/* ------------------------------------------------------------------ */
/* Sample content — only inserted when a collection is empty.          */
/* ------------------------------------------------------------------ */

const services = [
  {
    title: 'Civil Construction',
    icon: 'civil',
    description:
      'End-to-end civil construction for residential and commercial builds, from foundation to handover.',
    features: ['Foundation & Structure', 'Quality Materials', 'Site Management'],
    order: 1,
  },
  {
    title: 'Interior Design',
    icon: 'interior',
    description:
      'Thoughtful interior design that balances aesthetics, comfort and everyday functionality.',
    features: ['Space Planning', 'Custom Furniture', 'Turnkey Execution'],
    order: 2,
  },
  {
    title: 'Aluminum & Glass Works',
    icon: 'glass',
    description:
      'Precision aluminum and glass installations for facades, partitions and openings.',
    features: ['Sliding & Casement Systems', 'Frameless Partitions', 'Weather Sealing'],
    order: 3,
  },
  {
    title: 'Renovation Services',
    icon: 'renovation',
    description:
      'Careful renovations that refresh existing spaces while preserving what matters.',
    features: ['Modular Upgrades', 'Structural Repairs', 'On-time Handover'],
    order: 4,
  },
  {
    title: 'Commercial Projects',
    icon: 'commercial',
    description:
      'Fit-outs and builds for offices, retail and hospitality, delivered at scale.',
    features: ['Office Fit-outs', 'Retail Builds', 'MEP Coordination'],
    order: 5,
  },
  {
    title: 'Residential Projects',
    icon: 'residential',
    description:
      'Homes built with detail and care — villas, apartments and turnkey residences.',
    features: ['Villa Construction', 'Turnkey Finishing', 'Landscape Works'],
    order: 6,
  },
];

const projects = [
  {
    title: 'The Aurelia Residence',
    category: 'Residential',
    location: 'Lahore, Punjab',
    year: 2025,
    area: '4,800 sq.ft',
    featured: true,
    description:
      'A warm contemporary villa built around open light wells and hand-finished surfaces.',
    scope: ['Structural Civil Work', 'Turnkey Finishing', 'MEP Coordination', 'Quality Assurance'],
    images: [
      img('photo-1613490493576-7fde63acd811'),
      img('photo-1600585154340-be6161a56a0c'),
      img('photo-1600566753086-00f18fb6b3ea'),
    ],
    completedAt: 'March 2025',
    testimonial: {
      quote:
        'DECORA delivered our home two weeks ahead of schedule and the finish quality exceeded expectations.',
      author: 'Rohit & Ananya Sharma',
      role: 'Homeowners',
    },
  },
  {
    title: 'Meridian Corporate Tower',
    category: 'Commercial',
    location: 'Karachi, Sindh',
    year: 2024,
    area: '42,000 sq.ft',
    featured: true,
    description:
      'A 12-storey corporate tower with a glass facade and fully fitted Grade-A office floors.',
    scope: ['Structural Civil Work', 'Facade Glazing', 'MEP Coordination', 'Quality Assurance'],
    images: [
      img('photo-1486406146926-c627a92ad1ab'),
      img('photo-1497366754035-f200968a6e72'),
      img('photo-1497366811353-6870744d04b2'),
    ],
    completedAt: 'August 2024',
    testimonial: {
      quote:
        'Their project management kept a complex tower build on timeline without cutting corners.',
      author: 'Vikram Malhotra',
      role: 'Director, Meridian Group',
    },
  },
  {
    title: 'Luxe Haven Interiors',
    category: 'Interior',
    location: 'Islamabad, Capital Territory',
    year: 2025,
    area: '3,200 sq.ft',
    featured: true,
    description:
      'A refined penthouse interior with layered lighting, stone accents and custom joinery.',
    scope: ['Space Planning', 'Custom Joinery', 'Lighting Design', 'Styling & Handover'],
    images: [
      img('photo-1600210492486-724fe5c67fb0'),
      img('photo-1618221195710-dd6b41faaea6'),
      img('photo-1494526585095-c41746248156'),
    ],
    completedAt: 'June 2025',
    testimonial: {
      quote:
        'Every detail — from the cabinetry to the lighting — was executed exactly as designed.',
      author: 'Neha Kapoor',
      role: 'Client',
    },
  },
  {
    title: 'Skyline Business Park',
    category: 'Civil',
    location: 'Faisalabad, Punjab',
    year: 2023,
    area: '85,000 sq.ft',
    featured: false,
    description:
      'A low-rise business campus with landscaped courtyards and column-free workspaces.',
    scope: ['Structural Civil Work', 'External Works', 'MEP Coordination', 'Quality Assurance'],
    images: [
      img('photo-1487958449943-2429e8be8625'),
      img('photo-1470723710355-95304d8aece4'),
      img('photo-1486718448742-163732cd1544'),
    ],
    completedAt: 'November 2023',
  },
  {
    title: 'Heritage Villa Renovation',
    category: 'Renovation',
    location: 'Rawalpindi, Punjab',
    year: 2024,
    area: '5,500 sq.ft',
    featured: true,
    description:
      'A careful restoration of a decades-old villa, blending original detailing with modern services.',
    scope: ['Structural Repairs', 'Heritage Plastering', 'MEP Upgrades', 'Turnkey Finishing'],
    images: [
      img('photo-1580587771525-78b9dba3b914'),
      img('photo-1502005229762-cf1b2da7c5d6'),
      img('photo-1560448204-e02f11c3d0e2'),
    ],
    completedAt: 'October 2024',
    testimonial: {
      quote:
        'They restored the original character of the villa while quietly upgrading everything behind the walls.',
      author: 'Mahendra Singh',
      role: 'Property Owner',
    },
  },
  {
    title: 'Onyx Kitchen Studio',
    category: 'Interior',
    location: 'Gujranwala, Punjab',
    year: 2025,
    area: '1,400 sq.ft',
    featured: true,
    description:
      'A sleek modular kitchen with matte-black hardware, quartz counters and integrated lighting.',
    scope: ['Modular Carpentry', 'Countertop Fabrication', 'Lighting Design', 'Handover'],
    images: [
      img('photo-1484154218962-a197022b5858'),
      img('photo-1556912173-3bb406ef7e77'),
      img('photo-1631679706909-1844bbd07221'),
    ],
    completedAt: 'February 2025',
  },
];

const products = [
  {
    title: 'Premium Aluminum Sliding Windows',
    category: 'Aluminum & Glass',
    description:
      'Heavy-duty sliding windows with smooth runners, tight weather seals and slim sightlines.',
    features: ['Thermally Broken Profiles', 'Twin Roller Track', 'Weatherproof Seals'],
    image: img('photo-1470723710355-95304d8aece4'),
    featured: true,
  },
  {
    title: 'Frameless Glass Partitions',
    category: 'Aluminum & Glass',
    description:
      'Minimal frameless partitions that divide spaces while keeping light flowing through.',
    features: ['10–12mm Toughened Glass', 'Concealed Fixings', 'Acoustic Options'],
    image: img('photo-1517581177682-a085bb7ffb15'),
    featured: false,
  },
  {
    title: 'Modular Kitchen Interiors',
    category: 'Interior Design',
    description:
      'Factory-precision modular kitchens with soft-close hardware and easy-care finishes.',
    features: ['Soft-close Hardware', 'Moisture-resistant Carcasses', 'Custom Storage Layouts'],
    image: img('photo-1556912173-3bb406ef7e77'),
    featured: true,
  },
  {
    title: 'False Ceiling & Lighting Systems',
    category: 'Interior Design',
    description:
      'Layered gypsum and POP ceilings with integrated cove, spot and pendant lighting.',
    features: ['Gypsum & POP Options', 'Cove Lighting Layouts', 'Fire-rated Boards'],
    image: img('photo-1600566752355-35792bedcfea'),
    featured: false,
  },
  {
    title: 'Designer Doors & Windows',
    category: 'Doors & Windows',
    description:
      'Statement entry doors and matching internal joinery in veneer, laminate and glass.',
    features: ['Veneer & Laminate Finishes', 'Concealed Hinges', 'Security Hardware'],
    image: img('photo-1497215728101-856f4ea42174'),
    featured: false,
  },
  {
    title: 'Office Workstation Fit-Outs',
    category: 'Office Interiors',
    description:
      'Complete workstation fit-outs — desks, storage and cable management — installed at scale.',
    features: ['Ergonomic Layouts', 'Cable Management', 'Bulk Rollout Ready'],
    image: img('photo-1524758631624-e2822e304c36'),
    featured: true,
  },
];

const clients = [
  { name: 'Sterling InfraTech', industry: 'Real Estate', logo: '', order: 1 },
  { name: 'Nova Realty', industry: 'Development', logo: '', order: 2 },
  { name: 'Orion Hotels', industry: 'Hospitality', logo: '', order: 3 },
  { name: 'Vertex Malls', industry: 'Retail', logo: '', order: 4 },
  { name: 'Zenith Hospitals', industry: 'Healthcare', logo: '', order: 5 },
  { name: 'Prisma Interiors', industry: 'Design Studio', logo: '', order: 6 },
];

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Managing Director',
    company: 'Sterling InfraTech',
    rating: 5,
    text: 'The construction quality is excellent and every milestone was met on schedule.',
    featured: true,
  },
  {
    name: 'Priya Nair',
    role: 'Founder',
    company: 'Prisma Interiors',
    rating: 5,
    text: 'A rare team that cares about finish details as much as we do — our clients are thrilled.',
    featured: true,
  },
  {
    name: 'Sanjay Verma',
    role: 'Operations Head',
    company: 'Orion Hotels',
    rating: 5,
    text: 'Four properties delivered across two states, all handed over without a single delay claim.',
    featured: true,
  },
  {
    name: 'Kavita Joshi',
    role: 'Homeowner',
    company: '',
    rating: 5,
    text: 'From demolition to final styling, the renovation was clean, transparent and beautifully done.',
    featured: false,
  },
];

const settingsDoc = {
  key: 'site',
  companyName: 'DECORA Civil & Interiors',
  tagline: 'Building Excellence. Designing Experiences.',
  phone: '+92 334 9125409',
  whatsapp: '923349125409',
  email: 'hello@decora-civil.com',
  address: 'Hascol Pump, Peshawar Ring Rd., near Sarhad University, Garhi Sikandar Khan, Peshawar, 25000, Pakistan',
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  mapEmbed:
    'https://maps.google.com/maps?q=Hascol%20Pump%2C%20Peshawar%20Ring%20Rd.%2C%20near%20Sarhad%20University%2C%20Garhi%20Sikandar%20Khan%2C%20Peshawar%2C%2025000%2C%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed',
  social: {
    instagram: 'https://instagram.com/decora.civil',
    linkedin: 'https://linkedin.com/company/decora-civil',
    facebook: 'https://facebook.com/decora.civil',
    youtube: 'https://youtube.com/@decora-civil',
  },
  about: {
    story:
      'DECORA Civil & Interiors is a Peshawar-based design-and-build studio delivering civil construction and turnkey interiors since 2015. We bring architects, engineers and craftspeople under one roof so clients get one accountable team from first sketch to final handover.',
    mission:
      'To deliver durable, beautifully finished spaces on time and on budget for every client.',
    vision:
      'To be Pakistan\'s most trusted civil and interiors partner.',
    values: ['Integrity', 'Craftsmanship', 'Innovation', 'Timeliness'],
  },
  stats: { projects: 150, clients: 100, years: 10, cities: 20 },
};

/* ------------------------------------------------------------------ */
/* Seed runner                                                          */
/* ------------------------------------------------------------------ */

/** Insert `docs` into `Model` only when the collection is empty. */
async function seedIfEmpty(Model, docs, label) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`  - ${label}: ${count} existing, skipped`);
    return count;
  }
  // Model.create (not insertMany) so schema hooks run — slugs, defaults, etc.
  await Model.create(docs);
  console.log(`  - ${label}: inserted ${docs.length}`);
  return docs.length;
}

/** Create the admin account from env vars (upsert, password hashed by hook). */
async function ensureAdmin() {
  const name = process.env.ADMIN_NAME || 'DECORA Admin';
  const email = (process.env.ADMIN_EMAIL || 'admin@decora.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Decora@2026';

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    existing.name = name;
    existing.password = password; // re-hashed by the pre('save') hook
    await existing.save();
    console.log(`  - Admin: refreshed "${email}"`);
    return;
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`  - Admin: created "${email}"`);
}

async function main() {
  console.log('\n=== DECORA seed starting ===\n');
  await connectDB();

  console.log('Ensuring admin user:');
  await ensureAdmin();

  console.log('\nSeeding collections:');
  await seedIfEmpty(HeroSlide, heroSlides, 'Hero slides');
  await seedIfEmpty(Service, services, 'Services');
  await seedIfEmpty(Project, projects, 'Projects');
  await seedIfEmpty(Product, products, 'Products');
  await seedIfEmpty(Client, clients, 'Clients');
  await seedIfEmpty(Testimonial, testimonials, 'Testimonials');

  // Settings are always upserted so env/docs stay in sync.
  await SiteSettings.findOneAndUpdate(
    { key: 'site' },
    { $set: settingsDoc },
    { upsert: true, new: true, runValidators: true }
  );
  console.log('  - Settings: upserted');

  const [s, p, pr, c, t, m] = await Promise.all([
    Service.countDocuments(),
    Project.countDocuments(),
    Product.countDocuments(),
    Client.countDocuments(),
    Testimonial.countDocuments(),
    ContactMessage.countDocuments(),
  ]);

  console.log('\n=== Seed complete ===');
  console.log(
    `  services=${s} projects=${p} products=${pr} clients=${c} testimonials=${t} messages=${m}`
  );
  console.log(
    `  admin: ${process.env.ADMIN_EMAIL || 'admin@decora.com'} / ${
      process.env.ADMIN_PASSWORD || 'Decora@2026'
    }\n`
  );
}

try {
  await main();
} catch (err) {
  console.error('\n[seed] Failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
  console.log('[seed] Disconnected from MongoDB');
}
