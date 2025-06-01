import axios from 'axios';

// GoHighLevel API configuration
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Helper function to create/update contact in GoHighLevel
async function createOrUpdateContact(donorData) {
  const contactPayload = {
    firstName: donorData.firstName || '',
    lastName: donorData.lastName || '',
    email: donorData.email || '',
    phone: donorData.phone || '',
    source: 'WinRed',
    customFields: {
      'donation_amount': donorData.amount?.toString() || '0',
      'campaign_name': donorData.campaign || 'Scott Bottoms Campaign',
      'donation_date': donorData.date || new Date().toISOString(),
      'donor_source': 'WinRed'
    }
  };

  try {
    // First, try to find existing contact by email
    const searchResponse = await axios.get(
      `${GHL_BASE_URL}/contacts/search/duplicate`,
      {
        headers: {
          'Authorization': `Bearer ${GHL_API_KEY}`,
          'Version': '2021-07-28'
        },
        params: {
          locationId: GHL_LOCATION_ID,
          email: donorData.email
        }
      }
    );

    let contactId;
    
    if (searchResponse.data.contact) {
      // Update existing contact
      contactId = searchResponse.data.contact.id;
      await axios.put(
        `${GHL_BASE_URL}/contacts/${contactId}`,
        contactPayload,
        {
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`Updated existing contact: ${contactId}`);
    } else {
      // Create new contact
      const createResponse = await axios.post(
        `${GHL_BASE_URL}/contacts/`,
        {
          ...contactPayload,
          locationId: GHL_LOCATION_ID
        },
        {
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          }
        }
      );
      contactId = createResponse.data.contact.id;
      console.log(`Created new contact: ${contactId}`);
    }

    return contactId;
  } catch (error) {
    console.error('GoHighLevel API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Main webhook handler
export default async function handler(req, res) {
  // Log all incoming requests for debugging
  console.log('Webhook received:', {
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing webhook data...');
    console.log('Raw body:', JSON.stringify(req.body, null, 2));

    // Extract donation data from WinRed webhook
    const winredData = req.body;
    
    // Log all possible field names to understand WinRed's data structure
    console.log('Available fields:', Object.keys(winredData));
    
    // Transform WinRed data to our format - checking multiple possible field names
    const donorData = {
      firstName: winredData.first_name || winredData.donor_first_name || winredData.firstName || '',
      lastName: winredData.last_name || winredData.donor_last_name || winredData.lastName || '',
      email: winredData.email || winredData.donor_email || winredData.donorEmail || '',
      phone: winredData.phone || winredData.donor_phone || winredData.donorPhone || '',
      amount: winredData.amount || winredData.contribution_amount || winredData.donationAmount || '0',
      campaign: winredData.campaign_name || winredData.campaignName || 'Scott Bottoms Campaign',
      date: winredData.created_at || winredData.transaction_date || winredData.createdAt || new Date().toISOString()
    };

    console.log('Transformed donor data:', donorData);

    // Validate required fields
    if (!donorData.email) {
      console.error('Missing email in webhook data');
      throw new Error('Email is required');
    }

    // Check if API credentials are set
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error('Missing GoHighLevel credentials');
      throw new Error('GoHighLevel API credentials not configured');
    }

    // Send to GoHighLevel
    const contactId = await createOrUpdateContact(donorData);

    // Log success
    console.log(`Successfully processed donation for: ${donorData.email}`);

    // Return success response to WinRed
    res.status(200).json({
      success: true,
      message: 'Donation processed successfully',
      contactId: contactId,
      email: donorData.email
    });

  } catch (error) {
    console.error('Webhook processing error:', error.message);
    console.error('Full error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
