'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import imageCompression from 'browser-image-compression';
import { 
  Package, 
  Plus, 
  UploadCloud, 
  Tag, 
  IndianRupee, 
  Layers, 
  Box, 
  CheckCircle,
  AlertCircle,
  Truck,
  Image as ImageIcon,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isPhysical, setIsPhysical] = useState(true);
  const [stock, setStock] = useState('10');
  const [shippingFee, setShippingFee] = useState('0');
  const [shippingDays, setShippingDays] = useState('3-5 Days');
  const [variants, setVariants] = useState('');
  
  const [files, setFiles] = useState<File[]>([]);
  const [customCategories, setCustomCategories] = useState<{id: string, name: string}[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const supabase = createClient();

  const fetchProductsAndCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').eq('creator_id', user.id).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('creator_id', user.id).order('created_at', { ascending: true })
    ]);
      
    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data && categoriesRes.data.length > 0) {
      setCustomCategories(categoriesRes.data);
      setCategory(categoriesRes.data[0].name);
    } else {
      setCategory('General');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleEditClick = (product: any) => {
    setEditingProductId(product.id);
    setTitle(product.title || '');
    setDescription(product.description || '');
    setPrice(product.price?.toString() || '');
    setCategory(product.category || 'General');
    setIsPhysical(product.is_physical ?? true);
    setStock(product.stock?.toString() || '10');
    setShippingFee(product.shipping_fee?.toString() || '0');
    setShippingDays(product.shipping_days || '3-5 Days');
    setVariants(product.variants || '');
    setFiles([]); // Note: Existing images are kept in DB unless overwritten
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setVariants('');
    setFiles([]);
    setStock('10');
    setShippingFee('0');
    setShippingDays('3-5 Days');
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    } else {
      fetchProductsAndCategories();
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let imageUrl = null;
    let additionalImages: string[] = [];

    const uploadSingleImage = async (imgFile: File) => {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(imgFile, options);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      return publicUrl;
    };

    if (files.length > 0) {
      setUploadingImage(true);
      try {
        imageUrl = await uploadSingleImage(files[0]);
        for (let i = 1; i < files.length; i++) {
          additionalImages.push(await uploadSingleImage(files[i]));
        }
      } catch (err: any) {
        alert("Image upload failed: " + err.message);
        setUploadingImage(false);
        setAdding(false);
        return;
      }
      setUploadingImage(false);
    }
    
    // Insert or Update database
    const productData: any = {
      creator_id: user.id,
      title,
      description,
      price: parseFloat(price),
      category: category,
      is_physical: isPhysical,
      stock: isPhysical ? parseInt(stock, 10) : 0,
      shipping_fee: isPhysical ? parseFloat(shippingFee) : 0,
      shipping_days: isPhysical ? shippingDays : null,
      variants: variants.trim() || null
    };

    // Only update image fields if new images were uploaded
    if (imageUrl) {
      productData.image_url = imageUrl;
      productData.additional_images = additionalImages;
    }

    let error;
    if (editingProductId) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProductId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert(productData);
      error = insertError;
    }
    
    setAdding(false);
    
    if (error) {
      alert(`Error ${editingProductId ? 'updating' : 'saving'} product: ` + error.message);
    } else {
      cancelEdit();
      fetchProductsAndCategories();
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>Product Inventory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Add and manage your digital goods and physical items.</p>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      <div className="card" style={{ padding: '32px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)' }}>
              {editingProductId ? <Edit2 size={20} /> : <Plus size={20} />}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {editingProductId ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          {editingProductId && (
            <button type="button" onClick={cancelEdit} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', gap: '6px' }}>
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Lightroom Presets Pack or Cotton Hoodie" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price (₹)</label>
              <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="1" placeholder="499" className="input-field" />
              {price && Number(price) > 0 && (
                <div style={{ marginTop: '8px', padding: '10px 14px', backgroundColor: '#f0ffd4', borderRadius: '12px', border: '1.5px solid #c8f135', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#3a6600', fontWeight: 700 }}>
                    <span>Platform Fee (5%)</span>
                    <span>- ₹{(Number(price) * 0.05).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#166534', fontWeight: 900 }}>
                    <span>You will earn</span>
                    <span>₹{(Number(price) * 0.95).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Provide details about what buyers get upon purchase..." className="input-field" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product Images (Up to 4)</label>
              {editingProductId && (
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Leave empty to keep existing images. Uploading new images will replace the old ones.
                </div>
              )}
              <input 
                required={!editingProductId && files.length === 0}
                type="file" 
                accept="image/*" 
                multiple 
                onChange={e => {
                  if (e.target.files) {
                    const selected = Array.from(e.target.files).slice(0, 4);
                    setFiles(selected);
                  }
                }} 
                className="input-field" 
                style={{ padding: '10px 14px' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Select up to 4 images at once. {files.length} selected.</p>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product Type</label>
              <select value={isPhysical ? 'true' : 'false'} onChange={e => setIsPhysical(e.target.value === 'true')} className="input-field" style={{ cursor: 'pointer' }}>
                <option value="true">Physical Item (Requires Shipping)</option>
                <option value="false">Digital Download (Instant Delivery)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
              {customCategories.length > 0 ? (
                <select value={category} onChange={e => setCategory(e.target.value)} className="input-field" style={{ cursor: 'pointer' }}>
                  {customCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              ) : (
                <input required value={category} onChange={e => setCategory(e.target.value)} type="text" placeholder="e.g. Handmade" className="input-field" />
              )}
            </div>
          </div>

          {isPhysical && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', padding: '20px', backgroundColor: 'var(--surface-2)', borderRadius: '18px', border: '1px dashed var(--border)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Stock Quantity</label>
                <input required value={stock} onChange={e => setStock(e.target.value)} type="number" min="0" className="input-field" style={{ backgroundColor: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Shipping Fee (₹)</label>
                <input required value={shippingFee} onChange={e => setShippingFee(e.target.value)} type="number" min="0" className="input-field" style={{ backgroundColor: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Shipping Days</label>
                <input required value={shippingDays} onChange={e => setShippingDays(e.target.value)} type="text" placeholder="e.g. 3-5 Days" className="input-field" style={{ backgroundColor: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Variants (Optional)</label>
                <input value={variants} onChange={e => setVariants(e.target.value)} type="text" placeholder="S, M, L or Black, Blue" className="input-field" style={{ backgroundColor: '#fff' }} />
              </div>
            </div>
          )}

          <button type="submit" disabled={adding || uploadingImage} className="btn-lime" style={{ justifySelf: 'start', padding: '14px 28px', fontSize: '0.92rem', borderRadius: '100px', gap: '8px' }}>
            <UploadCloud size={18} />
            <span>{uploadingImage ? 'Uploading Image...' : adding ? (editingProductId ? 'Updating...' : 'Publishing...') : (editingProductId ? 'Update Product' : 'Publish Product')}</span>
          </button>
        </form>
      </div>

      {/* Product List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Inventory Catalog</h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{products.length} products listed</span>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading product catalog...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--text-muted)' }}>
              <Package size={24} />
            </div>
            <p style={{ color: 'var(--foreground)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>No products added yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Create your first product listing using the form above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map(p => (
              <div key={p.id} className="store-product-card" style={{ padding: '16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--surface-2)', borderRadius: '16px', position: 'relative', overflow: 'hidden', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <ImageIcon size={28} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>No Image</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#0a0a0a', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {p.category}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 4px 4px 4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--foreground)' }}>{p.title}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--foreground)', marginBottom: '12px' }}>
                    ₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </div>
                  {p.category === 'Physical' && (
                    <div style={{ marginTop: 'auto', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--surface-2)', padding: '8px 12px', borderRadius: '10px', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600 }}>Stock: <span style={{ color: p.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: 800 }}>{p.stock ?? 0}</span></span>
                      <span style={{ fontWeight: 600 }}>Shipping: ₹{p.shipping_fee ?? 0}</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: p.category === 'Physical' ? '0' : 'auto' }}>
                    <button 
                      onClick={() => handleEditClick(p)} 
                      className="btn-secondary" 
                      style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: '12px', gap: '6px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)} 
                      style={{ 
                        flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: '12px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
