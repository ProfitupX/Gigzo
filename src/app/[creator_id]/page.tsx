import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import StorefrontClient from './StorefrontClient';

export const revalidate = 60; // Revalidate cache every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ creator_id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(resolvedParams.creator_id);
  
  const { data: creator } = await supabase
    .from('creators')
    .select('brand_name, bio')
    .eq(isUUID ? 'id' : 'store_link', resolvedParams.creator_id)
    .single();

  if (!creator) return { title: 'Store Not Found' };

  return {
    title: `${creator.brand_name} | Gigzo Store`,
    description: creator.bio || `Shop exclusive products from ${creator.brand_name}`,
  };
}

export default async function CreatorStore({ params }: { params: Promise<{ creator_id: string }> }) {
  const resolvedParams = await params;
  const creatorId = resolvedParams.creator_id;
  
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(creatorId);

  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq(isUUID ? 'id' : 'store_link', creatorId)
    .single();

  if (!creator) {
    notFound();
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('creator_id', creator.id) // Use the resolved creator's actual ID
    .order('created_at', { ascending: false });

  const allProducts = products || [];

  return (
    <StorefrontClient 
      creator={creator} 
      products={allProducts} 
    />
  );
}
