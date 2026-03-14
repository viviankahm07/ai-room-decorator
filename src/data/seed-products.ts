import type { EtsyProduct } from "@/app/api/etsy-products/route";

// 50 unique Unsplash photo IDs — confirmed or high-confidence home-decor images
const POOL = [
  "1600166898405-da9535204843", //  0 area rug / floor
  "1531835551805-16d864c8d311", //  1 macrame / textile
  "1555041469-a586c61ea9bc",    //  2 sofa / pillows
  "1532372320572-cda25653a26d", //  3 wood coffee table
  "1611269154421-4e27233ac5c7", //  4 metal side table / desk
  "1616046229478-9901c5536a45", //  5 rattan furniture
  "1595428774223-ef52624120d2", //  6 marble / white surface
  "1513506003901-1e6a229e2d15", //  7 Edison string lights
  "1482517967863-00e15c9b44be", //  8 fairy lights / warm glow
  "1558618666-fcd25c85cd64",    //  9 LED / modern light
  "1513519245088-0e12902e35a5", // 10 botanical / green art
  "1541961017774-22349e4a1262", // 11 abstract wall art
  "1579783902614-a3fb3927b6a5", // 12 minimal line art
  "1507473885765-e6ed057f782c", // 13 table lamp
  "1614594975525-e45190c55d0b", // 14 monstera plant
  "1459411552884-841db9b3cc2a", // 15 hanging / trailing plant
  "1509937528035-ad76254b0356", // 16 succulent / cactus
  "1593691509543-c55fb32d8de1", // 17 fiddle leaf fig
  "1563861826100-9cb868fdbe1c", // 18 wall clock
  "1505693416388-ac5ce068fe85", // 19 cozy bedroom scene
  "1522771739844-6a9f6a5ab7d4", // 20 cozy living room
  "1493663284031-b7e3aefcae8e", // 21 colorful throw pillows
  "1618220048045-10a6dbdf0ecd", // 22 modern minimal bedroom
  "1631049307264-da0ec9d70304", // 23 aesthetic / vsco room
  "1524758631624-e2a6118e2e3b", // 24 modern interior
  "1502481851512-8a97cef77b40", // 25 candles / warm
  "1578301978-bacd785819b2",    // 26 gallery wall / art
  "1501183638374-4edd2116d046", // 27 warm pendant lamp
  "1598300042247-d088f8ab3a91", // 28 indoor plants shelf
  "1519710164239-da838a17fc18", // 29 pink / girly room
  "1580237541866-3dcfe857b8e1", // 30 rattan boho chair
  "1494438639946-1ebd1d20bf85", // 31 colourful abstract art
  "1560185127-6ed189168bb5",    // 32 modern living room
  "1617103625126-f2ac12e3b9e8", // 33 bedroom aesthetic
  "1616137466296-9ba25b1b0d60", // 34 white clean bedroom
  "1540518614-9780812b6f22",    // 35 warm cozy bedroom
  "1586023764-9b786dfef4d0",    // 36 plants + bedroom
  "1463320726281-2d09e84248c8", // 37 bright room decor
  "1489171078254-c3365d6e359f", // 38 minimal bedroom
  "1585128786-3f69f3bfcc91",    // 39 vanity / beauty
  "1593312431941-efa39f3f75b5", // 40 cozy nook
  "1513694203232-719a899d0d47", // 41 warm bedroom tones
  "1549643977-26f4abe01bc7",    // 42 plants / nature interior
  "1534349762-02b7a25a4d6f",    // 43 bedroom warm light
  "1556909114-f6e7ad7d3136",    // 44 styled interior
  "1496328275-bc64c1f84dde",    // 45 morning bedroom
  "1551632811-561732d1e306",    // 46 cozy corner
  "1583847268964-b28dc8f51f92", // 47 home decor flatlay
  "1525097487707-1a8b8e4a9a57", // 48 styled shelf
  "1568781961406-8c13d5f7a36b", // 49 modern styled room
];

const p = (i: number) =>
  `https://images.unsplash.com/photo-${POOL[i]}?w=400&fit=crop&auto=format`;
const etsy = (q: string) =>
  `https://www.etsy.com/search?q=${encodeURIComponent(q)}`;

type P = EtsyProduct;
type Def = [string, number, string, string, string]; // title, price, shop, category, etsyQ

function build(prefix: string, defs: Def[]): P[] {
  return defs.map(([title, price, shop, category, q], i) => ({
    id: `${prefix}-${i + 1}`,
    title,
    price,
    currency: "USD",
    image_url: p(i % POOL.length),
    product_url: etsy(q),
    shop_name: shop,
    category,
  }));
}

// ─── PASTEL ──────────────────────────────────────────────────────────────────
const pastel: P[] = build("pas", [
  ["Pastel Pink Throw Pillow Cover", 24, "BlushHomeDecor", "Pillows", "pastel pink throw pillow cover"],
  ["Lavender Watercolor Art Print", 18, "SoftAesthetic", "Art Prints", "lavender watercolor art print"],
  ["Blush Pink Ceramic Vase", 34, "PastelNestCo", "Vases", "blush pink ceramic vase"],
  ["Pastel Rainbow Wall Tapestry", 42, "DreamyDecorShop", "Tapestries", "pastel rainbow wall tapestry"],
  ["Soft Pink Fluffy Area Rug", 89, "LavenderLiving", "Rugs", "soft pink fluffy area rug"],
  ["Pastel Aesthetic Poster Set of 3", 22, "PastelNestCo", "Posters", "pastel aesthetic poster set"],
  ["Lilac Cloud Plush Pillow", 28, "DreamyDecorShop", "Pillows", "lilac cloud plush pillow"],
  ["Baby Blue Rattan Round Mirror", 67, "BlushHomeDecor", "Mirrors", "baby blue rattan round mirror"],
  ["Pastel Macramé Wall Hanging", 38, "LavenderLiving", "Wall Decor", "pastel macrame wall hanging"],
  ["Pink Marble Desktop Tray", 29, "SoftAesthetic", "Accessories", "pink marble desktop tray"],
  ["Pastel Fairy Light Garland", 19, "DreamyDecorShop", "Lighting", "pastel fairy light garland"],
  ["Lavender Soy Candle Set of 3", 32, "BlushHomeDecor", "Candles", "lavender soy candle set"],
  ["Pastel Woven Storage Basket", 44, "PastelNestCo", "Storage", "pastel woven storage basket"],
  ["Pink Ombre Sheer Curtain Panels", 55, "LavenderLiving", "Curtains", "pink ombre sheer curtain panels"],
  ["Pastel Ceramic Succulent Pot Set", 16, "SoftAesthetic", "Planters", "pastel ceramic succulent pot"],
  ["Lavender Dream Catcher Mobile", 28, "DreamyDecorShop", "Wall Decor", "lavender dream catcher mobile"],
  ["Rose Quartz Crystal Candle", 36, "BlushHomeDecor", "Candles", "rose quartz crystal candle"],
  ["Pastel Chunky Knit Throw Blanket", 62, "LavenderLiving", "Throws", "pastel chunky knit throw blanket"],
  ["Pink Arch Decorative Mirror", 78, "PastelNestCo", "Mirrors", "pink arch decorative mirror"],
  ["Pastel Botanical Framed Print Trio", 26, "SoftAesthetic", "Art Prints", "pastel botanical framed print"],
  ["Lilac Fairy String Lights 2m", 22, "DreamyDecorShop", "Lighting", "lilac fairy string lights bedroom"],
  ["Blush Velvet Lumbar Pillow", 32, "BlushHomeDecor", "Pillows", "blush velvet lumbar pillow"],
  ["Pastel Oak Floating Wall Shelf", 54, "LavenderLiving", "Shelving", "pastel oak floating wall shelf"],
  ["Pink Neon LED Sign", 68, "PastelNestCo", "Signs", "pink neon led sign room decor"],
  ["Pastel Ceramic Table Lamp", 72, "SoftAesthetic", "Lamps", "pastel ceramic table lamp"],
  ["Lavender Wax Melt Pod Set", 18, "DreamyDecorShop", "Candles", "lavender wax melt pods"],
  ["Blush Photo Frame Set of 4", 42, "BlushHomeDecor", "Frames", "blush pink photo frame set"],
  ["Pastel Rattan Floor Lamp", 98, "LavenderLiving", "Lamps", "pastel rattan floor lamp"],
  ["Pink Faux Fur Round Rug", 76, "PastelNestCo", "Rugs", "pink faux fur round rug"],
  ["Pastel Pressed Flower Wall Art", 38, "SoftAesthetic", "Art Prints", "pastel pressed flower wall art"],
  ["Lilac Linen Cushion Covers Set of 2", 36, "DreamyDecorShop", "Pillows", "lilac linen cushion cover set"],
  ["Blush Paper Star Garland", 24, "BlushHomeDecor", "Garlands", "blush paper star garland"],
  ["Pastel Pegboard Organizer Kit", 58, "LavenderLiving", "Organizers", "pastel pegboard organizer kit"],
  ["Pink Mushroom Ceramic Planter", 22, "PastelNestCo", "Planters", "pink mushroom ceramic planter"],
  ["Lavender Macramé Plant Hanger", 28, "SoftAesthetic", "Planters", "lavender macrame plant hanger"],
  ["Blush LED Fairy Light Curtain", 34, "DreamyDecorShop", "Lighting", "blush led fairy light curtain"],
  ["Pastel Abstract Canvas Print", 48, "BlushHomeDecor", "Art Prints", "pastel abstract canvas print"],
  ["Pink Wooden Bookend Pair", 38, "LavenderLiving", "Accessories", "pink wooden bookend pair"],
  ["Pastel Gallery Frame Set of 6", 52, "PastelNestCo", "Frames", "pastel gallery frame set"],
  ["Lilac Vanity LED Mirror", 88, "SoftAesthetic", "Mirrors", "lilac vanity led mirror"],
  ["Blush Terrazzo Coaster Set", 26, "DreamyDecorShop", "Accessories", "blush terrazzo coaster set"],
  ["Pastel Wicker Storage Box with Lid", 44, "BlushHomeDecor", "Storage", "pastel wicker storage box"],
  ["Pink Pom Pom Knit Throw", 56, "LavenderLiving", "Throws", "pink pom pom knit throw"],
  ["Lavender Hanging Ceramic Planter", 32, "PastelNestCo", "Planters", "lavender hanging ceramic planter"],
  ["Pastel Aesthetic Poster Wall Set of 9", 45, "SoftAesthetic", "Posters", "pastel aesthetic poster wall set"],
]);

