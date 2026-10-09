/**
 * DECORA — Seed content & site configuration
 * Used as the fallback data layer so the site is fully functional
 * even when the API/database is unavailable.
 */

export const img = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const SITE = {
  name: 'DECORA',
  fullName: 'DECORA Civil & Interiors',
  tagline: 'Building Excellence. Designing Experiences.',
  subTagline: 'Premium Civil Construction & Interior Solutions for Modern Living.',
  phone: '+92 334 9125409',
  whatsapp: '923349125409',
  email: 'hello@decora-civil.com',
  address: 'Hascol Pump, Peshawar Ring Rd., near Sarhad University, Garhi Sikandar Khan, Peshawar, 25000, Pakistan',
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  mapEmbed:
    'https://maps.google.com/maps?q=Hascol%20Pump%2C%20Peshawar%20Ring%20Rd.%2C%20near%20Sarhad%20University%2C%20Garhi%20Sikandar%20Khan%2C%20Peshawar%2C%2025000%2C%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed',
  founded: 2015,
  social: {
    instagram: 'https://instagram.com/decora.civil',
    linkedin: 'https://linkedin.com/company/decora-civil',
    facebook: 'https://facebook.com/decora.civil',
    youtube: 'https://youtube.com/@decora.civil',
  },
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Products & Services', to: '/products' },
  { label: 'Contact', to: '/contact' },
]

export const FOOTER_SERVICES = [
  'Civil Construction',
  'Interior Design',
  'Aluminum & Glass Works',
  'Renovation Services',
  'Commercial Projects',
  'Residential Projects',
]

/* ---------------------------------- HERO ---------------------------------- */

export const HERO_SLIDES = [
  {
    id: 'default-construction',
    name: 'Building Excellence',
    heading: 'Building Excellence. Designing Experiences.',
    highlightText: 'Designing Experiences.',
    description:
      'Premium Civil Construction, Luxury Interiors, UPVC Windows, Aluminium and Glass Solutions for Modern Living.',
    image: img('1486406146926-c627a92ad1ab', 2000),
    buttonText: 'Explore Projects',
    buttonLink: '/projects',
    order: 0,
    active: true,
    overlayOpacity: 58,
  },
  {
    id: 'default-interiors',
    name: 'Luxury Interiors',
    heading: 'Spaces Designed to Inspire.',
    highlightText: 'Designed to Inspire.',
    description:
      'Transforming residential and commercial spaces with elegant interior design and exceptional craftsmanship.',
    image: img('1600585154340-be6161a56a0c', 2000),
    buttonText: 'Explore Projects',
    buttonLink: '/projects',
    order: 1,
    active: true,
    overlayOpacity: 58,
  },
  {
    id: 'default-windows',
    name: 'Windows & Glass',
    heading: 'Modern Windows. Lasting Quality.',
    highlightText: 'Lasting Quality.',
    description:
      'High-quality UPVC, aluminium and glass solutions designed for durability, comfort and contemporary style.',
    image: img('1487958449943-2429e8be8625', 2000),
    buttonText: 'View Services',
    buttonLink: '/products',
    order: 2,
    active: true,
    overlayOpacity: 58,
  },
  {
    id: 'default-craftsmanship',
    name: 'Our Craftsmanship',
    heading: 'Your Vision. Our Craftsmanship.',
    highlightText: 'Our Craftsmanship.',
    description:
      'From construction to the finest interior details, we bring your ideas to life with precision and care.',
    image: img('1497366754035-f200968a6e72', 2000),
    buttonText: 'Start a Project',
    buttonLink: '/contact',
    order: 3,
    active: true,
    overlayOpacity: 58,
  },
]

/* ---------------------------------- STATS --------------------------------- */

export const STATS = [
  { value: 150, suffix: '+', label: 'Projects Completed' },
  { value: 100, suffix: '+', label: 'Happy Clients' },
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Cities Served' },
]

/* -------------------------------- SERVICES -------------------------------- */

