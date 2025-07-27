# WhatsApp Account Switching Guide

## Overview

This guide explains how to logout from one WhatsApp account and login with a different one using the enhanced session management features.

## New Features

### 🔄 **Account Switching Capabilities**

#### 1. **Clear Credentials**
- Removes all saved login data
- Forces a fresh login on next initialization
- Allows switching to a different WhatsApp account

#### 2. **Force New Session**
- Clears credentials and immediately starts a new session
- Generates a new QR code for scanning
- Perfect for switching accounts quickly

#### 3. **Enhanced Logout**
- Properly disconnects current session
- Handles connection errors gracefully
- Maintains clean state for next login

## How to Switch WhatsApp Accounts

### Method 1: Using the Frontend (Recommended)

1. **Open the Application**
   ```
   http://localhost:3001
   ```

2. **Current Account Status**
   - Check if you're currently connected
   - Note the phone number displayed

3. **Switch Account Options**

   #### Option A: Clear Credentials + Initialize
   - Click **"Clear Credentials"** (Orange button)
   - Click **"Initialize WhatsApp"** (Green button)
   - Scan the new QR code with the different WhatsApp account

   #### Option B: Force New Session (One-click)
   - Click **"Switch Account"** (Purple button)
   - This automatically clears credentials and starts a new session
   - Scan the new QR code with the different WhatsApp account

### Method 2: Using API Endpoints

#### Step 1: Clear Current Credentials
```bash
curl -X POST http://localhost:3000/api/whatsapp/clear-credentials
```

#### Step 2: Start New Session
```bash
curl -X POST http://localhost:3000/api/whatsapp/force-new-session
```

#### Step 3: Get QR Code
```bash
curl -X GET http://localhost:3000/api/whatsapp/qr-code
```

#### Step 4: Check Status
```bash
curl -X GET http://localhost:3000/api/whatsapp/status
```

## API Endpoints Reference

### New Endpoints

#### Clear Credentials
```bash
POST /api/whatsapp/clear-credentials
```
**Response:**
```json
{
  "message": "Credentials cleared successfully"
}
```

#### Force New Session
```bash
POST /api/whatsapp/force-new-session
```
**Response:**
```json
{
  "message": "New session started successfully"
}
```

### Existing Endpoints

#### Get Status
```bash
GET /api/whatsapp/status
```
**Response:**
```json
{
  "isConnected": false,
  "phone": null
}
```

#### Get QR Code
```bash
GET /api/whatsapp/qr-code
```
**Response:**
```json
{
  "qrCode": "2@..."
}
```

## Step-by-Step Account Switching

### Scenario: Switch from Account A to Account B

1. **Current State**: Connected to Account A (+5511999999999)

2. **Clear Credentials**:
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/clear-credentials
   ```

3. **Verify Disconnection**:
   ```bash
   curl -X GET http://localhost:3000/api/whatsapp/status
   # Should return: {"isConnected": false}
   ```

4. **Start New Session**:
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/force-new-session
   ```

5. **Get QR Code**:
   ```bash
   curl -X GET http://localhost:3000/api/whatsapp/qr-code
   # Should return: {"qrCode": "2@..."}
   ```

6. **Scan with Account B**:
   - Open WhatsApp on the phone with Account B
   - Go to Settings > Linked Devices
   - Scan the QR code

7. **Verify New Connection**:
   ```bash
   curl -X GET http://localhost:3000/api/whatsapp/status
   # Should return: {"isConnected": true, "phone": "Account B number"}
   ```

## Frontend Usage

### WhatsApp Manager Interface

The frontend provides a user-friendly interface with:

- **Status Indicator**: Shows current connection status
- **Phone Number Display**: Shows which account is connected
- **Action Buttons**:
  - **Initialize WhatsApp**: Start a new session
  - **Logout**: Disconnect current session
  - **Clear Credentials**: Remove saved login data
  - **Switch Account**: One-click account switching
  - **Refresh Status**: Update connection status

### Visual Feedback

- **Green Status**: Connected to WhatsApp
- **Red Status**: Disconnected
- **Loading Spinners**: During operations
- **Error Messages**: Clear feedback on failures
- **Success Messages**: Confirmation of actions

## Troubleshooting

### Common Issues

#### 1. **QR Code Not Appearing**
```bash
# Check if credentials are cleared
curl -X GET http://localhost:3000/api/whatsapp/status

# Force clear credentials
curl -X POST http://localhost:3000/api/whatsapp/clear-credentials

# Start new session
curl -X POST http://localhost:3000/api/whatsapp/force-new-session
```

#### 2. **Still Connected to Old Account**
```bash
# Force logout
curl -X POST http://localhost:3000/api/whatsapp/logout

# Clear credentials
curl -X POST http://localhost:3000/api/whatsapp/clear-credentials
```

#### 3. **Connection Errors**
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Debug Commands

#### Check Current State
```bash
# Get connection status
curl -X GET http://localhost:3000/api/whatsapp/status | jq

# Check if QR code is available
curl -X GET http://localhost:3000/api/whatsapp/qr-code | jq
```

#### Reset Everything
```bash
# Clear credentials
curl -X POST http://localhost:3000/api/whatsapp/clear-credentials

# Force new session
curl -X POST http://localhost:3000/api/whatsapp/force-new-session

# Get QR code
curl -X GET http://localhost:3000/api/whatsapp/qr-code
```

## Security Considerations

### Credential Management
- **Local Storage**: Credentials are stored locally in the backend
- **Automatic Cleanup**: Credentials are properly cleared when switching accounts
- **Session Isolation**: Each session is completely independent
- **No Cross-Contamination**: Old credentials don't interfere with new sessions

### Best Practices
1. **Always Clear Credentials** when switching accounts
2. **Use Force New Session** for quick account switching
3. **Verify Status** after switching accounts
4. **Check Backend Logs** if issues occur

## Example Workflows

### Quick Account Switch
```bash
# One command to switch accounts
curl -X POST http://localhost:3000/api/whatsapp/force-new-session
```

### Manual Account Switch
```bash
# Step 1: Clear current account
curl -X POST http://localhost:3000/api/whatsapp/clear-credentials

# Step 2: Initialize new session
curl -X POST http://localhost:3000/api/whatsapp/initialize

# Step 3: Get QR code for new account
curl -X GET http://localhost:3000/api/whatsapp/qr-code
```

### Frontend Workflow
1. Open http://localhost:3001
2. Click "Switch Account" button
3. Scan QR code with new WhatsApp account
4. Verify connection status updates

## Success Indicators

### ✅ **Successful Account Switch**
- Status shows `"isConnected": true`
- Phone number changes to new account
- QR code disappears after successful scan
- No error messages in logs

### ❌ **Failed Account Switch**
- Status remains `"isConnected": false`
- QR code doesn't appear
- Error messages in backend logs
- Frontend shows error notifications

## Next Steps

After switching accounts:
1. **Test Message Sending**: Send a test message to verify the new account
2. **Monitor Logs**: Check for any connection issues
3. **Update Documentation**: Note which account is currently active
4. **Backup Credentials**: If needed for the new account 