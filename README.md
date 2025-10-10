# Química Industrial frontend

Sitio marketing construido con [Astro](https://astro.build/) para mostrar el catálogo de Insumos Químicos Perú y habilitar un flujo de cotización rápido. El proyecto consume la API de WooCommerce cuando las credenciales están configuradas y mantiene datos locales como respaldo para desarrollos sin conexión.

## Requisitos

- Node.js 18+
- npm 9+

## Puesta en marcha

1. Copia el archivo de ejemplo de variables de entorno y actualiza los valores si tienes credenciales distintas:
   ```sh
   cp .env.example .env
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Ejecuta el entorno de desarrollo:
   ```sh
   npm run dev
   ```
4. Genera la versión de producción cuando necesites validar el build:
   ```sh
   npm run build
   ```

## Variables de entorno

| Variable             | Descripción                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `WC_API_URL`         | URL base del endpoint de WooCommerce (`https://tu-sitio/wp-json/wc/v3`). |
| `WC_CONSUMER_KEY`    | Consumer key generada en WooCommerce.                                    |
| `WC_CONSUMER_SECRET` | Consumer secret correspondiente a la key anterior.                       |

Si las credenciales no están presentes, el sitio utiliza los datos de ejemplo incluidos en `src/data/products.ts` para mantener la experiencia de navegación durante el desarrollo.

## Arquitectura

- **Astro + Island architecture** para servir páginas estáticas con componentes interactivos puntuales.
- **Catálogo dinámico** a través de `src/data/products.ts`, que consulta la API de WooCommerce y transforma la respuesta al modelo utilizado por la interfaz.
- **Fallback local** que asegura contenido en caso de fallos de red o ausencia de credenciales.

## Scripts disponibles

| Comando           | Acción                                                |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Ejecuta el entorno de desarrollo en `localhost:4321`. |
| `npm run build`   | Construye el sitio estático en la carpeta `dist/`.    |
| `npm run preview` | Sirve la build generada para pruebas locales.         |

## Estilo y linting

El proyecto incluye configuración de ESLint (ver `eslint.config.js`). Ejecuta `npm run lint` si deseas validar el código antes de abrir un Pull Request.
