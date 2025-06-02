# 🔧 TROUBLESHOOTING GUIDE - WinRed to GoHighLevel Webhook

## 🚨 ISSUE: Data Not Appearing in GoHighLevel Dashboard

### 📋 STEP-BY-STEP TROUBLESHOOTING

## 1. ✅ VERIFY WEBHOOK IS RECEIVING DATA

### Test the Webhook Manually
```bash
curl -X POST https://winred-mmdb-webhook-i0yqhz43n-babesespressos-projects.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "Manual",
    "email": "test.manual@example.com",
    "phone": "555-123-4567",
    "amount": "25.00",
    "campaign_name": "Scott Bottoms Campaign",
    "created_at": "2024-06-01T11:30:00Z",
    "transaction_id": "MANUAL_TEST_123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Donation data forwarded to GoHighLevel successfully",
  "timestamp": "2025-06-01T11:30:14.198Z"
}
```

## 2. 🔍 CHECK VERCEL LOGS

### View Real-time Logs
```bash
cd winred-ghl-webhook
vercel logs https://winred-mmdb-webhook-i0yqhz43n-babesespressos-projects.vercel.app
```

### What to Look For:
- ✅ **Incoming requests** from WinRed
- ✅ **Data transformation** logs
- ✅ **GoHighLevel webhook calls**
- ❌ **Error messages** or failed requests

## 3. 🎯 VERIFY GOHIGHLEVEL WORKFLOW SETUP

### Check Your GoHighLevel Workflow:

#### A. Workflow Trigger Configuration
1. **Login to GoHighLevel**
2. **Go to Automation → Workflows**
3. **Find your webhook workflow**
4. **Check the trigger settings:**
   - **Trigger Type**: Inbound Webhook
   - **Webhook URL**: Should be `https://services.leadconnectorhq.com/hooks/aOaqJlyUINf9VfPvp0hw/webhook-trigger/901ef24e-18d2-4685-8a26-11f93683f410`

#### B. Workflow Actions
Ensure you have these actions configured:
1. **Create/Update Contact** (Primary action)
2. **Map the incoming fields:**
   - `{{firstName}}` → Contact First Name
   - `{{lastName}}` → Contact Last Name
   - `{{email}}` → Contact Email
   - `{{phone}}` → Contact Phone
   - `{{donationAmount}}` → Custom Field
   - `{{campaignName}}` → Custom Field
   - `{{source}}` → Contact Source

#### C. Test the Workflow
1. **Go to the workflow**
2. **Click "Test"**
3. **Send sample data**
4. **Verify it creates a contact**

## 4. 🔗 VERIFY WINRED WEBHOOK CONFIGURATION

### Check WinRed Settings:
1. **Login to WinRed**
2. **Go to Utilities → Integrations**
3. **Find your webhook integration**
4. **Verify:**
   - **URL**: `https://winred-mmdb-webhook-i0yqhz43n-babesespressos-projects.vercel.app/api/webhook`
   - **Events**: New Donations, Refunds
   - **Status**: Active/Enabled

### Test WinRed Webhook:
1. **Make a small test donation** ($1)
2. **Check if WinRed sends the webhook**
3. **Monitor Vercel logs for incoming data**

## 5. 🧪 COMMON ISSUES & SOLUTIONS

### Issue 1: Webhook Not Receiving Data from WinRed
**Symptoms:** No logs in Vercel, no activity
**Solutions:**
- ✅ Verify WinRed webhook URL is correct
- ✅ Check WinRed webhook is enabled
- ✅ Confirm events are selected (New Donations)
- ✅ Test with a real donation

### Issue 2: Webhook Receiving Data but GoHighLevel Not Responding
**Symptoms:** Vercel logs show incoming data, but no contact creation
**Solutions:**
- ✅ Verify GoHighLevel webhook URL in code
- ✅ Check GoHighLevel workflow is active
- ✅ Test GoHighLevel workflow manually
- ✅ Check workflow trigger configuration

### Issue 3: Data Format Issues
**Symptoms:** Webhook works but data is malformed
**Solutions:**
- ✅ Check WinRed data format
- ✅ Verify field mapping in webhook code
- ✅ Test with sample WinRed data structure

### Issue 4: GoHighLevel Workflow Not Triggering
**Symptoms:** Webhook sends data but workflow doesn't run
**Solutions:**
- ✅ Check workflow is published/active
- ✅ Verify webhook trigger URL matches code
- ✅ Test workflow with manual trigger
- ✅ Check workflow conditions/filters

## 6. 🔧 DEBUGGING STEPS

### Step 1: Test Webhook Endpoint
```bash
# Test if webhook is responding
curl -X GET https://winred-mmdb-webhook-i0yqhz43n-babesespressos-projects.vercel.app/api/webhook
```
**Expected:** 405 Method Not Allowed (this is correct - only POST allowed)

### Step 2: Test with Sample WinRed Data
```bash
curl -X POST https://winred-mmdb-webhook-i0yqhz43n-babesespressos-projects.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "donor_first_name": "John",
    "donor_last_name": "Donor",
    "donor_email": "john.donor@example.com",
    "donor_phone": "555-987-6543",
    "contribution_amount": "50.00",
    "campaign_name": "Scott Bottoms Campaign",
    "transaction_date": "2024-06-01T11:30:00Z",
    "id": "WR_12345"
  }'
```

### Step 3: Check GoHighLevel Webhook Directly
```bash
curl -X POST https://services.leadconnectorhq.com/hooks/aOaqJlyUINf9VfPvp0hw/webhook-trigger/901ef24e-18d2-4685-8a26-11f93683f410 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Direct",
    "lastName": "Test",
    "email": "direct.test@example.com",
    "phone": "555-111-2222",
    "donationAmount": "10.00",
    "source": "Direct Test"
  }'
```

## 7. 📊 MONITORING & VERIFICATION

### Real-time Monitoring:
```bash
# Monitor Vercel logs
vercel logs https://winred-mmdb-webhook-i0yqhz43n-babesespressos-projects.vercel.app

# Check GoHighLevel contacts
# Go to GoHighLevel → Contacts → Search for test emails
```

### Verification Checklist:
- [ ] Webhook URL is correct in WinRed
- [ ] WinRed webhook is enabled and active
- [ ] Vercel webhook is deployed and responding
- [ ] GoHighLevel workflow is active
- [ ] GoHighLevel webhook URL is correct in code
- [ ] Field mapping is configured in workflow
- [ ] Test donation triggers webhook
- [ ] Contact appears in GoHighLevel

## 8. 🆘 EMERGENCY FIXES

### If Nothing Works:
1. **Recreate GoHighLevel Workflow**
   - Delete current workflow
   - Create new inbound webhook trigger
   - Update webhook URL in code
   - Redeploy

2. **Reset WinRed Integration**
   - Remove current webhook
   - Add new webhook integration
   - Test with small donation

3. **Simplify for Testing**
   - Test GoHighLevel webhook directly
   - Test Vercel webhook with manual data
   - Verify each component separately

## 9. 📞 SUPPORT CONTACTS

### If You Need Help:
- **Vercel Support**: Check deployment status
- **GoHighLevel Support**: Verify webhook trigger setup
- **WinRed Support**: Confirm webhook configuration

---

## 🎯 MOST LIKELY ISSUES

Based on the symptoms (no data in GoHighLevel), the most likely causes are:

1. **GoHighLevel workflow not properly configured**
2. **GoHighLevel webhook URL mismatch**
3. **WinRed not sending webhook data**
4. **Workflow not active/published**

**Start with testing the GoHighLevel workflow manually!**
