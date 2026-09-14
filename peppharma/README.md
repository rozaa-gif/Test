# Peppharma

En enkel, brukervennlig og responsiv nettbutikk for vitaminer, kosttilskudd og velværeprodukter. Bygget med ren HTML, CSS og JavaScript — ingen rammeverk eller byggesteg nødvendig.

Siden er på **norsk som standard**, med en **NO / EN**-språkbryter øverst på hver side.

## Sider

| Side | Fil | Innhold |
|---|---|---|
| Hjem | `index.html` | Hero, leveringsgaranti-stripe, "hvorfor velge oss", populære produkter |
| Produkter | `produkter.html` | Alle produkter med kategorifiltrering |
| Spørsmål og svar | `faq.html` | Accordion med vanlige spørsmål (levering, betaling, garanti, konto) |
| Handlekurv | `handlekurv.html` | Handlekurv med mengde, sum og enkel betalingsformular |
| Min side | `min-side.html` | Innlogging og registrering (demo, ingen backend) |
| Frakt & betaling | `frakt-betaling.html` | Leveringstider (innland/internasjonalt), fraktpriser, betalingsmåter og leveringsgaranti |

## Funksjoner

- **Språkbytte (NO/EN)**: alle tekster styres av `data-i18n`-attributter og ordboken i `js/i18n.js`. Valgt språk lagres i `localStorage`.
- **Handlekurv**: lagres i `localStorage` (`js/cart.js`), fungerer på tvers av alle sider, med mengdejustering og fjerning av varer.
- **Leveringsgaranti**: er kunden ikke fornøyd med produktet, sendes et nytt produkt helt gratis — omtalt på forsiden, i FAQ og på frakt-siden.
- **Leveringstider**: innland Norge 1–5 virkedager (avhengig av område), internasjonalt 2–12 virkedager avhengig av destinasjon (Norden raskest, resten av verden lengst).
- **Responsivt design**: mobilmeny med hamburger-ikon, produktgrid og handlekurv-tabell som tilpasser seg mindre skjermer.

## Filstruktur

```
peppharma/
├── index.html
├── produkter.html
├── faq.html
├── handlekurv.html
├── min-side.html
├── frakt-betaling.html
├── css/
│   └── style.css
└── js/
    ├── i18n.js        # oversettelser (NO/EN) + språkbytte
    ├── products.js    # produktkatalog + rendering
    ├── cart.js        # handlekurv-logikk
    └── app.js         # mobilmeny, FAQ-accordion, kontoskjemaer
```

## Kjøre lokalt

Ingen avhengigheter eller bygg — åpne `index.html` direkte i nettleseren, eller server mappen:

```bash
python3 -m http.server 8000
```

og gå til `http://localhost:8000/`.

## Neste steg (ikke implementert ennå)

- Ekte betalingsløsning (f.eks. Vipps/Stripe/Klarna) i stedet for demo-skjema
- Ekte innlogging/kontoer med backend
- Produktbilder fra egen fotografering/CDN i stedet for Unsplash-placeholder
- Ordrehistorikk på "Min side"
