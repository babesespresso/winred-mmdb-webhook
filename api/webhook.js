// Simple webhook forwarder - no API keys needed!
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received WinRed webhook:', JSON.stringify(req.body, null, 2));

    // GoHighLevel Inbound Webhook URL
    const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/aOaqJlyUINf9VfPvp0hw/webhook-trigger/eqXnc4XunLFIZ1Hdr5PW';

    // Extract and transform WinRed data
    const winredData = req.body;
    
    // Transform to clean format for GoHighLevel
    const transformedData = {
      // Donor Information
      firstName: winredData.first_name || winredData.donor_first_name || '',
      lastName: winredData.last_name || winredData.donor_last_name || '',
      email: winredData.email || winredData.donor_email || '',
      phone: winredData.phone || winredData.donor_phone || '',
      
      // Donation Details
      donationAmount: winredData.amount || winredData.contribution_amount || '0',
      campaignName: winredData.campaign_name || 'Scott Bottoms Campaign',
      donationDate: winredData.created_at || winredData.transaction_date || new Date().toISOString(),
      
      // Source Information
      source: 'WinRed',
      platform: 'WinRed Donation',
      
      // Transaction Details
      transactionId: winredData.transaction_id || winredData.id || '',
      paymentMethod: winredData.payment_method || 'Credit Card',
      
      // Address Information (if available)
      address: winredData.address || '',
      city: winredData.city || '',
      state: winredData.state || '',
      zipCode: winredData.zip_code || winredData.postal_code || '',
      
      // Raw data for debugging
      rawWinRedData: winredData
    };

    console.log('Sending transformed data to GoHighLevel:', JSON.stringify(transformedData, null, 2));

    // Forward to GoHighLevel Inbound Webhook
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData)
    });

    if (!response.ok) {
      throw new Error(`GoHighLevel webhook failed: ${response.status} ${response.statusText}`);
    }

    const ghlResponse = await response.text();
    console.log('GoHighLevel response:', ghlResponse);

    // Return success to WinRed
    res.status(200).json({
      success: true,
      message: 'Donation data forwarded to GoHighLevel successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return error response to WinRed
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
