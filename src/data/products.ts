// New products data layer using QI MongoDB API
// This replaces the WooCommerce implementation

import * as qiApi from "./qiApi";
import { adaptQIProduct, adaptQICategory } from "./qiAdapter";

// Type definitions (from old products.ts)
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
  fiscalizado?: boolean;
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
  // New QI fields
  physicalState?: string;
  views?: number;
  searches?: number;
  totalQuotes?: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — matches ISR revalidation window

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

let categoriesCache: CacheEntry<qiApi.QICategory[]> | null = null;
let presentationsCache: CacheEntry<qiApi.QIPresentation[]> | null = null;

async function loadBaseData() {
  const now = Date.now();

  if (!categoriesCache || now > categoriesCache.expiresAt) {
    const fetched = await qiApi.getCategories({ includeCount: true });
    categoriesCache = { data: fetched, expiresAt: now + CACHE_TTL_MS };
  }

  if (!presentationsCache || now > presentationsCache.expiresAt) {
    const fetched = await qiApi.getPresentations();
    presentationsCache = { data: fetched, expiresAt: now + CACHE_TTL_MS };
  }

  const qiCategories = categoriesCache.data;
  return {
    qiCategories,
    categories: qiCategories.map(adaptQICategory),
    presentations: presentationsCache.data,
  };
}

export async function getProductSlugs(): Promise<string[]> {
  return qiApi.getProductSlugs();
}

export async function getQuoteCatalog(): Promise<qiApi.QIProductCatalogItem[]> {
  return qiApi.getProductCatalog();
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { qiCategories, presentations } = await loadBaseData();

    // Always fetch fresh products to reflect dashboard changes
    const qiProducts = await qiApi.getProducts({ limit: 500 });

    return qiProducts.map((p) =>
      adaptQIProduct(p, qiCategories || [], presentations || []),
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { qiCategories, presentations } = await loadBaseData();

  const qiProducts = await qiApi.getFeaturedProducts();
  return qiProducts.map((p) => adaptQIProduct(p, qiCategories, presentations));
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const { qiCategories, presentations } = await loadBaseData();

  const qiProduct = await qiApi.getProductBySlug(slug);

  if (!qiProduct) {
    return undefined;
  }

  return adaptQIProduct(qiProduct, qiCategories, presentations);
}

export interface RelatedProductWithReason extends Product {
  relationshipReason?: string;
}

export async function getRelatedProducts(
  slug: string,
): Promise<RelatedProductWithReason[]> {
  const { qiCategories, presentations } = await loadBaseData();

  const currentProduct = await qiApi.getProductBySlug(slug);

  if (!currentProduct) {
    return [];
  }

  // Use relatedProducts array if available (includes AI-generated reasoning)
  if (
    currentProduct.relatedProducts &&
    currentProduct.relatedProducts.length > 0
  ) {
    const relatedIds = currentProduct.relatedProducts.map((rp) => rp.productId);

    const relatedProductsData = await Promise.all(
      relatedIds.slice(0, 6).map((id) => qiApi.getProductById(id)),
    );

    return relatedProductsData
      .filter((p) => p !== null)
      .map((p) => {
        const adapted = adaptQIProduct(p!, qiCategories, presentations);
        const relationshipInfo = currentProduct.relatedProducts?.find(
          (rp) => String(rp.productId) === String(p!._id),
        );
        return { ...adapted, relationshipReason: relationshipInfo?.reason };
      });
  }

  // Fall back to backend category-scoped related products query
  const qiRelated = await qiApi.getRelatedProducts(currentProduct._id);
  return qiRelated
    .slice(0, 6)
    .map((p) => adaptQIProduct(p, qiCategories, presentations));
}

export async function getCategories(): Promise<ProductCategory[]> {
  // Always fetch fresh categories to reflect dashboard changes
  const qiCategories = await qiApi.getCategories({ includeCount: true });
  return qiCategories.map(adaptQICategory);
}

// Additional helper functions for the new API

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const { qiCategories, presentations } = await loadBaseData();

  // Find category by slug
  const category = qiCategories.find((c) => c.slug === categorySlug);

  if (!category) {
    return [];
  }

  // Get products for this category
  const qiProducts = await qiApi.getProducts({
    category: category._id,
    status: "published",
    limit: 100,
  });

  return qiProducts.map((p) => adaptQIProduct(p, qiCategories, presentations));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { qiCategories, presentations } = await loadBaseData();

  const qiProducts = await qiApi.getProducts({
    search: query,
    status: "published",
    limit: 100,
  });

  return qiProducts.map((p) => adaptQIProduct(p, qiCategories, presentations));
}

// Banner functions
export async function getHomepageBanners() {
  return await qiApi.getActiveBanners("homepage-hero");
}

export async function trackBannerImpression(bannerId: string) {
  await qiApi.trackBannerImpression(bannerId);
}

export async function trackBannerClick(bannerId: string) {
  await qiApi.trackBannerClick(bannerId);
}
