# Troubleshooting Guide: WinRed to GoHighLevel Webhook

## Current Issue: Vercel Authentication Protection

Your webhook is currently protected by Vercel authentication, which is preventing WinRed from sending data to it. This is why you're seeing "Authentication Required" when trying to access the webhook.

## Solution: Disable Vercel Authentication

### Option 1: Via Vercel Dashboard (Recommended)

1. **Login to Vercel Dashboard**
   - Go to https://vercel.com
   - Navigate to your project: `winred-mmdb-webhook`

2. **Access Project Settings**
   - Click on your project
   - Go to "Settings" tab
   - Navigate to "Security" or "Authentication" section

3. **Disable Authentication**
   - Look for "Vercel Authentication" or "Password Protection"
   - Turn OFF authentication for the project
   - Save changes

4. **Wait for Changes to Propagate**
   - Changes may take 1-2 minutes to take effect
   - Your webhook should then be publicly accessible

### Option 2: Use Vercel CLI

If you have access to disable authentication via CLI:

```bash
vercel --prod --public
```

## Testing Your Webhook

Once authentication is disabled, test your webhook:

```bash
curl -X POST https://winred-mmdb-webhook-as4tyxpgm-babesespressos-projects.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User", 
    "email": "test@example.com",
    "phone": "555-123-4567",
    "amount": "25.00",
    "campaign_name": "Scott Bottoms Campaign",
    "created_at": "2024-12-01T10:30:00Z"
  }'
```

You should receive a success response like:
```json
{
  "success": true,
  "message": "Donation processed successfully",
  "contactId": "contact_id_here",
  "email": "test@example.com"
}
```

## Monitoring Webhook Activity

After disabling authentication and updating WinRed:

1. **Check Vercel Logs**
   ```bash
   vercel logs --follow
   ```

2. **What to Look For**
   - "Webhook received:" messages
   - "Available fields:" to see WinRed's data structure
   - Any error messages

## Common Issues and Solutions

### 1. Still Getting Authentication Error
- Clear browser cache
- Try accessing in incognito/private mode
- Ensure you saved the authentication settings in Vercel

### 2. Webhook Receives Data but GoHighLevel Fails
- Verify your GoHighLevel API key is correct
- Check that the Location ID matches your GoHighLevel account
- Ensure API key has permissions to create/update contacts

### 3. WinRed Not Sending Data
- Verify webhook URL is exactly: `https://winred-mmdb-webhook-as4tyxpgm-babesespressos-projects.vercel.app/api/webhook`
- Ensure webhook is enabled in WinRed
- Check that you selected the correct events (New Donations)

## Understanding WinRed Data Format

The webhook now logs all incoming fields. When you receive your first real webhook from WinRed, check the logs to see the exact field names they use. The webhook is configured to check multiple possible field names:

- First Name: `first_name`, `donor_first_name`, `firstName`
- Last Name: `last_name`, `donor_last_name`, `lastName`
- Email: `email`, `donor_email`, `donorEmail`
- Phone: `phone`, `donor_phone`, `donorPhone`
- Amount: `amount`, `contribution_amount`, `donationAmount`
- Campaign: `campaign_name`, `campaignName`
- Date: `created_at`, `transaction_date`, `createdAt`

## Next Steps

1. **Disable Vercel Authentication** (most important)
2. **Test with curl command** to verify webhook works
3. **Update WinRed** with the correct webhook URL
4. **Make a test donation** in WinRed
5. **Monitor logs** to see the data flow
6. **Check GoHighLevel** for the new contact

## Need More Help?

- **Vercel Support**: For authentication issues
- **GoHighLevel Support**: For API-related issues
- **WinRed Support**: For webhook configuration

Remember: The main issue right now is Vercel authentication. Once that's disabled, your webhook should work perfectly!
