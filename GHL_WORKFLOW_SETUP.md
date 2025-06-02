# 🎯 GOHIGHLEVEL WORKFLOW CONFIGURATION GUIDE

## ✅ GREAT NEWS - DATA IS FLOWING CORRECTLY!

Your webhook is working perfectly! The data you showed proves:
- ✅ Webhook sends clean, formatted data to GoHighLevel
- ✅ GoHighLevel receives the data successfully
- ✅ All fields are available for mapping

## 🔧 THE MISSING PIECE: WORKFLOW ACTIONS

Your GoHighLevel workflow is **receiving the data** but has **no actions configured** to create contacts.

## 📋 STEP-BY-STEP WORKFLOW SETUP

### **Step 1: Go to Your Workflow**
1. **Login to GoHighLevel**
2. **Navigate to**: Automation → Workflows
3. **Find your webhook workflow** (the one with the inbound webhook trigger)

### **Step 2: Add Contact Creation Action**

**Click "+ Add Action" and configure:**

#### **Action Type: Create/Update Contact**
- **Action**: Create/Update Contact
- **Location**: Select your location

#### **Field Mapping (Use these exact values):**
- **First Name**: `{{firstName}}`
- **Last Name**: `{{lastName}}`
- **Email**: `{{email}}`
- **Phone**: `{{phone}}`
- **Source**: `{{source}}`

#### **Custom Fields (if you have them created):**
- **Donation Amount**: `{{donationAmount}}`
- **Campaign Name**: `{{campaignName}}`
- **Donation Date**: `{{donationDate}}`
- **Transaction ID**: `{{transactionId}}`
- **Platform**: `{{platform}}`

### **Step 3: Add Additional Actions (Optional)**

#### **Add Tags Action:**
- **Action**: Add Tags
- **Tags**: "WinRed Donor", "Scott Bottoms Supporter"

#### **Send Email Action:**
- **Action**: Send Email
- **Template**: Thank you email for donors
- **To**: `{{email}}`

#### **Add to List Action:**
- **Action**: Add to List
- **List**: "WinRed Donors" or "Campaign Supporters"

### **Step 4: Save and Publish**
1. **Click "Save"**
2. **Click "Publish"** (CRITICAL - workflow won't work without this!)
3. **Verify status shows "Active"**

## 🧪 TEST THE COMPLETE WORKFLOW

### **Test 1: Send Test Data**
```bash
curl -X POST https://winred-mmdb-webhook-1w9hejzs1-babesespressos-projects.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "WorkflowTest",
    "email": "john.workflowtest@example.com",
    "phone": "555-999-1234",
    "amount": "50.00",
    "campaign_name": "Scott Bottoms Campaign",
    "created_at": "2024-06-01T12:15:00Z",
    "transaction_id": "WORKFLOW_TEST_456"
  }'
```

### **Test 2: Verify Contact Creation**
1. **Go to GoHighLevel → Contacts**
2. **Search for**: "john.workflowtest@example.com"
3. **Verify**:
   - Contact exists
   - All fields are populated
   - Tags are applied (if configured)
   - Source shows "WinRed"

## 🔍 TROUBLESHOOTING WORKFLOW ISSUES

### **If Contact Still Not Created:**

#### **Check 1: Workflow Status**
- Ensure workflow is **Published** (not just saved)
- Verify status shows **"Active"**

#### **Check 2: Workflow Execution Logs**
- Go to workflow → **Executions** tab
- Look for recent executions
- Check for error messages

#### **Check 3: Field Mapping**
- Verify field names match exactly: `{{firstName}}`, `{{lastName}}`, etc.
- Check that custom fields exist in your GoHighLevel account

#### **Check 4: Contact Permissions**
- Ensure workflow has permission to create contacts
- Check location settings

## 🎯 COMMON WORKFLOW MISTAKES

### **Mistake 1: Not Publishing**
- Saving ≠ Publishing
- Must click **"Publish"** for workflow to be active

### **Mistake 2: Wrong Field Names**
- Use `{{firstName}}` not `{{first_name}}`
- Field names are case-sensitive

### **Mistake 3: Missing Contact Creation Action**
- Workflow trigger alone doesn't create contacts
- Must add **"Create/Update Contact"** action

### **Mistake 4: Location Issues**
- Ensure correct location is selected
- Contact creation must be in the right location

## 📊 EXPECTED WORKFLOW STRUCTURE

```
Trigger: Inbound Webhook
├── Action 1: Create/Update Contact
│   ├── First Name: {{firstName}}
│   ├── Last Name: {{lastName}}
│   ├── Email: {{email}}
│   ├── Phone: {{phone}}
│   └── Source: {{source}}
├── Action 2: Add Tags (Optional)
│   └── Tags: "WinRed Donor"
└── Action 3: Send Email (Optional)
    └── Template: Thank you email
```

## 🏆 SUCCESS INDICATORS

After configuring the workflow correctly, you should see:
- ✅ **New contacts** appearing in GoHighLevel
- ✅ **All fields populated** with donation data
- ✅ **Tags applied** (if configured)
- ✅ **Workflow execution logs** showing successful runs

## 🚨 CRITICAL REMINDER

**The webhook is working perfectly!** The only missing piece is configuring your GoHighLevel workflow to actually **DO SOMETHING** with the data it receives.

Once you add the "Create/Update Contact" action and publish the workflow, contacts will start appearing in your GoHighLevel dashboard immediately!