// ─── BOHO ─────────────────────────────────────────────────────────────────────
const boho: P[] = build("boh", [
  ["Large Macramé Wall Hanging", 58, "WildRootsCo", "Wall Decor", "large macrame wall hanging boho"],
  ["Rattan Hanging Egg Chair", 145, "TheBohoNest", "Seating", "rattan hanging egg chair boho"],
  ["Boho Pom Pom Throw Blanket", 47, "NomadHomeDecor", "Throws", "boho pom pom throw blanket"],
  ["Woven Jute Area Rug Natural", 94, "EarthSpiritDecor", "Rugs", "woven jute area rug natural boho"],
  ["Boho Beaded Dream Catcher Mobile", 32, "WildRootsCo", "Wall Decor", "boho beaded dream catcher mobile"],
  ["Terracotta Textured Ceramic Planter", 28, "RattanAndCo", "Planters", "terracotta textured ceramic planter"],
  ["Vintage Kilim Throw Pillow Cover", 39, "TheBohoNest", "Pillows", "vintage kilim throw pillow cover"],
  ["Rattan Round Wall Mirror", 78, "EarthSpiritDecor", "Mirrors", "rattan round wall mirror boho"],
  ["Boho Tassel Garland Banner", 22, "NomadHomeDecor", "Garlands", "boho tassel garland banner"],
  ["Macramé Plant Hanger Set of 3", 26, "WildRootsCo", "Planters", "macrame plant hanger set boho"],
  ["Carved Teak Wood Wall Shelf", 64, "RattanAndCo", "Shelving", "carved teak wood wall shelf boho"],
  ["Boho Fringe Woven Throw Pillow", 31, "TheBohoNest", "Pillows", "boho fringe woven throw pillow"],
  ["Seagrass Storage Basket Large", 48, "EarthSpiritDecor", "Storage", "seagrass storage basket large"],
  ["Copper Wire Fairy Lights 3m", 24, "NomadHomeDecor", "Lighting", "copper wire fairy lights boho"],
  ["Boho Wooden Bead Curtain Panel", 38, "WildRootsCo", "Curtains", "boho wooden bead curtain panel"],
  ["Woven Rattan Lampshade", 52, "RattanAndCo", "Lamps", "woven rattan lampshade boho"],
  ["Tribal Print Floor Cushion", 44, "TheBohoNest", "Cushions", "tribal print floor cushion boho"],
  ["Dried Pampas Grass Bunch", 28, "EarthSpiritDecor", "Botanicals", "dried pampas grass bunch boho"],
  ["Boho Diamond Macramé Wall Art", 58, "NomadHomeDecor", "Wall Decor", "boho diamond macrame wall art"],
  ["Hand-knotted Wool Runner Rug", 118, "WildRootsCo", "Rugs", "hand knotted wool runner rug boho"],
  ["Bamboo Floor Lamp Natural", 86, "RattanAndCo", "Lamps", "bamboo floor lamp natural boho"],
  ["Batik Print Throw Pillow", 33, "TheBohoNest", "Pillows", "batik print throw pillow boho"],
  ["Painted Clay Pot Set of 3", 36, "EarthSpiritDecor", "Planters", "painted clay pot set boho"],
  ["Boho Leather Wall Hanging", 72, "NomadHomeDecor", "Wall Decor", "boho leather wall hanging"],
  ["Woven Cotton Hammock", 88, "WildRootsCo", "Seating", "woven cotton hammock boho"],
  ["Jute Rope Hanging Shelf", 44, "RattanAndCo", "Shelving", "jute rope hanging shelf boho"],
  ["Embroidered Boho Cushion", 29, "TheBohoNest", "Pillows", "embroidered boho cushion"],
  ["Rattan Tray Organizer", 38, "EarthSpiritDecor", "Accessories", "rattan tray organizer boho"],
  ["Shibori Indigo Throw Blanket", 68, "NomadHomeDecor", "Throws", "shibori indigo throw blanket boho"],
  ["Carved Wood Arch Mirror", 96, "WildRootsCo", "Mirrors", "carved wood arch mirror boho"],
  ["Boho Wicker Pouf Ottoman", 84, "RattanAndCo", "Seating", "boho wicker pouf ottoman"],
  ["Global Patchwork Quilt", 78, "TheBohoNest", "Bedding", "global patchwork quilt boho"],
  ["Dried Flower Wreath", 42, "EarthSpiritDecor", "Wall Decor", "dried flower wreath boho"],
  ["Canvas Tote Storage Basket", 34, "NomadHomeDecor", "Storage", "canvas tote storage basket boho"],
  ["Woven Rattan Photo Frame", 28, "WildRootsCo", "Frames", "woven rattan photo frame boho"],
  ["Boho Star Pendant Light", 92, "RattanAndCo", "Lamps", "boho star pendant light"],
  ["Ethnic Striped Accent Rug", 74, "TheBohoNest", "Rugs", "ethnic striped accent rug boho"],
  ["Clay Bead Wind Chime", 26, "EarthSpiritDecor", "Accessories", "clay bead wind chime boho"],
  ["Woven Wall Basket Gallery Set", 62, "NomadHomeDecor", "Wall Decor", "woven wall basket gallery set"],
  ["Rattan Nightstand Side Table", 124, "WildRootsCo", "Furniture", "rattan nightstand side table boho"],
  ["Boho Tassel Table Runner", 32, "RattanAndCo", "Table Decor", "boho tassel table runner"],
  ["Hanging Terracotta Planter", 24, "TheBohoNest", "Planters", "hanging terracotta planter boho"],
  ["Fringed Blanket Ladder", 56, "EarthSpiritDecor", "Accessories", "fringed blanket ladder boho"],
  ["Crochet Round Wall Hanging", 46, "NomadHomeDecor", "Wall Decor", "crochet round wall hanging boho"],
  ["Natural Wood Bead Garland", 19, "WildRootsCo", "Garlands", "natural wood bead garland boho"],
]);

