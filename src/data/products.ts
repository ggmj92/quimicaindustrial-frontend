import process from "node:process";

export interface ProductPresentation {
  id: string;
  label: string;
  minimumOrder?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  heroHighlight: string;
  image: string;
  slug?: string;
  wordpressId?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  categories: string[];
  presentations: ProductPresentation[];
  summary: string;
  description: string;
  popularity: number;
  createdAt: string;
  featured?: boolean;
  heroHighlights: string[];
}

const DEFAULT_API_BASE = "https://test.insumosquimicos.pe/wp-json/wc/v3";
const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

const API_BASE =
  import.meta.env.WC_API_URL ?? process.env.WC_API_URL ?? DEFAULT_API_BASE;
const CONSUMER_KEY =
  import.meta.env.WC_CONSUMER_KEY ?? process.env.WC_CONSUMER_KEY ?? "";
const CONSUMER_SECRET =
  import.meta.env.WC_CONSUMER_SECRET ?? process.env.WC_CONSUMER_SECRET ?? "";

interface WooCommerceImage {
  src: string;
  alt?: string;
}

interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface WooCommerceAttribute {
  id: number;
  name: string;
  slug: string;
  visible: boolean;
  variation: boolean;
  options: string[];
}

interface WooCommerceMetaData {
  id: number;
  key: string;
  value: unknown;
}

interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  date_created: string;
  date_modified: string;
  featured: boolean;
  total_sales: number;
  images: WooCommerceImage[];
  categories: WooCommerceCategory[];
  attributes: WooCommerceAttribute[];
  meta_data: WooCommerceMetaData[];
}

interface WooCommerceCategoryResponse extends WooCommerceCategory {
  count?: number;
  parent?: number;
}

const remoteCategoryIndex = new Map<
  string,
  { name: string; wordpressId?: number }
>();

let cachedProducts: Product[] | null = null;
let productsPromise: Promise<Product[] | null> | null = null;
let cachedCategories: ProductCategory[] | null = null;
let categoriesPromise: Promise<ProductCategory[] | null> | null = null;

export const productCategories: ProductCategory[] = [
  {
    id: "acidos",
    slug: "acidos",
    name: "Ácidos Industriales",
    description:
      "Soluciones para tratamiento de superficies, limpieza y procesos metalúrgicos.",
    heroHighlight: "Control de procesos químicos críticos",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "solventes",
    slug: "solventes",
    name: "Solventes y diluyentes",
    description:
      "Materias primas para pinturas, limpieza y productos farmacéuticos.",
    heroHighlight: "Pureza certificada para formulaciones sensibles",
    image:
      "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "alimentario",
    slug: "alimentario",
    name: "Grado alimentario",
    description: "Ingredientes seguros para bebidas, confitería y conservas.",
    heroHighlight: "Cumplimos normativa DIGESA",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "limpieza",
    slug: "limpieza",
    name: "Limpieza y cuidado personal",
    description:
      "Tensioactivos, espumantes y desinfectantes para industrias de higiene.",
    heroHighlight: "Fórmulas listas para tu marca",
    image:
      "https://images.unsplash.com/photo-1598514982833-419c69827deb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mineria",
    slug: "mineria",
    name: "Minería y perforación",
    description:
      "Reactivos para flotación, lixiviación y tratamiento de aguas.",
    heroHighlight: "Soporte técnico en campo",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  },
];