export const SERVICES = [
  {
    title: 'Civil Construction',
    slug: 'civil-construction',
    icon: 'civil',
    description:
      'End-to-end civil construction — from foundation to finishing — executed with engineered precision and uncompromising quality.',
    features: ['Structural Work', 'Turnkey Delivery', 'Quality Assurance'],
  },
  {
    title: 'Interior Design',
    slug: 'interior-design',
    icon: 'interior',
    description:
      'Bespoke interiors that balance aesthetics and function, crafted around the way you live and work.',
    features: ['Modular Systems', 'Bespoke Furniture', 'Lighting Design'],
  },
  {
    title: 'Aluminum & Glass Works',
    slug: 'aluminum-glass-works',
    icon: 'glass',
    description:
      'Precision-fabricated aluminum and glazing systems — facades, partitions, windows and frameless assemblies.',
    features: ['Facade Systems', 'Frameless Partitions', 'Custom Fabrication'],
  },
  {
    title: 'Renovation Services',
    slug: 'renovation-services',
    icon: 'renovation',
    description:
      'Thoughtful renovation that revitalises existing spaces while preserving their character and value.',
    features: ['Space Revitalisation', 'Structural Repair', 'Finish Upgrades'],
  },
  {
    title: 'Commercial Projects',
    slug: 'commercial-projects',
    icon: 'commercial',
    description:
      'Offices, retail and hospitality builds delivered on aggressive timelines without cutting corners.',
    features: ['Design & Build', 'MEP Coordination', 'Zero-Disruption Handover'],
  },
  {
    title: 'Residential Projects',
    slug: 'residential-projects',
    icon: 'residential',
    description:
      'Villas, apartments and turnkey homes built with attention to every detail your family will live with.',
    features: ['Turnkey Homes', 'Villa Construction', 'Site Management'],
  },
]

/* -------------------------------- PROJECTS -------------------------------- */

const P = (overrides) => ({
  status: 'Completed',
  scope: ['Structural Civil Work', 'Turnkey Finishing', 'MEP Coordination', 'Quality Assurance'],
  testimonial: null,
  ...overrides,
})

