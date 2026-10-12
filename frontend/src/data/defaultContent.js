/**
 * DECORA — Default website content.
 *
 * This is the single source of truth for everything that is NOT a repeatable
 * collection (projects / products / clients / testimonials / hero slides are
 * managed through their own dashboard pages).
 *
 * The dashboard stores admin overrides in MongoDB under matching keys
 * (`site`, `navigation`, `stats`, `services`, `whyChooseUs`, `home`, `about`,
 * `contact`, `projectsPage`, `productsPage`, `cta`). At runtime the saved
 * overrides are deep-merged over these defaults, so the site always renders —
 * online or offline.
 */

import {
  SITE,
  NAV_LINKS,
  FOOTER_SERVICES,
  STATS,
  SERVICES,
  WHY_CHOOSE_US,
  TEAM,
  COMPANY_STORY,
  MISSION,
  VISION,
  VALUES,
  ACHIEVEMENTS,
  CONTACT_FORM_SERVICES,
  COMPANY_ABOUT,
  PROJECT_CATEGORIES,
  PRODUCT_CATEGORIES,
  img,
} from './seed'

export const DEFAULT_CONTENT = {
  /* ------------------------------ Brand / contact ----------------------------- */
  site: {
    name: SITE.name,
    fullName: SITE.fullName,
    tagline: SITE.tagline,
    subTagline: SITE.subTagline,
    phone: SITE.phone,
    whatsapp: SITE.whatsapp,
    email: SITE.email,
    address: SITE.address,
    hours: SITE.hours,
    mapEmbed: SITE.mapEmbed,
    founded: SITE.founded,
    social: { ...SITE.social },
    whatsappMessage: 'Hi DECORA! I would like to discuss a project (site, scope & timeline).',
    footerDescription: `${SITE.fullName} delivers premium civil construction, interiors and modern building solutions — crafted with precision, delivered with trust.`,
    copyright: `© {year} ${SITE.fullName}. All rights reserved.`,
  },

  /* ------------------------------- Menu & footer ------------------------------ */
  navigation: {
    links: NAV_LINKS.map((l) => ({ label: l.label, to: l.to })),
    footerColumns: [
      {
        title: 'Quick Links',
        links: NAV_LINKS.map((l) => ({ label: l.label, to: l.to })),
      },
      {
        title: 'Our Services',
        links: FOOTER_SERVICES.map((s) => ({ label: s, to: '/products' })),
      },
    ],
    footerTagline: SITE.tagline,
    privacyLabel: 'Privacy Policy',
    privacyLink: '#top',
  },

  /* --------------------------------- Statistics -------------------------------- */
  stats: STATS.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),

  /* ---------------------------------- Services --------------------------------- */
  services: SERVICES.map((s) => ({
    title: s.title,
    slug: s.slug,
    icon: s.icon,
    description: s.description,
    features: [...s.features],
  })),

  /* -------------------------------- Why choose us ------------------------------ */
  whyChooseUs: WHY_CHOOSE_US.map((w) => ({ ...w })),

  /* --------------------------------- Home page --------------------------------- */
  home: {
    about: {
      eyebrow: 'Who We Are',
      title: 'Craftsmanship is our language.',
      titleHighlight: 'Precision is our habit.',
      text: COMPANY_ABOUT,
      textSecondary:
        'From structural civil work to the last coat of finish, everything is planned, engineered and supervised by our own teams — so quality never depends on guesswork.',
      image: img('1590725140246-20acdee442be', 1400),
      imageSecondary: img('1486406146926-c627a92ad1ab', 800),
      badgeValue: '10+',
      badgeLabel: 'Years of Excellence',
      highlights: [
        'In-house engineering, design & execution teams',
        '150+ projects delivered across 20+ cities',
        'Single-point accountability from drawing to handover',
      ],
      ctaLabel: 'Read more about DECORA',
      ctaLink: '/about',
    },
    servicesHeading: {
      eyebrow: 'What We Do',
      title: 'End-to-end solutions,',
      titleHighlight: 'executed flawlessly.',
      description:
        'Specialised divisions, one standard of quality — coordinated under a single accountable team.',
      ctaLabel: 'All Services',
      ctaLink: '/products',
    },
    projectsHeading: {
      eyebrow: 'Selected Work',
      title: 'Featured',
      titleHighlight: 'Projects.',
      description:
        'A glimpse of residences, workplaces and commercial builds delivered by our teams.',
      ctaLabel: 'View All Projects',
      ctaLink: '/projects',
    },
    whyHeading: {
      eyebrow: 'Why Choose Us',
      title: 'The DECORA',
      titleHighlight: 'difference.',
      description: 'We are not the cheapest quote you will get — we are the last one you will need.',
      ctaLabel: 'Start a Conversation',
    },
    testimonialsHeading: {
      eyebrow: 'Testimonials',
      title: 'Trusted by those we',
      titleHighlight: 'build for.',
      description: '',
    },
    clientsHeading: {
      eyebrow: 'Trusted Clients',
      description: 'Brands, builders and families who chose to build with us.',
    },
  },

  /* --------------------------------- About page -------------------------------- */
  about: {
    header: {
      eyebrow: 'Who We Are',
      title: 'About DECORA',
      description: COMPANY_ABOUT,
      image: img('1504307651254-35680f356dfd', 2000),
    },
    storyHeading: { eyebrow: 'Our Story', title: 'A decade of building with intent.' },
    storyParagraphs: [
      'DECORA began in 2015 with a two-person crew and a simple conviction — that a building is only as good as the people who care about it. Ten years on, that conviction still runs the company: engineers, designers, project managers and craftsmen work under one roof, so nothing important is ever handed off to chance.',
      'We keep execution in-house wherever it matters most — surveying, shuttering, joinery, glazing and finishing — because quality is hardest to control once it is outsourced. Every site runs on documented QA/QC checklists, weekly accountability and the same detailing standard we would accept in our own homes.',
    ],
    collage: {
      primary: img('1590725140246-20acdee442be'),
      secondary: img('1486406146926-c627a92ad1ab'),
      badgeValue: '10+',
      badgeLabel: 'of Excellence',
    },
    milestonesLabel: 'Milestones',
    milestones: COMPANY_STORY.map((m) => ({ ...m })),
    pillarsHeading: {
      eyebrow: 'What Guides Us',
      title: 'Mission, vision and the values behind both.',
      description:
        'Two promises we hold ourselves to, and the four principles that decide how we keep them.',
    },
    mission: MISSION,
    vision: VISION,
    values: VALUES.map((v) => ({ ...v })),
    teamHeading: {
      eyebrow: 'The People',
      title: 'Minds behind the craft.',
      description:
        'Designers, engineers and project managers who obsess over the details no one else sees.',
    },
    team: TEAM.map((m) => ({ ...m })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
    achievementsImage: img('1486718448742-163732cd1544', 2000),
  },

  /* -------------------------------- Contact page ------------------------------- */
  contact: {
    header: {
      eyebrow: 'Get In Touch',
      title: 'Contact Us',
      description:
        'Discuss your site, scope or idea with a DECORA consultant — we respond within one working day.',
      image: img('1504307651254-35680f356dfd', 2000),
    },
    reachHeading: {
      eyebrow: 'Reach Us',
      title: 'Let’s start the conversation.',
      description:
        'Walk in, call, or send a note — the same team that builds your project answers your message.',
    },
    socialsLabel: 'Follow our work',
    responseLabel: 'Response time —',
    responseTime: 'Within 1 working day',
    formHeading: 'Send a Message',
    formText:
      'Share a few lines about your site, scope and timeline — we will come back with next steps and an honest budget range.',
    successHeading: 'Message received!',
    successText: 'A DECORA consultant will call you back within one working day.',
    serviceLabel: 'Service',
    serviceOptions: [...CONTACT_FORM_SERVICES],
  },

  /* -------------------------------- Projects page ------------------------------ */
  projectsPage: {
    header: {
      eyebrow: 'Our Portfolio',
      title: 'Our Projects',
      description:
        'Every project is a proof of process — planned precisely, built fearlessly, finished obsessively.',
      image: img('1486718448742-163732cd1544', 2000),
    },
    filters: [...PROJECT_CATEGORIES],
    cta: {
      eyebrow: 'Your Project, Next',
      title: 'Have a site in mind? Let’s make it remarkable.',
      text: 'Share your drawings, plot details or just an idea — we will come back with a clear scope, timeline and budget.',
    },
  },

  /* -------------------------------- Products page ------------------------------ */
  productsPage: {
    header: {
      eyebrow: 'What We Offer',
      title: 'Products & Services',
      description:
        'From civil works to finished interiors — a single source for materials, systems and turnkey solutions.',
      image: img('1497215728101-856f4ea42174', 2000),
    },
    servicesHeading: {
      eyebrow: 'Services',
      title: 'Ways we build.',
      description:
        'Six disciplines, one accountable team — take a single service or hand us the whole project.',
    },
    catalogHeading: {
      eyebrow: 'Catalogue',
      title: 'Products & materials.',
      description:
        'Specify from our standard range, or ask us to source and fabricate to your drawing.',
    },
    productCategories: [...PRODUCT_CATEGORIES],
    trustNotes: [
      {
        icon: 'shield',
        title: 'Quality-certified sourcing',
        text: 'Materials pulled only from approved mills, brands and fabricators — with test certificates on file.',
      },
      {
        icon: 'trending',
        title: 'Bulk supply for builders',
        text: 'Trade pricing and consistent volumes for contractors, developers and fit-out teams.',
      },
      {
        icon: 'clock',
        title: 'Site delivery schedules',
        text: 'Dispatch planned against your programme, so the right stock lands on the right day.',
      },
    ],
    cta: {
      eyebrow: 'Need a custom solution?',
      title: 'Tell us what you need — we source, fabricate and install.',
      text: 'Non-standard sizes, bespoke finishes or bulk quantities: share the specification and we will build a custom quote around it.',
    },
  },

  /* ------------------------------ Global CTA band ------------------------------ */
  cta: {
    eyebrow: 'Ready When You Are',
    title: 'Let’s Build Something Extraordinary Together.',
    text: 'Tell us about your site, your vision and your timeline — we will bring the engineering, design and craftsmanship.',
    image: img('1504307651254-35680f356dfd', 2000),
    primaryLabel: 'Get Free Consultation',
    secondaryLabel: 'Explore Projects',
    secondaryLink: '/projects',
  },
}

export default DEFAULT_CONTENT
