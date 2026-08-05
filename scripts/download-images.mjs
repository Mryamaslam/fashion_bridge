import fs from "fs";
import path from "path";
import https from "https";

const dir = path.resolve("tmp-img-check");
fs.mkdirSync(dir, { recursive: true });

const photos = {
  polo: "photo-1586363104862-3a5e2ab60d99",
  poloPerformance: "photo-1625910513520-bed0389ce32f",
  poloLongSleeve: "photo-1603252109303-2751441dd157",
  shorts: "photo-1591195853828-11db59a44f6b",
  shortsBasketball: "photo-1571019614242-c5c5dee9f50b",
  sportsYoga: "photo-1518611012118-696072aa579a",
  sportsRun: "photo-1483721310020-03333e577078",
  jeans: "photo-1542272604-787c3835535d",
  jeansStraight: "photo-1541099649105-f69ad21f3246",
  jeansRelaxed: "photo-1604176354204-9268737828e4",
  bag: "photo-1590874103328-eac38a683ce7",
  backpack: "photo-1553062407-98eeb64c6a62",
  crossbody: "photo-1548036328-c9fa89d128fa",
  duffel: "photo-1622560480605-d83c853bc5c3",
  sneakers: "photo-1549298916-b41d501d3772",
  sneakersRun: "photo-1542291026-7eec264c27ff",
  sneakersWhite: "photo-1606107557195-0e29a4b5b4aa",
  sneakersHighTop: "photo-1608231387042-66d1773070a5",
  sneakersCanvas: "photo-1595950653106-6c9ebd614d3a",
  sneakersTrail: "photo-1460353581641-37baddab0fa2",
  sneakersLifestyle: "photo-1491553895911-0055eca6402d",
  accessories: "photo-1551028719-00167b16eac5",
  cap: "photo-1588850561407-ed78c282e89b",
  beanie: "photo-1556905055-8f358a7a47b2",
  socks: "photo-1571019614242-c5c5dee9f50b",
  scarf: "photo-1539533018447-63fcce2678e3",
  windbreaker: "photo-1591047139829-d91aecb6caea",
  performanceTee: "photo-1552374196-1ab2a1c593e8",
  hoodieTech: "photo-1544022613-e87ca75a784a",
  hoodieBlack: "photo-1612978322313-be209301e185",
  // candidates for replacements
  candCargo1: "photo-1591195853828-11db59a44f6b",
  candSocks1: "photo-1586350977771-b3b0abd50c82",
  candSocks2: "photo-1582966772680-860e8369876f",
  candScarf1: "photo-1601924994987-69e26d50dc26",
  candScarf2: "photo-1520903920243-00d872a77d5d",
  candBelt1: "photo-1624222247344-550fb60583fd",
  candBelt2: "photo-1661956602116-aa6865609028",
  candAthleticShorts: "photo-1517836357463-d25dfeac3438",
  candYoga: "photo-1544367567-0f2fcb009e0b",
  candRun: "photo-1476480862126-209bfaa8edc8",
  candDuffel: "photo-1553062407-98eeb64c6a62",
  candCrossbody: "photo-1590874103328-eac38a683ce7",
  candBeanie: "photo-1576871337622-98d48d1cf531",
  candCargo2: "photo-1506629082955-511b1aa78283",
  candChino: "photo-1473966968600-fa801b869a1a",
  candWomenJeans: "photo-1541099649105-f69ad21f3246",
  candWomenJeans2: "photo-1582418702059-97ebafb35d09",
};

function download(name, id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=70`;
    const file = path.join(dir, `${name}.jpg`);
    const f = fs.createWriteStream(file);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, (res2) => {
            res2.pipe(f);
            f.on("finish", () => {
              f.close();
              resolve(`${name} OK ${res2.statusCode}`);
            });
          }).on("error", () => resolve(`${name} FAIL redirect`));
          return;
        }
        if (res.statusCode !== 200) {
          resolve(`${name} FAIL ${res.statusCode}`);
          return;
        }
        res.pipe(f);
        f.on("finish", () => {
          f.close();
          resolve(`${name} OK`);
        });
      })
      .on("error", (e) => resolve(`${name} FAIL ${e.message}`));
  });
}

const results = [];
for (const [name, id] of Object.entries(photos)) {
  results.push(await download(name, id));
}
fs.writeFileSync(path.join(dir, "results.txt"), results.join("\n"));
console.log(results.join("\n"));
