import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerPhone, orderId, returnUrl } = body;

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || 'PRODUCTION';

    if (!appId || !secretKey) {
      return NextResponse.json({ 
        error: 'Cashfree API keys missing. Please configure CASHFREE_APP_ID & CASHFREE_SECRET_KEY in .env.local' 
      }, { status: 400 });
    }

    const isProduction = env.toUpperCase() === 'PRODUCTION';
    const baseUrl = isProduction 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders';

    const cleanPhone = customerPhone?.replace(/\D/g, '') || '9999999999';
    const validPhone = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : '9999999999';

    // Cashfree Production requires HTTPS protocol for return_url
    let rawOrigin = req.headers.get('origin') || 'https://gogocreate.in';
    let finalReturnUrl = returnUrl || `${rawOrigin}/auth/callback`;
    if (finalReturnUrl.startsWith('http://')) {
      finalReturnUrl = finalReturnUrl.replace('http://', 'https://');
    }

    const payload = {
      order_id: orderId || `ORD_${Date.now()}`,
      order_amount: Number(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_name: customerName || 'Valued Customer',
        customer_email: customerEmail || 'customer@example.com',
        customer_phone: validPhone,
      },
      order_meta: {
        return_url: finalReturnUrl,
      },
    };

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree order creation error:', data);
      return NextResponse.json({ error: data.message || 'Cashfree Order creation failed' }, { status: response.status });
    }

    return NextResponse.json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
      cf_env: isProduction ? 'production' : 'sandbox',
    });
  } catch (error: any) {
    console.error('Cashfree API route exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