// ─── MINIMALIST ───────────────────────────────────────────────────────────────
const minimalist: P[] = build("min", [
  ["Minimal Line Art Print Set of 3", 29, "TheSimpleShelf", "Art Prints", "minimal line art print set"],
  ["White Concrete Planter Pot", 24, "WabiSabiHome", "Planters", "white concrete planter pot minimal"],
  ["Natural Oak Floating Shelf", 54, "JapandiLiving", "Shelving", "natural oak floating shelf minimal"],
  ["Matte Black Metal Wall Clock", 44, "CleanLinesCo", "Clocks", "matte black metal wall clock minimal"],
  ["Natural Woven Cotton Area Rug", 112, "TheSimpleShelf", "Rugs", "natural woven cotton area rug"],
  ["Abstract Minimal Poster Print", 18, "MinimalMoment", "Posters", "abstract minimal poster print"],
  ["White Ceramic Table Lamp", 72, "WabiSabiHome", "Lamps", "white ceramic table lamp minimalist"],
  ["Natural Linen Cushion Cover Set", 34, "JapandiLiving", "Pillows", "natural linen cushion cover set"],
  ["Japandi Style Wooden Tray", 38, "CleanLinesCo", "Accessories", "japandi style wooden tray minimal"],
  ["Eucalyptus Dried Stems Bunch", 22, "MinimalMoment", "Botanicals", "eucalyptus dried stems bunch decor"],
  ["Slim Wood Picture Frames Set of 3", 42, "TheSimpleShelf", "Frames", "slim wood picture frames set minimal"],
  ["Warm LED Fairy String Lights", 28, "WabiSabiHome", "Lighting", "warm led fairy string lights minimal"],
  ["Ivory Knit Throw Blanket", 56, "JapandiLiving", "Throws", "ivory knit throw blanket minimal"],
  ["Stone River Rock Coaster Set", 28, "CleanLinesCo", "Accessories", "stone river rock coaster set"],
  ["Minimal Wire Art Sculpture", 48, "MinimalMoment", "Sculptures", "minimal wire art sculpture decor"],
  ["Linen Roman Window Blind", 64, "TheSimpleShelf", "Window", "linen roman window blind minimal"],
  ["Matte White Arch Mirror", 98, "WabiSabiHome", "Mirrors", "matte white arch mirror minimalist"],
  ["Sculptural Ceramic Vase", 44, "JapandiLiving", "Vases", "sculptural ceramic vase minimal"],
  ["Beech Wood Bedside Shelf", 68, "CleanLinesCo", "Shelving", "beech wood bedside shelf minimal"],
  ["Mono Botanical Photo Print", 22, "MinimalMoment", "Art Prints", "mono botanical photo print minimal"],
  ["Fluted Ceramic Pendant Lamp", 88, "TheSimpleShelf", "Lamps", "fluted ceramic pendant lamp minimal"],
  ["Organic Cotton Waffle Throw", 52, "WabiSabiHome", "Throws", "organic cotton waffle throw minimal"],
  ["Wabi-Sabi Linen Pillow Cover", 32, "JapandiLiving", "Pillows", "wabi sabi linen pillow cover"],
  ["Concrete Candle Holder Set", 34, "CleanLinesCo", "Candles", "concrete candle holder set minimal"],
  ["Dried Grass Arrangement", 26, "MinimalMoment", "Botanicals", "dried grass arrangement minimal"],
  ["Grid Wire Wall Board", 48, "TheSimpleShelf", "Organizers", "grid wire wall board minimal"],
  ["Neutral Jute Doormat", 32, "WabiSabiHome", "Rugs", "neutral jute doormat minimal"],
  ["Black Steel Bookend Pair", 38, "JapandiLiving", "Accessories", "black steel bookend pair minimal"],
  ["Pleated Paper Lampshade", 42, "CleanLinesCo", "Lamps", "pleated paper lampshade minimal"],
  ["Scandi Wool Blanket Natural", 76, "MinimalMoment", "Throws", "scandi wool blanket natural minimal"],
  ["Bamboo Blind Roll-Up", 54, "TheSimpleShelf", "Window", "bamboo blind roll up minimal"],
  ["Etched Glass Tealight Holder", 24, "WabiSabiHome", "Candles", "etched glass tealight holder"],
  ["Oak Ladder Blanket Stand", 88, "JapandiLiving", "Accessories", "oak ladder blanket stand minimal"],
  ["Cotton Rope Hanging Planter", 28, "CleanLinesCo", "Planters", "cotton rope hanging planter minimal"],
  ["Minimal Black Line Portrait", 19, "MinimalMoment", "Art Prints", "minimal black line portrait print"],
  ["Birch Wood Key Holder Wall", 32, "TheSimpleShelf", "Organizers", "birch wood key holder wall minimal"],
  ["Travertine Marble Tray", 58, "WabiSabiHome", "Accessories", "travertine marble tray minimal"],
  ["Narrow Floating Picture Ledge", 44, "JapandiLiving", "Shelving", "narrow floating picture ledge minimal"],
  ["Linen Throw Pillow with Insert", 36, "CleanLinesCo", "Pillows", "linen throw pillow with insert minimal"],
  ["Herringbone Wool Rug", 98, "MinimalMoment", "Rugs", "herringbone wool rug minimal"],
  ["Bamboo Utensil Desk Organizer", 28, "TheSimpleShelf", "Organizers", "bamboo utensil desk organizer minimal"],
  ["Moon Phase Ceramic Dish Set", 34, "WabiSabiHome", "Accessories", "moon phase ceramic dish set minimal"],
  ["Slim Profile Wall Sconce", 66, "JapandiLiving", "Lamps", "slim profile wall sconce minimal"],
  ["Hand-thrown Matte Mug Set", 42, "CleanLinesCo", "Accessories", "hand thrown matte mug set minimal"],
  ["Pebble Vase Trio", 38, "MinimalMoment", "Vases", "pebble vase trio minimal decor"],
]);

