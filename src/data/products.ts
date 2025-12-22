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

// Cache
let cachedProducts: Product[] | null = null;
let cachedCategories: ProductCategory[] | null = null;
let cachedQICategories: qiApi.QICategory[] | null = null;
let cachedPresentations: qiApi.QIPresentation[] | null = null;

// Load all data needed for adaptation
async function loadBaseData() {
  if (!cachedQICategories) {
    cachedQICategories = await qiApi.getCategories({ includeCount: true });
    cachedCategories = cachedQICategories.map(adaptQICategory);
  }

  if (!cachedPresentations) {
    cachedPresentations = await qiApi.getPresentations();
  }

  return {
    qiCategories: cachedQICategories,
    categories: cachedCategories,
    presentations: cachedPresentations,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  try {
    const { qiCategories, presentations } = await loadBaseData();

    // Get ALL products (no status filter for now - most are in draft)
    let qiProducts = await qiApi.getProducts({ limit: 1000 });

    cachedProducts = qiProducts.map((p) =>
      adaptQIProduct(p, qiCategories || [], presentations || []),
    );

    return cachedProducts;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { qiCategories, presentations } = await loadBaseData();

  const qiFeatured = await qiApi.getFeaturedProducts();

  if (qiFeatured.length > 0) {
    return qiFeatured.map((p) =>
      adaptQIProduct(p, qiCategories, presentations),
    );
  }

  // Fallback: return first 6 products
  const allProducts = await getProducts();
  return allProducts.slice(0, 6);
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

  // First get the current product to find its ID and relatedProducts
  const currentProduct = await qiApi.getProductBySlug(slug);

  if (!currentProduct) {
    // Fallback: return random products
    const allProducts = await getProducts();
    return allProducts.filter((p) => p.slug !== slug).slice(0, 3);
  }

  // Use relatedProducts array if available (has reasoning), otherwise fall back to relatedProductIds
  if (
    currentProduct.relatedProducts &&
    currentProduct.relatedProducts.length > 0
  ) {
    // Get product IDs from relatedProducts array
    const relatedIds = currentProduct.relatedProducts.map((rp) => rp.productId);

    // Fetch those products
    const relatedProductsData = await Promise.all(
      relatedIds.slice(0, 6).map((id) => qiApi.getProductById(id)),
    );

    // Map with reasoning
    const relatedWithReason: RelatedProductWithReason[] = relatedProductsData
      .filter((p) => p !== null)
      .map((p) => {
        const adapted = adaptQIProduct(p!, qiCategories, presentations);
        const relationshipInfo = currentProduct.relatedProducts?.find(
          (rp) => String(rp.productId) === String(p!._id),
        );
        return {
          ...adapted,
          relationshipReason: relationshipInfo?.reason,
        };
      });

    return relatedWithReason;
  }

  // Fallback: use old relatedProductIds
  const qiRelated = await qiApi.getRelatedProducts(currentProduct._id);

  if (qiRelated.length > 0) {
    return qiRelated
      .slice(0, 6)
      .map((p) => adaptQIProduct(p, qiCategories, presentations));
  }

  // Fallback: get products from same categories
  const allProducts = await getProducts();
  const related = allProducts.filter(
    (p) =>
      p.slug !== slug &&
      p.categories.some((cat) => currentProduct.categoryIds?.includes(cat)),
  );

  return related.length > 0
    ? related.slice(0, 6)
    : allProducts.filter((p) => p.slug !== slug).slice(0, 6);
}

export async function getCategories(): Promise<ProductCategory[]> {
  if (cachedCategories) {
    return cachedCategories;
  }

  const qiCategories = await qiApi.getCategories({ includeCount: true });
  cachedCategories = qiCategories.map(adaptQICategory);

  return cachedCategories;
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
    limit: 1000,
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
