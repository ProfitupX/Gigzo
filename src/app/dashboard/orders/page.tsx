'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShoppingCart, Package, ExternalLink, Calendar, MapPin, Receipt, Search, Clock, CheckCircle2 } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch orders with product details
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (
          title,
          image_url,
          is_physical
        )
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Failed to update status: ' + error.message);
    } else {
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.buyer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.utr_ref || '').includes(searchTerm) ||
    (o.products?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '4px' }}>Store Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Manage and fulfill your customer orders.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid var(--border)', padding: '12px 16px', gap: '12px' }}>
        <Search size={20} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search by buyer name, product, or UTR..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.95rem', fontWeight: 600 }}
        />
      </div>

      {/* Orders List */}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--text-muted)' }}>
              <ShoppingCart size={24} />
            </div>
            <p style={{ color: 'var(--foreground)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>No orders found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{searchTerm ? 'Try a different search term.' : 'When customers buy your products, they will appear here.'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredOrders.map(order => (
              <div key={order.id} className="card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Header: Buyer Info & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#0a0a0a', color: '#c8f135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                      {order.buyer_name?.[0]?.toUpperCase() || 'B'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{order.buyer_name || 'Anonymous Buyer'}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{order.buyer_email} • {order.buyer_phone}</p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '4px' }}>₹{Number(order.amount).toLocaleString('en-IN')}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '100px', backgroundColor: order.status === 'paid' ? '#dcfce7' : order.status === 'fulfilled' ? '#ede9fe' : '#fef3c7', color: order.status === 'paid' ? '#16a34a' : order.status === 'fulfilled' ? '#7c3aed' : '#d97706', textTransform: 'uppercase' }}>
                      {order.status === 'paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      <span>{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Body: Product Info & Shipping */}
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', padding: '16px', backgroundColor: 'var(--surface-2)', borderRadius: '16px' }}>
                  {/* Product Details */}
                  <div style={{ flex: '1 1 300px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>Item Purchased</h4>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '8px', backgroundColor: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        {order.products?.image_url ? (
                          <img src={order.products.image_url} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={20} style={{ margin: '10px auto', display: 'block', color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.products?.title || 'Unknown Product'}</div>
                        {order.selected_variant && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>
                            Variant: {order.selected_variant}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div style={{ flex: '1 1 200px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>Payment Details</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Receipt size={14} color="var(--text-muted)" /> Method: {order.payment_method === 'direct_upi' ? 'Direct UPI' : order.payment_method}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0ea5e9' }}>UTR: {order.utr_ref || 'N/A'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <Calendar size={14} /> {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  {order.products?.is_physical && (
                    <div style={{ flex: '1 1 200px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>Shipping Info</h4>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        <MapPin size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{order.shipping_address || 'No address provided'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  {order.status === 'paid' && order.products?.is_physical && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'fulfilled')}
                      className="btn-lime" 
                      style={{ padding: '10px 20px', borderRadius: '100px', fontSize: '0.85rem', gap: '6px' }}
                    >
                      <Package size={16} /> Mark as Fulfilled / Shipped
                    </button>
                  )}
                  {order.status === 'fulfilled' && (
                    <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Order Fulfilled
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