export const products: Product[] = [
  {
    id: "acido-sulfurico",
    name: "Ácido Sulfúrico 98%",
    slug: "acido-sulfurico",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    categories: ["acidos", "mineria"],
    presentations: [
      { id: "drum-200l", label: "Tambor 200 L", minimumOrder: "1 tambor" },
      { id: "ibc-1000l", label: "IBC 1000 L", minimumOrder: "1 unidad" },
    ],
    summary:
      "Reactivo industrial para procesos metalúrgicos, tratamiento de agua y producción química.",
    description:
      "El ácido sulfúrico grado industrial 98% es un reactivo esencial para refinación de metales, producción de fertilizantes y control de pH. Nuestro producto cuenta con trazabilidad completa y soporte logístico en Lima y regiones.",
    popularity: 98,
    createdAt: "2024-01-17",
    featured: true,
    heroHighlights: [
      "Stock permanente",
      "Entrega en 24h Lima",
      "Asesoría en seguridad",
    ],
  },
  {
    id: "peroxido-hidrogeno",
    name: "Peróxido de Hidrógeno 50%",
    slug: "peroxido-de-hidrogeno",
    image:
      "https://images.unsplash.com/photo-1503387762-43a5f7ecc84c?auto=format&fit=crop&w=900&q=80",
    categories: ["acidos", "limpieza"],
    presentations: [
      { id: "bidon-30kg", label: "Bidón 30 kg", minimumOrder: "4 bidones" },
      { id: "granel", label: "Granel", minimumOrder: "500 kg" },
    ],
    summary:
      "Agente oxidante para desinfección, tratamiento de aguas y procesos textiles.",
    description:
      "Peróxido de hidrógeno estabilizado con inhibidores de corrosión. Ideal para sanitización de superficies, industria alimentaria y blanqueo de textiles. Disponible en presentaciones a medida.",
    popularity: 85,
    createdAt: "2024-06-22",
    featured: true,
    heroHighlights: [
      "Cumple norma HACCP",
      "Formula estabilizada",
      "Entrega programada",
    ],
  },
  {
    id: "soda-caustica",
    name: "Soda Cáustica Escamas",
    slug: "soda-caustica-escamas",
    image:
      "https://images.unsplash.com/photo-1581093588401-22c70d4c4542?auto=format&fit=crop&w=900&q=80",
    categories: ["acidos", "limpieza"],
    presentations: [
      { id: "saco-25kg", label: "Saco 25 kg", minimumOrder: "2 sacos" },
      { id: "paleta", label: "Paleta 40 sacos", minimumOrder: "1 paleta" },
    ],
    summary:
      "Hidróxido de sodio de alta pureza para industrias de alimentos, jabón y tratamiento de aguas.",
    description:
      "Soda cáustica en escamas al 99% con baja humedad. Perfecta para saponificación, control de pH y limpieza CIP. Ofrecemos capacitación en manejo seguro y hojas SDS actualizadas.",
    popularity: 92,
    createdAt: "2023-11-05",
    heroHighlights: ["Pureza 99%", "Formato industrial", "Soporte técnico"],
  },
  {
    id: "acido-citrico",
    name: "Ácido Cítrico Monohidratado",
    slug: "acido-citrico-monohidratado",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
    categories: ["alimentario"],
    presentations: [
      { id: "bolsa-25kg", label: "Bolsa 25 kg", minimumOrder: "4 bolsas" },
      {
        id: "sacos-500kg",
        label: "Súper saco 500 kg",
        minimumOrder: "1 unidad",
      },
    ],
    summary:
      "Aditivo regulador de acidez para bebidas, confitería y conservas.",
    description:
      "Ácido cítrico monohidratado grado FCC, fabricado bajo certificaciones ISO 22000. Disponible en diferentes granulometrías para adaptarse a tus formulaciones.",
    popularity: 74,
    createdAt: "2024-02-12",
    featured: true,
    heroHighlights: [
      "Certificación FCC",
      "Granulometría controlada",
      "Stock en Lima",
    ],
  },
  {
    id: "metabisulfito-sodio",
    name: "Metabisulfito de Sodio",
    slug: "metabisulfito-de-sodio",
    image:
      "https://images.unsplash.com/photo-1505577071155-d875269c7a19?auto=format&fit=crop&w=900&q=80",
    categories: ["alimentario", "mineria"],
    presentations: [
      { id: "saco-25kg", label: "Saco 25 kg", minimumOrder: "2 sacos" },
      {
        id: "bolsa-500kg",
        label: "Súper saco 500 kg",
        minimumOrder: "1 unidad",
      },
    ],
    summary:
      "Conservante y antioxidante para alimentos, tratamiento de aguas y minería.",
    description:
      "Metabisulfito de sodio grado alimentario e industrial con especificaciones personalizadas. Ideal para control de cloro en sistemas de agua y para procesos de flotación.",
    popularity: 68,
    createdAt: "2023-12-18",
    heroHighlights: [
      "Baja humedad",
      "Certificado de análisis",
      "Soporte normativo",
    ],
  },
  {
    id: "glicerina",
    name: "Glicerina USP",
    slug: "glicerina-usp",
    image:
      "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=900&q=80",
    categories: ["limpieza", "alimentario"],
    presentations: [
      { id: "bidon-250kg", label: "Tambor 250 kg", minimumOrder: "1 tambor" },
      { id: "granel", label: "Granel", minimumOrder: "500 kg" },
    ],
    summary:
      "Humectante multifuncional para cosmética, farmacéutica y alimentos.",
    description:
      "Glicerina vegetal USP con trazabilidad y certificaciones Kosher y Halal. Ideal para jabones líquidos, cremas, bebidas y productos farmacéuticos.",
    popularity: 81,
    createdAt: "2024-04-02",
    heroHighlights: [
      "Kosher & Halal",
      "Viscosidad estable",
      "Soporte de formulación",
    ],
  },
  {
    id: "xantana",
    name: "Goma Xantana",
    slug: "goma-xantana",
    image:
      "https://images.unsplash.com/photo-1524593119773-7be09c4aab95?auto=format&fit=crop&w=900&q=80",
    categories: ["alimentario", "limpieza"],
    presentations: [
      { id: "bolsa-25kg", label: "Bolsa 25 kg", minimumOrder: "2 bolsas" },
      { id: "cajas-10kg", label: "Caja 10 kg", minimumOrder: "5 cajas" },
    ],
    summary:
      "Espesante y estabilizante de alta performance para alimentos y cuidado personal.",
    description:
      "Goma xantana de rápida hidratación, disponible en grado transparente y estándar. Ideal para aderezos, salsas, helados y detergentes líquidos.",
    popularity: 77,
    createdAt: "2024-05-28",
    heroHighlights: [
      "Alta viscosidad",
      "Aplicaciones múltiples",
      "Gran rendimiento",
    ],
  },
  {
    id: "acetona",
    name: "Acetona Técnica",
    slug: "acetona-tecnica",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    categories: ["solventes"],
    presentations: [
      { id: "bidon-190l", label: "Tambor 190 L", minimumOrder: "1 tambor" },
      { id: "tanque", label: "Granel", minimumOrder: "500 L" },
    ],
    summary: "Solvente versátil para pinturas, limpieza y laboratorio.",
    description:
      "Acetona técnica de alta pureza con contenido controlado de agua y metanol. Disponible con servicio de retorno de envases y asesoría de seguridad.",
    popularity: 83,
    createdAt: "2024-07-11",
    heroHighlights: ["Evaporación rápida", "Pureza 99.5%", "Entrega nacional"],
  },
  {
    id: "thf",
    name: "Tetrahidrofurano (THF)",
    slug: "tetrahidrofurano",
    image:
      "https://images.unsplash.com/photo-1581092446323-9b0d27f6d1a6?auto=format&fit=crop&w=900&q=80",
    categories: ["solventes", "mineria"],
    presentations: [
      { id: "bidon-180kg", label: "Tambor 180 kg", minimumOrder: "1 tambor" },
      { id: "granel", label: "Isotanque", minimumOrder: "1000 kg" },
    ],
    summary: "Solvente polar aprotico para síntesis orgánica y polimerización.",
    description:
      "Tetrahidrofurano estabilizado con BHT disponible en grado técnico y grado reactivo. Ofrecemos monitoreo de inhibidores y asistencia en seguridad operacional.",
    popularity: 71,
    createdAt: "2024-03-14",
    heroHighlights: [
      "Grado técnico y reactivo",
      "Estabilizado con BHT",
      "Asistencia en seguridad",
    ],
  },
];