// ─── COZY ─────────────────────────────────────────────────────────────────────
const cozy: P[] = build("coz", [
  ["Chunky Knit Throw Blanket", 68, "CozyNookCo", "Throws", "chunky knit throw blanket cozy"],
  ["Edison Bulb String Lights 3m", 34, "HyggeHomeDecor", "Lighting", "edison bulb string lights warm"],
  ["Sherpa Round Floor Cushion", 52, "TheWarmCorner", "Cushions", "sherpa round floor cushion cozy"],
  ["Hygge Soy Wax Candle Set", 38, "CosyLivingUK", "Candles", "hygge soy wax candle set cozy"],
  ["Faux Fur Throw Pillow Cover", 28, "SnugHaven", "Pillows", "faux fur throw pillow cover cozy"],
  ["Warm Cable Knit Rug", 98, "CozyNookCo", "Rugs", "warm cable knit rug cozy bedroom"],
  ["Reading Nook Bolster Cushion", 45, "HyggeHomeDecor", "Cushions", "reading nook bolster cushion cozy"],
  ["Rattan Hanging Pendant Lamp", 86, "TheWarmCorner", "Lamps", "rattan hanging pendant lamp cozy"],
  ["Wool Woven Tapestry Wall Art", 62, "CosyLivingUK", "Wall Decor", "wool woven tapestry wall art cozy"],
  ["Fairy Light Curtain Panel Warm", 29, "SnugHaven", "Lighting", "fairy light curtain panel warm cozy"],
  ["Beeswax Pillar Candle Trio", 32, "CozyNookCo", "Candles", "beeswax pillar candle trio cozy"],
  ["Sherpa Oversized Reading Blanket", 58, "HyggeHomeDecor", "Throws", "sherpa oversized reading blanket"],
  ["Wicker Log Storage Basket", 54, "TheWarmCorner", "Storage", "wicker log storage basket cozy"],
  ["Cottagecore Floral Art Print", 22, "CosyLivingUK", "Art Prints", "cottagecore floral art print cozy"],
  ["Macramé Drum Lampshade Cover", 44, "SnugHaven", "Lamps", "macrame drum lampshade cover cozy"],
  ["Cinnamon Spice Reed Diffuser", 28, "CozyNookCo", "Aromatherapy", "cinnamon spice reed diffuser cozy"],
  ["Berber Wool Pompom Rug", 108, "HyggeHomeDecor", "Rugs", "berber wool pompom rug cozy"],
  ["Hot Cocoa Mug Gift Set", 34, "TheWarmCorner", "Accessories", "hot cocoa mug gift set cozy"],
  ["Woodland Animal Framed Print", 26, "CosyLivingUK", "Art Prints", "woodland animal framed print cozy"],
  ["Fleece Heated Blanket", 66, "SnugHaven", "Throws", "fleece heated blanket cozy bedroom"],
  ["Amber Glass Candle Holder Set", 36, "CozyNookCo", "Candles", "amber glass candle holder set cozy"],
  ["Tufted Velvet Accent Pillow", 38, "HyggeHomeDecor", "Pillows", "tufted velvet accent pillow cozy"],
  ["Cosy Corner Floor Lamp", 82, "TheWarmCorner", "Lamps", "cosy corner floor lamp warm light"],
  ["Hand-stitched Quilt Throw", 72, "CosyLivingUK", "Throws", "hand stitched quilt throw cozy"],
  ["Woven Oval Bath Rug", 44, "SnugHaven", "Rugs", "woven oval bath rug cozy"],
  ["Crochet Wall Art Hoop", 38, "CozyNookCo", "Wall Decor", "crochet wall art hoop cozy"],
  ["Mason Jar Fairy Light Set", 24, "HyggeHomeDecor", "Lighting", "mason jar fairy light set cozy"],
  ["Knitted Storage Basket", 46, "TheWarmCorner", "Storage", "knitted storage basket cozy"],
  ["Cottagecore Mushroom Print", 21, "CosyLivingUK", "Posters", "cottagecore mushroom poster print"],
  ["Flannel Duvet Cover Set", 88, "SnugHaven", "Bedding", "flannel duvet cover set cozy"],
  ["Velvet Pleated Lampshade", 54, "CozyNookCo", "Lamps", "velvet pleated lampshade cozy"],
  ["Pressed Herb Shadow Box", 42, "HyggeHomeDecor", "Wall Decor", "pressed herb shadow box cozy decor"],
  ["Braided Jute Floor Pouf", 74, "TheWarmCorner", "Seating", "braided jute floor pouf cozy"],
  ["Faux Sheepskin Rug", 62, "CosyLivingUK", "Rugs", "faux sheepskin rug cozy bedroom"],
  ["Woodland Wreath Front Door", 48, "SnugHaven", "Wall Decor", "woodland wreath front door cozy"],
  ["Ceramic Mug Warmer Set", 32, "CozyNookCo", "Accessories", "ceramic mug warmer set cozy"],
  ["Hygge Scented Beeswax Candle", 26, "HyggeHomeDecor", "Candles", "hygge scented beeswax candle"],
  ["Cable-Knit Pillow Cover", 29, "TheWarmCorner", "Pillows", "cable knit pillow cover cozy bedroom"],
  ["Macramé Curtain Tie-Back Set", 22, "CosyLivingUK", "Curtains", "macrame curtain tie back set cozy"],
  ["Bamboo Book Nook Shelf", 58, "SnugHaven", "Shelving", "bamboo book nook shelf cozy reading"],
  ["Terracotta Mug Set of 4", 44, "CozyNookCo", "Accessories", "terracotta mug set cozy aesthetic"],
  ["Handmade Candle Advent Set", 52, "HyggeHomeDecor", "Candles", "handmade candle advent set cozy"],
  ["Floral Embroidered Duvet Cover", 94, "TheWarmCorner", "Bedding", "floral embroidered duvet cover cozy"],
  ["Crochet Hanging Plant Basket", 28, "CosyLivingUK", "Planters", "crochet hanging plant basket cozy"],
  ["Fingerweave Throw Pillow", 34, "SnugHaven", "Pillows", "fingerweave throw pillow cozy"],
]);

// ─── VINTAGE ──────────────────────────────────────────────────────────────────
const vintage: P[] = build("vin", [
  ["Retro Botanical Specimen Poster", 19, "OldSoulDecor", "Posters", "retro botanical specimen poster vintage"],
  ["Antique Brass Table Lamp", 88, "AntiqueCharmCo", "Lamps", "antique brass table lamp vintage"],
  ["Vintage World Map Art Print", 27, "TimelessNest", "Art Prints", "vintage world map art print"],
  ["Art Deco Ornate Frame Mirror", 112, "VintageRoostCo", "Mirrors", "art deco ornate frame mirror vintage"],
  ["Persian Style Embroidered Pillow", 42, "HeirloomHome", "Pillows", "persian style embroidered pillow"],
  ["Vintage Botanical Print Set of 4", 35, "OldSoulDecor", "Art Prints", "vintage botanical print set"],
  ["Antique Bronze Roman Wall Clock", 67, "AntiqueCharmCo", "Clocks", "antique bronze roman wall clock"],
  ["Retro Edison Pendant Light", 94, "TimelessNest", "Lamps", "retro edison bulb pendant light vintage"],
  ["Victorian Lace Cushion Cover", 29, "VintageRoostCo", "Pillows", "victorian lace cushion cover vintage"],
  ["Vintage Album Cover Frame Display", 38, "HeirloomHome", "Frames", "vintage album cover frame display"],
  ["Rustic Wooden Letter Board", 44, "OldSoulDecor", "Accessories", "rustic wooden letter board vintage"],
  ["Aged Brass Bookend Set", 52, "AntiqueCharmCo", "Accessories", "aged brass bookend set vintage"],
  ["Vintage Floral Wool Runner", 128, "TimelessNest", "Rugs", "vintage floral wool runner rug"],
  ["Rattan Peacock Accent Chair", 178, "VintageRoostCo", "Seating", "rattan peacock accent chair vintage"],
  ["Antique Sepia Photo Frame Set", 34, "HeirloomHome", "Frames", "antique sepia photo frame set"],
  ["Vintage French Apothecary Bottles", 48, "OldSoulDecor", "Accessories", "vintage french apothecary bottles"],
  ["Chippy White Distressed Mirror", 86, "AntiqueCharmCo", "Mirrors", "chippy white distressed mirror vintage"],
  ["Tapestry Needlepoint Pillow", 56, "TimelessNest", "Pillows", "tapestry needlepoint pillow vintage"],
  ["Ornate Candelabra Candle Holder", 72, "VintageRoostCo", "Candles", "ornate candelabra candle holder vintage"],
  ["Victorian Pressed Flower Frame", 38, "HeirloomHome", "Wall Decor", "victorian pressed flower frame vintage"],
  ["Retro Tin Advertising Sign", 32, "OldSoulDecor", "Wall Decor", "retro tin advertising sign vintage"],
  ["Gilded Scroll Wall Sconce", 66, "AntiqueCharmCo", "Lamps", "gilded scroll wall sconce vintage"],
  ["Chinoiserie Blue Ceramic Vase", 54, "TimelessNest", "Vases", "chinoiserie blue ceramic vase vintage"],
  ["Antique Map Framed Print", 42, "VintageRoostCo", "Art Prints", "antique map framed print vintage"],
  ["Fringed Persian Style Rug", 142, "HeirloomHome", "Rugs", "fringed persian style rug vintage"],
  ["Vintage Compass Rose Wall Art", 36, "OldSoulDecor", "Wall Decor", "vintage compass rose wall art"],
  ["Repro Vintage Movie Poster", 24, "AntiqueCharmCo", "Posters", "reproduction vintage movie poster"],
  ["Wicker Pedestal Side Table", 96, "TimelessNest", "Furniture", "wicker pedestal side table vintage"],
  ["Lace Doily Table Runner", 22, "VintageRoostCo", "Table Decor", "lace doily table runner vintage"],
  ["Copper Kettle Vase", 48, "HeirloomHome", "Vases", "copper kettle vase vintage decor"],
  ["Victorian Silhouette Art Set", 32, "OldSoulDecor", "Art Prints", "victorian silhouette art set vintage"],
  ["Antique Canteen Storage Tin", 28, "AntiqueCharmCo", "Storage", "antique canteen storage tin vintage"],
  ["Embossed Leather Wall Panel", 88, "TimelessNest", "Wall Decor", "embossed leather wall panel vintage"],
  ["Vintage Suitcase Stack Decor", 78, "VintageRoostCo", "Accessories", "vintage suitcase stack decor"],
  ["Rustic Barn Wood Photo Frame", 34, "HeirloomHome", "Frames", "rustic barn wood photo frame vintage"],
  ["Sepia Tone Map Wallpaper Panel", 62, "OldSoulDecor", "Wall Decor", "sepia tone map wallpaper panel"],
  ["Art Nouveau Stained Glass Lamp", 124, "AntiqueCharmCo", "Lamps", "art nouveau stained glass lamp vintage"],
  ["Hand-painted Tile Trivet", 28, "TimelessNest", "Accessories", "hand painted tile trivet vintage"],
  ["Velvet Tufted Ottoman Stool", 108, "VintageRoostCo", "Seating", "velvet tufted ottoman stool vintage"],
  ["Retro Seed Packet Print Set", 26, "HeirloomHome", "Posters", "retro seed packet print set vintage"],
  ["Aged Patina Mirror Frame", 92, "OldSoulDecor", "Mirrors", "aged patina mirror frame vintage"],
  ["Vintage Spice Jar Set", 38, "AntiqueCharmCo", "Accessories", "vintage spice jar set kitchen decor"],
  ["Country Quilt Patchwork Throw", 82, "TimelessNest", "Throws", "country quilt patchwork throw vintage"],
  ["Ornate Oval Picture Frame", 44, "VintageRoostCo", "Frames", "ornate oval picture frame vintage"],
  ["Heirloom Linen Embroidered Pillowcase", 36, "HeirloomHome", "Pillows", "heirloom linen embroidered pillowcase"],
]);

