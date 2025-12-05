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

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
  thumbnail: string;
  srcset?: string;
  sizes?: string;
}

export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  images: ProductImage[];
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
  sku?: string;
  weight?: string;
  dimensions?: ProductDimensions;
  tags: ProductTag[];
  attributes: ProductAttribute[];
  averageRating: number;
  ratingCount: number;
  totalSales: number;
  onSale: boolean;
  virtual: boolean;
  downloadable: boolean;
  externalUrl?: string;
  buttonText?: string;
  purchaseNote?: string;
  reviewsAllowed: boolean;
  upsellIds: number[];
  crossSellIds: number[];
  relatedIds: number[];
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
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
  srcset?: string;
  sizes?: string;
  thumbnail: string;
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
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

interface WooCommerceTag {
  id: number;
  name: string;
  slug: string;
}

interface WooCommerceDimensions {
  length: string;
  width: string;
  height: string;
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
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: WooCommerceDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  images: WooCommerceImage[];
  categories: WooCommerceCategory[];
  brands: any[];
  tags: WooCommerceTag[];
  attributes: WooCommerceAttribute[];
  default_attributes: any[];
  variations: number[];
  grouped_products: any[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: WooCommerceMetaData[];
  stock_status: string;
  has_options: boolean;
  post_password: string;
  global_unique_id: string;
  jetpack_sharing_enabled: boolean;
  google_listings_and_ads__channel_visibility: {
    is_visible: boolean;
    channel_visibility: string;
    sync_status: string;
    issues: any[];
  };
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
  const images: ProductImage[] = (product.images ?? []).map((img) => ({
    id: img.id,
    src: img.src,
    name: img.name,
    alt: img.alt,
    thumbnail: img.thumbnail,
    srcset: img.srcset,
    sizes: img.sizes,
  }));

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

  const tags: ProductTag[] = (product.tags ?? []).map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }));

  const attributes: ProductAttribute[] = (product.attributes ?? []).map(
    (attr) => ({
      id: attr.id,
      name: attr.name,
      slug: attr.slug,
      position: attr.position,
      visible: attr.visible,
      variation: attr.variation,
      options: attr.options,
    }),
  );

  const dimensions: ProductDimensions = {
    length: product.dimensions?.length || "",
    width: product.dimensions?.width || "",
    height: product.dimensions?.height || "",
  };

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    image,
    images,
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
    sku: product.sku || undefined,
    weight: product.weight || undefined,
    dimensions:
      dimensions.length || dimensions.width || dimensions.height
        ? dimensions
        : undefined,
    tags,
    attributes,
    averageRating: Number(product.average_rating) || 0,
    ratingCount: product.rating_count || 0,
    totalSales: product.total_sales || 0,
    onSale: product.on_sale || false,
    virtual: product.virtual || false,
    downloadable: product.downloadable || false,
    externalUrl: product.external_url || undefined,
    buttonText: product.button_text || undefined,
    purchaseNote: product.purchase_note || undefined,
    reviewsAllowed: product.reviews_allowed || false,
    upsellIds: product.upsell_ids || [],
    crossSellIds: product.cross_sell_ids || [],
    relatedIds: product.related_ids || [],
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
