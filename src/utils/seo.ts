import type { Product } from "../data/products";

export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": string;
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string;
  };
  sameAs: string[];
}

export interface LocalBusinessSchema extends OrganizationSchema {
  "@type": "LocalBusiness";
  geo: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: Array<{
    "@type": string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange: string;
}

export interface ProductSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  image: string;
  url: string;
  brand: {
    "@type": string;
    name: string;
  };
  offers: {
    "@type": string;
    availability: string;
    priceCurrency: string;
    url: string;
  };
  category?: string;
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface FAQSchema {
  "@context": string;
  "@type": string;
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: {
      "@type": string;
      text: string;
    };
  }>;
}

export interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  potentialAction: {
    "@type": string;
    target: {
      "@type": string;
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Química Industrial",
    url: "https://www.quimicaindustrial.pe",
    logo: "https://www.quimicaindustrial.pe/images/qi-logo-mobile.png",
    description:
      "Distribuidores de químicos industriales y materias primas en Lima, Perú. Más de 12 años de experiencia con soporte técnico especializado.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jr. Dante 236",
      addressLocality: "Surquillo",
      addressRegion: "Lima",
      postalCode: "15047",
      addressCountry: "PE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+51-933-634-055",
      contactType: "sales",
      areaServed: "PE",
      availableLanguage: "Spanish",
    },
    sameAs: [],
  };
}

export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    ...generateOrganizationSchema(),
    "@type": "LocalBusiness",
    geo: {
      "@type": "GeoCoordinates",
      latitude: -12.11667,
      longitude: -76.99893,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
  };
}

export function generateProductSchema(
  product: Product,
  categoryName?: string,
): ProductSchema {
  const baseUrl = "https://www.quimicaindustrial.pe";
  const productUrl = `${baseUrl}/products/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.summary ||
      `${product.name} - Materia prima química disponible en Química Industrial`,
    image:
      product.image || `${baseUrl}/images/placeholders/product-placeholder.png`,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: "Química Industrial",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "PEN",
      url: productUrl,
    },
    ...(categoryName && { category: categoryName }),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

export function generateFAQSchema(): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo puedo solicitar una cotización?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Puedes agregar productos a tu carrito de cotización desde nuestro catálogo y luego completar el formulario de cotización. Nuestro equipo te responderá en menos de 24 horas con precios y disponibilidad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Realizan entregas en todo el Perú?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, realizamos entregas en todo el Perú. Contamos con despacho propio en Lima y trabajamos con transportistas certificados para envíos a provincias.",
        },
      },
      {
        "@type": "Question",
        name: "¿Los productos cuentan con certificados de calidad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Todos nuestros productos cuentan con certificados de análisis y fichas técnicas. Trabajamos con proveedores certificados ISO 9001 para garantizar la calidad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Ofrecen soporte técnico?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, contamos con un equipo de ingenieros químicos que brindan asesoría técnica sobre el uso seguro de productos, dosificación y aplicaciones industriales.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es el tiempo de entrega en Lima?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para Lima Metropolitana, el tiempo de entrega es de 24 a 48 horas dependiendo de la disponibilidad del producto y la zona de entrega.",
        },
      },
    ],
  };
}

export function generateMetaDescription(
  product: Product,
  categoryName?: string,
): string {
  const category = categoryName ? ` para ${categoryName.toLowerCase()}` : "";
  const presentations = product.presentations
    .slice(0, 3)
    .map((p) => p.label)
    .join(", ");

  if (product.summary) {
    return `${product.name}${category} - ${product.summary}. Disponible en ${presentations}. Cotiza ahora con Química Industrial en Lima, Perú.`;
  }

  return `${product.name}${category} - Materia prima química de calidad certificada. Disponible en ${presentations}. Entrega en Lima y todo el Perú. Cotiza ahora.`;
}

export function generateWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Química Industrial Perú",
    url: "https://www.quimicaindustrial.pe",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.quimicaindustrial.pe/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function truncateDescription(
  text: string,
  maxLength: number = 160,
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + "...";
}
