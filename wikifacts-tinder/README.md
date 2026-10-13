# WikiFacts Tinder 🃏

Ein schnelles, interaktives Wissens- und Faktenquiz nach dem Tinder-Prinzip (Swipe-Cards).
Entwickelt mit dem **Vanilla Stack (reines HTML5, CSS3 und modernes JavaScript)** – komplett ohne Node.js, React, Tailwind oder Build-Tools.

## Features ✨

- **Tinder-Swipe-Mechanik:** Volle Touch- und Maus-Gestensteuerung (Swipe nach rechts für *WAHR*, nach links für *FALSCH*) mit dynamischen Stempeln und flüssiger Physik.
- **Barrierefreie Bedienung:** Auch per Klick auf die FALSCH/WAHR-Buttons oder per Tastatur steuerbar (`←` für Falsch, `→` für Wahr, `Leertaste`/`Enter` zum Bestätigen).
- **Soundeffekte:** Integrierter Sound-Synthesizer via Web Audio API (keine externen Audio-Dateien nötig), mit Mute-Schalter.
- **Quellenprüfung:** Verlinkung zu geprüften Wikipedia- und Fachquellen für jeden Fakt.
- **Ergebnis & Fakten-Rückblick:** Detaillierte Punkteauswertung mit Akkordeon zur Durchsicht aller überprüften Fakten und Share-Funktion.
- **Responsive & Modernes Design:** Schlankes Zinc-Farbschema, Dark-Mode-Unterstützung, flüssige Animationen und typografische Eleganz.

## Lokale Ausführung 🚀

Da es sich um eine reine **Vanilla-Stack-Webanwendung** handelt, sind **keine Installationen (kein npm, kein Node.js)** erforderlich:

### Option 1: Direkt im Browser öffnen
Doppelklicke einfach auf die Datei `index.html` oder öffne sie direkt im Browser deiner Wahl (Chrome, Safari, Firefox, Edge).

### Option 2: Mit Python lokal servieren
Im Verzeichnis `wikifacts-tinder/`:
```bash
python3 -m http.server 3000
```
Öffne anschließend [http://localhost:3000](http://localhost:3000) im Browser.

## Projektstruktur 📁

```text
wikifacts-tinder/
├── index.html       # Semantische HTML5-Struktur & Screens
├── css/
│   └── style.css    # Reines Vanilla CSS (Design-System, Animationen, Responsive Layout)
├── js/
│   ├── facts.js     # Fakten-Datensatz mit Erklärungen & Quellen
│   └── app.js       # Game-Engine, Drag-Physik, Audio-Synthesizer & UI-Controller
└── README.md
```