export const PROJECTS = [
  P({
    title: 'The Aurelia Residence',
    slug: 'the-aurelia-residence',
    category: 'Residential',
    location: 'Lahore, Punjab',
    client: 'Private Client',
    year: 2025,
    area: '4,800 sq.ft',
    featured: true,
    cover: img('1613490493576-7fde63acd811'),
    images: [
      img('1613490493576-7fde63acd811'),
      img('1600585154340-be6161a56a0c'),
      img('1600566753086-00f18fb6b3ea'),
    ],
    description:
      'A contemporary villa shaped around light and landscape. Load-bearing walls give way to double-height glazing, warm stone and hand-finished wood detailing across two serene levels.',
    scope: ['Foundation & Structure', 'Facade & Glazing', 'Turnkey Interiors', 'Landscape Handover'],
    completedAt: 'March 2025',
    testimonial: {
      quote:
        'DECORA handled everything from excavation to the final styling pass. The finish quality is genuinely at par with the best builders we have seen.',
      author: 'Ritika & Ankit Mehra',
      role: 'Homeowners',
    },
  }),
  P({
    title: 'Meridian Corporate Tower',
    slug: 'meridian-corporate-tower',
    category: 'Commercial',
    location: 'Karachi, Sindh',
    client: 'Meridian Estates',
    year: 2024,
    area: '42,000 sq.ft',
    featured: true,
    cover: img('1486406146926-c627a92ad1ab'),
    images: [
      img('1486406146926-c627a92ad1ab'),
      img('1497366754035-f200968a6e72'),
      img('1497366811353-6870744d04b2'),
    ],
    description:
      'A nine-storey corporate tower with a unitised glass facade, column-free office floors and a triple-height lobby — delivered in 14 months with zero lost-time incidents.',
    scope: ['RCC Superstructure', 'Unitised Glass Facade', 'Core & Shell MEP', 'Interior Fit-Out'],
    completedAt: 'November 2024',
    testimonial: {
      quote:
        'Their project management discipline kept a very aggressive timeline on track. Handover was on the date promised — to the day.',
      author: 'Vikram Shah',
      role: 'Director, Meridian Estates',
    },
  }),
  P({
    title: 'Luxe Haven Interiors',
    slug: 'luxe-haven-interiors',
    category: 'Interior',
    location: 'Islamabad, Capital Territory',
    client: 'Private Client',
    year: 2025,
    area: '3,200 sq.ft',
    featured: true,
    cover: img('1600210492486-724fe5c67fb0'),
    images: [
      img('1600210492486-724fe5c67fb0'),
      img('1618221195710-dd6b41faaea6'),
      img('1494526585095-c41746248156'),
    ],
    description:
      'A muted, material-led apartment interior — travertine, brushed bronze and smoked oak — designed for quiet luxury and everyday ease.',
    scope: ['Space Planning', 'Joinery & Woodwork', 'Lighting & Electrical', 'Styling & Handover'],
    completedAt: 'June 2025',
    testimonial: {
      quote:
        'Every corner of the home feels intentional. The team obsessed over details we would never have thought of ourselves.',
      author: 'Neha Kapoor',
      role: 'Homeowner',
    },
  }),
  P({
    title: 'Skyline Business Park',
    slug: 'skyline-business-park',
    category: 'Civil',
    location: 'Faisalabad, Punjab',
    client: 'Skyline Infra Ltd.',
    year: 2023,
    area: '85,000 sq.ft',
    featured: false,
    cover: img('1487958449943-2429e8be8625'),
    images: [
      img('1487958449943-2429e8be8625'),
      img('1470723710355-95304d8aece4'),
      img('1486718448742-163732cd1544'),
    ],
    description:
      'Three interconnected office blocks with landscaped courtyards, built in a live campus environment using staged phasing to keep operations running.',
    scope: ['Site Development', 'RCC Frames', 'External Facades', 'MEP Installation'],
    completedAt: 'August 2023',
  }),
  P({
    title: 'Heritage Villa Renovation',
    slug: 'heritage-villa-renovation',
    category: 'Renovation',
    location: 'Rawalpindi, Punjab',
    client: 'Private Client',
    year: 2024,
    area: '5,500 sq.ft',
    featured: true,
    cover: img('1580587771525-78b9dba3b914'),
    images: [
      img('1580587771525-78b9dba3b914'),
      img('1502005229762-cf1b2da7c5d6'),
      img('1560448204-e02f11c3d0e2'),
    ],
    description:
      'A 40-year-old villa reimagined for modern family life — structural repairs, updated services and contemporary interiors woven into its original character.',
    scope: ['Structural Repair', 'Complete Rewiring', 'Interior Redesign', 'Heritage Restoration'],
    completedAt: 'February 2024',
    testimonial: {
      quote:
        'They preserved everything we loved about the old house and quietly made it work like a brand-new home.',
      author: 'S. Rathore',
      role: 'Homeowner',
    },
  }),
  P({
    title: 'Onyx Kitchen Studio',
    slug: 'onyx-kitchen-studio',
    category: 'Interior',
    location: 'Gujranwala, Punjab',
    client: 'Private Client',
    year: 2025,
    area: '1,400 sq.ft',
    featured: true,
    cover: img('1484154218962-a197022b5858'),
    images: [
      img('1484154218962-a197022b5858'),
      img('1556912173-3bb406ef7e77'),
      img('1631679706909-1844bbd07221'),
    ],
    description:
      'A chef-grade kitchen with handleless cabinetry, book-matched stone surfaces and integrated appliances — the centrepiece of a sea-facing apartment.',
    scope: ['Modular Cabinetry', 'Stone Fabrication', 'Appliance Integration', 'Task Lighting'],
    completedAt: 'January 2025',
    testimonial: {
      quote:
        'The kitchen is the heart of our home now. Functionally it is perfect, and it photographs like a magazine spread.',
      author: 'Meher & Zain Ali',
      role: 'Homeowners',
    },
  }),
  P({
    title: 'Nova Retail Plaza',
    slug: 'nova-retail-plaza',
    category: 'Commercial',
    location: 'Hyderabad, Sindh',
    client: 'Nova Realty',
    year: 2023,
    area: '30,000 sq.ft',
    featured: false,
    cover: img('1449844908441-8829872d2607'),
    images: [
      img('1449844908441-8829872d2607'),
      img('1517581177682-a085bb7ffb15'),
      img('1524758631624-e2822e304c36'),
    ],
    description:
      'A two-level retail plaza with storefront glazing, wayfinding and common-area finishes designed for high footfall and fast fit-out turnover.',
    scope: ['Civil & Shell', 'Storefront Glazing', 'Common Areas', 'Signage & Wayfinding'],
    completedAt: 'May 2023',
  }),
  P({
    title: 'Serenity Farmhouse',
    slug: 'serenity-farmhouse',
    category: 'Residential',
    location: 'Nathia Gali, KP',
    client: 'Private Client',
    year: 2024,
    area: '6,200 sq.ft',
    featured: true,
    cover: img('1616486338812-3dadae4b4ace'),
    images: [
      img('1616486338812-3dadae4b4ace'),
      img('1600596542815-ffad4c1539a9'),
      img('1600585154526-990dced4db0d'),
    ],
    description:
      'A tropical retreat of exposed concrete, deep overhangs and indoor-outdoor living — engineered for monsoon resilience and cross ventilation.',
    scope: ['Turnkey Civil Work', 'Waterproofing Systems', 'Joinery & Screens', 'Pool & Deck'],
    completedAt: 'October 2024',
    testimonial: {
      quote:
        'Monsoon-tested and still flawless a year later. DECORA build quality is the real deal.',
      author: 'Arjun Nair',
      role: 'Homeowner',
    },
  }),
  P({
    title: 'Vertex Office Fit-Out',
    slug: 'vertex-office-fit-out',
    category: 'Interior',
    location: 'Peshawar, KPK',
    client: 'Vertex Systems',
    year: 2025,
    area: '12,000 sq.ft',
    featured: false,
    cover: img('1497215728101-856f4ea42174'),
    images: [
      img('1497215728101-856f4ea42174'),
      img('1522771739844-6a9f6d5f14af'),
      img('1497366811353-6870744d04b2'),
    ],
    description:
      'A 120-seat agile workspace with acoustic pods, glass cabins and a warm material palette — delivered in a live building over six weeks.',
    scope: ['Space Planning', 'Glass Partitions', 'Workstation Install', 'Acoustic Treatment'],
    completedAt: 'April 2025',
  }),
  P({
    title: 'Riverside Enclave',
    slug: 'riverside-enclave',
    category: 'Civil',
    location: 'Multan, Punjab',
    client: 'Harmony Builders',
    year: 2022,
    area: '120,000 sq.ft',
    featured: false,
    cover: img('1512917774080-9991f1c4c750'),
    images: [
      img('1512917774080-9991f1c4c750'),
      img('1541888946425-d81bb19240f5'),
      img('1560185007-c5ca9d2c014d'),
    ],
    description:
      'A 36-unit residential enclave with shared amenities, storm-water management and phased handover across three construction blocks.',
    scope: ['Mass Excavation', 'Block-wise RCC', 'Internal Services', 'Common Amenities'],
    completedAt: 'December 2022',
  }),
]

