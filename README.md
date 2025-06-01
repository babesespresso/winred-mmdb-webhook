# WinRed to GoHighLevel Webhook Integration

This webhook integration automatically syncs donation data from WinRed to GoHighLevel CRM.

## Features

- ✅ Automatic contact creation/update in GoHighLevel
- ✅ Real-time donation data sync
- ✅ Secure API key management
- ✅ Error handling and logging
- ✅ Deployed on Vercel for reliability

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- Vercel account
- GoHighLevel API access
- WinRed account with webhook access

### Environment Variables

Create a `.env.local` file with the following variables:

```
GHL_API_KEY=your_gohighlevel_api_key
GHL_LOCATION_ID=your_location_id
WINRED_WEBHOOK_SECRET=your_webhook_secret
```

### Deployment

1. Clone this repository
2. Install dependencies: `npm install`
3. Deploy to Vercel: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Webhook Configuration

Configure your WinRed webhook to point to:
```
https://your-deployment-url.vercel.app/api/webhook
```

## Data Mapping

The webhook maps the following fields from WinRed to GoHighLevel:

- First Name
- Last Name
- Email (required)
- Phone
- Donation Amount
- Campaign Name
- Donation Date
- Source (marked as "WinRed")

## Security

- API keys are stored as environment variables
- Webhook only accepts POST requests
- All sensitive data is handled server-side

## Support

For issues or questions, please open an issue in this repository.
