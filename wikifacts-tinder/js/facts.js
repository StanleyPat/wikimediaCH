/**
 * WikiFacts Tinder - Fakten-Datenbank
 * Jedes Fakt-Objekt enthält:
 * - id: Eindeutige Kennung
 * - text: Die zu überprüfende Aussage
 * - isTrue: Wahrheitswert (true / false)
 * - explanation: Ausführliche Aufklärung
 * - sources: Liste vertrauenswürdiger Quellen (Wikipedia, wissenschaftliche Seiten etc.)
 */

const FACTS = [
  {
    id: "1",
    text: "Die Chinesische Mauer ist das einzige von Menschen geschaffene Bauwerk, das man mit bloßem Auge vom Mond aus sehen kann.",
    isTrue: false,
    explanation: "Das ist ein weit verbreiteter Mythos. Selbst aus einer niedrigen Erdumlaufbahn ist sie ohne Hilfsmittel kaum zu erkennen.",
    sources: [
      { label: "Wikipedia: Chinesische Mauer", url: "https://de.wikipedia.org/wiki/Chinesische_Mauer" },
      { label: "NASA: China's Wall Less Visible", url: "https://www.nasa.gov/vision/space/workinginspace/great_wall.html" }
    ]
  },
  {
    id: "2",
    text: "Bananen sind botanisch gesehen Beeren, Erdbeeren hingegen nicht.",
    isTrue: true,
    explanation: "Botanisch gesehen sind Bananen Beeren, da sie aus einem einzigen Fruchtknoten entstehen. Erdbeeren sind Sammelnussfrüchte.",
    sources: [
      { label: "Wikipedia: Beere", url: "https://de.wikipedia.org/wiki/Beere" },
      { label: "Wissen.de: Bananen sind Beeren", url: "https://www.wissen.de/sind-bananen-beeren" }
    ]
  },
  {
    id: "3",
    text: "Ein Oktopus hat drei Herzen.",
    isTrue: true,
    explanation: "Zwei Herzen pumpen Blut zu den Kiemen, während das dritte Herz den Rest des Körpers versorgt.",
    sources: [
      { label: "Wikipedia: Kraken", url: "https://de.wikipedia.org/wiki/Kraken" },
      { label: "National Geographic: Octopus Facts", url: "https://www.nationalgeographic.com/animals/invertebrates/facts/common-octopus" }
    ]
  },
  {
    id: "4",
    text: "Goldfische haben ein Gedächtnis von nur drei Sekunden.",
    isTrue: false,
    explanation: "Studien haben gezeigt, dass Goldfische Informationen über Monate hinweg speichern können.",
    sources: [
      { label: "Wikipedia: Goldfisch", url: "https://de.wikipedia.org/wiki/Goldfisch" },
      { label: "Geo: Das Gedächtnis von Goldfischen", url: "https://www.geo.de/geolino/natur-und-umwelt/16386-rtkl-tierwelt-haben-goldfische-ein-sieb-gedaechtnis" }
    ]
  },
  {
    id: "5",
    text: "Der Eiffelturm kann im Sommer bis zu 15 Zentimeter wachsen.",
    isTrue: true,
    explanation: "Durch die Wärme dehnt sich das Eisen aus, was zu einer messbaren Vergrößerung des Turms führt.",
    sources: [
      { label: "Wikipedia: Eiffelturm", url: "https://de.wikipedia.org/wiki/Eiffelturm" },
      { label: "Offizielle Seite: Eiffelturm", url: "https://www.toureiffel.paris/de/nachrichten/geschichte/warum-der-eiffelturm-im-sommer-waechst" }
    ]
  }
];

// Für Umgebungen mit Modulen verfügbar machen, falls importiert:
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FACTS };
}