export const PROJECT_CATEGORIES = [
  'All',
  'Residential',
  'Commercial',
  'Interior',
  'Civil',
  'Renovation',
]

/* -------------------------------- PRODUCTS -------------------------------- */

export const PRODUCTS = [
  {
    title: 'Premium Aluminum Sliding Windows',
    slug: 'premium-aluminum-sliding-windows',
    category: 'Aluminum & Glass',
    image: img('1470723710355-95304d8aece4'),
    description:
      'Thermally-broken aluminum sliding systems with concealed drainage, premium hardware and double-glazed units for quiet, weather-tight living.',
    features: ['Powder-Coated Frames', 'Double Glazing', 'Smooth Roller Hardware'],
    price: 'On request',
    featured: true,
  },
  {
    title: 'Frameless Glass Partitions',
    slug: 'frameless-glass-partitions',
    category: 'Aluminum & Glass',
    image: img('1517581177682-a085bb7ffb15'),
    description:
      '10–12mm toughened frameless partitions with slim channel details — acoustic privacy without losing light or openness.',
    features: ['Acoustic Glass Options', 'Slim Floor Channels', 'Custom Heights'],
    price: 'On request',
    featured: true,
  },
  {
    title: 'Modular Kitchen Interiors',
    slug: 'modular-kitchen-interiors',
    category: 'Interior Design',
    image: img('1556912173-3bb406ef7e77'),
    description:
      'Ergonomic modular kitchens with soft-close hardware, moisture-resistant carcasses and stone or quartz countertops fabricated to measure.',
    features: ['Soft-Close Fittings', 'Moisture-Resistant Carcasses', 'Stone Countertops'],
    price: 'On request',
    featured: true,
  },
  {
    title: 'False Ceiling & Lighting Systems',
    slug: 'false-ceiling-lighting-systems',
    category: 'Interior Design',
    image: img('1600566752355-35792bedcfea'),
    description:
      'Layered gypsum and pop ceiling designs with integrated cove, spot and profile lighting planned for every room’s mood.',
    features: ['Gypsum & POP Designs', 'Cove Lighting', 'Dimmable Profiles'],
    price: 'On request',
    featured: false,
  },
  {
    title: 'Designer Doors & Windows',
    slug: 'designer-doors-windows',
    category: 'Doors & Windows',
    image: img('1600566753190-17f0baa2a6c3'),
    description:
      'Engineered main doors, flush doors and windows in veneer, laminate or paint-grade finishes with precision hardware.',
    features: ['Veneer & Laminate Finishes', 'Concealed Hinges', 'Security Hardware'],
    price: 'On request',
    featured: false,
  },
  {
    title: 'Office Workstation Fit-Outs',
    slug: 'office-workstation-fit-outs',
    category: 'Office Interiors',
    image: img('1524758631624-e2822e304c36'),
    description:
      'Modular workstations, acoustic pods and collaboration zones delivered as a single coordinated fit-out with cabling built in.',
    features: ['Cable Management', 'Acoustic Pods', 'Ergonomic Setups'],
    price: 'On request',
    featured: true,
  },
  {
    title: 'Complete Home Renovation Package',
    slug: 'complete-home-renovation-package',
    category: 'Home Renovation',
    image: img('1502005229762-cf1b2da7c5d6'),
    description:
      'A single-team renovation covering demolition, civil repairs, services, finishes and styling — one timeline, one point of contact.',
    features: ['Single-Point Delivery', 'Civil & MEP Repairs', 'Turnkey Finishing'],
    price: 'On request',
    featured: false,
  },
  {
    title: 'Structural Steel & Civil Works',
    slug: 'structural-steel-civil-works',
    category: 'Civil Works',
    image: img('1504307651254-35680f356dfd'),
    description:
      'Foundations, RCC frames, pre-engineered structures and industrial civil works executed to drawing with documented QA/QC.',
    features: ['RCC & PEB Structures', 'Documented QA/QC', 'Site Survey & Layout'],
    price: 'On request',
    featured: false,
  },
  {
    title: 'Interior & Exterior Plywood Panels',
    slug: 'interior-exterior-plywood-panels',
    category: 'Construction Materials',
    image: img('1631679706909-1844bbd07221'),
    description:
      'BWP-grade plywood, MDF, wicker and cladding panels sourced from trusted mills — supplied to site or used in our own joinery.',
    features: ['BWP/BWR Grades', 'Termite Treatment', 'Bulk Supply Available'],
    price: 'On request',
    featured: false,
  },
]

