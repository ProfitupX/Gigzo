'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tag, Plus, Trash2, FolderPlus, Layers } from 'lucide-react';

type Category = { id: string; name: string; creator_id: string; created_at: string; };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const supabase = createClient();

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: true });

    setCategories((cats as Category[]) || []);

    // Count products per category
    if (cats && cats.length > 0) {
      const counts: Record<string, number> = {};
      await Promise.all(
        cats.map(async (cat: Category) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', user.id)
            .eq('category', cat.name);
          counts[cat.id] = count || 0;
        })
      );
      setProductCounts(counts);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('categories').insert({
      name: name.trim(),
      creator_id: user?.id,
    });

    setAdding(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setName('');
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  const defaultCategories = ['Physical', 'Digital', 'Clothing', 'Presets', 'Templates', 'Handmade'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>Product Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Organise your inventory for seamless store navigation.</p>
      </div>

      {/* Add Category Card */}
      <div className="card" style={{ padding: '28px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
            <FolderPlus size={20} />
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Create New Category</h2>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="e.g. Handmade Jewellery, Presets, Ebooks"
            className="input-field"
            style={{ flex: 1, minWidth: '240px' }}
          />
          <button type="submit" disabled={adding} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '100px', fontSize: '0.88rem', gap: '6px' }}>
            <Plus size={16} />
            <span>{adding ? 'Adding...' : 'Add Category'}</span>
          </button>
        </form>

        {/* Quick Add Suggestions */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 700 }}>Quick Add Suggestions:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {defaultCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setName(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#0a0a0a';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-2)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                }}
              >
                + {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category List */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Active Categories</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-muted)' }}>
              <Tag size={20} />
            </div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>No categories created yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Create custom categories to organise your store listings.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {categories.map(cat => (
              <div key={cat.id} className="card" style={{ padding: '18px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--pastel-purple)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {productCounts[cat.id] || 0} product{productCounts[cat.id] !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    transition: 'color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#dc2626';
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                  title="Delete Category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
