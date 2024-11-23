import BacklinkCard from "./BacklinkCard";

const FeaturedBacklinks = () => {
  const backlinks = [
    {
      id: "1",
      title: "Premium Tech Blog Backlink",
      domain: "techreview.com",
      da: 75,
      dr: 82,
      price: 299,
      rating: 4.8,
      reviews: 156,
      isSponsored: true,
    },
    {
      id: "2",
      title: "News Website Guest Post",
      domain: "dailynews.com",
      da: 65,
      dr: 71,
      price: 199,
      rating: 4.6,
      reviews: 92,
    },
    {
      id: "3",
      title: "Authority Business Blog",
      domain: "bizinsider.com",
      da: 55,
      dr: 68,
      price: 149,
      rating: 4.5,
      reviews: 78,
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