export const PRODUCT_CATEGORIES = [
  'All',
  'Civil Works',
  'Interior Design',
  'Aluminum & Glass',
  'Doors & Windows',
  'Office Interiors',
  'Home Renovation',
  'Construction Materials',
]

/* ------------------------------- WHY CHOOSE ------------------------------- */

export const WHY_CHOOSE_US = [
  {
    icon: 'quality',
    title: 'Premium Quality',
    description: 'Grade-A materials, documented QA/QC and finishes inspected before handover.',
  },
  {
    icon: 'team',
    title: 'Skilled Team',
    description: 'In-house engineers, supervisors and craftsmen — not loose subcontractor networks.',
  },
  {
    icon: 'time',
    title: 'On-Time Delivery',
    description: 'Milestone-driven planning with transparent weekly progress reporting.',
  },
  {
    icon: 'value',
    title: 'Affordable Excellence',
    description: 'Premium outcomes without premium waste — value engineered from day one.',
  },
  {
    icon: 'design',
    title: 'Modern Designs',
    description: 'Architecture-led thinking informed by contemporary global design practice.',
  },
  {
    icon: 'satisfaction',
    title: 'Customer Satisfaction',
    description: 'A single point of contact, clear communication and after-handover support.',
  },
]

/* ------------------------------- TESTIMONIALS ----------------------------- */