// ─── MODERN ───────────────────────────────────────────────────────────────────
const modern: P[] = build("mod", [
  ["Geometric Abstract Wall Art Print", 45, "TheModernLoft", "Art Prints", "geometric abstract wall art print modern"],
  ["Matte Black Industrial Floor Lamp", 92, "UrbanNestCo", "Lamps", "matte black industrial floor lamp"],
  ["Marble and Gold Decorative Tray", 58, "GeometricHome", "Accessories", "marble and gold decorative tray modern"],
  ["Large Round Arch Wall Mirror", 134, "SleekSpaceCo", "Mirrors", "large round arch wall mirror modern"],
  ["Bold Typography Poster Print", 24, "ModernMoodBoard", "Posters", "bold typography poster print modern"],
  ["Black Geometric Velvet Pillow", 32, "TheModernLoft", "Pillows", "black geometric velvet pillow modern"],
  ["Steel Wire Wall Grid Panel", 48, "UrbanNestCo", "Organizers", "steel wire wall grid panel"],
  ["Asymmetric Matte Ceramic Vase", 44, "GeometricHome", "Vases", "asymmetric matte ceramic vase modern"],
  ["RGB Smart Corner Floor Lamp", 118, "SleekSpaceCo", "Lamps", "rgb smart corner floor lamp modern"],
  ["Bouclé Textured Throw Pillow", 38, "ModernMoodBoard", "Pillows", "boucle textured throw pillow modern"],
  ["Floating Corner Shelf Set of 3", 62, "TheModernLoft", "Shelving", "floating corner shelf set modern"],
  ["Black and White Gallery Print Set", 52, "UrbanNestCo", "Art Prints", "black and white gallery print set"],
  ["Terrazzo Pattern Coaster Set", 28, "GeometricHome", "Accessories", "terrazzo pattern coaster set modern"],
  ["Matte Black Planter Pot Trio", 44, "SleekSpaceCo", "Planters", "matte black planter pot trio modern"],
  ["Abstract Resin 3D Wall Sculpture", 88, "ModernMoodBoard", "Sculptures", "abstract resin 3d wall sculpture"],
  ["Smoked Glass Pendant Lamp", 76, "TheModernLoft", "Lamps", "smoked glass pendant lamp modern"],
  ["Ribbed Cotton Throw Blanket", 52, "UrbanNestCo", "Throws", "ribbed cotton throw blanket modern"],
  ["Gunmetal Wall Clock", 54, "GeometricHome", "Clocks", "gunmetal wall clock modern"],
  ["Slim Oval Floor Mirror", 116, "SleekSpaceCo", "Mirrors", "slim oval floor mirror modern"],
  ["Concrete Side Table", 98, "ModernMoodBoard", "Furniture", "concrete side table modern"],
  ["Oversized Abstract Canvas", 68, "TheModernLoft", "Art Prints", "oversized abstract canvas print modern"],
  ["Black Linen Throw Pillow", 34, "UrbanNestCo", "Pillows", "black linen throw pillow modern"],
  ["Geometric Metal Candle Holders", 48, "GeometricHome", "Candles", "geometric metal candle holders modern"],
  ["Monstera Leaf Large Framed Print", 38, "SleekSpaceCo", "Art Prints", "monstera leaf large framed print modern"],
  ["Steel Bookshelf Wall Unit", 156, "ModernMoodBoard", "Shelving", "steel bookshelf wall unit modern"],
  ["Woven Geometric Area Rug", 122, "TheModernLoft", "Rugs", "woven geometric area rug modern"],
  ["Arc Floor Task Lamp", 88, "UrbanNestCo", "Lamps", "arc floor task lamp modern"],
  ["Acrylic Picture Frame Set", 36, "GeometricHome", "Frames", "acrylic picture frame set modern"],
  ["Sculptural Brass Vase", 58, "SleekSpaceCo", "Vases", "sculptural brass vase modern"],
  ["Monochrome Abstract Triptych", 72, "ModernMoodBoard", "Art Prints", "monochrome abstract triptych modern"],
  ["Zigzag Woven Cotton Rug", 84, "TheModernLoft", "Rugs", "zigzag woven cotton rug modern"],
  ["Matte Gold Desk Lamp", 66, "UrbanNestCo", "Lamps", "matte gold desk lamp modern"],
  ["Hexagon Mirror Wall Cluster", 96, "GeometricHome", "Mirrors", "hexagon mirror wall cluster modern"],
  ["Velvet Charcoal Throw", 58, "SleekSpaceCo", "Throws", "velvet charcoal throw blanket modern"],
  ["Marble Bookend Pair", 52, "ModernMoodBoard", "Accessories", "marble bookend pair modern"],
  ["Open Box Wall Shelves Set", 78, "TheModernLoft", "Shelving", "open box wall shelves set modern"],
  ["LED Edison Clip Lights", 32, "UrbanNestCo", "Lighting", "led edison clip lights modern"],
  ["Embossed Leather Stool", 94, "GeometricHome", "Seating", "embossed leather stool modern"],
  ["Industrial Pipe Shelf Bracket", 34, "SleekSpaceCo", "Shelving", "industrial pipe shelf bracket modern"],
  ["Block Colour Throw Pillow Set", 46, "ModernMoodBoard", "Pillows", "block colour throw pillow set modern"],
  ["Metallic Foil Art Print", 28, "TheModernLoft", "Art Prints", "metallic foil art print modern"],
  ["Frosted Glass Diffuser Lamp", 62, "UrbanNestCo", "Lamps", "frosted glass diffuser lamp modern"],
  ["Marble and Brass Tray", 44, "GeometricHome", "Accessories", "marble and brass tray modern decor"],
  ["Cube Storage Ottoman", 86, "SleekSpaceCo", "Seating", "cube storage ottoman modern"],
  ["Graphic Wall Mural Panel", 54, "ModernMoodBoard", "Wall Decor", "graphic wall mural panel modern"],
]);

