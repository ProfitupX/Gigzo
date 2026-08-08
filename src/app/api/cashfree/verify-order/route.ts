import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || 'TEST';

    if (!appId || !secretKey) {
      return NextResponse.json({ error: 'Cashfree API credentials missing' }, { status: 400 });
    }

    const baseUrl = env.toUpperCase() === 'PRODUCTION'
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to verify Cashfree order' }, { status: response.status });
    }

    const isPaid = data.order_status === 'PAID';

    return NextResponse.json({
      status: data.order_status,
      isPaid,
      order_id: data.order_id,
      order_amount: data.order_amount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verification error' }, { status: 500 });
  }
}