function hasWooCommerceCredentials(): boolean {
  return Boolean(CONSUMER_KEY && CONSUMER_SECRET);
}

function createApiUrl(path: string): URL {
  const normalizedBase = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(`${normalizedBase}${normalizedPath}`);
}

async function fetchWooCommerce<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!hasWooCommerceCredentials()) {
    return null;
  }

  try {
    const url = createApiUrl(path);
    url.searchParams.set("consumer_key", CONSUMER_KEY);
    url.searchParams.set("consumer_secret", CONSUMER_SECRET);
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.warn(
        `WooCommerce request failed (${response.status} ${response.statusText}) for ${url.pathname}`,
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`WooCommerce request failed for ${path}`, error);
    return null;
  }
}

function stripHtml(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|ul|ol|h[1-6]|blockquote)\s*>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&lsquo;|&rsquo;/gi, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeForComparison(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugify(value: string): string {
  const normalized = normalizeForComparison(value);
  const slug = normalized.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug || "opcion";
}

function parseMetaList(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => parseMetaList(item));
  }

  if (typeof value === "string") {
    return value
      .split(/[\n\r|;,•·]+/)
      .map((item) => stripHtml(item))
      .map((item) => item.replace(/\s{2,}/g, " ").trim())
      .filter(Boolean);
  }

  return [];
}

