import BacklinkCard from "./BacklinkCard";

const FeaturedBacklinks = () => {
  const backlinks = [
    {
      id: "1",
      title: "Increase Domain Rating Package",
      domain: "premium-backlinks.com",
      da: 85,
      dr: 90,
      price: 499,
      rating: 4.9,
      reviews: 234,
      description: "Boost your website's domain rating with high-quality backlinks from authoritative sources. Perfect for SEO professionals.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      isSponsored: true,
    },
    {
      id: "2",
      title: "Domain Authority Booster",
      domain: "seo-authority.com",
      da: 80,
      dr: 85,
      price: 399,
      rating: 4.8,
      reviews: 156,
      description: "Strategic link building package designed to increase your domain authority score. Includes detailed reporting.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    },
    {
      id: "3",
      title: "2,500 Keyword Targeted Backlinks",
      domain: "link-builder.com",
      da: 75,
      dr: 78,
      price: 299,
      rating: 4.7,
      reviews: 189,
      description: "Get 2,500 high-quality backlinks targeting your specific keywords. Perfect for medium-sized businesses.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
      id: "4",
      title: "5,000 Keyword Targeted Backlinks",
      domain: "seo-master.com",
      da: 82,
      dr: 84,
      price: 599,
      rating: 4.8,
      reviews: 167,
      description: "Comprehensive package of 5,000 backlinks with keyword optimization. Ideal for growing businesses.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    },
    {
      id: "5",
      title: "15,000 Keyword Targeted Backlinks",
      domain: "enterprise-seo.com",
      da: 88,
      dr: 92,
      price: 1499,
      rating: 4.9,
      reviews: 145,
      description: "Enterprise-level package with 15,000 carefully curated backlinks. Perfect for large businesses and corporations.",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    },
  ];

  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Backlinks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backlinks.map((backlink) => (
            <BacklinkCard key={backlink.id} {...backlink} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBacklinks;