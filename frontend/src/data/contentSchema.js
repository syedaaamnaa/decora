/**
 * DECORA — Dashboard content schema.
 *
 * Declarative description of every editable website section. The admin
 * "Site Content" screen renders its forms directly from this file, so adding
 * a new editable field is a one-line change here (plus the matching default in
 * `defaultContent.js`).
 *
 * Field types: text | textarea | number | image | images | strings | list | object
 */

const SOCIAL_FIELDS = [
  { name: 'instagram', label: 'Instagram URL', type: 'text' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
  { name: 'facebook', label: 'Facebook URL', type: 'text' },
  { name: 'youtube', label: 'YouTube URL', type: 'text' },
]

const LINK_FIELDS = [
  { name: 'label', label: 'Label', type: 'text' },
  { name: 'to', label: 'Link (e.g. /about)', type: 'text' },
]

const HEADING_FIELDS = [
  { name: 'eyebrow', label: 'Eyebrow (small label)', type: 'text' },
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'titleHighlight', label: 'Gradient words (optional)', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
]

export const CONTENT_SECTIONS = [
  /* ------------------------------ Brand & contact ------------------------------ */
  {
    key: 'site',
    label: 'Brand & Contact',
    icon: 'globe',
    description: 'Business name, phone, WhatsApp, email, address, map and social links.',
    fields: [
      { name: 'name', label: 'Short name', type: 'text' },
      { name: 'fullName', label: 'Full business name', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'subTagline', label: 'Sub tagline', type: 'textarea' },
      { name: 'phone', label: 'Phone number', type: 'text' },
      { name: 'whatsapp', label: 'WhatsApp number (digits only)', type: 'text' },
      { name: 'whatsappMessage', label: 'WhatsApp prefilled message', type: 'textarea' },
      { name: 'email', label: 'Email address', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'hours', label: 'Working hours', type: 'text' },
      { name: 'mapEmbed', label: 'Google Maps embed URL', type: 'textarea' },
      { name: 'founded', label: 'Founded year', type: 'number' },
      { name: 'footerDescription', label: 'Footer description', type: 'textarea' },
      { name: 'copyright', label: 'Footer copyright ({year} = current year)', type: 'text' },
      { name: 'social', label: 'Social links', type: 'object', fields: SOCIAL_FIELDS },
    ],
  },

  /* --------------------------------- Navigation -------------------------------- */
  {
    key: 'navigation',
    label: 'Menu & Footer',
    icon: 'menu',
    description: 'Navbar links and every footer column / link.',
    fields: [
      { name: 'links', label: 'Navbar links', type: 'list', itemFields: LINK_FIELDS },
      {
        name: 'footerColumns',
        label: 'Footer columns',
        type: 'list',
        itemFields: [
          { name: 'title', label: 'Column heading', type: 'text' },
          { name: 'links', label: 'Links', type: 'list', itemFields: LINK_FIELDS },
        ],
      },
      { name: 'footerTagline', label: 'Footer bottom tagline', type: 'text' },
      { name: 'privacyLabel', label: 'Privacy link label', type: 'text' },
      { name: 'privacyLink', label: 'Privacy link URL', type: 'text' },
    ],
  },

  /* ---------------------------------- Statistics -------------------------------- */
  {
    key: 'stats',
    label: 'Home Statistics',
    icon: 'chart',
    description: 'The 150+ / 100+ / 10+ / 20+ counters shown on the home page.',
    rootList: true,
    itemFields: [
      { name: 'value', label: 'Number', type: 'number' },
      { name: 'suffix', label: 'Suffix (e.g. +)', type: 'text' },
      { name: 'label', label: 'Label', type: 'text' },
    ],
  },

  /* ---------------------------------- Services ---------------------------------- */
  {
    key: 'services',
    label: 'Services',
    icon: 'layers',
    description: 'The service cards used on the home and products pages.',
    rootList: true,
    itemFields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'icon', label: 'Icon key (civil / interior / glass / renovation / commercial / residential)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'features', label: 'Features', type: 'strings' },
      { name: 'slug', label: 'Slug (optional)', type: 'text' },
    ],
  },

  /* -------------------------------- Why choose us ------------------------------- */
  {
    key: 'whyChooseUs',
    label: 'Why Choose Us',
    icon: 'star',
    description: 'The trust cards on the home page.',
    rootList: true,
    itemFields: [
      { name: 'icon', label: 'Icon key (quality / team / time / value / design / satisfaction)', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  /* ---------------------------------- Home page --------------------------------- */
  {
    key: 'home',
    label: 'Home Page',
    icon: 'home',
    description: 'Section headings and the “Who We Are” preview block.',
    fields: [
      {
        name: 'about',
        label: '“Who We Are” preview',
        type: 'object',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'titleHighlight', label: 'Gradient words', type: 'text' },
          { name: 'text', label: 'Main text', type: 'textarea' },
          { name: 'textSecondary', label: 'Secondary text', type: 'textarea' },
          { name: 'image', label: 'Primary image', type: 'image' },
          { name: 'imageSecondary', label: 'Secondary image', type: 'image' },
          { name: 'badgeValue', label: 'Badge number', type: 'text' },
          { name: 'badgeLabel', label: 'Badge label', type: 'text' },
          { name: 'highlights', label: 'Checklist items', type: 'strings' },
          { name: 'ctaLabel', label: 'Button label', type: 'text' },
          { name: 'ctaLink', label: 'Button link', type: 'text' },
        ],
      },
      { name: 'servicesHeading', label: 'Services heading', type: 'object', fields: [...HEADING_FIELDS, { name: 'ctaLabel', label: 'Link label', type: 'text' }, { name: 'ctaLink', label: 'Link URL', type: 'text' }] },
      { name: 'projectsHeading', label: 'Projects heading', type: 'object', fields: [...HEADING_FIELDS, { name: 'ctaLabel', label: 'Link label', type: 'text' }, { name: 'ctaLink', label: 'Link URL', type: 'text' }] },
      { name: 'whyHeading', label: 'Why choose us heading', type: 'object', fields: [...HEADING_FIELDS, { name: 'ctaLabel', label: 'Button label', type: 'text' }] },
      { name: 'testimonialsHeading', label: 'Testimonials heading', type: 'object', fields: HEADING_FIELDS },
      { name: 'clientsHeading', label: 'Clients heading', type: 'object', fields: HEADING_FIELDS },
    ],
  },

  /* ---------------------------------- About page -------------------------------- */
  {
    key: 'about',
    label: 'About Page',
    icon: 'info',
    description: 'Story, milestones, mission, vision, values, team and achievements.',
    fields: [
      { name: 'header', label: 'Page header', type: 'object', fields: [...HEADING_FIELDS, { name: 'image', label: 'Background image', type: 'image' }] },
      { name: 'storyHeading', label: 'Story heading', type: 'object', fields: [{ name: 'eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'title', label: 'Title', type: 'text' }] },
      { name: 'storyParagraphs', label: 'Story paragraphs', type: 'strings' },
      {
        name: 'collage',
        label: 'Story images',
        type: 'object',
        fields: [
          { name: 'primary', label: 'Primary image', type: 'image' },
          { name: 'secondary', label: 'Secondary image', type: 'image' },
          { name: 'badgeValue', label: 'Badge number', type: 'text' },
          { name: 'badgeLabel', label: 'Badge label', type: 'text' },
        ],
      },
      { name: 'milestonesLabel', label: 'Milestones label', type: 'text' },
      { name: 'milestones', label: 'Milestones / timeline', type: 'list', itemFields: [
        { name: 'year', label: 'Year', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ] },
      { name: 'pillarsHeading', label: 'Mission/Vision heading', type: 'object', fields: HEADING_FIELDS },
      { name: 'mission', label: 'Mission', type: 'textarea' },
      { name: 'vision', label: 'Vision', type: 'textarea' },
      { name: 'values', label: 'Values', type: 'list', itemFields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ] },
      { name: 'teamHeading', label: 'Team heading', type: 'object', fields: HEADING_FIELDS },
      { name: 'team', label: 'Team members', type: 'list', itemFields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'image', label: 'Photo', type: 'image' },
      ] },
      { name: 'achievements', label: 'Achievements counters', type: 'list', itemFields: [
        { name: 'value', label: 'Number', type: 'number' },
        { name: 'suffix', label: 'Suffix', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' },
      ] },
      { name: 'achievementsImage', label: 'Achievements background', type: 'image' },
    ],
  },

  /* --------------------------------- Contact page ------------------------------- */
  {
    key: 'contact',
    label: 'Contact Page',
    icon: 'mail',
    description: 'Headings, form copy and the service dropdown options.',
    fields: [
      { name: 'header', label: 'Page header', type: 'object', fields: [...HEADING_FIELDS, { name: 'image', label: 'Background image', type: 'image' }] },
      { name: 'reachHeading', label: 'Reach-us heading', type: 'object', fields: HEADING_FIELDS },
      { name: 'socialsLabel', label: 'Socials label', type: 'text' },
      { name: 'responseLabel', label: 'Response label', type: 'text' },
      { name: 'responseTime', label: 'Response time', type: 'text' },
      { name: 'formHeading', label: 'Form heading', type: 'text' },
      { name: 'formText', label: 'Form description', type: 'textarea' },
      { name: 'successHeading', label: 'Success heading', type: 'text' },
      { name: 'successText', label: 'Success message', type: 'textarea' },
      { name: 'serviceLabel', label: 'Service field label', type: 'text' },
      { name: 'serviceOptions', label: 'Service options', type: 'strings' },
    ],
  },

  /* -------------------------------- Projects page ------------------------------- */
  {
    key: 'projectsPage',
    label: 'Projects Page',
    icon: 'briefcase',
    description: 'Header, filter categories and closing CTA.',
    fields: [
      { name: 'header', label: 'Page header', type: 'object', fields: [...HEADING_FIELDS, { name: 'image', label: 'Background image', type: 'image' }] },
      { name: 'filters', label: 'Filter categories', type: 'strings' },
      { name: 'cta', label: 'Closing CTA', type: 'object', fields: [
        { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ] },
    ],
  },

  /* -------------------------------- Products page ------------------------------- */
  {
    key: 'productsPage',
    label: 'Products & Services',
    icon: 'box',
    description: 'Headers, catalogue categories, trust band and closing CTA.',
    fields: [
      { name: 'header', label: 'Page header', type: 'object', fields: [...HEADING_FIELDS, { name: 'image', label: 'Background image', type: 'image' }] },
      { name: 'servicesHeading', label: 'Services heading', type: 'object', fields: HEADING_FIELDS },
      { name: 'catalogHeading', label: 'Catalogue heading', type: 'object', fields: HEADING_FIELDS },
      { name: 'productCategories', label: 'Product categories', type: 'strings' },
      { name: 'trustNotes', label: 'Trust band', type: 'list', itemFields: [
        { name: 'icon', label: 'Icon key (shield / trending / clock)', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ] },
      { name: 'cta', label: 'Closing CTA', type: 'object', fields: [
        { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ] },
    ],
  },

  /* ---------------------------------- Global CTA -------------------------------- */
  {
    key: 'cta',
    label: 'Global CTA Band',
    icon: 'sparkle',
    description: 'The full-width call-to-action used across the site.',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'image', label: 'Background image', type: 'image' },
      { name: 'primaryLabel', label: 'Primary button label', type: 'text' },
      { name: 'secondaryLabel', label: 'Secondary button label', type: 'text' },
      { name: 'secondaryLink', label: 'Secondary button link', type: 'text' },
    ],
  },
]

export default CONTENT_SECTIONS