export const TESTIMONIALS = [
  {
    name: 'Ritika Mehra',
    role: 'Homeowner',
    company: 'The Aurelia Residence',
    rating: 5,
    text: 'From the first drawing to the final handover, DECORA felt like a partner rather than a contractor. The craftsmanship in our villa is exceptional.',
    avatar: img('1573496359142-b8d87734a5a2', 200),
    featured: true,
  },
  {
    name: 'Vikram Shah',
    role: 'Director',
    company: 'Meridian Estates',
    rating: 5,
    text: 'We handed them a brutal 14-month timeline on a 42,000 sq.ft tower. They handed over on the promised date with zero quality punch-lists of note.',
    avatar: img('1507003211169-0a1dd7228f2d', 200),
    featured: true,
  },
  {
    name: 'Neha Kapoor',
    role: 'Homeowner',
    company: 'Luxe Haven Interiors',
    rating: 5,
    text: 'The interior team understood the quiet, warm aesthetic we wanted immediately. Every detail — from joinery to lighting — feels considered.',
    avatar: img('1580489944761-15a19d654956', 200),
    featured: true,
  },
  {
    name: 'Arjun Nair',
    role: 'Homeowner',
    company: 'Serenity Farmhouse',
    rating: 5,
    text: 'A year of monsoons later, the house is still perfect. Their waterproofing and detailing standards are genuinely superior.',
    avatar: img('1500648767791-00dcc994a43e', 200),
    featured: true,
  },
  {
    name: 'Priya Deshmukh',
    role: 'Head of Admin',
    company: 'Vertex Systems',
    rating: 5,
    text: 'Our office fit-out happened in six weeks without disrupting a single working day. Coordination and site discipline were outstanding.',
    avatar: img('1544005313-94ddf0286df2', 200),
    featured: true,
  },
  {
    name: 'Karan Malhotra',
    role: 'VP Projects',
    company: 'Skyline Infra Ltd.',
    rating: 5,
    text: 'Building in a live campus is never easy. DECORA staged the work so cleanly that our tenants never noticed construction was happening.',
    avatar: img('1472099645785-5658abf4ff4e', 200),
    featured: false,
  },
]

/* --------------------------------- CLIENTS -------------------------------- */

export const CLIENTS = [
  { name: 'Sterling InfraTech', industry: 'Real Estate' },
  { name: 'Nova Realty', industry: 'Development' },
  { name: 'Orion Hotels', industry: 'Hospitality' },
  { name: 'Vertex Malls', industry: 'Retail' },
  { name: 'Zenith Hospitals', industry: 'Healthcare' },
  { name: 'Prisma Interiors', industry: 'Design Studio' },
  { name: 'UrbanNest Developers', industry: 'Development' },
  { name: 'Meridian Estates', industry: 'Real Estate' },
  { name: 'Skyline Infra', industry: 'Infrastructure' },
  { name: 'Harmony Builders', industry: 'Construction' },
  { name: 'Elysian Estates', industry: 'Real Estate' },
  { name: 'Orbit Workspaces', industry: 'Co-Working' },
]

