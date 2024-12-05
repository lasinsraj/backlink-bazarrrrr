import { Helmet } from "react-helmet";

const SEO = () => {
  return (
    <Helmet>
      <title>Backlink Bazaar - Premium Quality Backlinks Marketplace</title>
      <meta name="description" content="Find high-quality backlinks from verified domains. Boost your website's SEO with our curated marketplace of premium backlinks, guest posts, and more." />
      <meta name="keywords" content="backlinks, SEO, digital marketing, guest posts, link building, domain authority, website ranking, search engine optimization, quality backlinks, DA PA metrics" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://backlinkbazaar.com/" />
      <meta property="og:title" content="Backlink Bazaar - Premium Backlinks Marketplace" />
      <meta property="og:description" content="Find high-quality backlinks from verified domains. Boost your website's SEO with our curated marketplace." />
      <meta property="og:image" content="/og-image.svg" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://backlinkbazaar.com/" />
      <meta name="twitter:title" content="Backlink Bazaar - Premium Backlinks" />
      <meta name="twitter:description" content="Find high-quality backlinks from verified domains. Boost your website's SEO with our curated marketplace." />
      <meta name="twitter:image" content="/og-image.svg" />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Backlink Bazaar" />
      <link rel="canonical" href="https://backlinkbazaar.com/" />
    </Helmet>
  );
};

export default SEO;