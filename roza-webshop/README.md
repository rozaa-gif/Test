# ROZA – rozathelabel.com

Design preview of the ROZA online shop: classy, elegant and confident blazers, suits, office dresses and after-work outfits for women 25+.

This is a clickable prototype for agreeing on the look, structure and content. At launch it becomes a custom Shopify theme, so that Shopify handles checkout, payments, customer accounts and data storage securely.

## Open it

Open `index.html` in a browser, or serve the folder locally:

```bash
cd roza-webshop
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Shop (New In, All, Blazers, Suits, Office Dresses, Skirts, Trousers, Tops & Blouses, After Work) | `shop.html?cat=…` |
| Product | `product.html?id=…` |
| About | `about.html` |
| FAQ | `faq.html` |
| Shipping & Returns | `shipping-returns.html` |
| Size Guide | `size-guide.html` |
| Contact | `contact.html` |
| Sign in / Create account / Reset password | `account.html` |
| Privacy Policy, Cookie Policy, Terms of Sale | `privacy.html`, `cookies.html`, `terms.html` |

## Features

- **Brand look:** black, soft nude and white, with self-hosted Cormorant Garamond and Jost fonts.
- **Languages:** English and Norwegian. The site picks one from the browser language and the shopper can switch in the header.
- **Currencies:** NOK (default), SEK, DKK and EUR. The rates here are indicative only; Shopify Markets sets the real prices.
- **Navigation:** a mega menu on desktop and a slide-in menu on mobile, plus search, a shopping bag drawer with a free-shipping progress bar, and filters and sorting on the shop page.
- **Social media:** Instagram and TikTok links in the header menu, footer, home page and contact page (placeholder handle `@rozathelabel`).
- **Accessibility:** keyboard navigation, focus handling in dialogs, skip link, labelled forms and a reduced-motion setting.

## Privacy and security (GDPR)

- **Cookie consent:** "Accept all" and "Only necessary" are equally easy to choose. There are separate choices for statistics and marketing, consent lasts 12 months, and a "Cookie settings" link in the footer reopens the choices. Optional scripts may only be added in `loadOptionalScripts()` in `assets/js/app.js`, which runs after the visitor has given consent.
- **No third-party requests:** no Google Fonts, trackers or embedded feeds, so no visitor IP addresses are passed to other companies without consent.
- **Content Security Policy** on every page: scripts, styles and fonts load only from this site, and there is no inline script.
- **Safe handling of text:** anything the visitor types (search words, web-address parameters) is shown as plain text or checked against an allowed list, never inserted as HTML.
- **Forms:** newsletter and account sign-up require explicit opt-in (the boxes are not pre-ticked), with a link to the privacy policy. **In this preview, forms send and store nothing**; at launch they post to Shopify over HTTPS.
- **Local storage** holds only the bag, language, currency and cookie choice. No personal data is kept there.
- **Legal pages:** privacy policy, cookie policy and terms of sale in English and Norwegian, based on the GDPR, the Norwegian Right of Withdrawal Act (angrerettloven) and the Consumer Purchases Act (forbrukerkjøpsloven). These are templates: fill in the `[bracketed]` details and have them reviewed before launch.

## Before launch (checklist)

- [ ] Replace the placeholder illustrations with product photos
- [ ] Confirm the Instagram and TikTok handles
- [ ] Fill in the company name, org. no. and address; confirm shipping prices, carriers and delivery times
- [ ] Convert the design into a Shopify theme (Liquid) and connect the products, customer accounts and checkout
- [ ] Set up Shopify Markets (NOK/SEK/DKK/EUR) and the payment methods (Klarna, Vipps, cards, Apple Pay)
- [ ] Turn on two-factor login for all Shopify staff accounts
- [ ] Connect the domain **rozathelabel.com** with HTTPS
- [ ] Have the legal texts reviewed

## Structure

```
roza-webshop/
├── *.html                 pages
└── assets/
    ├── css/styles.css     design system and layout
    ├── js/i18n.js         EN/NO interface text
    ├── js/products.js     product catalogue and placeholder illustrations
    ├── js/app.js          header/footer, language, currency, bag, consent, forms, pages
    ├── fonts/             self-hosted fonts (SIL Open Font License)
    └── img/favicon.svg
```
