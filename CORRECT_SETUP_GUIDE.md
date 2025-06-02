# 🎯 CORRECT WEBHOOK SETUP - CRITICAL CONFIGURATION

## ❌ WHAT YOU DID WRONG

You put the **GoHighLevel URL directly in WinRed**. This bypasses our webhook transformation!

**Wrong Configuration:**
- WinRed → GoHighLevel directly
- No data transformation
- No field mapping
- Raw WinRed data format

## ✅ CORRECT CONFIGURATION

### **Step 1: Use the Vercel URL in WinRed**

**In WinRed webhook configuration, use THIS URL:**
```
https://winred-mmdb-webhook-1w9hejzs1-babesespressos-projects.vercel.app/api/webhook
```

**NOT the GoHighLevel URL!**

### **Step 2: How It Should Work**

```
WinRed → Vercel Webhook → GoHighLevel Inbound Webhook → Contact Creation
```

1. **WinRed** sends raw donation data to **Vercel webhook**
2. **Vercel webhook** transforms and cleans the data
3. **Vercel webhook** forwards clean data to **GoHighLevel**
4. **GoHighLevel workflow** creates contact with clean data

## 🔧 IMMEDIATE ACTION REQUIRED

### **Fix WinRed Configuration:**

1. **Login to WinRed**
2. **Go to Utilities → Integrations**
3. **Find your webhook integration**
4. **CHANGE the URL from:**
   ```
   https://services.leadconnectorhq.com/hooks/aOaqJlyUINf9VfPvp0hw/webhook-trigger/eqXnc4XunLFIZ1Hdr5PW
   ```
   **TO:**
   ```
   https://winred-mmdb-webhook-1w9hejzs1-babesespressos-projects.vercel.app/api/webhook
   ```
5. **Save the configuration**

### **Your GoHighLevel Workflow Should:**

1. **Have an Inbound Webhook trigger with URL:**
   ```
   https://services.leadconnectorhq.com/hooks/aOaqJlyUINf9VfPvp0hw/webhook-trigger/eqXnc4XunLFIZ1Hdr5PW
   ```

2. **Map these clean fields (that our webhook sends):**
   - `{{firstName}}` → Contact First Name
   - `{{lastName}}` → Contact Last Name
   - `{{email}}` → Contact Email
   - `{{phone}}` → Contact Phone
   - `{{donationAmount}}` → Custom Field
   - `{{campaignName}}` → Custom Field
   - `{{source}}` → Contact Source

## 🧪 TEST THE CORRECT SETUP

### **Test 1: Test the Vercel Webhook**
```bash
curl -X POST https://winred-mmdb-webhook-1w9hejzs1-babesespressos-projects.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "Correct",
    "email": "test.correct@example.com",
    "phone": "555-123-4567",
    "amount": "25.00",
    "campaign_name": "Scott Bottoms Campaign",
    "created_at": "2024-06-01T12:00:00Z",
    "transaction_id": "CORRECT_TEST_123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Donation data forwarded to GoHighLevel successfully",
  "timestamp": "2025-06-01T12:00:00.000Z"
}
```

### **Test 2: Check GoHighLevel**
After the test above:
1. Go to **GoHighLevel → Contacts**
2. Search for **"test.correct@example.com"**
3. Verify the contact was created with all fields

## 🚨 WHY THIS MATTERS

### **With Direct GoHighLevel URL (Wrong):**
- WinRed sends raw, messy data
- Field names don't match GoHighLevel expectations
- No data transformation or cleaning
- Workflow can't map fields properly

### **With Vercel Webhook (Correct):**
- WinRed sends data to our webhook
- Webhook transforms data to clean format
- Clean data sent to GoHighLevel
- Workflow can easily map all fields

## 📋 VERIFICATION CHECKLIST

- [ ] WinRed webhook URL changed to Vercel URL
- [ ] GoHighLevel workflow has correct inbound webhook URL
- [ ] GoHighLevel workflow has field mapping configured
- [ ] Test webhook responds successfully
- [ ] Test contact appears in GoHighLevel
- [ ] All fields are populated correctly

## 🎯 SUMMARY

**The key issue:** You were sending WinRed data directly to GoHighLevel, bypassing our data transformation webhook.

**The solution:** Use the Vercel webhook URL in WinRed, which will transform the data and forward it to GoHighLevel in the correct format.

**After fixing this, your integration will work perfectly!**
