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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));

    // Extract donation data from WinRed webhook
    const winredData = req.body;
    
    // Transform WinRed data to our format
    const donorData = {
      firstName: winredData.first_name || winredData.donor_first_name,
      lastName: winredData.last_name || winredData.donor_last_name,
      email: winredData.email || winredData.donor_email,
      phone: winredData.phone || winredData.donor_phone,
      amount: winredData.amount || winredData.contribution_amount,
      campaign: winredData.campaign_name || 'Scott Bottoms Campaign',
      date: winredData.created_at || winredData.transaction_date || new Date().toISOString()
    };

    // Validate required fields
    if (!donorData.email) {
      throw new Error('Email is required');
    }

    // Send to GoHighLevel
    const contactId = await createOrUpdateContact(donorData);

    // Log success
    console.log(`Successfully processed donation for: ${donorData.email}`);

    // Return success response to WinRed
    res.status(200).json({
      success: true,
      message: 'Donation processed successfully',
      contactId: contactId
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