function deriveHeroHighlights(product: WooCommerceProduct): string[] {
  const highlights = new Set<string>();
  const meta = new Map<string, unknown>();

  for (const entry of product.meta_data ?? []) {
    if (entry?.key) {
      meta.set(entry.key, entry.value);
    }
  }

  const addValues = (values: string[]) => {
    for (const value of values) {
      if (!value) continue;
      if (!highlights.has(value)) {
        highlights.add(value);
      }
      if (highlights.size >= 6) {
        break;
      }
    }
  };

  addValues(parseMetaList(meta.get("beneficios")));
  addValues(parseMetaList(meta.get("aplicaciones")));
  addValues(parseMetaList(meta.get("efecto")));
  addValues(parseMetaList(meta.get("forma_del_producto")));
  addValues(parseMetaList(meta.get("nombre_quimico")));

  if (!highlights.size) {
    addValues(
      (product.categories ?? []).map((category) => stripHtml(category.name)),
    );
  }

  const defaults = [
    "Soporte técnico especializado",
    "Despacho a todo el Perú",
    "Calidad certificada",
  ];

  if (!highlights.size) {
    addValues(defaults);
  }

  const result = Array.from(highlights);
  for (const fallback of defaults) {
    if (result.length >= 3) {
      break;
    }
    if (!result.includes(fallback)) {
      result.push(fallback);
    }
  }

  return result.slice(0, 6);
}

function resolvePresentations(
  product: WooCommerceProduct,
): ProductPresentation[] {
  const attribute = (product.attributes ?? []).find((attr) => {
    const reference = normalizeForComparison(attr.name ?? attr.slug ?? "");
    return reference.includes("presentacion");
  });

  const options = attribute?.options ?? [];
  const presentations = options
    .map((option, index) => {
      const label = stripHtml(option);
      return {
        id: `${product.id}-presentation-${index}-${slugify(label)}`,
        label: label || option,
      } satisfies ProductPresentation;
    })
    .filter((item) => Boolean(item.label));

  if (presentations.length) {
    return presentations;
  }

  return [
    {
      id: `${product.id}-presentation-disponibilidad`,
      label: "Consultar disponibilidad",
    },
  ];
}

function applyCategoryMetadata(category: {
  id: string;
  name: string;
  slug?: string;
  wordpressId?: number;
  description?: string;
  heroHighlight?: string;
  image?: string;
}): ProductCategory {
  const slug = category.slug ?? category.id;
  const metadata = productCategories.find(
    (item) => item.id === slug || item.slug === slug,
  );

  return {
    id: slug,
    slug,
    name: category.name,
    wordpressId: category.wordpressId ?? metadata?.wordpressId,
    description: category.description?.trim().length
      ? category.description.trim()
      : (metadata?.description ??
        "Consigue asesoría personalizada para esta categoría."),
    heroHighlight: category.heroHighlight?.trim().length
      ? category.heroHighlight.trim()
      : (metadata?.heroHighlight ?? "Logística inmediata y soporte técnico."),
    image: category.image?.trim().length
      ? category.image
      : (metadata?.image ?? PLACEHOLDER_IMAGE),
  };
}

function mapWooCommerceCategory(
  category: WooCommerceCategoryResponse,
): ProductCategory | null {
  if (!category?.slug) {
    return null;
  }

  remoteCategoryIndex.set(category.slug, {
    name: category.name,
    wordpressId: category.id,
  });

  return applyCategoryMetadata({
    id: category.slug,
    slug: category.slug,
    name: category.name,
    wordpressId: category.id,
    description: stripHtml(category.description ?? ""),
  });
}