// ─── NATURE ───────────────────────────────────────────────────────────────────
const nature: P[] = build("nat", [
  ["Monstera Leaf Large Wall Art Print", 22, "ForestHomeDecor", "Art Prints", "monstera leaf large wall art print"],
  ["Live Edge Wood Serving Board", 58, "TerraRootsCo", "Accessories", "live edge wood serving board nature"],
  ["Macramé Plant Hanger Set of 3", 34, "BotanicalNest", "Planters", "macrame plant hanger set nature"],
  ["Pressed Wildflower Shadow Box", 38, "NaturalHavenCo", "Wall Decor", "pressed wildflower shadow box frame"],
  ["Mushroom Ceramic Planter Pot", 29, "EarthDwelling", "Planters", "mushroom ceramic planter pot nature"],
  ["Botanical Woven Throw Pillow", 36, "ForestHomeDecor", "Pillows", "botanical woven throw pillow nature"],
  ["Watercolor Forest Art Print Set", 44, "TerraRootsCo", "Art Prints", "watercolor forest art print set"],
  ["Terracotta Hanging Planter", 32, "BotanicalNest", "Planters", "terracotta hanging planter nature"],
  ["Dried Pampas Grass Arrangement", 28, "NaturalHavenCo", "Botanicals", "dried pampas grass arrangement nature"],
  ["Reclaimed Wood Floating Wall Shelf", 72, "EarthDwelling", "Shelving", "reclaimed wood floating wall shelf"],
  ["Seagrass Woven Basket Set of 3", 54, "ForestHomeDecor", "Storage", "seagrass woven basket set nature"],
  ["Leaf Canopy Fairy String Lights", 38, "TerraRootsCo", "Lighting", "leaf canopy fairy string lights"],
  ["Stone Tealight Candle Holder Set", 24, "BotanicalNest", "Candles", "stone tealight candle holder set"],
  ["Bamboo Wind Chime Handmade", 32, "NaturalHavenCo", "Accessories", "bamboo wind chime handmade nature"],
  ["Organic Cotton Knit Area Rug", 88, "EarthDwelling", "Rugs", "organic cotton knit area rug nature"],
  ["Fern Frond Pressed Art Frame", 34, "ForestHomeDecor", "Art Prints", "fern frond pressed art frame nature"],
  ["Lava Rock Succulent Bowl", 26, "TerraRootsCo", "Planters", "lava rock succulent bowl nature"],
  ["Driftwood Wall Mirror", 92, "BotanicalNest", "Mirrors", "driftwood wall mirror nature decor"],
  ["Nature Walk Photo Print Set", 42, "NaturalHavenCo", "Posters", "nature walk photo print set"],
  ["Bonsai Pot and Tray Set", 48, "EarthDwelling", "Planters", "bonsai pot and tray set nature"],
  ["Moss Terrarium Glass Jar", 36, "ForestHomeDecor", "Planters", "moss terrarium glass jar nature"],
  ["Leaf Print Linen Throw Pillow", 32, "TerraRootsCo", "Pillows", "leaf print linen throw pillow nature"],
  ["Natural Rattan Floor Lamp", 96, "BotanicalNest", "Lamps", "natural rattan floor lamp nature"],
  ["Cork World Map Wall Decor", 44, "NaturalHavenCo", "Wall Decor", "cork world map wall decor nature"],
  ["Himalayan Salt Crystal Lamp", 52, "EarthDwelling", "Lamps", "himalayan salt crystal lamp nature"],
  ["Wild Flower Candle Gift Set", 34, "ForestHomeDecor", "Candles", "wild flower candle gift set nature"],
  ["Carved Wood Leaf Wall Art", 58, "TerraRootsCo", "Wall Decor", "carved wood leaf wall art nature"],
  ["Grass and Seed Head Wreath", 46, "BotanicalNest", "Wall Decor", "grass and seed head wreath nature"],
  ["Recycled Glass Vase Set", 38, "NaturalHavenCo", "Vases", "recycled glass vase set nature"],
  ["Tree Slice Natural Coaster Set", 28, "EarthDwelling", "Accessories", "tree slice natural coaster set"],
  ["Botanical Illustration Canvas", 52, "ForestHomeDecor", "Art Prints", "botanical illustration canvas nature"],
  ["Eucalyptus Garland Faux", 32, "TerraRootsCo", "Garlands", "eucalyptus garland faux nature"],
  ["Wicker Plant Stand Set of 3", 68, "BotanicalNest", "Planters", "wicker plant stand set nature"],
  ["Bark Texture Throw Blanket", 76, "NaturalHavenCo", "Throws", "bark texture throw blanket nature"],
  ["Pine Cone Wreath Front Door", 44, "EarthDwelling", "Wall Decor", "pine cone wreath front door nature"],
  ["Jungle Leaf Tapestry", 54, "ForestHomeDecor", "Tapestries", "jungle leaf tapestry wall hanging"],
  ["River Stone Bookend Set", 42, "TerraRootsCo", "Accessories", "river stone bookend set nature"],
  ["Pressed Fern Botanical Print", 24, "BotanicalNest", "Art Prints", "pressed fern botanical print nature"],
  ["Rattan Hanging Light Globe", 78, "NaturalHavenCo", "Lamps", "rattan hanging light globe nature"],
  ["Natural Sisal Braided Rug", 84, "EarthDwelling", "Rugs", "natural sisal braided rug nature"],
  ["Wooden Mushroom Figurine Set", 28, "ForestHomeDecor", "Accessories", "wooden mushroom figurine set nature"],
  ["Forest Canopy Photography Print", 36, "TerraRootsCo", "Art Prints", "forest canopy photography print"],
  ["Coir Doormat Natural Fibre", 38, "BotanicalNest", "Rugs", "coir doormat natural fibre"],
  ["Air Plant Geometric Stand", 32, "NaturalHavenCo", "Planters", "air plant geometric stand nature"],
  ["Handmade Ceramic Leaf Bowl", 44, "EarthDwelling", "Accessories", "handmade ceramic leaf bowl nature"],
]);

// ─── GAMING ───────────────────────────────────────────────────────────────────
const gaming: P[] = build("gam", [
  ["RGB LED Strip Lights 3m Smart", 28, "PixelNestCo", "Lighting", "rgb led strip lights gaming setup"],
  ["XL Gaming Desk Mat Anime Art", 34, "GamerCaveDecor", "Desk Accessories", "xl gaming desk mat anime art"],
  ["Custom Neon Gaming Sign", 78, "LevelUpHome", "Signs", "custom neon gaming sign room decor"],
  ["Controller Wall Mount Display", 22, "NeonDenCo", "Wall Accessories", "controller wall mount display gaming"],
  ["Pixel Art Game Character Print", 19, "RGBHavenShop", "Posters", "pixel art game character poster print"],
  ["Gaming Chair Lumbar Support Pillow", 38, "PixelNestCo", "Pillows", "gaming chair lumbar support pillow"],
  ["Geometric RGB Hexagon Lamp", 54, "GamerCaveDecor", "Lamps", "geometric rgb hexagon lamp gaming"],
  ["Retro Console Pixel Art Print", 22, "LevelUpHome", "Posters", "retro console pixel art print"],
  ["LED Moon Lamp Night Light", 32, "NeonDenCo", "Lamps", "led moon lamp night light gaming room"],
  ["Black Pegboard Panel Organizer", 48, "RGBHavenShop", "Organizers", "black pegboard panel organizer desk"],
  ["Gaming Zone Neon Wall Art Sign", 62, "PixelNestCo", "Wall Decor", "gaming zone neon wall art sign"],
  ["Holographic Foil Character Poster", 26, "GamerCaveDecor", "Posters", "holographic foil character poster"],
  ["RGB Bluetooth Star Projector", 44, "LevelUpHome", "Lighting", "rgb bluetooth star projector gaming"],
  ["Kawaii Plushie Shelf Display Set", 34, "NeonDenCo", "Decor", "kawaii plushie shelf display set"],
  ["Anime Wall Scroll Tapestry", 29, "RGBHavenShop", "Tapestries", "anime wall scroll tapestry gaming room"],
  ["LED Galaxy Projector Lamp", 52, "PixelNestCo", "Lamps", "led galaxy projector lamp gaming"],
  ["Gaming Setup Poster Print", 18, "GamerCaveDecor", "Posters", "gaming setup poster print room"],
  ["Neon Cat Sign LED Pink", 66, "LevelUpHome", "Signs", "neon cat sign led pink gaming room"],
  ["Gamer Headphone Wall Mount", 28, "NeonDenCo", "Accessories", "gamer headphone wall mount"],
  ["RGB Corner Tube Lamp", 72, "RGBHavenShop", "Lamps", "rgb corner tube lamp gaming"],
  ["Pixel Art Minecraft Print", 21, "PixelNestCo", "Posters", "pixel art minecraft poster print"],
  ["Smash Bros Character Frame Set", 38, "GamerCaveDecor", "Frames", "smash bros character frame set gaming"],
  ["Black Cable Management Box", 32, "LevelUpHome", "Organizers", "black cable management box gaming desk"],
  ["LED Neon Arrow Sign", 48, "NeonDenCo", "Signs", "led neon arrow sign gaming room"],
  ["Gaming Chair RGB Mat", 56, "RGBHavenShop", "Rugs", "gaming chair rgb mat floor"],
  ["Gamer Motivation Quote Print", 16, "PixelNestCo", "Posters", "gamer motivation quote print room"],
  ["Acrylic LED Night Light Base", 34, "GamerCaveDecor", "Lamps", "acrylic led night light base gaming"],
  ["Xbox Poster Art Retro Style", 22, "LevelUpHome", "Posters", "xbox poster art retro style gaming"],
  ["Mesh Desk Organizer Black", 28, "NeonDenCo", "Organizers", "mesh desk organizer black gaming desk"],
  ["Floating Monitor Shelf", 54, "RGBHavenShop", "Shelving", "floating monitor shelf gaming setup"],
  ["Zelda Hylian Shield Print", 24, "PixelNestCo", "Posters", "zelda hylian shield art print gaming"],
  ["LED Light Bar Strip Set", 36, "GamerCaveDecor", "Lighting", "led light bar strip set gaming"],
  ["Gaming Wrist Rest Pad", 18, "LevelUpHome", "Desk Accessories", "gaming wrist rest pad keyboard"],
  ["Abstract Tech Tapestry", 44, "NeonDenCo", "Tapestries", "abstract tech tapestry gaming room"],
  ["Star Wars Death Star Lamp", 58, "RGBHavenShop", "Lamps", "star wars death star lamp gaming room"],
  ["Gamer Girl Neon Sign", 72, "PixelNestCo", "Signs", "gamer girl neon sign room"],
  ["Pixel Art Rainbow Rug", 66, "GamerCaveDecor", "Rugs", "pixel art rainbow rug gaming room"],
  ["Action Figure Display Case", 48, "LevelUpHome", "Accessories", "action figure display case shelf gaming"],
  ["Pac-Man Retro Poster", 18, "NeonDenCo", "Posters", "pac man retro poster gaming room"],
  ["RGB Keyboard Wrist Pad", 24, "RGBHavenShop", "Desk Accessories", "rgb keyboard wrist pad gaming"],
  ["Kawaii Pastel Gaming Mat", 38, "PixelNestCo", "Desk Accessories", "kawaii pastel gaming mat desk"],
  ["Neon Joystick Wall Art", 56, "GamerCaveDecor", "Wall Decor", "neon joystick wall art gaming"],
  ["Gaming Corner LED Lamp Set", 44, "LevelUpHome", "Lighting", "gaming corner led lamp set rgb"],
  ["Console Cartridge Shadow Box", 34, "NeonDenCo", "Accessories", "console cartridge shadow box gaming"],
  ["8-Bit Pixel Throw Blanket", 52, "RGBHavenShop", "Throws", "8 bit pixel throw blanket gaming"],
]);

