// Adapter to convert QI MongoDB API data to existing Product interface
// This allows us to keep existing components unchanged

import type {
  Product,
  ProductCategory,
  ProductPresentation,
  ProductImage,
} from "./products";
import type { QIProduct, QICategory, QIPresentation } from "./qiApi";

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

export function adaptQIProduct(
  qiProduct: QIProduct,
  categories: QICategory[] = [],
  presentations: QIPresentation[] = [],
): Product {
  // Use PRESENTATION IMAGES instead of product images
  const images: ProductImage[] = [];

  // Get presentation images for this product
  const presentationMap = new Map(presentations.map((p) => [p._id, p]));

  // Force convert presentation IDs to strings (same issue as categories)
  const presentationIds = (qiProduct.presentationIds || []).map((id) => {
    if (typeof id === "string") return id;
    if (typeof id === "object" && id !== null) {
      return (id as any)._id || (id as any).id || String(id);
    }
    return String(id);
  });

  const productPresentations = presentationIds
    .map((id) => presentationMap.get(id))
    .filter(Boolean);

  // Add images from presentations
  productPresentations.forEach((presentation, index) => {
    if (presentation && presentation.image?.url) {
      images.push({
        id: index,
        src: presentation.image.url,
        name: `${qiProduct.title} - ${presentation.pretty}`,
        alt: `${qiProduct.title} - ${presentation.pretty}`,
        thumbnail: presentation.image.url,
        srcset: undefined,
        sizes: undefined,
      });
    }
  });

  // If no presentation images, use placeholder based on physical state
  let mainImage: string;
  if (images.length > 0) {
    mainImage = images[0].src;
  } else {
    // Use physical state to determine placeholder
    const isLiquid = qiProduct.physicalState === "liquido";
    const placeholderType = isLiquid ? "liquido" : "solido";
    mainImage = `/images/placeholders/presentation-placeholder-${placeholderType}.png`;

    // Add placeholder to images array
    images.push({
      id: -1,
      src: mainImage,
      name: qiProduct.title,
      alt: qiProduct.title,
      thumbnail: mainImage,
      srcset: undefined,
      sizes: undefined,
    });
  }

  // Keep category IDs for filtering (don't convert to slugs)
  // Force convert to strings in case API returns objects
  const categoryIds = (qiProduct.categoryIds || []).map((id) => {
    if (typeof id === "string") return id;
    if (typeof id === "object" && id !== null) {
      // If it's an object with _id or id property, use that
      return (id as any)._id || (id as any).id || String(id);
    }
    return String(id);
  });

  // Map presentations for display (labels only, images already handled above)
  const presentationLabels: ProductPresentation[] = productPresentations.map(
    (p, index) => ({
      id: `${qiProduct._id}-presentation-${index}-${p!.pretty}`,
      label: p!.pretty,
      minimumOrder: undefined,
    }),
  );

  // Use AI-generated content or fallback to regular content
  const description =
    qiProduct.ai?.description ||
    qiProduct.description_text ||
    qiProduct.description_html ||
    "";
  const shortDescription =
    qiProduct.ai?.shortDescription ||
    qiProduct.short_text ||
    qiProduct.short_html ||
    "";

  // Create summary (max 220 chars)
  const summarySource = shortDescription || description || qiProduct.title;
  const summary =
    summarySource.length > 220
      ? `${summarySource.slice(0, 217)}...`
      : summarySource;

  // Generate hero highlights from categories and tags
  const heroHighlights: string[] = [];

  // Add first 3 category names
  categoryIds.slice(0, 3).forEach((id) => {
    const cat = categories.find((c) => c._id === id);
    if (cat) heroHighlights.push(cat.name);
  });

  // Add tags
  (qiProduct.tags || []).slice(0, 3).forEach((tag) => {
    if (!heroHighlights.includes(tag)) {
      heroHighlights.push(tag);
    }
  });

  // Add defaults if needed
  const defaults = [
    "Soporte técnico especializado",
    "Despacho a todo el Perú",
    "Calidad certificada",
  ];

  defaults.forEach((fallback) => {
    if (heroHighlights.length >= 6) return;
    if (!heroHighlights.includes(fallback)) {
      heroHighlights.push(fallback);
    }
  });

  return {
    id: qiProduct._id,
    name: qiProduct.title,
    slug: qiProduct.slug,
    image: mainImage,
    images,
    categories: categoryIds,
    presentations: presentationLabels,
    summary,
    description,
    popularity:
      qiProduct.views + qiProduct.searches + qiProduct.totalQuotes * 10,
    createdAt: qiProduct.createdAt,
    featured: qiProduct.featured,
    heroHighlights: heroHighlights.slice(0, 6),

    // Price fields (not used in QI, set to null)
    price: null,
    regularPrice: null,
    salePrice: null,
    priceText: "Consultar precio",

    // Stock fields (not used in QI)
    stockStatus: "instock",
    stockQuantity: null,
    purchasable: true,

    // Optional fields
    sku: qiProduct.sku,
    weight: undefined,
    dimensions: undefined,

    // Tags and attributes (simplified)
    tags: (qiProduct.tags || []).map((tag, index) => ({
      id: index,
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, "-"),
    })),
    attributes: [],

    // Ratings (not used in QI)
    averageRating: 0,
    ratingCount: 0,
    totalSales: qiProduct.totalQuotes,

    // Flags
    onSale: false,
    virtual: false,
    downloadable: false,
    reviewsAllowed: false,

    // Related products
    upsellIds: [],
    crossSellIds: [],
    relatedIds: qiProduct.relatedProductIds
      .map((id) => parseInt(id, 10))
      .filter((n) => !isNaN(n)),

    // Optional
    externalUrl: undefined,
    buttonText: undefined,
    purchaseNote: undefined,

    // New QI fields
    physicalState: qiProduct.physicalState,
    views: qiProduct.views,
    searches: qiProduct.searches,
    totalQuotes: qiProduct.totalQuotes,
  };
}

export function adaptQICategory(qiCategory: QICategory): ProductCategory {
  return {
    id: qiCategory._id,
    slug: qiCategory.slug,
    name: qiCategory.name,
    description: qiCategory.description,
    image: qiCategory.image?.url,
    wordpressId: undefined,
    heroHighlight: undefined,
  };
}

export function adaptQIPresentation(
  qiPresentation: QIPresentation,
): ProductPresentation {
  return {
    id: qiPresentation._id,
    label: qiPresentation.pretty,
    minimumOrder: undefined,
  };
}