function mapWooCommerceProduct(product: WooCommerceProduct): Product {
  const image = product.images?.[0]?.src ?? PLACEHOLDER_IMAGE;
  const categories = Array.from(
    new Set(
      (product.categories ?? []).map((category) => {
        const slug = category.slug || String(category.id);
        remoteCategoryIndex.set(slug, {
          name: category.name,
          wordpressId: category.id,
        });
        return slug;
      }),
    ),
  );

  const presentations = resolvePresentations(product);
  const rawSummary = stripHtml(
    product.short_description || product.description || "",
  );
  const summary =
    rawSummary.length > 220 ? `${rawSummary.slice(0, 217)}...` : rawSummary;
  const description = stripHtml(
    product.description || product.short_description || "",
  );
  const heroHighlights = deriveHeroHighlights(product);

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    image,
    categories,
    presentations,
    summary:
      summary ||
      "Solicita una ficha técnica para conocer especificaciones y usos.",
    description:
      description ||
      "Contáctanos para recibir la ficha técnica completa y asesoría especializada.",
    popularity: Number(product.total_sales ?? 0) || 0,
    createdAt: product.date_created || new Date().toISOString(),
    featured: product.featured,
    heroHighlights,
  };
}

async function loadWooCommerceProducts(): Promise<Product[] | null> {
  const response = await fetchWooCommerce<WooCommerceProduct[]>("/products", {
    per_page: "100",
    status: "publish",
    order: "desc",
  });

  if (!Array.isArray(response) || !response.length) {
    return null;
  }

  remoteCategoryIndex.clear();
  return response.map((item) => mapWooCommerceProduct(item));
}

async function loadWooCommerceCategories(): Promise<ProductCategory[] | null> {
  const response = await fetchWooCommerce<WooCommerceCategoryResponse[]>(
    "/products/categories",
    {
      per_page: "100",
      hide_empty: "false",
    },
  );

  if (!Array.isArray(response) || !response.length) {
    return null;
  }

  const collection = new Map<string, ProductCategory>();
  for (const item of response) {
    const mapped = mapWooCommerceCategory(item);
    if (mapped) {
      collection.set(mapped.id, mapped);
    }
  }

  for (const fallback of productCategories) {
    if (!collection.has(fallback.id)) {
      collection.set(fallback.id, fallback);
    }
  }

  const categories = Array.from(collection.values());
  categories.sort((a, b) => a.name.localeCompare(b.name, "es-PE"));
  return categories;
}

function deriveCategoriesFromIndex(): ProductCategory[] | null {
  if (!remoteCategoryIndex.size) {
    return null;
  }

  const collection = new Map<string, ProductCategory>();
  for (const [slug, info] of remoteCategoryIndex.entries()) {
    const entry = applyCategoryMetadata({
      id: slug,
      slug,
      name: info.name,
      wordpressId: info.wordpressId,
    });
    collection.set(entry.id, entry);
  }

  for (const fallback of productCategories) {
    if (!collection.has(fallback.id)) {
      collection.set(fallback.id, fallback);
    }
  }

  const categories = Array.from(collection.values());
  categories.sort((a, b) => a.name.localeCompare(b.name, "es-PE"));
  return categories;
}

export async function getProducts(): Promise<Product[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  if (!productsPromise) {
    productsPromise = loadWooCommerceProducts().then((result) => {
      if (!result) {
        productsPromise = null;
      }
      return result;
    });
  }

  const remote = await productsPromise;
  if (remote && remote.length) {
    cachedProducts = remote;
    return remote;
  }

  cachedProducts = products;
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const catalog = await getProducts();
  const featured = catalog.filter((product) => product.featured);
  return featured.length ? featured : catalog.slice(0, 6);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const catalog = await getProducts();
  return catalog.find((product) => product.slug === slug);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const catalog = await getProducts();
  const current = catalog.find((product) => product.slug === slug);
  if (!current) {
    return catalog.filter((product) => product.slug !== slug).slice(0, 3);
  }

  const related = catalog.filter(
    (product) =>
      product.slug !== slug &&
      product.categories.some((category) =>
        current.categories.includes(category),
      ),
  );

  return related.length
    ? related.slice(0, 3)
    : catalog.filter((product) => product.slug !== slug).slice(0, 3);
}

export async function getCategories(): Promise<ProductCategory[]> {
  if (cachedCategories) {
    return cachedCategories;
  }

  if (!categoriesPromise) {
    categoriesPromise = loadWooCommerceCategories().then((result) => {
      if (!result) {
        categoriesPromise = null;
      }
      return result;
    });
  }

  const remote = await categoriesPromise;
  if (remote && remote.length) {
    cachedCategories = remote;
    return remote;
  }

  const derived = deriveCategoriesFromIndex();
  if (derived && derived.length) {
    cachedCategories = derived;
    return derived;
  }

  cachedCategories = productCategories;
  return productCategories;
}