// ─── GIRLY ────────────────────────────────────────────────────────────────────
const girly: P[] = build("gir", [
  ["Pink Velvet Throw Pillow Cover", 28, "PinkBoudoirCo", "Pillows", "pink velvet throw pillow cover girly"],
  ["Rose Gold LED Vanity Mirror", 72, "FeminineNestCo", "Mirrors", "rose gold led vanity mirror girly"],
  ["Pink Floral Watercolor Art Print", 22, "RoseGoldHome", "Art Prints", "pink floral watercolor art print"],
  ["Blush Pink Fluffy Area Rug", 98, "BlushBoudoir", "Rugs", "blush pink fluffy area rug girly"],
  ["Gold Star Shape String Lights", 24, "GirlyRoomDecor", "Lighting", "gold star shape string lights girly"],
  ["Feminine Empowerment Quote Print", 18, "PinkBoudoirCo", "Art Prints", "feminine empowerment quote print"],
  ["Pink Ceramic Jewellery Tray", 32, "FeminineNestCo", "Accessories", "pink ceramic jewellery tray girly"],
  ["Floral Lace Sheer Curtain Panels", 54, "RoseGoldHome", "Curtains", "floral lace sheer curtain panels girly"],
  ["Vintage Pink Rose Poster Set of 3", 29, "BlushBoudoir", "Posters", "vintage pink rose poster set"],
  ["Heart Shaped Rattan Wall Mirror", 56, "GirlyRoomDecor", "Mirrors", "heart shaped rattan wall mirror girly"],
  ["Pink Faux Fur Vanity Stool", 84, "PinkBoudoirCo", "Seating", "pink faux fur vanity stool girly"],
  ["Rose Quartz Crystal Soy Candle", 36, "FeminineNestCo", "Candles", "rose quartz crystal soy candle"],
  ["Pink Neon LED Sign Babe", 68, "RoseGoldHome", "Signs", "pink neon led sign babe girly room"],
  ["Satin Bow Decorative Pillow Cover", 26, "BlushBoudoir", "Pillows", "satin bow decorative pillow cover"],
  ["Pressed Flower Resin Serving Tray", 44, "GirlyRoomDecor", "Accessories", "pressed flower resin serving tray"],
  ["Blush Tulle Bed Canopy", 52, "PinkBoudoirCo", "Bedding", "blush tulle bed canopy girly room"],
  ["Rose Gold Geometric Planter", 28, "FeminineNestCo", "Planters", "rose gold geometric planter girly"],
  ["Pink Butterfly Art Print", 22, "RoseGoldHome", "Art Prints", "pink butterfly art print girly"],
  ["Fluffy Pom Pom Curtain Tie-Backs", 18, "BlushBoudoir", "Curtains", "fluffy pom pom curtain tie backs"],
  ["Glam Hollywood Vanity Bulb Mirror", 96, "GirlyRoomDecor", "Mirrors", "glam hollywood vanity bulb mirror girly"],
  ["Pink Cloud Floating Wall Shelves", 58, "PinkBoudoirCo", "Shelving", "pink cloud floating wall shelves girly"],
  ["Satin Ribbon Fairy Lights", 26, "FeminineNestCo", "Lighting", "satin ribbon fairy lights girly room"],
  ["Floral Bouquet Framed Wall Art", 34, "RoseGoldHome", "Art Prints", "floral bouquet framed wall art girly"],
  ["Pastel Pink Round Bath Rug", 42, "BlushBoudoir", "Rugs", "pastel pink round bath rug girly"],
  ["Glitter Star Garland Banner", 16, "GirlyRoomDecor", "Garlands", "glitter star garland banner girly"],
  ["Pink Velvet Vanity Chair", 112, "PinkBoudoirCo", "Seating", "pink velvet vanity chair girly room"],
  ["Peony Art Deco Print Set", 32, "FeminineNestCo", "Art Prints", "peony art deco print set girly"],
  ["Iridescent Shimmer Throw Blanket", 54, "RoseGoldHome", "Throws", "iridescent shimmer throw blanket girly"],
  ["Pink Marble Contact Paper Roll", 22, "BlushBoudoir", "Accessories", "pink marble contact paper roll"],
  ["Heart String Lights LED", 28, "GirlyRoomDecor", "Lighting", "heart string lights led girly room"],
  ["Crown Decorative Mirror", 66, "PinkBoudoirCo", "Mirrors", "crown decorative mirror girly room"],
  ["Floral Printed Storage Box Set", 38, "FeminineNestCo", "Storage", "floral printed storage box set girly"],
  ["Pastel Hair Bow Organiser", 24, "RoseGoldHome", "Accessories", "pastel hair bow organiser girly room"],
  ["Pink Ombre Wall Tapestry", 48, "BlushBoudoir", "Tapestries", "pink ombre wall tapestry girly"],
  ["Rose Gold Letter Desk Organizer", 34, "GirlyRoomDecor", "Organizers", "rose gold letter desk organizer girly"],
  ["Pearl Bead Garland String", 18, "PinkBoudoirCo", "Garlands", "pearl bead garland string girly room"],
  ["Pink Chandelier Ceiling Light", 128, "FeminineNestCo", "Lamps", "pink chandelier ceiling light girly"],
  ["Blush Linen Duvet Cover", 76, "RoseGoldHome", "Bedding", "blush linen duvet cover girly bedroom"],
  ["Sparkle Body Pillow Cover", 38, "BlushBoudoir", "Pillows", "sparkle body pillow cover girly"],
  ["Flower-shaped Ceramic Ring Dish", 22, "GirlyRoomDecor", "Accessories", "flower shaped ceramic ring dish girly"],
  ["Pink Wicker Laundry Hamper", 64, "PinkBoudoirCo", "Storage", "pink wicker laundry hamper girly"],
  ["Romantic Fairytale Canvas Print", 46, "FeminineNestCo", "Art Prints", "romantic fairytale canvas print girly"],
  ["Pink Rattan Oval Full Length Mirror", 88, "RoseGoldHome", "Mirrors", "pink rattan oval full length mirror"],
  ["Floral Knot Macramé Wall Hanging", 44, "BlushBoudoir", "Wall Decor", "floral knot macrame wall hanging girly"],
  ["Pink Crushed Velvet Cushion Cover", 28, "GirlyRoomDecor", "Pillows", "pink crushed velvet cushion cover girly"],
]);

