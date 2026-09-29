/* ROZA – product catalogue (placeholder data until Shopify is connected).
   Prices are stored in NOK incl. VAT. `art` picks the placeholder illustration. */
window.ROZA_CATEGORIES = ["blazers", "suits", "dresses", "skirts", "trousers", "tops", "afterwork"];
window.ROZA_SIZES = ["XS", "S", "M", "L", "XL"];
window.ROZA_COLORS = ["black", "nude", "ivory", "camel", "espresso"];

window.ROZA_PRODUCTS = [
  {
    id: "signature-blazer", cat: "blazers", art: "blazer", color: "black", price: 1999, isNew: true, added: 20260915,
    name: "The Signature Blazer",
    desc: {
      en: "Our signature single-breasted blazer with sharp shoulders and a softly nipped waist. Wear it over a dress for the office or on bare skin for evening.",
      nb: "Vår signaturblazer med skarpe skuldre og en myk, innsvinget midje. Bruk den over en kjole på kontoret eller rett på huden om kvelden."
    },
    details: {
      en: ["Tailored regular fit", "Peak lapels, one-button closure", "Fully lined", "Wool blend", "Dry clean only"],
      nb: ["Skreddersydd, normal passform", "Spisse slag, én knapp", "Helfôret", "Ullblanding", "Kun rens"]
    }
  },
  {
    id: "oversized-wool-blazer", cat: "blazers", art: "blazer", color: "camel", price: 2299, isNew: false, added: 20260801,
    name: "Oversized Wool Blazer",
    desc: {
      en: "A relaxed, longline blazer in a warm camel tone – effortless over tailored trousers or a slip dress.",
      nb: "En avslappet, lang blazer i en varm kameltone – lekker over dressbukser eller en slip-kjole."
    },
    details: {
      en: ["Relaxed oversized fit", "Double flap pockets", "Fully lined", "70% wool", "Dry clean only"],
      nb: ["Avslappet, romslig passform", "To klaffelommer", "Helfôret", "70 % ull", "Kun rens"]
    }
  },
  {
    id: "double-breasted-blazer", cat: "blazers", art: "blazer", color: "nude", price: 2199, isNew: true, added: 20260920,
    name: "Double-Breasted Blazer",
    desc: {
      en: "Structured double-breasted blazer in soft nude with gold-tone buttons. Polished, powerful and feminine.",
      nb: "Strukturert dobbeltspent blazer i myk nude med gullfargede knapper. Stilren, kraftfull og feminin."
    },
    details: {
      en: ["Structured fit", "Six-button double-breasted front", "Fully lined", "Viscose blend", "Dry clean only"],
      nb: ["Strukturert passform", "Dobbeltspent med seks knapper", "Helfôret", "Viskoseblanding", "Kun rens"]
    }
  },
  {
    id: "power-suit", cat: "suits", art: "suit", color: "black", price: 3499, isNew: true, added: 20260918,
    name: "The Power Suit",
    desc: {
      en: "A two-piece suit made for big decisions: fitted blazer and high-waisted straight trousers in deep black.",
      nb: "En todelt dress for store beslutninger: tettsittende blazer og høyt skårne, rette bukser i dyp svart."
    },
    details: {
      en: ["Blazer and trousers sold as a set", "High-waisted trousers with pressed crease", "Fully lined blazer", "Wool blend", "Dry clean only"],
      nb: ["Blazer og bukse selges som sett", "Høyt liv med pressfold", "Helfôret blazer", "Ullblanding", "Kun rens"]
    }
  },
  {
    id: "soft-tailored-suit", cat: "suits", art: "suit", color: "nude", price: 3299, isNew: false, added: 20260710,
    name: "Soft Tailored Suit",
    desc: {
      en: "Soft shoulders, fluid wide-leg trousers and a colour that flatters every skin tone.",
      nb: "Myke skuldre, flytende vide bukser og en farge som kler alle hudtoner."
    },
    details: {
      en: ["Relaxed tailoring", "Wide-leg trousers", "Partly lined", "Crepe fabric", "Gentle wash 30°C"],
      nb: ["Avslappet skreddersøm", "Vide bukser", "Delvis fôret", "Crepe-stoff", "Skånevask 30 °C"]
    }
  },
  {
    id: "espresso-skirt-suit", cat: "suits", art: "suit", color: "espresso", price: 3199, isNew: false, added: 20260620,
    name: "Espresso Two-Piece",
    desc: {
      en: "A rich espresso two-piece with a cropped blazer – timeless, warm and quietly confident.",
      nb: "Et fyldig espressofarget sett med kort blazer – tidløst, varmt og stille selvsikkert."
    },
    details: {
      en: ["Cropped blazer", "Matching trousers", "Fully lined", "Wool blend", "Dry clean only"],
      nb: ["Kort blazer", "Matchende bukser", "Helfôret", "Ullblanding", "Kun rens"]
    }
  },
  {
    id: "boardroom-dress", cat: "dresses", art: "dress", color: "black", price: 1699, isNew: true, added: 20260912,
    name: "The Boardroom Dress",
    desc: {
      en: "A figure-skimming sheath dress with a defined waist – our go-to for presentations and dinners alike.",
      nb: "En tettsittende kjole med markert midje – vår favoritt både til presentasjoner og middager."
    },
    details: {
      en: ["Fitted silhouette, knee length", "Concealed back zip", "Stretch crepe", "Lined", "Gentle wash 30°C"],
      nb: ["Tettsittende, knelang", "Skjult glidelås bak", "Stretch-crepe", "Fôret", "Skånevask 30 °C"]
    }
  },
  {
    id: "wrap-midi-dress", cat: "dresses", art: "dress", color: "camel", price: 1599, isNew: false, added: 20260805,
    name: "Wrap Midi Dress",
    desc: {
      en: "A flattering wrap dress in fluid fabric that moves with you from morning meetings to evening plans.",
      nb: "En flatterende omslagskjole i flytende stoff som følger deg fra morgenmøtet til kveldens planer."
    },
    details: {
      en: ["Wrap front with tie belt", "Midi length", "Soft satin-back crepe", "Unlined", "Gentle wash 30°C"],
      nb: ["Omslag foran med knytebelte", "Midilengde", "Myk crepe med satengbakside", "Uforet", "Skånevask 30 °C"]
    }
  },
  {
    id: "belted-shirt-dress", cat: "dresses", art: "dress", color: "ivory", price: 1499, isNew: false, added: 20260701,
    name: "Belted Shirt Dress",
    desc: {
      en: "Crisp and clean with a removable belt – the dress that makes getting ready effortless.",
      nb: "Sprø og ren med avtakbart belte – kjolen som gjør det enkelt å bli klar."
    },
    details: {
      en: ["Relaxed fit with belt", "Button front", "Cotton blend", "Unlined", "Machine wash 30°C"],
      nb: ["Avslappet passform med belte", "Knapper foran", "Bomullsblanding", "Uforet", "Maskinvask 30 °C"]
    }
  },
  {
    id: "classic-pencil-skirt", cat: "skirts", art: "skirt", color: "black", price: 999, isNew: false, added: 20260615,
    name: "Classic Pencil Skirt",
    desc: {
      en: "The essential high-waisted pencil skirt with a back slit – sharp, sleek and endlessly versatile.",
      nb: "Det klassiske pencilskjørtet med høyt liv og splitt bak – stramt, elegant og uendelig allsidig."
    },
    details: {
      en: ["High waist, knee length", "Back slit and zip", "Stretch crepe", "Lined", "Gentle wash 30°C"],
      nb: ["Høyt liv, knelang", "Splitt og glidelås bak", "Stretch-crepe", "Fôret", "Skånevask 30 °C"]
    }
  },
  {
    id: "satin-midi-skirt", cat: "skirts", art: "skirt", color: "nude", price: 1099, isNew: true, added: 20260922,
    name: "Satin Midi Skirt",
    desc: {
      en: "A bias-cut satin skirt with a soft sheen. Pair with a blazer by day and a silk top by night.",
      nb: "Et skråskåret satengskjørt med myk glans. Kombiner med blazer på dagtid og silketopp om kvelden."
    },
    details: {
      en: ["Bias cut, midi length", "Elasticated back waist", "Satin", "Unlined", "Hand wash cold"],
      nb: ["Skråskåret, midilengde", "Strikk i livet bak", "Sateng", "Uforet", "Håndvask kaldt"]
    }
  },
  {
    id: "wide-leg-trousers", cat: "trousers", art: "trousers", color: "ivory", price: 1299, isNew: false, added: 20260725,
    name: "Wide-Leg Trousers",
    desc: {
      en: "High-waisted wide-leg trousers with a pressed crease that elongates the silhouette.",
      nb: "Vide bukser med høyt liv og pressfold som forlenger silhuetten."
    },
    details: {
      en: ["High waist, full length", "Pressed front crease", "Side pockets", "Viscose blend", "Gentle wash 30°C"],
      nb: ["Høyt liv, full lengde", "Pressfold foran", "Sidelommer", "Viskoseblanding", "Skånevask 30 °C"]
    }
  },
  {
    id: "cigarette-trousers", cat: "trousers", art: "trousers", color: "black", price: 1199, isNew: false, added: 20260705,
    name: "Cigarette Trousers",
    desc: {
      en: "Slim, ankle-length trousers with a hint of stretch – made for heels and busy days.",
      nb: "Smale, ankellange bukser med litt stretch – laget for høye hæler og travle dager."
    },
    details: {
      en: ["Slim fit, ankle length", "Concealed side zip", "Stretch twill", "Unlined", "Machine wash 30°C"],
      nb: ["Smal passform, ankellengde", "Skjult glidelås i siden", "Stretch-twill", "Uforet", "Maskinvask 30 °C"]
    }
  },
  {
    id: "silk-tie-neck-blouse", cat: "tops", art: "top", color: "ivory", price: 1199, isNew: true, added: 20260916,
    name: "Silk Tie-Neck Blouse",
    desc: {
      en: "A fluid blouse with a tie neck you can wear as a bow or leave loose for a softer look.",
      nb: "En flytende bluse med knytebånd i halsen – bruk den som sløyfe eller løs for et mykere uttrykk."
    },
    details: {
      en: ["Relaxed fit", "Tie neck, buttoned cuffs", "Mulberry silk", "Unlined", "Hand wash cold"],
      nb: ["Avslappet passform", "Knytebånd i halsen, knapper i mansjetten", "Morbærsilke", "Uforet", "Håndvask kaldt"]
    }
  },
  {
    id: "satin-shell-top", cat: "tops", art: "top", color: "nude", price: 799, isNew: false, added: 20260612,
    name: "Satin Shell Top",
    desc: {
      en: "A minimal satin top that layers perfectly under blazers and shines on its own after dark.",
      nb: "En minimalistisk satengtopp som passer perfekt under blazeren og skinner alene etter mørkets frembrudd."
    },
    details: {
      en: ["Regular fit", "Round neck", "Satin", "Unlined", "Hand wash cold"],
      nb: ["Normal passform", "Rund hals", "Sateng", "Uforet", "Håndvask kaldt"]
    }
  },
  {
    id: "midnight-slip-dress", cat: "afterwork", art: "slip", color: "black", price: 1899, isNew: true, added: 20260925,
    name: "The Midnight Slip Dress",
    desc: {
      en: "A sensual bias-cut slip dress with a deep V-neck. Add a blazer and you are ready for anything.",
      nb: "En sensuell, skråskåret slip-kjole med dyp V-hals. Legg til en blazer, og du er klar for alt."
    },
    details: {
      en: ["Bias cut, midi length", "Adjustable straps", "Satin", "Unlined", "Hand wash cold"],
      nb: ["Skråskåret, midilengde", "Justerbare stropper", "Sateng", "Uforet", "Håndvask kaldt"]
    }
  },
  {
    id: "draped-evening-dress", cat: "afterwork", art: "slip", color: "espresso", price: 1999, isNew: false, added: 20260728,
    name: "Draped Evening Dress",
    desc: {
      en: "Soft draping and a sculpted waist in a deep espresso tone – elegant with a hint of allure.",
      nb: "Myk drapering og markert midje i en dyp espressotone – elegant med et hint av forførelse."
    },
    details: {
      en: ["Fitted, midi length", "Draped bodice", "Jersey crepe", "Lined", "Gentle wash 30°C"],
      nb: ["Tettsittende, midilengde", "Drapert overdel", "Jersey-crepe", "Fôret", "Skånevask 30 °C"]
    }
  },
  {
    id: "satin-corset-top", cat: "afterwork", art: "top", color: "black", price: 1099, isNew: false, added: 20260702,
    name: "Satin Corset Top",
    desc: {
      en: "A structured satin corset top – wear it under a blazer for an effortless after-work look.",
      nb: "En strukturert korsett-topp i sateng – bruk den under en blazer for en uanstrengt after work-look."
    },
    details: {
      en: ["Fitted with boning", "Back zip", "Satin", "Lined", "Hand wash cold"],
      nb: ["Tettsittende med spiler", "Glidelås bak", "Sateng", "Fôret", "Håndvask kaldt"]
    }
  }
];

