import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ WARNING: RESEND_API_KEY is not set in environment');
}


const getEmailHtml = (type: string, payload: any) => {
  switch (type) {
    case 'otp':
      return `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h2 style="color: #18181b;">Verify Your Account</h2>
          <p style="color: #71717a;">Use the verification code below to complete your action:</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 6px; font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #000; margin: 24px 0;">
            ${payload.code}
          </div>
          <p style="color: #a1a1aa; font-size: 14px;">This code will expire shortly.</p>
        </div>
      `;

    case 'order':
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px; background: #fafafa;">
          <div style="background: #2D241E; color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px; font-weight: bold;">Order Confirmed!</h2>
            <p style="margin: 5px 0 0 0; color: #D99A5B; font-size: 14px;">Order ID: <strong>#${payload.orderId}</strong></p>
          </div>
          
          <p style="font-size: 16px; color: #18181b;">Thank you for your order, <strong>${payload.customerName || 'Customer'}</strong>!</p>
          
          <div style="margin-top: 20px; border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; padding: 20px 0;">
            <h3 style="color: #18181b; font-size: 16px; margin-top: 0;">Order Items (${payload.itemsCount})</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 2px solid #D99A5B;">
                  <th style="padding: 12px; text-align: left; color: #2D241E; font-weight: bold;">Item</th>
                  <th style="padding: 12px; text-align: center; color: #2D241E; font-weight: bold;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #2D241E; font-weight: bold;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${payload.itemsHtml || ''}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #f4f4f5; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #71717a;">Subtotal:</span>
              <span style="color: #18181b; font-weight: bold;">$${(payload.totalAmount * 0.9909).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #e4e4e7; padding-bottom: 10px;">
              <span style="color: #71717a;">Tax (10%):</span>
              <span style="color: #18181b; font-weight: bold;">$${(payload.totalAmount * 0.0909).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px;">
              <span style="color: #18181b; font-weight: bold;">Total:</span>
              <span style="color: #D99A5B; font-weight: bold;">$${payload.totalAmount}</span>
            </div>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: white; border: 1px solid #e4e4e7; border-radius: 6px;">
            <h3 style="color: #18181b; font-size: 14px; margin-top: 0; margin-bottom: 10px; font-weight: bold;">Delivery Address</h3>
            <p style="margin: 0; color: #3f3f46; line-height: 1.6;">
              <strong>${payload.customerName}</strong><br/>
              ${payload.address}<br/>
              <strong>Phone:</strong> ${payload.phone}
            </p>
          </div>

          <p style="color: #71717a; font-size: 13px; margin-top: 20px; text-align: center;">
            We'll notify you once your order ships. Thank you for choosing our bakery!
          </p>
        </div>
      `;

    case 'contact':
      return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px; background: #fafafa;">
          <div style="background: #2D241E; color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 22px; font-weight: bold;">📧 New Contact Form Submission</h2>
            <p style="margin: 8px 0 0 0; color: #D99A5B; font-size: 14px;">Subject: <strong>${payload.subject || 'No subject'}</strong></p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background: white; border: 1px solid #e4e4e7; border-radius: 6px;">
            <h3 style="color: #18181b; font-size: 14px; margin-top: 0; margin-bottom: 12px; font-weight: bold;">Contact Information</h3>
            <p style="margin: 0 0 8px 0; color: #3f3f46;"><strong>Name:</strong> ${payload.name || 'N/A'}</p>
            <p style="margin: 0 0 8px 0; color: #3f3f46;"><strong>Email:</strong> <a href="mailto:${payload.email}" style="color: #D99A5B; text-decoration: none;">${payload.email || 'N/A'}</a></p>
            <p style="margin: 0; color: #3f3f46;"><strong>Phone:</strong> <a href="tel:${payload.phone}" style="color: #D99A5B; text-decoration: none;">${payload.phone || 'N/A'}</a></p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: white; border: 1px solid #e4e4e7; border-radius: 6px;">
            <h3 style="color: #18181b; font-size: 14px; margin-top: 0; margin-bottom: 12px; font-weight: bold;">Message</h3>
            <div style="background: #f4f4f5; padding: 16px; border-radius: 6px; white-space: pre-wrap; color: #3f3f46; line-height: 1.6;">
              ${payload.message || 'No message provided'}
            </div>
          </div>

          <p style="color: #71717a; font-size: 12px; margin-top: 20px; text-align: center; border-top: 1px solid #e4e4e7; padding-top: 15px;">
            This message was sent through the contact form at your Bakery website.
          </p>
        </div>
      `;

    default:
    
      return `<div style="font-family: sans-serif; padding: 20px;">${payload.message || ''}</div>`;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, type, payload } = body;

    if (!to || !subject || !type || !payload) {
      return Response.json({ error: 'Missing required fields (to, subject, type, payload)' }, { status: 400 });
    }

    const htmlContent = getEmailHtml(type, payload);

    const { data, error } = await resend.emails.send({
      from: 'BAkERY <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: htmlContent, 
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return Response.json({ error: error.message || 'Failed to send email' }, { status: 500 });
    }

    console.log(' Email sent successfully to:', to);
    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}