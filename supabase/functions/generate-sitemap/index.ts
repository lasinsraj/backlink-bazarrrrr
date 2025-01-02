import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('title, created_at')
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    // Generate sitemap XML
    const baseUrl = 'https://backlinkbazaar.com';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/shop</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/auth</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Add product URLs with slugs
    for (const product of products) {
      const slug = generateSlug(product.title);
      const lastmod = new Date(product.created_at).toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>${baseUrl}/product/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    sitemap += '\n</urlset>';

    // Store the sitemap in public folder
    const encoder = new TextEncoder();
    const data = encoder.encode(sitemap);

    const { error: storageError } = await supabase
      .storage
      .from('products')
      .upload('sitemap.xml', data, {
        contentType: 'application/xml',
        upsert: true
      });

    if (storageError) throw storageError;

    // Update sitemap status
    const { error: updateError } = await supabase
      .from('sitemap_status')
      .update({ needs_update: false, last_updated: new Date().toISOString() })
      .eq('id', (await supabase.from('sitemap_status').select('id').single()).data?.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: 'Sitemap updated successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})