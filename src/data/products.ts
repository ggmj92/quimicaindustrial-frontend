import { Buffer } from "node:buffer";
import process from "node:process";

export interface ProductPresentation {
  id: string;
  label: string;
  minimumOrder?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  heroHighlight?: string;
  image?: string;
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
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  priceText: string | null;
  stockStatus: string;
  stockQuantity: number | null;
  purchasable: boolean;
}

const DEFAULT_API_BASE = "https://test.insumosquimicos.pe/wp-json/wc/v3";
const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

const DEFAULT_CONSUMER_KEY = "ck_deab038b47bb888419d8edbd76b8acba8d8754c5";
const DEFAULT_CONSUMER_SECRET = "cs_6731881cceb5f7479a96de7b83a8e3cccc6db297";

const API_BASE =
  import.meta.env.WC_API_URL ?? process.env.WC_API_URL ?? DEFAULT_API_BASE;
const CONSUMER_KEY =
  import.meta.env.WC_CONSUMER_KEY ??
  process.env.WC_CONSUMER_KEY ??
  DEFAULT_CONSUMER_KEY;
const CONSUMER_SECRET =
  import.meta.env.WC_CONSUMER_SECRET ??
  process.env.WC_CONSUMER_SECRET ??
  DEFAULT_CONSUMER_SECRET;
const AUTH_HEADER =
  CONSUMER_KEY && CONSUMER_SECRET
    ? `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`
    : null;

interface WooCommerceImage {
  src: string;
  alt?: string;
}

interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: { src?: string | null } | null;
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
  price?: string | null;
  regular_price?: string | null;
  sale_price?: string | null;
  price_html?: string | null;
  stock_status?: string | null;
  stock_quantity?: number | null;
  purchasable?: boolean;
}

interface WooCommerceCategoryResponse extends WooCommerceCategory {
  count?: number;
  parent?: number;
}

const remoteCategoryIndex = new Map<
  string,
  { name: string; wordpressId?: number; image?: string; description?: string }
>();

let cachedProducts: Product[] | null = null;
let productsPromise: Promise<Product[] | null> | null = null;
let cachedCategories: ProductCategory[] | null = null;
let categoriesPromise: Promise<ProductCategory[] | null> | null = null;

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
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (AUTH_HEADER) {
      headers.Authorization = AUTH_HEADER;
    }
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }

    const response = await fetch(url.toString(), { headers });
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
  description?: string | null;
  heroHighlight?: string | null;
  image?: string | null;
}): ProductCategory {
  const slug = category.slug ?? category.id;

  const normalize = (value?: string | null) => {
    const trimmed = value?.toString().trim();
    return trimmed?.length ? trimmed : undefined;
  };

  return {
    id: slug,
    slug,
    name: category.name,
    wordpressId: category.wordpressId,
    description: normalize(category.description),
    heroHighlight: normalize(category.heroHighlight),
    image: normalize(category.image),
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
    image: category.image?.src ?? undefined,
    description: stripHtml(category.description ?? "") || undefined,
  });

  return applyCategoryMetadata({
    id: category.slug,
    slug: category.slug,
    name: category.name,
    wordpressId: category.id,
    description: stripHtml(category.description ?? ""),
    image: category.image?.src ?? undefined,
  });
}

function mapWooCommerceProduct(product: WooCommerceProduct): Product {
  const image = product.images?.[0]?.src ?? PLACEHOLDER_IMAGE;
  const categories = Array.from(
    new Set(
      (product.categories ?? []).map((category) => {
        const slug = category.slug || String(category.id);
        const previous = remoteCategoryIndex.get(slug);
        remoteCategoryIndex.set(slug, {
          name: category.name,
          wordpressId: category.id,
          image: previous?.image,
          description: previous?.description,
        });
        return slug;
      }),
    ),
  );

  const presentations = resolvePresentations(product);
  const rawSummary = stripHtml(
    product.short_description || product.description || "",
  );
  const description = stripHtml(
    product.description || product.short_description || "",
  );
  const summarySource = rawSummary || description || product.name;
  const summary =
    summarySource.length > 220
      ? `${summarySource.slice(0, 217)}...`
      : summarySource;
  const heroHighlights = deriveHeroHighlights(product);
  const price = product.price?.toString().trim() || null;
  const regularPrice = product.regular_price?.toString().trim() || null;
  const salePrice = product.sale_price?.toString().trim() || null;
  const rawPriceText = stripHtml(product.price_html ?? "");
  const priceText = rawPriceText || price || regularPrice || null;
  const stockStatus =
    (product.stock_status || "").toLowerCase() ||
    (product.purchasable ? "instock" : "outofstock");
  const stockQuantity =
    typeof product.stock_quantity === "number"
      ? product.stock_quantity
      : product.stock_quantity != null
        ? Number(product.stock_quantity) || null
        : null;
  const purchasable =
    typeof product.purchasable === "boolean"
      ? product.purchasable
      : stockStatus === "instock" ||
        (stockQuantity != null && stockQuantity > 0);

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    image,
    categories,
    presentations,
    summary,
    description: description || summary,
    popularity: Number(product.total_sales ?? 0) || 0,
    createdAt: product.date_created || new Date().toISOString(),
    featured: product.featured,
    heroHighlights,
    price,
    regularPrice,
    salePrice,
    priceText,
    stockStatus,
    stockQuantity,
    purchasable,
  };
}

async function loadWooCommerceProducts(): Promise<Product[] | null> {
  const aggregated: WooCommerceProduct[] = [];
  const perPage = 100;
  let page = 1;

  remoteCategoryIndex.clear();

  while (page <= 25) {
    const response = await fetchWooCommerce<WooCommerceProduct[]>("/products", {
      per_page: String(perPage),
      status: "publish",
      order: "desc",
      page: String(page),
    });

    if (!Array.isArray(response) || !response.length) {
      break;
    }

    aggregated.push(...response);

    if (response.length < perPage) {
      break;
    }

    page += 1;
  }

  if (!aggregated.length) {
    return null;
  }

  return aggregated.map((item) => mapWooCommerceProduct(item));
}

async function loadWooCommerceCategories(): Promise<ProductCategory[] | null> {
  const aggregated: WooCommerceCategoryResponse[] = [];
  const perPage = 100;
  let page = 1;

  while (page <= 25) {
    const response = await fetchWooCommerce<WooCommerceCategoryResponse[]>(
      "/products/categories",
      {
        per_page: String(perPage),
        hide_empty: "false",
        page: String(page),
      },
    );

    if (!Array.isArray(response) || !response.length) {
      break;
    }

    aggregated.push(...response);

    if (response.length < perPage) {
      break;
    }

    page += 1;
  }

  if (!aggregated.length) {
    return null;
  }

  const collection = new Map<string, ProductCategory>();
  for (const item of aggregated) {
    const mapped = mapWooCommerceCategory(item);
    if (mapped) {
      collection.set(mapped.id, mapped);
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
      description: info.description ?? undefined,
      image: info.image ?? undefined,
    });
    collection.set(entry.id, entry);
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

  cachedProducts = [];
  return [];
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

  cachedCategories = [];
  return [];
}
