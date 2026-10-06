/**
 * Markets Decoded Inc. — site content
 * ------------------------------------------------------------------
 * Single source of truth for all repeated content on the website.
 * Edit text here; pages re-render automatically on load.
 *
 * Next.js migration: each top-level key maps to a JSON file, an MDX
 * collection or a CMS model. See MIGRATION_TO_NEXTJS.md.
 *
 * Content rules (from 00_Strategy/STRATEGY.md):
 *  - Client names are withheld; every case is anonymized.
 *  - Fees and fee structures are NOT published. There are no free offers.
 *  - Internal planning numbers (revenue targets, margins, FX) never
 *    appear on the public site.
 */
(function (root) {
  'use strict';

  var SITE_DATA = {
    /* ---------------------------------------------------------------- */
    site: {
      name: 'Markets Decoded Inc.',
      shortName: 'Markets Decoded',
      url: 'https://www.marketsdecoded.com',
      email: 'contactus@marketsdecoded.com',
      linkedin: 'https://www.linkedin.com/company/markets-decoded/',
      tagline: 'Rapid Value Creation in 100 days.',
      altTaglines: ['Value, Decoded.', 'Rapid value creation for the sponsor-backed middle market.'],
      positioning:
        'For PE sponsors and their portfolio companies, Markets Decoded is the senior-led value creation partner that turns the investment thesis into measurable cash and EBITDA impact within 100 days, across the US and Canada.',
      legal: 'All rights reserved. Federally incorporated in Canada.'
    },

    /* ---------------------------------------------------------------- */
    /* Image slots. Set `src` to a real photo (e.g. 'assets/img/hero.jpg')
       and the generated SVG art is replaced automatically.               */
    media: {
      'home-hero':        { src: null, alt: '' },
      'services-hero':    { src: null, alt: '' },
      'industries-hero':  { src: null, alt: '' },
      'results-hero':     { src: null, alt: '' },
      'insights-hero':    { src: null, alt: '' },
      'about-hero':       { src: null, alt: '' },
      'locations-hero':   { src: null, alt: '' },
      'careers-hero':     { src: null, alt: '' },
      'contact-hero':     { src: null, alt: '' }
    },

    /* ---------------------------------------------------------------- */
    navigation: [
      {
        label: 'Services',
        href: 'services.html',
        id: 'services',
        mega: {
          intro: 'Five practices, one goal: measurable cash and EBITDA impact within 100 days.',
          columns: [
            {
              heading: 'Practices',
              links: [
                { label: 'Financial Transformation', href: 'services.html#financial' },
                { label: 'Go-To-Market Transformation', href: 'services.html#gtm' },
                { label: 'Risk Transformation', href: 'services.html#risk' },
                { label: 'Digital Transformation', href: 'services.html#digital' },
                { label: 'Cultural Transformation', href: 'services.html#cultural' }
              ]
            },
            {
              heading: 'How we engage',
              links: [
                { label: 'Diagnostics', href: 'services.html#ladder' },
                { label: 'Sprints', href: 'services.html#ladder' },
                { label: 'Programs', href: 'services.html#ladder' },
                { label: 'Retainers', href: 'services.html#ladder' }
              ]
            }
          ],
          feature: {
            eyebrow: 'Signature offer',
            title: 'The 13-Week Cash & CCC Sprint',
            href: 'services.html#financial'
          }
        }
      },
      {
        label: 'Industries',
        href: 'industries.html',
        id: 'industries',
        mega: {
          intro: 'Sector depth where the lower and core middle market is most active.',
          columns: [
            {
              heading: 'Lead sectors',
              links: [
                { label: 'Industrial & Energy Distribution', href: 'industries.html#industrial-energy' },
                { label: 'Healthcare Services & Diagnostics', href: 'industries.html#healthcare' },
                { label: 'Business & Marketing Services', href: 'industries.html#business-services' }
              ]
            },
            {
              heading: 'Also serving',
              links: [
                { label: 'Consumer & Multi-site Services', href: 'industries.html#consumer' },
                { label: 'Software-enabled Services', href: 'industries.html#software' },
                { label: 'Non-profit & Institutional', href: 'industries.html#institutional' }
              ]
            }
          ],
          feature: {
            eyebrow: 'Who we serve',
            title: 'PE sponsors and portfolio companies with $20M–$500M revenue',
            href: 'industries.html#sponsors'
          }
        }
      },
      { label: 'Results', href: 'results.html', id: 'results' },
      { label: 'Insights', href: 'insights.html', id: 'insights' },
      {
        label: 'About',
        href: 'about.html',
        id: 'about',
        mega: {
          intro: 'A senior-led partner for North American portfolios, based in Toronto.',
          columns: [
            {
              heading: 'Our firm',
              links: [
                { label: 'About us', href: 'about.html' },
                { label: 'Leadership', href: 'about.html#leadership' },
                { label: 'Expert network', href: 'about.html#expert-network' }
              ]
            },
            {
              heading: 'Connect',
              links: [
                { label: 'Locations', href: 'locations.html' },
                { label: 'Careers', href: 'careers.html' },
                { label: 'Contact', href: 'contact.html' }
              ]
            }
          ],
          feature: {
            eyebrow: 'Join us',
            title: 'Join our expert network of former CFOs, CROs and COOs',
            href: 'careers.html#expert-network'
          }
        }
      }
    ],

    /* ---------------------------------------------------------------- */
    /* Client results band (the four proof metrics).                     */
    metrics: [
      { value: 22, suffix: '%', label: 'Cash conversion cycle improvement', context: 'Energy distribution', caseId: 'energy-distribution' },
      { value: 15, suffix: '%', label: 'Revenue lift', context: 'Healthcare diagnostics', caseId: 'healthcare-diagnostics' },
      { value: 20, suffix: '%', label: 'Efficiency gains', context: 'Non-profit operations', caseId: 'non-profit' },
      { value: 14, suffix: '%', label: 'Cash conversion cycle improvement', context: 'Direct mail & marketing', caseId: 'direct-marketing' }
    ],

    /* ---------------------------------------------------------------- */
    practices: [
      {
        id: 'financial',
        name: 'Financial Transformation',
        short: 'Financial',
        number: '01',
        summary: 'Release trapped cash, shorten the cash conversion cycle and give the board a 13-week view it can trust.',
        description:
          'We lead with cash. Our teams baseline working capital, build a rolling 13-week cash flow and work receivables, payables and inventory in parallel, so released cash shows up on the balance sheet within the sprint.',
        services: [
          'Cash & Working Capital Diagnostic',
          '13-Week Cash & CCC Sprint',
          'Turnaround & Liquidity',
          'Exit Readiness',
          'Fractional CFO / Value Creation Office'
        ],
        outcomes: ['Cash conversion cycle', 'Working capital released', 'Lender confidence'],
        hero: true
      },
      {
        id: 'gtm',
        name: 'Go-To-Market Transformation',
        short: 'Go-To-Market',
        number: '02',
        summary: 'Reset pricing, sales compensation and commercial execution to grow revenue without adding fixed cost.',
        description:
          'Sales compensation is often the cheapest EBITDA lever in the building. We diagnose the commercial engine, redesign incentives and pricing, and coach the front line until the new behaviours show up in the numbers.',
        services: [
          'Commercial Diagnostic',
          'Sales Comp & Commercial Excellence',
          'Pricing Optimization',
          'Sales enablement'
        ],
        outcomes: ['Revenue growth', 'Price realization', 'Sales productivity']
      },
      {
        id: 'risk',
        name: 'Risk Transformation',
        short: 'Risk',
        number: '03',
        summary: 'See the portfolio’s cyber exposure from the outside in, then remediate what matters before it reaches the board.',
        description:
          'Starting with an external exposure scan, we assess cyber risk across one company or a whole portfolio, prioritize remediation and set up continuous monitoring with our technology partner.',
        services: [
          'Portfolio Cyber Exposure Scan',
          'Cyber Risk Assessment',
          'Remediation roadmap',
          'Cyber monitoring (portfolio license)'
        ],
        outcomes: ['Critical exposures remediated', 'Time to detect', 'Board-ready risk view']
      },
      {
        id: 'digital',
        name: 'Digital Transformation',
        short: 'Digital',
        number: '04',
        summary: 'Automate the manual work that slows close, billing and reporting, and build a roadmap the deal team can underwrite.',
        description:
          'We find the quick wins first: automation in finance and operations that pays back inside the hold period. Then we sequence the larger ERP, data and systems decisions into a roadmap tied to the value creation plan.',
        services: [
          'Automation Quick Wins',
          'Digital Transformation Roadmap',
          'ERP and systems selection support',
          'KPI and reporting design'
        ],
        outcomes: ['Efficiency gains', 'Faster close', 'Reporting cadence']
      },
      {
        id: 'cultural',
        name: 'Cultural Transformation',
        short: 'Cultural',
        number: '05',
        summary: 'Align leadership and teams behind the plan, especially through add-ons and post-merger integration.',
        description:
          'Value creation plans fail when people do not move with them. We measure culture quickly, integrate teams after an add-on and build the leadership routines that keep a plan on track past day 45.',
        services: [
          'Culture Pulse',
          'Post-Merger Culture Integration',
          'Leadership alignment',
          'Change management for the 100-day plan'
        ],
        outcomes: ['Retention of key talent', 'Integration speed', 'Engagement']
      }
    ],

    /* ---------------------------------------------------------------- */
    /* Productized offer ladder. Fees intentionally omitted.             */
    offers: [
      {
        tier: 1,
        name: 'Diagnostic',
        duration: '2–3 weeks',
        purpose: 'A focused first step: the baseline and a prioritized roadmap.',
        items: ['Cash & Working Capital Diagnostic', 'Commercial Diagnostic', 'Culture Pulse', 'Cyber Risk Assessment']
      },
      {
        tier: 2,
        name: 'Sprint',
        duration: '6–12 weeks',
        purpose: 'Our core engagement: one lever, one measurable outcome.',
        items: ['13-Week Cash & CCC Sprint', 'Sales Comp & Commercial Excellence', 'Pricing Optimization', 'Post-Merger Culture Integration', 'Automation Quick Wins'],
        highlight: true
      },
      {
        tier: 3,
        name: 'Program',
        duration: '3–9 months',
        purpose: 'Multi-lever value creation across the hold.',
        items: ['100-Day Value Creation Plan + PMO', 'Turnaround & Liquidity', 'Exit Readiness', 'Digital Transformation Roadmap']
      },
      {
        tier: 4,
        name: 'Retainer',
        duration: 'Ongoing',
        purpose: 'Continuous support across the portfolio.',
        items: ['Fractional CFO / Value Creation Office', 'Cyber monitoring (portfolio license)']
      }
    ],

    /* ---------------------------------------------------------------- */
    /* Case studies. Client names withheld. Impact figures from the
       strategy's proof metrics; the Risk case is qualitative until it
       is retro-quantified (see STRATEGY.md §3.3).                       */
    caseStudies: [
      {
        id: 'energy-distribution',
        title: 'Cash flow excellence for an energy parts distributor',
        focus: 'Cash Flow Excellence',
        practiceId: 'financial',
        industry: 'Industrial & Energy Distribution',
        industryId: 'industrial-energy',
        metric: { value: '22%', label: 'CCC improvement' },
        challenge:
          'The board and leadership team of a mid-market energy parts distributor lacked visibility into the company’s ongoing cash position and flows.',
        approach: [
          'Developed a detailed 13-week cash flow model.',
          'Gave the board and leadership a clear, ongoing view of cash position and flows.'
        ],
        impact: [
          '22% improvement in the cash conversion cycle.',
          'Leadership empowered to manage cash better and keep the company out of distress.'
        ],
        featured: true
      },
      {
        id: 'healthcare-diagnostics',
        title: 'Sales transformation for a healthcare diagnostics company',
        focus: 'Sales Transformation',
        practiceId: 'gtm',
        industry: 'Healthcare Services & Diagnostics',
        industryId: 'healthcare',
        metric: { value: '15%', label: 'Revenue lift' },
        challenge:
          'A mid-market healthcare diagnostics company needed its sales function to drive growth as part of a broader transformation.',
        approach: [
          'Developed a detailed, drivers-based sales compensation model.',
          'Aligned the model with the company’s transformation efforts.'
        ],
        impact: [
          '15% lift in revenue.',
          'Transformed the sales function and mobilized key resources to fuel revenue growth.'
        ],
        featured: true
      },
      {
        id: 'direct-marketing',
        title: 'Digital transformation and liquidity in a turnaround',
        focus: 'Digital Transformation',
        practiceId: 'digital',
        industry: 'Business & Marketing Services',
        industryId: 'business-services',
        metric: { value: '14%', label: 'CCC improvement' },
        challenge:
          'A direct mail and marketing company in a turnaround needed to modernize while protecting liquidity.',
        approach: [
          'Led digital transformation and liquidity management efforts.',
          'Aligned resources with the digital transformation roadmap.',
          'Developed a detailed liquidity model to show the impact of financial performance on covenants.'
        ],
        impact: [
          '14% improvement in the cash conversion cycle.',
          'A clear view of covenant headroom for leadership and the sponsor.'
        ],
        featured: true
      },
      {
        id: 'non-profit',
        title: 'Culture assessment through an organization-wide merger',
        focus: 'Cultural Transformation',
        practiceId: 'cultural',
        industry: 'Non-profit & Institutional',
        industryId: 'institutional',
        metric: { value: '20%', label: 'Efficiency gains' },
        challenge:
          'The country office of a global non-profit faced friction during an organization-wide inter-department merger.',
        approach: [
          'Performed a detailed culture assessment to identify points of friction.',
          'Advised leadership on next steps and a roadmap to unlock value.'
        ],
        impact: [
          '20% efficiency gains.',
          'Identified frictions, communication gaps, structural roadblocks and silos.'
        ],
        featured: false
      },
      {
        id: 'sovereign-fund',
        title: 'Cyber resilience for a sovereign wealth fund',
        focus: 'Risk Management',
        practiceId: 'risk',
        industry: 'Institutional Investors',
        industryId: 'institutional',
        metric: { value: 'Cyber', label: 'Resilience & governance' },
        challenge:
          'A sovereign wealth fund needed stronger cyber resilience and governance.',
        approach: [
          'Advised on cyber resilience strategies.',
          'Enabled leadership to enact corrective governance measures.'
        ],
        impact: [
          'Provided a turn-key SaaS platform to minimize external cyber risk and mitigate cyber threats.',
          'Corrective governance measures adopted by leadership.'
        ],
        featured: false
      }
    ],

    /* ---------------------------------------------------------------- */
    industries: [
      {
        id: 'industrial-energy',
        name: 'Industrial & Energy Distribution',
        tier: 'lead',
        summary: 'Distributors and industrial services businesses where working capital, branch economics and pricing drive value.',
        levers: ['Working capital and CCC', 'Branch and SKU profitability', 'Pricing discipline'],
        caseId: 'energy-distribution'
      },
      {
        id: 'healthcare',
        name: 'Healthcare Services & Diagnostics',
        tier: 'lead',
        summary: 'Diagnostics, clinics and healthcare services where payer cycles, billing and multi-site operations shape cash.',
        levers: ['Order-to-cash and billing', 'Multi-site operating model', 'Cyber and data risk'],
        caseId: 'healthcare-diagnostics'
      },
      {
        id: 'business-services',
        name: 'Business & Marketing Services',
        tier: 'lead',
        summary: 'Agencies, direct marketing and outsourced services where commercial execution and utilization drive margin.',
        levers: ['Sales compensation', 'Pricing and account mix', 'Delivery efficiency'],
        caseId: 'direct-marketing'
      },
      {
        id: 'consumer',
        name: 'Consumer & Multi-site Services',
        tier: 'secondary',
        summary: 'Multi-location businesses that need consistent unit economics and fast integration of add-ons.',
        levers: ['Site-level KPIs', 'Add-on integration', 'Labour productivity']
      },
      {
        id: 'software',
        name: 'Software-enabled Services',
        tier: 'secondary',
        summary: 'Tech-enabled services companies scaling go-to-market and automating delivery.',
        levers: ['Go-to-market efficiency', 'Automation', 'Cyber posture']
      },
      {
        id: 'institutional',
        name: 'Non-profit & Institutional',
        tier: 'secondary',
        summary: 'Non-profits, institutions and institutional investors focused on culture, efficiency and cyber resilience.',
        levers: ['Operating efficiency', 'Culture and change', 'Cyber risk governance'],
        caseId: 'non-profit'
      }
    ],

    triggers: [
      { title: 'New platform close', body: 'Turn the investment thesis into a 100-day plan with owners and KPIs.' },
      { title: 'Add-on acquisition', body: 'Integrate teams, systems and culture without losing momentum.' },
      { title: 'Covenant pressure', body: 'Stand up a 13-week cash view and release working capital fast.' },
      { title: 'Two missed quarters', body: 'Diagnose the commercial and cost levers behind the miss.' },
      { title: 'CFO or CRO turnover', body: 'Give a new leader a fact base and early wins.' },
      { title: '12–24 months before exit', body: 'Tighten cash, KPIs and the equity story for buyers.' }
    ],

    sponsorTypes: [
      'Middle-market private equity sponsors',
      'Independent sponsors and search funds',
      'Family offices',
      'Private credit and ABL lenders',
      'Portfolio CEOs and CFOs'
    ],

    /* ---------------------------------------------------------------- */
    insights: [
      {
        id: '100-day-cash-playbook',
        type: 'Playbook',
        title: 'The 100-Day Cash Playbook',
        summary: 'How operating partners can release working capital and install a 13-week cash rhythm inside the first 100 days.',
        practiceId: 'financial',
        status: 'available',
        href: 'insight-100-day-cash-playbook.html',
        featured: true
      },
      {
        id: 'distributor-ccc-22',
        type: 'Case breakdown',
        title: 'How a mid-market distributor cut its cash conversion cycle 22%',
        summary: 'How a 13-week cash flow model gave the board and leadership the visibility to manage cash and avoid distress.',
        practiceId: 'financial',
        status: 'available',
        href: 'results.html#energy-distribution',
        featured: true
      },
      {
        id: '100-day-plans-day-45',
        type: 'Perspective',
        title: 'Why so many 100-day plans stall at day 45',
        summary: 'The plan is rarely the problem. Ownership, cadence and measurement usually are.',
        practiceId: 'cultural',
        status: 'available',
        href: 'insight-100-day-plans-day-45.html'
      },
      {
        id: 'sales-comp-ebitda',
        type: 'Perspective',
        title: 'Sales comp is your cheapest EBITDA lever',
        summary: 'Why redesigning incentives often beats new hires, new tools and new markets.',
        practiceId: 'gtm',
        status: 'available',
        href: 'insight-sales-comp-ebitda-lever.html'
      },
      {
        id: 'sales-comp-8-weeks',
        type: 'Playbook',
        title: 'Sales Comp Redesign in 8 Weeks',
        summary: 'A practical sequence for redesigning sales incentives without disrupting the quarter.',
        practiceId: 'gtm',
        status: 'available',
        href: 'insight-sales-comp-redesign-8-weeks.html'
      },
      {
        id: 'pmi-culture-checklist',
        type: 'Checklist',
        title: 'Post-Merger Culture Integration Checklist',
        summary: 'What to measure, decide and communicate in the first 90 days after an add-on closes.',
        practiceId: 'cultural',
        status: 'available',
        href: 'insight-post-merger-culture-checklist.html'
      },
      {
        id: 'portfolio-cyber-hygiene',
        type: 'Playbook',
        title: 'Portfolio Cyber Hygiene for Operating Partners',
        summary: 'The questions every operating partner should ask about cyber exposure across the portfolio.',
        practiceId: 'risk',
        status: 'available',
        href: 'insight-portfolio-cyber-hygiene.html'
      }
    ],

    newsletter: {
      name: 'Decoded',
      summary: 'A monthly newsletter on sponsor value creation: playbooks, case lessons and field notes from the US and Canada.'
    },

    /* ---------------------------------------------------------------- */
    pillars: [
      { id: 'fast', title: 'Fast', body: 'A 100-day horizon. We start in days, not months, and report against a plan from week one.' },
      { id: 'measured', title: 'Measured', body: 'Every engagement baselines KPIs and ends with an Impact Report showing baseline and outcome.' },
      { id: 'senior', title: 'Senior', body: 'No pyramid. The people you meet are operators who have run P&Ls, and they do the work.' },
      { id: 'sponsor-aligned', title: 'Sponsor-aligned', body: 'We speak EBITDA, cash and exit multiple, and we work to the sponsor’s value creation plan.' },
      { id: 'cross-border', title: 'Cross-border', body: 'One partner for North American portfolios, serving the US and Canada from a Toronto base.' }
    ],

    approachSteps: [
      { step: '01', title: 'Baseline', body: 'Agree the KPIs that matter to the sponsor and measure where they stand today.' },
      { step: '02', title: 'Decode', body: 'Find the specific levers that move cash and EBITDA fastest.' },
      { step: '03', title: 'Deliver', body: 'Work side by side with management in focused sprints.' },
      { step: '04', title: 'Prove', body: 'Close with an Impact Report: baseline, outcome and recommended next steps.' }
    ],

    /* ---------------------------------------------------------------- */
    /* Leadership. Add a photo path to show a portrait.                  */
    team: [
      {
        id: 'founder',
        name: 'Adnan Iqbal',
        role: 'Founder & Managing Director',
        linkedin: 'https://www.linkedin.com/in/adnan-iqbal/'
        // photo: 'assets/img/team/adnan-iqbal.jpg'  // add a portrait when ready
      },
      {
        id: 'co-founder',
        name: 'Sana Farid',
        role: 'Co-Founder',
        linkedin: 'https://www.linkedin.com/in/sanafarid/'
        // photo: 'assets/img/team/sana-farid.jpg'
      }
    ],

    expertNetwork: {
      intro:
        'A vetted bench of former executives who have run the functions we transform. They work to Markets Decoded playbooks and quality standards, so you get senior judgement with consistent delivery.',
      roles: [
        { title: 'Former CFOs', body: 'Cash, working capital, lender management and exit readiness.' },
        { title: 'Former CROs', body: 'Sales compensation, pricing and commercial excellence.' },
        { title: 'Former COOs', body: 'Operations, automation and multi-site performance.' },
        { title: 'Former CISOs', body: 'Cyber risk, remediation and portfolio monitoring.' },
        { title: 'HR & people leaders', body: 'Culture, integration and leadership alignment.' }
      ]
    },

    /* ---------------------------------------------------------------- */
    locations: [
      { id: 'toronto', labelPos: 'above', city: 'Toronto', region: 'Ontario, Canada', country: 'CA', type: 'Headquarters', note: 'Head office and Canadian hub.', lat: 43.65, lng: -79.38 },
      { id: 'connecticut', labelPos: 'right', city: 'Connecticut', region: 'Connecticut, US', country: 'US', type: 'Coverage hub', note: 'Northeast sponsors and lenders.', lat: 41.05, lng: -73.54 },
      { id: 'houston', labelPos: 'right', city: 'Houston', region: 'Texas, US', country: 'US', type: 'Coverage hub', note: 'Energy and industrial portfolios.', lat: 29.76, lng: -95.37 }
    ],

    /* ---------------------------------------------------------------- */
    careers: {
      intro:
        'We are building a senior, cross-border team that measures itself by client impact. If you have run a P&L, led a finance or commercial function, or want to learn value creation from people who have, we would like to hear from you.',
      values: [
        { title: 'Impact over hours', body: 'Team rewards are linked to client Impact Report scores.' },
        { title: 'Senior from day one', body: 'Small teams, real responsibility and direct client contact.' },
        { title: 'Two markets, one firm', body: 'Work across the US and Canada from a Toronto base.' }
      ],
      // Open roles: none listed for now. Add { title, location, type, summary }
      // objects and restore an OpenRoles section in careers.html when hiring.
      roles: []
    },

    /* ---------------------------------------------------------------- */
    contact: {
      interests: [
        { value: 'diagnostic', label: 'Diagnostic (cash, commercial, culture or cyber)' },
        { value: 'cyber-scan', label: 'Portfolio Cyber Exposure Scan' },
        { value: 'cash', label: '13-Week Cash & CCC Sprint' },
        { value: 'financial', label: 'Financial Transformation' },
        { value: 'gtm', label: 'Go-To-Market Transformation' },
        { value: 'risk', label: 'Risk Transformation' },
        { value: 'digital', label: 'Digital Transformation' },
        { value: 'cultural', label: 'Cultural Transformation' },
        { value: 'newsletter', label: '"Decoded" newsletter' },
        { value: 'partnership', label: 'Partnership (lender, advisor, technology)' },
        { value: 'expert-network', label: 'Joining the expert network' },
        { value: 'careers', label: 'Careers' },
        { value: 'other', label: 'Something else' }
      ],
      roles: ['Operating Partner', 'Deal Partner / Principal', 'Portfolio CEO', 'Portfolio CFO', 'Lender / Advisor', 'Other']
    },

    footer: {
      columns: [
        {
          heading: 'Services',
          links: [
            { label: 'Financial', href: 'services.html#financial' },
            { label: 'Go-To-Market', href: 'services.html#gtm' },
            { label: 'Risk', href: 'services.html#risk' },
            { label: 'Digital', href: 'services.html#digital' },
            { label: 'Cultural', href: 'services.html#cultural' }
          ]
        },
        {
          heading: 'Firm',
          links: [
            { label: 'About', href: 'about.html' },
            { label: 'Industries', href: 'industries.html' },
            { label: 'Results', href: 'results.html' },
            { label: 'Insights', href: 'insights.html' },
            { label: 'Careers', href: 'careers.html' }
          ]
        }
      ]
    }
  };

  root.SITE_DATA = SITE_DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = SITE_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