// ─── VSCO ─────────────────────────────────────────────────────────────────────
const vsco: P[] = build("vsc", [
  ["VSCO Aesthetic Poster Print Set", 22, "AestheticNestCo", "Posters", "vsco aesthetic poster print set"],
  ["Polaroid Photo String Light Display", 28, "ThePinterestShop", "Wall Decor", "polaroid photo string light display"],
  ["Boho Hammock Hanging Chair", 112, "MoodboardDecor", "Seating", "boho hammock hanging chair vsco"],
  ["Neutral Dried Pampas Arrangement", 38, "NeutralVibesCo", "Botanicals", "neutral dried pampas arrangement"],
  ["Cream Chunky Knit Throw Blanket", 62, "VSCOHomeDecor", "Throws", "cream chunky knit throw blanket vsco"],
  ["Aesthetic Terracotta Plant Pot Set", 34, "AestheticNestCo", "Planters", "aesthetic terracotta plant pot set"],
  ["Pinterest Neutral Tones Art Print", 19, "ThePinterestShop", "Art Prints", "pinterest neutral tones art print"],
  ["Woven Rope Hanging Shelf", 44, "MoodboardDecor", "Shelving", "woven rope hanging shelf vsco"],
  ["Warm Fairy Light Curtain Panel", 32, "NeutralVibesCo", "Lighting", "warm fairy light curtain panel vsco"],
  ["Beige Linen Cushion Cover Set of 2", 38, "VSCOHomeDecor", "Pillows", "beige linen cushion cover set vsco"],
  ["Earth Tones Abstract Wall Print", 24, "AestheticNestCo", "Art Prints", "earth tones abstract wall print vsco"],
  ["Natural Reed Aromatherapy Diffuser", 28, "ThePinterestShop", "Aromatherapy", "natural reed aromatherapy diffuser"],
  ["Dried Botanicals Shadow Box Art", 46, "MoodboardDecor", "Wall Decor", "dried botanicals shadow box art vsco"],
  ["Rattan Photo Frame Set of 4", 42, "NeutralVibesCo", "Frames", "rattan photo frame set vsco aesthetic"],
  ["Aesthetic Woven Coaster Set", 22, "VSCOHomeDecor", "Accessories", "aesthetic woven coaster set vsco"],
  ["Cream Boucle Accent Chair", 162, "AestheticNestCo", "Seating", "cream boucle accent chair vsco aesthetic"],
  ["Mushroom Pampas Dried Bouquet", 34, "ThePinterestShop", "Botanicals", "mushroom pampas dried bouquet vsco"],
  ["Neutral Toned Gallery Wall Set", 58, "MoodboardDecor", "Art Prints", "neutral toned gallery wall set vsco"],
  ["Seagrass Wall Basket Set", 48, "NeutralVibesCo", "Wall Decor", "seagrass wall basket set vsco"],
  ["Camel Wool Throw", 82, "VSCOHomeDecor", "Throws", "camel wool throw blanket vsco aesthetic"],
  ["Sand Coloured Linen Rug", 104, "AestheticNestCo", "Rugs", "sand coloured linen rug vsco"],
  ["Warm Amber Glass Vase", 32, "ThePinterestShop", "Vases", "warm amber glass vase aesthetic vsco"],
  ["Instax Film Photo Display String", 26, "MoodboardDecor", "Wall Decor", "instax film photo display string vsco"],
  ["Oat Linen Bedding Set", 94, "NeutralVibesCo", "Bedding", "oat linen bedding set aesthetic vsco"],
  ["Sage Green Ceramic Planter", 28, "VSCOHomeDecor", "Planters", "sage green ceramic planter vsco"],
  ["Earthy Tone Macramé Wall Hanging", 52, "AestheticNestCo", "Wall Decor", "earthy tone macrame wall hanging vsco"],
  ["Handmade Paper Garland Chain", 18, "ThePinterestShop", "Garlands", "handmade paper garland chain vsco"],
  ["Boho Sun and Moon Wall Art", 38, "MoodboardDecor", "Wall Decor", "boho sun and moon wall art vsco"],
  ["Jute and Linen Throw Pillow", 29, "NeutralVibesCo", "Pillows", "jute and linen throw pillow vsco"],
  ["Rattan Floor Lamp Tall", 96, "VSCOHomeDecor", "Lamps", "rattan floor lamp tall vsco aesthetic"],
  ["Cotton Tasseled Curtain Panels", 62, "AestheticNestCo", "Curtains", "cotton tasseled curtain panels vsco"],
  ["Aesthetic Dried Flower Bouquet", 32, "ThePinterestShop", "Botanicals", "aesthetic dried flower bouquet vsco"],
  ["Neutral Print Linen Pillow", 34, "MoodboardDecor", "Pillows", "neutral print linen pillow vsco"],
  ["Bamboo Beaded Room Divider", 68, "NeutralVibesCo", "Accessories", "bamboo beaded room divider aesthetic"],
  ["Oatmeal Boucle Throw", 72, "VSCOHomeDecor", "Throws", "oatmeal boucle throw blanket vsco"],
  ["Organic Shapes Canvas Art", 42, "AestheticNestCo", "Art Prints", "organic shapes canvas art vsco"],
  ["Sand Ceramic Candle Vessels", 36, "ThePinterestShop", "Candles", "sand ceramic candle vessels vsco"],
  ["Neutral Tones Desk Mat", 28, "MoodboardDecor", "Desk Accessories", "neutral tones desk mat vsco"],
  ["Oversized Knit Pouf", 78, "NeutralVibesCo", "Seating", "oversized knit pouf vsco aesthetic"],
  ["Boho Fringe Wall Clock", 44, "VSCOHomeDecor", "Clocks", "boho fringe wall clock aesthetic vsco"],
  ["Vintage Candlestick Holders", 32, "AestheticNestCo", "Candles", "vintage candlestick holders aesthetic"],
  ["Bleached Wood Branch Mobile", 38, "ThePinterestShop", "Wall Decor", "bleached wood branch mobile vsco"],
  ["Grass Cloth Natural Wallpaper", 54, "MoodboardDecor", "Accessories", "grass cloth natural wallpaper panel"],
  ["Woven Check Throw Pillow", 26, "NeutralVibesCo", "Pillows", "woven check throw pillow vsco"],
  ["Aesthetic Cane Shelf Display", 76, "VSCOHomeDecor", "Shelving", "aesthetic cane shelf display vsco"],
]);

// ─── DEFAULT / ROOM DECOR ─────────────────────────────────────────────────────
const roomDecor: P[] = build("def", [
  ["Handwoven Wall Tapestry", 52, "ArtisanHomeDecor", "Wall Decor", "handwoven wall tapestry room decor"],
  ["Ceramic Table Lamp with Linen Shade", 74, "HomeGlowCo", "Lamps", "ceramic table lamp linen shade"],
  ["Natural Jute Area Rug 5×7", 99, "FloorDecorCo", "Rugs", "natural jute area rug room decor"],
  ["Abstract Watercolor Art Print", 28, "ArtisanHomeDecor", "Art Prints", "abstract watercolor art print"],
  ["Round Rattan Wall Mirror", 68, "WeavedHomesCo", "Mirrors", "round rattan wall mirror room decor"],
  ["Cozy Woven Throw Blanket", 58, "HomeGlowCo", "Throws", "cozy woven throw blanket room decor"],
  ["Potted Fern Plant Arrangement", 32, "GreenDwellingCo", "Plants", "potted fern plant arrangement decor"],
  ["Edison String Lights Warm Glow", 26, "ArtisanHomeDecor", "Lighting", "edison string lights warm glow"],
  ["Botanical Poster Gallery Set", 38, "WeavedHomesCo", "Posters", "botanical poster gallery set"],
  ["Scented Soy Candle Gift Set", 34, "HomeGlowCo", "Candles", "scented soy candle gift set decor"],
  ["Reclaimed Wood Floating Shelves", 64, "FloorDecorCo", "Shelving", "reclaimed wood floating shelves"],
  ["Throw Pillow Cover Set of 4", 44, "GreenDwellingCo", "Pillows", "throw pillow cover set room decor"],
  ["Hanging Succulent Planter Trio", 36, "ArtisanHomeDecor", "Planters", "hanging succulent planter trio decor"],
  ["Farmhouse Wooden Wall Clock", 48, "WeavedHomesCo", "Clocks", "farmhouse wooden wall clock decor"],
  ["Macramé Plant Hanger with Pot", 29, "HomeGlowCo", "Planters", "macrame plant hanger with pot"],
]);

// ─── EXPORT ───────────────────────────────────────────────────────────────────
const SEED: Record<string, P[]> = { pastel, boho, minimalist, cozy, vintage, modern, nature, gaming, girly, vsco };

export function getSeedProducts(theme: string): P[] {
  return SEED[theme.toLowerCase().trim()] ?? roomDecor;
}