/* ---------------------------------- TEAM ---------------------------------- */

export const TEAM = [
  {
    name: 'Aditya Rathore',
    role: 'Founder & CEO',
    bio: 'Civil engineer with 18 years across residential and commercial delivery. Sets DECORA’s quality bar and culture.',
    image: img('1560250097-0b93528c311a', 800),
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Head of Design',
    bio: 'Interior architect translating how clients live into material, light and detail-led spaces.',
    image: img('1573496359142-b8d87734a5a2', 800),
  },
  {
    name: 'Rahul Verma',
    role: 'Senior Project Manager',
    bio: 'Owns schedules, sites and stakeholders — the reason our handovers land on the promised date.',
    image: img('1507003211169-0a1dd7228f2d', 800),
  },
  {
    name: 'Imran Qureshi',
    role: 'Chief Engineer',
    bio: 'Structural specialist overseeing civil execution, QA/QC documentation and site safety.',
    image: img('1472099645785-5658abf4ff4e', 800),
  },
  {
    name: 'Aisha Fernandes',
    role: 'Design Lead',
    bio: 'Leads visualisation and detailing — turning concepts into shop drawings that site teams can build from.',
    image: img('1580489944761-15a19d654956', 800),
  },
]

/* --------------------------------- STORY ---------------------------------- */

export const COMPANY_STORY = [
  {
    year: '2015',
    title: 'The Foundation',
    text: 'DECORA is founded as a two-person civil contractor taking on residential builds with a simple promise — quality without excuses.',
  },
  {
    year: '2017',
    title: 'First Commercial Contract',
    text: 'A 20,000 sq.ft commercial build signs the beginning of our commercial projects division.',
  },
  {
    year: '2019',
    title: 'Interiors Studio Launch',
    text: 'An in-house design studio opens, bringing architecture, interiors and execution under one roof.',
  },
  {
    year: '2021',
    title: '100 Projects Milestone',
    text: 'We deliver our 100th project and expand into turnkey renovation services.',
  },
  {
    year: '2023',
    title: 'New Cities, New Scale',
    text: 'Operations expand to 20+ cities with dedicated engineering and QA/QC teams.',
  },
  {
    year: '2025',
    title: '150+ & Counting',
    text: 'Aluminum & glass fabrication scales up — completing DECORA’s modern building solutions stack.',
  },
]

export const MISSION =
  'To deliver civil construction and interior solutions of uncompromising quality — on time, on budget, and exactly as designed.'

export const VISION =
  'To be the most trusted name in premium construction and interiors, known for craftsmanship that outlives the trend cycle.'

export const VALUES = [
  { title: 'Integrity', text: 'What we quote is what you pay. What we promise is what you get.' },
  { title: 'Craftsmanship', text: 'Detailing standards we would accept in our own homes.' },
  { title: 'Innovation', text: 'Modern methods, materials and design thinking on every site.' },
  { title: 'Timeliness', text: 'Milestone-driven planning with weekly accountability.' },
]

export const ACHIEVEMENTS = [
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 100, suffix: '+', label: 'Happy Clients' },
  { value: 12, suffix: '', label: 'Design Awards' },
  { value: 20, suffix: '+', label: 'Cities Served' },
]

export const CONTACT_FORM_SERVICES = [
  'Civil Construction',
  'Interior Design',
  'Aluminum & Glass Works',
  'Renovation Services',
  'Commercial Projects',
  'Residential Projects',
  'Other',
]

export const COMPANY_ABOUT =
  'DECORA Civil & Interiors is a leading construction and interior solutions company delivering exceptional craftsmanship and innovative designs.'
