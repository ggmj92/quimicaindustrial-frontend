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

export const productCategories: ProductCategory[] = [
  {
    id: "acidos",
    name: "Ácidos Industriales",
    description:
      "Soluciones para tratamiento de superficies, limpieza y procesos metalúrgicos.",
    heroHighlight: "Control de procesos químicos críticos",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "solventes",
    name: "Solventes y diluyentes",
    description:
      "Materias primas para pinturas, limpieza y productos farmacéuticos.",
    heroHighlight: "Pureza certificada para formulaciones sensibles",
    image:
      "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "alimentario",
    name: "Grado alimentario",
    description: "Ingredientes seguros para bebidas, confitería y conservas.",
    heroHighlight: "Cumplimos normativa DIGESA",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "limpieza",
    name: "Limpieza y cuidado personal",
    description:
      "Tensioactivos, espumantes y desinfectantes para industrias de higiene.",
    heroHighlight: "Fórmulas listas para tu marca",
    image:
      "https://images.unsplash.com/photo-1598514982833-419c69827deb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mineria",
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

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((product) => product.featured);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const current = products.find((product) => product.slug === slug);
  if (!current) return products.slice(0, 3);
  const related = products.filter(
    (product) =>
      product.slug !== slug &&
      product.categories.some((category) =>
        current.categories.includes(category),
      ),
  );
  return related.length
    ? related.slice(0, 3)
    : products.filter((product) => product.slug !== slug).slice(0, 3);
}

export async function getCategories(): Promise<ProductCategory[]> {
  return productCategories;
}
