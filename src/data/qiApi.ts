// QI MongoDB API Client
// Replaces WooCommerce with our new backend

const API_BASE =
  import.meta.env.PUBLIC_QI_API_URL ||
  "https://oregonchem-backend.onrender.com/api/qi";

// Debug: Log which API we're using
console.log("🔍 QI API Base URL:", API_BASE);
console.log("🔍 Environment:", import.meta.env.PUBLIC_QI_API_URL);

export interface QIImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface QIPresentation {
  _id: string;
  qty: number;
  unit: string;
  pretty: string;
  image?: QIImage;
  sortOrder: number;
  productCount: number;
}

export interface QICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: QIImage;
  parentId?: string;
  productCount?: number;
}

export interface QIProduct {
  _id: string;
  sourceId?: number;
  title: string;
  slug: string;
  sku?: string;
  status: "draft" | "published";
  featured: boolean;
  categoryIds: string[];
  presentationIds: string[];
  relatedProductIds: string[];
  relatedProducts?: Array<{
    productId: string;
    reason: string;
  }>;
  tags: string[];
  description_html?: string;
  description_text?: string;
  short_html?: string;
  short_text?: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  media: {
    hero?: QIImage;
    gallery: QIImage[];
  };
  images: QIImage[];
  ai: {
    description?: string;
    shortDescription?: string;
    seoTitle?: string;
    seoDescription?: string;
    physicalStateReasoning?: string;
  };
  physicalState?:
    | "liquido"
    | "solido"
    | "polvo"
    | "granular"
    | "pasta"
    | "gas"
    | "unknown";
  views: number;
  searches: number;
  totalQuotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface QIBanner {
  _id: string;
  title: string;
  image: QIImage;
  link?: {
    url: string;
    openInNewTab: boolean;
  };
  placement: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder: number;
  overlay?: {
    title: string;
    subtitle: string;
    buttonText: string;
    textColor: string;
    backgroundColor: string;
  };
  impressions: number;
  clicks: number;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T | null> {
  try {
    const url = new URL(`${API_BASE}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    console.log("🌐 Fetching from QI MongoDB API:", url.toString());
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.warn(
        `QI API request failed (${response.status}) for ${endpoint}`,
      );
      return null;
    }

    const result: APIResponse<T> = await response.json();
    console.log(
      `✅ QI API response for ${endpoint}:`,
      result.success ? "SUCCESS" : "FAILED",
    );
    return result.success ? result.data : null;
  } catch (error) {
    console.warn(`QI API request failed for ${endpoint}`, error);
    return null;
  }
}

// Products
export async function getProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  status?: string;
  limit?: number;
  page?: number;
}): Promise<QIProduct[]> {
  const queryParams: Record<string, string> = {};

  if (params?.category) queryParams.category = params.category;
  if (params?.search) queryParams.search = params.search;
  if (params?.featured !== undefined)
    queryParams.featured = String(params.featured);
  if (params?.status) queryParams.status = params.status;
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.page) queryParams.page = String(params.page);

  const products = await fetchAPI<QIProduct[]>("/products", queryParams);
  return products || [];
}

export async function getProductBySlug(
  slug: string,
): Promise<QIProduct | null> {
  return await fetchAPI<QIProduct>(`/products/slug/${slug}`);
}

export async function getProductById(id: string): Promise<QIProduct | null> {
  return await fetchAPI<QIProduct>(`/products/${id}`);
}

export async function getFeaturedProducts(): Promise<QIProduct[]> {
  const products = await fetchAPI<QIProduct[]>("/products/featured");
  return products || [];
}

export async function getRelatedProducts(
  productId: string,
): Promise<QIProduct[]> {
  const products = await fetchAPI<QIProduct[]>(
    `/products/${productId}/related`,
  );
  return products || [];
}

// Categories
export async function getCategories(params?: {
  includeCount?: boolean;
}): Promise<QICategory[]> {
  const queryParams: Record<string, string> = {};
  if (params?.includeCount) queryParams.includeCount = "true";

  const categories = await fetchAPI<QICategory[]>("/categories", queryParams);
  return categories || [];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<QICategory | null> {
  return await fetchAPI<QICategory>(`/categories/slug/${slug}`);
}

export async function getCategoryProducts(
  categoryId: string,
  params?: {
    limit?: number;
    page?: number;
  },
): Promise<QIProduct[]> {
  const queryParams: Record<string, string> = {};
  if (params?.limit) queryParams.limit = String(params.limit);
  if (params?.page) queryParams.page = String(params.page);

  const products = await fetchAPI<QIProduct[]>(
    `/categories/${categoryId}/products`,
    queryParams,
  );
  return products || [];
}

// Presentations
export async function getPresentations(): Promise<QIPresentation[]> {
  const presentations = await fetchAPI<QIPresentation[]>("/presentations");
  return presentations || [];
}

export async function getPresentationProducts(
  presentationId: string,
): Promise<QIProduct[]> {
  const products = await fetchAPI<QIProduct[]>(
    `/presentations/${presentationId}/products`,
  );
  return products || [];
}

// Banners
export async function getActiveBanners(placement: string): Promise<QIBanner[]> {
  const banners = await fetchAPI<QIBanner[]>(`/banners/active/${placement}`);
  return banners || [];
}

export async function trackBannerImpression(bannerId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/banners/${bannerId}/impression`, {
      method: "POST",
    });
  } catch (error) {
    console.warn("Failed to track banner impression", error);
  }
}

export async function trackBannerClick(bannerId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/banners/${bannerId}/click`, { method: "POST" });
  } catch (error) {
    console.warn("Failed to track banner click", error);
  }
}
