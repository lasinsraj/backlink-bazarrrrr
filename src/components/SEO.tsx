import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noindex?: boolean;
  type?: string;
  hasContent?: boolean;
}

const SEO = ({ 
  title = "Backlink Bazaar - Premium Quality Backlinks Marketplace",
  description = "Find high-quality backlinks from verified domains. Boost your website's SEO with our curated marketplace of premium backlinks, guest posts, and more.",
  keywords = "backlinks, SEO, digital marketing, guest posts, link building, domain authority, website ranking, search engine optimization, quality backlinks, DA PA metrics",
  image = "/og-image.svg",
  noindex = false,
  type = "website",
  hasContent = true
}: SEOProps) => {
  const location = useLocation();
  const canonicalUrl = `https://backlinkbazaar.online${location.pathname}`;

  // If page has no content, set noindex to true
  const shouldIndex = hasContent && !noindex;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {!shouldIndex && <meta name="robots" content="noindex,nofollow" />}
      {shouldIndex && <meta name="robots" content="index,follow" />}
      
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Backlink Bazaar" />
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type,
          "name": title,
          "description": description,
          "url": canonicalUrl,
          "image": image,
          "publisher": {
            "@type": "Organization",
            "name": "Backlink Bazaar",
            "logo": {
              "@type": "ImageObject",
              "url": "/og-image.svg"
            }
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;