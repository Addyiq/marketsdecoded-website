/**
 * Markets Decoded Inc. — UI components
 * ------------------------------------------------------------------
 * Every component is a PURE function: (props, data) => HTML string.
 * No DOM access, no side effects. Behaviour (menus, reveal, counters,
 * forms) lives in main.js.
 *
 * Each function maps 1:1 to a future React component
 * (see MIGRATION_TO_NEXTJS.md). `data` is window.SITE_DATA.
 */
(function (root) {
  'use strict';

  /* ================================================================ */
  /* Helpers                                                          */
  /* ================================================================ */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function map(list, fn) {
    return (list || []).map(fn).join('');
  }

  function find(list, id) {
    for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // Deterministic pseudo-random generator so art is stable per slot.
  function seeded(seed) {
    var h = 2166136261;
    var s = String(seed || 'md');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return function () {
      h += 0x6d2b79f5;
      var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var uid = 0;

  // "Revenue lift" -> "revenue lift", but keep acronyms ("CCC improvement").
  function lcFirst(s) {
    s = String(s || '');
    return /^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
  }

  /* ================================================================ */
  /* Primitives                                                       */
  /* ================================================================ */

  /** <Icon name="arrow" /> */
  function Icon(props) {
    var name = (props && props.name) || 'arrow';
    var paths = {
      arrow: '<path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
      chevron: '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
      menu: '<path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" stroke-width="2"/>',
      close: '<path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2"/>',
      linkedin: '<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4 0-3.2-1.95-3.2S13.8 13.5 13.8 15.1V21H10z"/>',
      pin: '<path fill="currentColor" d="M3 3h8v8H3zM13 13h8v8h-8z"/><path fill="currentColor" opacity=".45" d="M13 3h8v8h-8zM3 13h8v8H3z"/>'
    };
    return '<svg class="icon icon-' + esc(name) + '" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">' + (paths[name] || paths.arrow) + '</svg>';
  }

  /**
   * <ChartMark inverse? />
   * Brand mark: rising columns built from the brand squares, with a trend arrow.
   */
  function ChartMark(props) {
    props = props || {};
    var inv = !!props.inverse;
    var base = inv ? '#F6F7F4' : '#0B2A5B';
    var green = inv ? '#6CC24A' : '#4E9A2F';
    var sq = function (x, y, fill, op) {
      return '<rect x="' + x + '" y="' + y + '" width="26" height="26" fill="' + fill + '"' + (op < 1 ? ' opacity="' + op + '"' : '') + '/>';
    };
    var o = inv ? [0.2, 0.4, 0.2, 0.7, 0.4, 0.9, 0.7] : [0.25, 0.55, 0.25, 1, 0.55, 1, 1];
    return (
      '<svg class="logo-mark ' + (props.className || '') + '" viewBox="-8 -22 160 150" width="43" height="40" aria-hidden="true" focusable="false">' +
        sq(0, 96, base, o[0]) +
        sq(34, 96, base, o[1]) + sq(34, 66, base, o[2]) +
        sq(68, 96, base, o[3]) + sq(68, 66, base, o[4]) + sq(68, 36, '#6CC24A', 0.55) +
        sq(102, 96, base, o[5]) + sq(102, 66, base, o[6]) + sq(102, 36, '#6CC24A', 0.8) + sq(102, 6, '#6CC24A', 1) +
        '<polyline points="2,82 47,60 81,40 115,12 138,-6" fill="none" stroke="' + green + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<polygon points="146,-14 124,-10 140,6" fill="' + green + '"/>' +
      '</svg>'
    );
  }

  /**
   * <Logo inverse? />
   * Chart mark + "Markets Decoded Inc." wordmark.
   */
  function Logo(props) {
    props = props || {};
    var inverse = !!props.inverse;
    var navy = inverse ? '#FFFFFF' : '#0B2A5B';
    return (
      '<span class="logo' + (inverse ? ' logo--inverse' : '') + '">' +
        ChartMark({ inverse: inverse }) +
        '<span class="logo-word"><span class="logo-markets">Markets</span><span class="logo-decoded" style="color:' + navy + '">Decoded</span><span class="logo-inc">Inc.</span></span>' +
      '</span>'
    );
  }

  /**
   * <Art seed variant label />
   * Abstract SVG art: a field of squares echoing the 2x2 logo grid.
   * variant: 'dark' | 'light' | 'green'
   */
  function Art(props) {
    props = props || {};
    var rand = seeded(props.seed || 'md');
    var variant = props.variant || 'dark';
    var id = 'art' + (++uid) + '-' + String(props.seed || 'x').replace(/[^a-z0-9]/gi, '');
    var W = 800, H = 600, cell = 50, gap = 6;
    var cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);

    var bg = {
      dark: ['#0B2A5B', '#071D40', '#13386F'],
      light: ['#EEF2F7', '#F7F9FB', '#E2E9F2'],
      green: ['#6CC24A', '#4FA32F', '#8BD46E'],
      slate: ['#222B37', '#161C25', '#2C3747']
    }[variant] || ['#0B2A5B', '#071D40', '#13386F'];

    var fills = {
      dark: [['#6CC24A', 0.95], ['#6CC24A', 0.35], ['#FFFFFF', 0.08], ['#FFFFFF', 0.16], ['#2A5BA8', 0.6]],
      light: [['#6CC24A', 0.9], ['#0B2A5B', 0.85], ['#0B2A5B', 0.12], ['#6CC24A', 0.3], ['#0B2A5B', 0.3]],
      green: [['#0B2A5B', 0.9], ['#FFFFFF', 0.3], ['#0B2A5B', 0.2], ['#FFFFFF', 0.12], ['#0B2A5B', 0.45]],
      slate: [['#6CC24A', 0.9], ['#6CC24A', 0.3], ['#FFFFFF', 0.07], ['#FFFFFF', 0.14], ['#0B2A5B', 0.9]]
    }[variant] || [];

    // Diagonal density: squares cluster toward one corner (seeded).
    // corner: 0 bottom-left, 1 bottom-right, 2 top-right, 3 top-left
    var corner = props.corner != null ? props.corner : Math.floor(rand() * 4);
    var density = props.density != null ? props.density : 1;
    var squares = '';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var nx = c / cols, ny = r / rows;
        var d;
        if (corner === 0) d = (1 - nx + ny) / 2;
        else if (corner === 1) d = (nx + ny) / 2;
        else if (corner === 2) d = (nx + 1 - ny) / 2;
        else d = (2 - nx - ny) / 2;
        var p = rand();
        if (p > (0.15 + d * 0.75) * density - (1 - density) * 0.1) continue; // sparse away from the corner
        var f = fills[Math.floor(rand() * fills.length)];
        squares += '<rect x="' + (c * cell + gap / 2) + '" y="' + (r * cell + gap / 2) + '" width="' + (cell - gap) + '" height="' + (cell - gap) + '" fill="' + f[0] + '" opacity="' + f[1] + '"/>';
      }
    }

    // A large 2x2 "mark" motif anchored on the grid.
    // Motif sits in the dense quadrant so it never fights overlaid text.
    var right = corner === 1 || corner === 2, top = corner === 2 || corner === 3;
    var halfC = Math.floor(cols / 2), halfR = Math.floor(rows / 2);
    var bx = ((right ? halfC : 1) + Math.floor(rand() * (halfC - 5))) * cell;
    var by = ((top ? 1 : halfR) + Math.floor(rand() * Math.max(1, halfR - 5))) * cell;
    var big = cell * 2;
    var accent = variant === 'green' ? '#0B2A5B' : '#6CC24A';
    var other = variant === 'light' ? '#0B2A5B' : (variant === 'green' ? '#FFFFFF' : '#FFFFFF');
    var motif =
      '<g class="art-motif">' +
        '<rect x="' + (bx + gap / 2) + '" y="' + (by + gap / 2) + '" width="' + (big - gap) + '" height="' + (big - gap) + '" fill="' + accent + '"/>' +
        '<rect x="' + (bx + big + gap / 2) + '" y="' + (by + gap / 2) + '" width="' + (big - gap) + '" height="' + (big - gap) + '" fill="' + other + '" opacity=".12"/>' +
        '<rect x="' + (bx + gap / 2) + '" y="' + (by + big + gap / 2) + '" width="' + (big - gap) + '" height="' + (big - gap) + '" fill="' + other + '" opacity=".22"/>' +
        '<rect x="' + (bx + big + gap / 2) + '" y="' + (by + big + gap / 2) + '" width="' + (big - gap) + '" height="' + (big - gap) + '" fill="' + accent + '" opacity=".55"/>' +
      '</g>';

    var label = props.label ? ' role="img" aria-label="' + esc(props.label) + '"' : ' aria-hidden="true" focusable="false"';
    return (
      '<svg class="art art--' + esc(variant) + '" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice"' + label + '>' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + bg[2] + '"/><stop offset=".55" stop-color="' + bg[0] + '"/><stop offset="1" stop-color="' + bg[1] + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/>' +
        squares + motif +
      '</svg>'
    );
  }

  /**
   * <Media slot variant seed label />
   * Named image slot. If data.media[slot].src is set, renders a real
   * <img>; otherwise falls back to generated <Art>.
   */
  function Media(props, data) {
    props = props || {};
    var slot = props.slot || 'default';
    var media = (data && data.media && data.media[slot]) || {};
    var inner = media.src
      ? '<img src="' + esc(media.src) + '" alt="' + esc(media.alt || '') + '" loading="' + (props.eager ? 'eager' : 'lazy') + '" decoding="async">'
      : Art({ seed: props.seed || slot, variant: props.variant, label: props.label, corner: props.corner, density: props.density });
    return '<div class="media' + (props.className ? ' ' + esc(props.className) : '') + '" data-media-slot="' + esc(slot) + '">' + inner + '</div>';
  }

  /** <Button href variant label /> */
  function Button(props) {
    var v = props.variant || 'primary';
    return '<a class="btn btn-' + esc(v) + '" href="' + esc(props.href) + '">' + esc(props.label) + (props.arrow === false ? '' : Icon({ name: 'arrow' })) + '</a>';
  }

  /** <TextLink href label /> */
  function TextLink(props) {
    return '<a class="text-link" href="' + esc(props.href) + '">' + esc(props.label) + Icon({ name: 'arrow' }) + '</a>';
  }

  /* ================================================================ */
  /* Layout: header, mega menu, drawer, footer                        */
  /* ================================================================ */

  /** <MegaMenu item /> */
  function MegaMenu(props) {
    var item = props.item;
    var m = item.mega;
    return (
      '<div class="mega" id="mega-' + esc(item.id) + '" hidden>' +
        '<div class="container mega-inner">' +
          '<div class="mega-intro">' +
            '<p class="mega-title">' + esc(item.label) + '</p>' +
            '<p class="mega-lede">' + esc(m.intro) + '</p>' +
            TextLink({ href: item.href, label: 'Explore ' + item.label.toLowerCase() }) +
          '</div>' +
          map(m.columns, function (col) {
            return (
              '<div class="mega-col">' +
                '<p class="mega-heading">' + esc(col.heading) + '</p>' +
                '<ul>' + map(col.links, function (l) { return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>'; }) + '</ul>' +
              '</div>'
            );
          }) +
          (m.feature
            ? '<a class="mega-feature" href="' + esc(m.feature.href) + '">' +
                '<span class="eyebrow">' + esc(m.feature.eyebrow) + '</span>' +
                '<span class="mega-feature-title">' + esc(m.feature.title) + '</span>' +
                Icon({ name: 'arrow' }) +
              '</a>'
            : '') +
        '</div>' +
      '</div>'
    );
  }

  /** <SiteHeader active /> */
  function SiteHeader(props, data) {
    var active = (props && props.active) || '';
    var nav = data.navigation;
    return (
      '<a class="skip-link" href="#main">Skip to main content</a>' +
      '<header class="site-header" data-header>' +
        '<div class="container header-inner">' +
          '<a class="brand" href="index.html" aria-label="Markets Decoded Inc. home">' + Logo({}) + '</a>' +
          '<nav class="primary-nav" aria-label="Primary">' +
            '<ul class="nav-list">' +
              map(nav, function (item) {
                var isActive = item.id === active;
                if (item.mega) {
                  return (
                    '<li class="nav-item has-mega' + (isActive ? ' is-active' : '') + '">' +
                      '<button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-' + esc(item.id) + '">' +
                        esc(item.label) + Icon({ name: 'chevron' }) +
                      '</button>' +
                      MegaMenu({ item: item }) +
                    '</li>'
                  );
                }
                return (
                  '<li class="nav-item' + (isActive ? ' is-active' : '') + '">' +
                    '<a class="nav-link" href="' + esc(item.href) + '"' + (isActive ? ' aria-current="page"' : '') + '>' + esc(item.label) + '</a>' +
                  '</li>'
                );
              }) +
            '</ul>' +
          '</nav>' +
          '<a class="btn btn-primary btn-sm header-cta" href="contact.html">Contact us</a>' +
          '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Open menu">' + Icon({ name: 'menu' }) + '</button>' +
        '</div>' +
      '</header>' +
      MobileDrawer({ active: active }, data)
    );
  }

  /** <MobileDrawer active /> */
  function MobileDrawer(props, data) {
    var active = props.active;
    return (
      '<div class="drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Site menu" hidden>' +
        '<div class="drawer-head">' +
          '<a class="brand" href="index.html" aria-label="Markets Decoded Inc. home">' + Logo({}) + '</a>' +
          '<button class="drawer-close" type="button" aria-label="Close menu">' + Icon({ name: 'close' }) + '</button>' +
        '</div>' +
        '<nav class="drawer-nav" aria-label="Mobile">' +
          map(data.navigation, function (item) {
            if (!item.mega) {
              return '<a class="drawer-link" href="' + esc(item.href) + '"' + (item.id === active ? ' aria-current="page"' : '') + '>' + esc(item.label) + '</a>';
            }
            return (
              '<details class="drawer-group"' + (item.id === active ? ' open' : '') + '>' +
                '<summary>' + esc(item.label) + Icon({ name: 'chevron' }) + '</summary>' +
                '<ul>' +
                  '<li><a href="' + esc(item.href) + '"' + (item.id === active ? ' aria-current="page"' : '') + '>' + esc(item.label) + ' overview</a></li>' +
                  map(item.mega.columns, function (col) {
                    return map(col.links, function (l) { return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>'; });
                  }) +
                '</ul>' +
              '</details>'
            );
          }) +
        '</nav>' +
        '<div class="drawer-foot">' + Button({ href: 'contact.html', label: 'Contact us' }) + '</div>' +
      '</div>'
    );
  }

  /** <SiteFooter /> */
  function SiteFooter(props, data) {
    var year = (props && props.year) || new Date().getFullYear();
    return (
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-top">' +
            '<div class="footer-brand">' +
              '<a class="brand" href="index.html" aria-label="Markets Decoded Inc. home">' + Logo({ inverse: true }) + '</a>' +
              '<p class="footer-tagline">' + esc(data.site.tagline) + '</p>' +
              Button({ href: 'contact.html', label: 'Start a conversation' }) +
            '</div>' +
            map(data.footer.columns, function (col) {
              return (
                '<nav class="footer-col" aria-label="' + esc(col.heading) + '">' +
                  '<h2 class="footer-heading">' + esc(col.heading) + '</h2>' +
                  '<ul>' + map(col.links, function (l) { return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>'; }) + '</ul>' +
                '</nav>'
              );
            }) +
            '<div class="footer-col footer-offices">' +
              '<h2 class="footer-heading"><a href="locations.html">Locations</a></h2>' +
              '<ul class="office-list">' +
                map(data.locations, function (loc) {
                  return '<li><span class="office-city">' + esc(loc.city) + '</span><span class="office-type">' + esc(loc.type === 'Headquarters' ? 'Headquarters' : loc.region) + '</span></li>';
                }) +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<p>&copy; ' + esc(year) + ' ' + esc(data.site.name) + ' ' + esc(data.site.legal) + '</p>' +
            '<ul class="footer-meta">' +
              '<li><a href="mailto:' + esc(data.site.email) + '">' + esc(data.site.email) + '</a></li>' +
              '<li><a href="privacy-policy.html">Privacy Policy</a></li>' +
              '<li><a class="footer-social" href="' + esc(data.site.linkedin) + '" rel="noopener" target="_blank">' + Icon({ name: 'linkedin' }) + '<span>LinkedIn<span class="sr-only"> (opens in a new tab)</span></span></a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  /* ================================================================ */
  /* Sections                                                         */
  /* ================================================================ */

  /** <ResultsBand metrics? caption? linkToCases? /> — big-number client results */
  function ResultsBand(props, data) {
    props = props || {};
    var metrics = props.metrics || data.metrics;
    return (
      '<ul class="results-band">' +
        map(metrics, function (m, i) {
          return (
            '<li class="result reveal" style="--delay:' + i * 90 + 'ms">' +
              '<p class="result-number" aria-label="' + esc(m.value + m.suffix) + '">' +
                '<span class="count" data-count="' + esc(m.value) + '" aria-hidden="true">' + esc(m.value) + '</span>' +
                '<span class="result-suffix" aria-hidden="true">' + esc(m.suffix) + '</span>' +
              '</p>' +
              '<p class="result-label">' + esc(m.label) + '</p>' +
              '<p class="result-context">' +
                (props.linkToCases !== false && m.caseId
                  ? '<a href="results.html#' + esc(m.caseId) + '">' + esc(m.context) + '<span class="sr-only"> case study</span></a>'
                  : esc(m.context)) +
              '</p>' +
            '</li>'
          );
        }) +
      '</ul>'
    );
  }

  /** <PracticeCard practice featured? /> */
  function PracticeCard(props) {
    var p = props.practice;
    return (
      '<article class="practice-card reveal' + (props.featured ? ' practice-card--featured' : '') + '">' +
        '<span class="practice-number" aria-hidden="true">' + esc(p.number) + '</span>' +
        '<h3 class="practice-name"><a href="services.html#' + esc(p.id) + '" class="stretched">' + esc(p.name) + '</a></h3>' +
        '<p class="practice-summary">' + esc(p.summary) + '</p>' +
        (props.featured ? '<p class="practice-flag">Hero offer: 13-Week Cash &amp; CCC Sprint</p>' : '') +
        '<span class="practice-more" aria-hidden="true">Explore ' + Icon({ name: 'arrow' }) + '</span>' +
      '</article>'
    );
  }

  /** <PracticesGrid /> */
  function PracticesGrid(props, data) {
    return (
      '<div class="practices-grid">' +
        map(data.practices, function (p) { return PracticeCard({ practice: p, featured: !!p.hero }); }) +
      '</div>'
    );
  }

  /** <PracticeDetail practice index /> — services page */
  function PracticeDetail(props, data) {
    var p = props.practice;
    var cases = (data.caseStudies || []).filter(function (c) { return c.practiceId === p.id; });
    return (
      '<section class="practice-detail" id="' + esc(p.id) + '" aria-labelledby="' + esc(p.id) + '-title">' +
        '<div class="container practice-detail-inner">' +
          '<div class="practice-detail-head reveal">' +
            '<span class="practice-number" aria-hidden="true">' + esc(p.number) + '</span>' +
            '<h2 id="' + esc(p.id) + '-title" class="h2">' + esc(p.name) + '</h2>' +
            '<p class="lede">' + esc(p.summary) + '</p>' +
          '</div>' +
          '<div class="practice-detail-body reveal">' +
            '<p>' + esc(p.description) + '</p>' +
            '<h3 class="h-label">What we do</h3>' +
            '<ul class="service-list">' + map(p.services, function (s) { return '<li>' + esc(s) + '</li>'; }) + '</ul>' +
            '<h3 class="h-label">What we measure</h3>' +
            '<ul class="tag-list">' + map(p.outcomes, function (o) { return '<li>' + esc(o) + '</li>'; }) + '</ul>' +
            (cases.length
              ? '<p class="practice-proof">Proof: ' + map(cases, function (c, i) {
                  return (i ? ' · ' : '') + '<a href="results.html#' + esc(c.id) + '">' + esc(c.metric.value + ' ' + lcFirst(c.metric.label)) + ' (' + esc(c.industry) + ')</a>';
                }) + '</p>'
              : '') +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  /** <PracticeDetails /> — all practices */
  function PracticeDetails(props, data) {
    return map(data.practices, function (p, i) { return PracticeDetail({ practice: p, index: i }, data); });
  }

  /** <OfferLadder compact? /> */
  function OfferLadder(props, data) {
    props = props || {};
    return (
      '<ol class="ladder' + (props.compact ? ' ladder--compact' : '') + '">' +
        map(data.offers, function (o, i) {
          return (
            '<li class="ladder-step reveal' + (o.highlight ? ' is-highlight' : '') + '" style="--step:' + i + ';--delay:' + i * 80 + 'ms">' +
              '<div class="ladder-card">' +
                '<p class="ladder-tier">Tier ' + esc(o.tier) + '</p>' +
                '<h3 class="ladder-name">' + esc(o.name) + '</h3>' +
                '<p class="ladder-meta"><span>' + esc(o.duration) + '</span>' + (o.label ? '<span>' + esc(o.label) + '</span>' : '') + '</p>' +
                '<p class="ladder-purpose">' + esc(o.purpose) + '</p>' +
                (props.compact ? '' : '<ul class="ladder-items">' + map(o.items, function (it) { return '<li>' + esc(it) + '</li>'; }) + '</ul>') +
              '</div>' +
            '</li>'
          );
        }) +
      '</ol>'
    );
  }

  /** <CaseStudyCard study /> */
  function CaseStudyCard(props) {
    var c = props.study;
    return (
      '<article class="case-card reveal">' +
        '<div class="case-card-media">' +
          Media({ slot: 'case-' + c.id, seed: c.id, variant: props.variant || 'dark', corner: 2, density: 0.85 }) +
          '<p class="case-card-metric"><span class="case-card-value">' + esc(c.metric.value) + '</span><span class="case-card-label">' + esc(c.metric.label) + '</span></p>' +
        '</div>' +
        '<div class="case-card-body">' +
          '<p class="eyebrow">' + esc(c.focus) + ' · ' + esc(c.industry) + '</p>' +
          '<h3 class="case-card-title"><a class="stretched" href="results.html#' + esc(c.id) + '">' + esc(c.title) + '</a></h3>' +
          '<span class="text-link" aria-hidden="true">Read the case' + Icon({ name: 'arrow' }) + '</span>' +
        '</div>' +
      '</article>'
    );
  }

  /** <CaseStudyGrid featuredOnly? limit? /> */
  function CaseStudyGrid(props, data) {
    props = props || {};
    var list = data.caseStudies.filter(function (c) { return !props.featuredOnly || c.featured; });
    if (props.limit) list = list.slice(0, props.limit);
    return '<div class="case-grid">' + map(list, function (c) { return CaseStudyCard({ study: c }); }) + '</div>';
  }

  /** <CaseStudyDetail study index /> — results page */
  function CaseStudyDetail(props, data) {
    var c = props.study;
    var practice = find(data.practices, c.practiceId);
    return (
      '<article class="case-detail reveal" id="' + esc(c.id) + '" aria-labelledby="' + esc(c.id) + '-title">' +
        '<div class="case-detail-aside">' +
          '<div class="case-detail-metric">' +
            '<p class="case-detail-value">' + esc(c.metric.value) + '</p>' +
            '<p class="case-detail-label">' + esc(c.metric.label) + '</p>' +
          '</div>' +
          '<dl class="case-facts">' +
            '<div><dt>Focus</dt><dd>' + (practice ? '<a href="services.html#' + esc(practice.id) + '">' + esc(c.focus) + '</a>' : esc(c.focus)) + '</dd></div>' +
            '<div><dt>Industry</dt><dd>' + esc(c.industry) + '</dd></div>' +
            '<div><dt>Client</dt><dd>Name withheld</dd></div>' +
          '</dl>' +
        '</div>' +
        '<div class="case-detail-main">' +
          '<p class="eyebrow">Case ' + esc(String(props.index + 1).padStart(2, '0')) + '</p>' +
          '<h2 id="' + esc(c.id) + '-title" class="h3">' + esc(c.title) + '</h2>' +
          '<div class="case-sections">' +
            '<section><h3 class="h-label">Challenge</h3><p>' + esc(c.challenge) + '</p></section>' +
            '<section><h3 class="h-label">Approach</h3><ul class="check-list">' + map(c.approach, function (a) { return '<li>' + esc(a) + '</li>'; }) + '</ul></section>' +
            '<section><h3 class="h-label">Impact</h3><ul class="impact-list">' + map(c.impact, function (a) { return '<li>' + esc(a) + '</li>'; }) + '</ul></section>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /** <CaseStudyList /> */
  function CaseStudyList(props, data) {
    return '<div class="case-list">' + map(data.caseStudies, function (c, i) { return CaseStudyDetail({ study: c, index: i }, data); }) + '</div>';
  }

  /** <InsightCard insight /> */
  function InsightCard(props, data) {
    var it = props.insight;
    var soon = it.status === 'coming-soon';
    var practice = find(data.practices, it.practiceId);
    var titleInner = !soon && it.href
      ? '<a class="stretched" href="' + esc(it.href) + '">' + esc(it.title) + '</a>'
      : esc(it.title);
    return (
      '<article class="insight-card reveal' + (soon ? ' is-soon' : '') + '" data-type="' + esc(it.type) + '">' +
        Media({ slot: 'insight-' + it.id, seed: it.id, variant: props.variant || ['dark', 'light', 'slate'][(props.index || 0) % 3] }) +
        '<div class="insight-body">' +
          '<p class="insight-meta"><span class="eyebrow">' + esc(it.type) + '</span>' +
            (practice ? '<span class="insight-practice">' + esc(practice.short) + '</span>' : '') + '</p>' +
          '<h3 class="insight-title">' + titleInner + '</h3>' +
          '<p class="insight-summary">' + esc(it.summary) + '</p>' +
          (soon
            ? '<p class="badge">Coming soon</p>'
            : '<span class="text-link" aria-hidden="true">Read' + Icon({ name: 'arrow' }) + '</span>') +
        '</div>' +
      '</article>'
    );
  }

  /** <InsightsGrid limit? featuredOnly? /> */
  function InsightsGrid(props, data) {
    props = props || {};
    var list = data.insights.filter(function (i) { return !props.featuredOnly || i.featured; });
    if (props.limit) list = list.slice(0, props.limit);
    return '<div class="insights-grid">' + map(list, function (it, i) { return InsightCard({ insight: it, index: i }, data); }) + '</div>';
  }

  /** <InsightFilters /> — client-side type filter chips */
  function InsightFilters(props, data) {
    var types = [];
    data.insights.forEach(function (i) { if (types.indexOf(i.type) === -1) types.push(i.type); });
    return (
      '<div class="filters" role="group" aria-label="Filter insights by type">' +
        '<button type="button" class="chip" aria-pressed="true" data-filter="all">All</button>' +
        map(types, function (t) { return '<button type="button" class="chip" aria-pressed="false" data-filter="' + esc(t) + '">' + esc(t) + '</button>'; }) +
      '</div>'
    );
  }

  /** <FeaturedInsight id /> — large lead card for the insights page */
  function FeaturedInsight(props, data) {
    var it = find(data.insights, props.id) || data.insights[0];
    var soon = it.status === 'coming-soon';
    return (
      '<article class="feature-insight reveal">' +
        Media({ slot: 'insight-feature-' + it.id, seed: it.id + '-feature', variant: 'dark' }) +
        '<div class="feature-insight-body on-dark">' +
          '<p class="eyebrow">Flagship ' + esc(it.type.toLowerCase()) + '</p>' +
          '<h2 class="h2">' + esc(it.title) + '</h2>' +
          '<p>' + esc(it.summary) + '</p>' +
          (soon
            ? '<p class="badge">Coming soon</p>' + '<p>' + TextLink({ href: 'contact.html?interest=benchmark', label: 'Get early access' }) + '</p>'
            : TextLink({ href: it.href, label: 'Read' })) +
        '</div>' +
      '</article>'
    );
  }

  /** <NewsletterPanel /> */
  function NewsletterPanel(props, data) {
    var n = data.newsletter;
    return (
      '<div class="newsletter reveal">' +
        '<div><p class="eyebrow">Newsletter</p><h2 class="h3">Subscribe to “' + esc(n.name) + '”</h2><p>' + esc(n.summary) + '</p></div>' +
        Button({ href: 'contact.html?interest=newsletter', label: 'Request a subscription', variant: 'primary' }) +
      '</div>'
    );
  }

  /** <IndustryCard industry /> */
  function IndustryCard(props, data) {
    var ind = props.industry;
    var cs = ind.caseId ? find(data.caseStudies, ind.caseId) : null;
    return (
      '<article class="industry-card reveal" id="' + esc(ind.id) + '">' +
        Media({ slot: 'industry-' + ind.id, seed: ind.id, variant: ind.tier === 'lead' ? 'dark' : 'light' }) +
        '<div class="industry-body">' +
          '<p class="eyebrow">' + (ind.tier === 'lead' ? 'Lead sector' : 'Also serving') + '</p>' +
          '<h3 class="h4">' + esc(ind.name) + '</h3>' +
          '<p>' + esc(ind.summary) + '</p>' +
          '<ul class="tag-list">' + map(ind.levers, function (l) { return '<li>' + esc(l) + '</li>'; }) + '</ul>' +
          (cs ? TextLink({ href: 'results.html#' + cs.id, label: 'Case: ' + cs.metric.value + ' ' + lcFirst(cs.metric.label) }) : '') +
        '</div>' +
      '</article>'
    );
  }

  /** <IndustriesGrid tier? /> */
  function IndustriesGrid(props, data) {
    props = props || {};
    var list = data.industries.filter(function (i) { return !props.tier || i.tier === props.tier; });
    return '<div class="industries-grid">' + map(list, function (i) { return IndustryCard({ industry: i }, data); }) + '</div>';
  }

  /** <TriggerGrid /> */
  function TriggerGrid(props, data) {
    return (
      '<ol class="trigger-grid">' +
        map(data.triggers, function (t, i) {
          return '<li class="trigger reveal" style="--delay:' + i * 60 + 'ms"><span class="trigger-num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(t.title) + '</h3><p>' + esc(t.body) + '</p></li>';
        }) +
      '</ol>'
    );
  }

  /** <SponsorList /> */
  function SponsorList(props, data) {
    return '<ul class="sponsor-list">' + map(data.sponsorTypes, function (s) { return '<li class="reveal">' + esc(s) + '</li>'; }) + '</ul>';
  }

  /** <PillarsList /> */
  function PillarsList(props, data) {
    return (
      '<ol class="pillars">' +
        map(data.pillars, function (p, i) {
          return '<li class="pillar reveal" style="--delay:' + i * 70 + 'ms"><span class="pillar-mark" aria-hidden="true"></span><h3>' + esc(p.title) + '</h3><p>' + esc(p.body) + '</p></li>';
        }) +
      '</ol>'
    );
  }

  /** <ApproachSteps /> */
  function ApproachSteps(props, data) {
    return (
      '<ol class="steps">' +
        map(data.approachSteps, function (s, i) {
          return '<li class="step reveal" style="--delay:' + i * 80 + 'ms"><span class="step-num" aria-hidden="true">' + esc(s.step) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.body) + '</p></li>';
        }) +
      '</ol>'
    );
  }

  /** <TeamCard member /> */
  function TeamCard(props) {
    var m = props.member;
    return (
      '<article class="team-card reveal">' +
        '<div class="team-photo" data-media-slot="team-' + esc(m.id) + '">' +
          (m.photo
            ? '<img src="' + esc(m.photo) + '" alt="Portrait of ' + esc(m.name) + '" loading="lazy">'
            : Art({ seed: 'team-' + m.id, variant: 'light', corner: 2, density: 0.55 }) +
              (m.initials ? '<span class="team-initials" aria-hidden="true">' + esc(m.initials) + '</span>' : '')) +
        '</div>' +
        '<div class="team-text">' +
          '<h3 class="team-name">' + esc(m.name) + '</h3>' +
          '<p class="team-role">' + esc(m.role) + (m.location ? ' · ' + esc(m.location) : '') + '</p>' +
          (m.bio ? '<p class="team-bio">' + esc(m.bio) + '</p>' : '') +
          (m.linkedin
            ? '<a class="team-link" href="' + esc(m.linkedin) + '" rel="noopener" target="_blank">' + Icon({ name: 'linkedin' }) +
                '<span>Connect on LinkedIn<span class="sr-only"> with ' + esc(m.name) + ' (opens in a new tab)</span></span></a>'
            : '') +
        '</div>' +
      '</article>'
    );
  }

  /** <TeamGrid /> */
  function TeamGrid(props, data) {
    var single = data.team.length === 1 ? ' team-grid--single' : data.team.length === 2 ? ' team-grid--pair' : '';
    return '<div class="team-grid' + single + '">' + map(data.team, function (m) { return TeamCard({ member: m }); }) + '</div>';
  }

  /** <ExpertNetwork showCta? /> */
  function ExpertNetwork(props, data) {
    props = props || {};
    var e = data.expertNetwork;
    return (
      '<div class="expert">' +
        '<ul class="expert-roles">' +
          map(e.roles, function (r) { return '<li class="reveal"><h3>' + esc(r.title) + '</h3><p>' + esc(r.body) + '</p></li>'; }) +
        '</ul>' +
        (props.showCta ? '<p class="expert-cta">' + Button({ href: 'contact.html?interest=expert-network', label: 'Apply to the expert network' }) + '</p>' : '') +
      '</div>'
    );
  }

  /** <LocationsMap /> — abstract square-grid map with projected hubs */
  function LocationsMap(props, data) {
    // Simple equirectangular projection over a North America window.
    var lngMin = -125, lngMax = -65, latMin = 25, latMax = 55;
    var W = 600, H = 360, cell = 20;
    var dots = '';
    for (var y = 0; y < H; y += cell) {
      for (var x = 0; x < W; x += cell) {
        dots += '<rect x="' + (x + 7) + '" y="' + (y + 7) + '" width="6" height="6" fill="currentColor" opacity=".18"/>';
      }
    }
    var pins = map(data.locations, function (l) {
      var px = ((l.lng - lngMin) / (lngMax - lngMin)) * W;
      var py = ((latMax - l.lat) / (latMax - latMin)) * H;
      var hq = l.type === 'Headquarters';
      var s = hq ? 22 : 16;
      var pos = l.labelPos || (px < W - 140 ? 'right' : 'left');
      var tx = pos === 'right' ? px + s / 2 + 10 : pos === 'left' ? px - s / 2 - 10 : px;
      var ty = pos === 'above' ? py - s / 2 - 14 : pos === 'below' ? py + s / 2 + 22 : py + 5;
      var anchor = pos === 'right' ? 'start' : pos === 'left' ? 'end' : 'middle';
      return (
        '<g class="map-pin' + (hq ? ' is-hq' : '') + '">' +
          '<rect x="' + (px - s / 2) + '" y="' + (py - s / 2) + '" width="' + s + '" height="' + s + '" fill="' + (hq ? '#6CC24A' : '#FFFFFF') + '"/>' +
          (hq ? '<rect x="' + (px - s / 2 - 6) + '" y="' + (py - s / 2 - 6) + '" width="' + (s + 12) + '" height="' + (s + 12) + '" fill="none" stroke="#6CC24A" stroke-width="2" opacity=".6"/>' : '') +
          '<text x="' + tx + '" y="' + ty + '" text-anchor="' + anchor + '" fill="' + (hq ? '#6CC24A' : '#FFFFFF') + '" font-family="Inter, Arial, sans-serif" font-size="' + (hq ? 17 : 15) + '" font-weight="' + (hq ? 700 : 600) + '">' + esc(l.city) + '</text>' +
        '</g>'
      );
    });
    var desc = 'Map of Markets Decoded locations: ' + data.locations.map(function (l) { return l.city + ' (' + l.type + ')'; }).join(', ') + '.';
    return (
      '<figure class="loc-map">' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(desc) + '">' +
          '<g class="map-grid">' + dots + '</g>' + pins +
        '</svg>' +
        '<figcaption class="sr-only">' + esc(desc) + '</figcaption>' +
      '</figure>'
    );
  }

  /** <LocationsList /> */
  function LocationsList(props, data) {
    return (
      '<ul class="loc-list">' +
        map(data.locations, function (l) {
          return (
            '<li class="loc reveal' + (l.type === 'Headquarters' ? ' is-hq' : '') + '">' +
              '<p class="eyebrow">' + esc(l.type) + '</p>' +
              '<h3 class="loc-city">' + esc(l.city) + '</h3>' +
              '<p class="loc-region">' + esc(l.region) + '</p>' +
              '<p class="loc-note">' + esc(l.note) + '</p>' +
            '</li>'
          );
        }) +
      '</ul>'
    );
  }

  /** <OpenRoles /> */
  function OpenRoles(props, data) {
    return (
      '<ul class="roles">' +
        map(data.careers.roles, function (r) {
          return (
            '<li class="role reveal">' +
              '<div><h3 class="role-title">' + esc(r.title) + '</h3><p>' + esc(r.summary) + '</p></div>' +
              '<p class="role-meta"><span>' + esc(r.location) + '</span><span>' + esc(r.type) + '</span></p>' +
              '<a class="text-link" href="contact.html?interest=careers">Express interest' + Icon({ name: 'arrow' }) + '<span class="sr-only"> in the ' + esc(r.title) + ' role</span></a>' +
            '</li>'
          );
        }) +
      '</ul>'
    );
  }

  /** <ValuesList /> */
  function ValuesList(props, data) {
    return '<ul class="values">' + map(data.careers.values, function (v) { return '<li class="reveal"><h3>' + esc(v.title) + '</h3><p>' + esc(v.body) + '</p></li>'; }) + '</ul>';
  }

  /** <CTABanner title body ctaLabel ctaHref secondaryLabel? secondaryHref? /> */
  function CTABanner(props) {
    props = props || {};
    return (
      '<section class="cta-band" aria-labelledby="cta-title">' +
        '<div class="cta-art" aria-hidden="true">' + Art({ seed: 'cta', variant: 'green', corner: 1 }) + '</div>' +
        '<div class="container cta-inner reveal">' +
          '<h2 id="cta-title" class="display-2">' + esc(props.title || 'Ready to decode your next 100 days?') + '</h2>' +
          '<p class="cta-body">' + esc(props.body || 'Start with a Diagnostic: a 2–3 week baseline of cash, commercial, culture or cyber performance, with a prioritized roadmap.') + '</p>' +
          '<div class="cta-actions">' +
            Button({ href: props.ctaHref || 'contact.html?interest=diagnostic', label: props.ctaLabel || 'Book a Diagnostic', variant: 'dark' }) +
            (props.secondaryLabel ? Button({ href: props.secondaryHref, label: props.secondaryLabel, variant: 'outline-dark' }) : '') +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  /** <ContactForm /> — progressive form; submission handled in main.js */
  function ContactForm(props, data) {
    var c = data.contact;
    return (
      '<form class="contact-form" id="contact-form" novalidate>' +
        '<div class="form-grid">' +
          field('name', 'Full name', '<input id="name" name="name" type="text" autocomplete="name" required>') +
          field('email', 'Work email', '<input id="email" name="email" type="email" autocomplete="email" required>') +
          field('firm', 'Firm', '<input id="firm" name="firm" type="text" autocomplete="organization" required>') +
          field('role', 'Role', '<input id="role" name="role" type="text" list="role-options" autocomplete="organization-title" required>' +
            '<datalist id="role-options">' + map(c.roles, function (r) { return '<option value="' + esc(r) + '">'; }) + '</datalist>') +
          field('interest', 'I’m interested in', '<select id="interest" name="interest" required><option value="">Select an option</option>' +
            map(c.interests, function (i) { return '<option value="' + esc(i.value) + '">' + esc(i.label) + '</option>'; }) + '</select>', true) +
          field('message', 'Message', '<textarea id="message" name="message" rows="6" required></textarea>', true) +
        '</div>' +
        // Honeypot for basic spam protection
        '<div class="hp" aria-hidden="true"><label for="company_website">Leave this field empty</label><input id="company_website" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<p class="form-note">By submitting, you agree that we may contact you about your enquiry. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
        '<div class="form-actions"><button class="btn btn-primary" type="submit">Send message' + Icon({ name: 'arrow' }) + '</button></div>' +
        '<p class="form-status" role="status" aria-live="polite"></p>' +
      '</form>'
    );

    function field(id, label, control, wide) {
      return (
        '<div class="field' + (wide ? ' field--wide' : '') + '">' +
          '<label for="' + id + '">' + esc(label) + ' <span class="req" aria-hidden="true">*</span></label>' +
          control +
          '<p class="field-error" id="' + id + '-error" hidden></p>' +
        '</div>'
      );
    }
  }

  /* ================================================================ */

  var Components = {
    // primitives
    Icon: Icon, ChartMark: ChartMark, Logo: Logo, Art: Art, Media: Media, Button: Button, TextLink: TextLink,
    // layout
    SiteHeader: SiteHeader, MegaMenu: MegaMenu, MobileDrawer: MobileDrawer, SiteFooter: SiteFooter,
    // sections
    ResultsBand: ResultsBand,
    PracticeCard: PracticeCard, PracticesGrid: PracticesGrid, PracticeDetail: PracticeDetail, PracticeDetails: PracticeDetails,
    OfferLadder: OfferLadder,
    CaseStudyCard: CaseStudyCard, CaseStudyGrid: CaseStudyGrid, CaseStudyDetail: CaseStudyDetail, CaseStudyList: CaseStudyList,
    InsightCard: InsightCard, InsightsGrid: InsightsGrid, FeaturedInsight: FeaturedInsight, InsightFilters: InsightFilters, NewsletterPanel: NewsletterPanel,
    IndustryCard: IndustryCard, IndustriesGrid: IndustriesGrid, TriggerGrid: TriggerGrid, SponsorList: SponsorList,
    PillarsList: PillarsList, ApproachSteps: ApproachSteps,
    TeamCard: TeamCard, TeamGrid: TeamGrid, ExpertNetwork: ExpertNetwork,
    LocationsMap: LocationsMap, LocationsList: LocationsList,
    OpenRoles: OpenRoles, ValuesList: ValuesList,
    CTABanner: CTABanner, ContactForm: ContactForm,
    // helpers (exported for tests / reuse)
    _esc: esc
  };

  root.Components = Components;
  if (typeof module !== 'undefined' && module.exports) module.exports = Components;
})(typeof window !== 'undefined' ? window : globalThis);
