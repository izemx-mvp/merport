import { CableCutaway } from "./current-lines";

const artByType: Record<string, string> = {
  cable: "M35 80h190l52 52h198M35 110h180l52 52h208M35 140h170l52 52h218",
  connect: "M95 150h86l30-30h82v110h-82l-30-30H95zm198-28 46 28v52l-46 28m-106-80v52",
  path: "M70 86h290v160H70zm0 52h290m-228-52v160m112-160v160M54 246h322",
  light: "M110 98h216l34 38v82H76v-82zm24 29v62m43-62v62m43-62v62m43-62v62m43-62v62",
  switch: "M102 72h208v196H102zm36 35h55v60h-55zm80 0h55v60h-55zm-80 86h119m-64-43v43m86-43v43",
  automation: "M80 110h250v148H80zm38 38h60v70h-60zm96 0h76m-76 36h76m-156 40 28-30 28 18 38-48 34 20",
  measure: "M100 76h188v190H100zm40 34h110v63H140zm25 98h18m25 0h18m25 0h10m-74-98v63",
  tools: "m104 232 84-84 48 48-84 84zm110-126 32 32m20 0 26-26 48 48-26 26m-96 10 54 54m18-154 20-20 30 30-20 20",
};

export function ProductIllustration({ category, tone = "" }: { category: string; tone?: string }) {
  if (category === "cables-fils") return <div className={`product-visual product-visual-${tone}`}><CableCutaway className="product-cable" /></div>;
  const d = artByType[category] ?? artByType.cable;
  return (
    <div className={`product-visual product-visual-${tone}`}>
      <div className="product-visual-index">MATÉRIEL ÉLECTRIQUE · MERPORT</div>
      <svg viewBox="0 0 440 330" fill="none" aria-hidden="true">
        <path className="product-illustration-line" d={d} />
        <circle className="product-illustration-point" cx="342" cy="78" r="5" />
        <path className="product-illustration-line product-illustration-faint" d="M40 293H400M40 287v12m360-12v12" />
      </svg>
      <span className="product-visual-arrow" aria-hidden="true">↗</span>
    </div>
  );
}
