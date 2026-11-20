import { useEffect, useState } from "react";

const AFRICA =
  "M67 12L88 16L116 7L155 4L160 6L157 22L182 31L204 41L209 33L237 35L264 37L277 37L278 44L292 77L304 105L316 124L337 140L381 144L380 152L363 182L341 204L325 220L316 237L315 253L322 267L322 292L292 330L294 341L278 352L278 369L264 381L248 395L220 396L201 398L198 385L190 366L182 358L179 335L164 303L165 281L173 272L172 257L166 242L149 215L151 193L146 184L132 185L121 174L106 175L88 183L77 180L58 185L39 172L26 162L17 149L7 140L3 128L8 118L10 102L6 94L17 77L25 58L44 47L46 42L45 30L62 22Z";
const MADAGASCAR = "M370 275L376 294L358 347L341 347L338 330L343 297L358 283Z";

const HUB = { name: "Casablanca", x: 57, y: 24 };
const DESTINATIONS = [
  { name: "Nouakchott", x: 12, y: 109 },
  { name: "Dakar", x: 3, y: 128 },
  { name: "Bamako", x: 55, y: 140 },
  { name: "Conakry", x: 24, y: 157 },
  { name: "Abidjan", x: 77, y: 180 },
  { name: "Douala", x: 152, y: 187 },
  { name: "Libreville", x: 151, y: 207 },
];

const MAP_IMAGE = "/images/africa-map.webp";

function AfricaSvg() {
  return (
    <svg className="africa-svg" viewBox="-20 -10 420 420" role="img" aria-label="Carte de l’Afrique : liaisons depuis Casablanca vers l’Afrique de l’Ouest et centrale">
      <path className="africa-land" d={AFRICA} />
      <path className="africa-land" d={MADAGASCAR} />
      {DESTINATIONS.map((city, index) => {
        const cx = (HUB.x + city.x) / 2 + 40;
        const cy = (HUB.y + city.y) / 2 - 10;
        return (
          <g key={city.name}>
            <path className="africa-route" style={{ animationDelay: `${index * 0.35}s` }} d={`M${HUB.x} ${HUB.y}Q${cx} ${cy} ${city.x} ${city.y}`} />
            <circle className="africa-city" cx={city.x} cy={city.y} r="3.5" />
          </g>
        );
      })}
      <circle className="africa-hub-pulse" cx={HUB.x} cy={HUB.y} r="9" />
      <circle className="africa-hub" cx={HUB.x} cy={HUB.y} r="5" />
      <text className="africa-label" x={HUB.x + 10} y={HUB.y + 4}>Casablanca</text>
    </svg>
  );
}

/** Affiche africa-map.webp dès que le fichier existe dans /public/images, sinon la carte SVG. */
export function AfricaMap() {
  const [hasImage, setHasImage] = useState(false);
  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setHasImage(true);
    probe.src = MAP_IMAGE;
    return () => {
      probe.onload = null;
    };
  }, []);
  if (hasImage) {
    return <img className="africa-image" src={MAP_IMAGE} alt="Carte de l’Afrique montrant les livraisons MERPORT depuis Casablanca" width={1200} height={1200} loading="lazy" decoding="async" />;
  }
  return <AfricaSvg />;
}