/* Line-art placeholder illustrations (replace with product photography later). */
window.ROZA_ART = (function () {
  const blazer =
    '<path d="M85 30 L60 38 Q45 44 42 60 L30 170 L48 172 L55 95 L58 200 L142 200 L145 95 L152 172 L170 170 L158 60 Q155 44 140 38 L115 30"/>' +
    '<path d="M85 30 L78 70 L92 78 L100 112 L108 78 L122 70 L115 30"/>' +
    '<path d="M68 152 L88 152 M112 152 L132 152"/>' +
    '<circle cx="100" cy="132" r="2.6"/><circle cx="100" cy="152" r="2.6"/>';
  const shapes = {
    blazer: blazer,
    suit: blazer + '<path d="M64 200 L58 252 L92 252 L100 210 L108 252 L142 252 L136 200"/>',
    dress:
      '<path d="M80 30 Q100 46 120 30 L135 38 L132 70 Q128 90 132 110 L146 238 L54 238 L68 110 Q72 90 68 70 L65 38 Z"/>' +
      '<path d="M69 108 Q100 116 131 108"/><path d="M100 238 L100 212"/>',
    skirt:
      '<path d="M64 40 L136 40 L141 72 L146 228 L54 228 L59 72 Z"/>' +
      '<path d="M64 56 L136 56"/><path d="M100 228 L100 196"/>',
    trousers:
      '<path d="M68 28 L132 28 L136 50 L152 238 L110 238 L100 92 L90 238 L48 238 L64 50 Z"/>' +
      '<path d="M67 44 L133 44"/><path d="M80 60 L70 232 M120 60 L130 232"/>',
    top:
      '<path d="M82 35 Q100 56 118 35 L145 45 L170 120 L155 126 L140 90 L140 192 L60 192 L60 90 L45 126 L30 120 L55 45 Z"/>' +
      '<path d="M100 52 L92 84 M100 52 L108 84"/>',
    slip:
      '<path d="M80 26 L80 70 M120 26 L120 70"/>' +
      '<path d="M80 70 L100 98 L120 70 Q129 90 125 112 L152 242 L48 242 L75 112 Q71 90 80 70 Z"/>' +
      '<path d="M76 112 Q100 120 124 112"/>'
  };
  return function (type, extraClass) {
    return '<svg class="art' + (extraClass ? " " + extraClass : "") + '" viewBox="0 0 200 260" aria-hidden="true" focusable="false" ' +
      'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">' +
      (shapes[type] || shapes.dress) + "</svg>";
  };
})();
