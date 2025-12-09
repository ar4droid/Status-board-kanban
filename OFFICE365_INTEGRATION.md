# Office 365 Integration Guide

Guide for integrating the Kanban Board with Office 365 / Microsoft 365.

## Overview

This kanban board can be integrated with:
- **Microsoft Planner** - Sync tasks with Planner boards
- **Microsoft To Do** - Personal task management
- **SharePoint Lists** - Custom task lists
- **Microsoft Teams** - Team collaboration

## Prerequisites

1. Microsoft 365 subscription with admin access
2. Azure Active Directory (Azure AD) tenant
3. Permission to register applications in Azure Portal

## Setup Azure AD Application

### Step 1: Register Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: Kanban Board
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: `https://your-domain.com/api/auth/callback/azure-ad`
5. Click **Register**

### Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add these permissions:
   - `User.Read` - Read user profile
   - `Tasks.ReadWrite` - Read and write tasks
   - `Group.Read.All` - Read all groups (for Planner)
   - `Tasks.ReadWrite.Shared` - Read and write shared tasks
   - Optional: `Calendars.ReadWrite` for calendar integration

4. Click **Add permissions**
5. Click **Grant admin consent** (requires admin rights)

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "Kanban Board Production"
4. Choose expiration: 24 months (recommended)
5. Click **Add**
6. **IMPORTANT**: Copy the secret value immediately (you won't see it again)

### Step 4: Get Application IDs

Note down these values from the **Overview** page:
- **Application (client) ID**
- **Directory (tenant) ID**

## Configure Application

### Update Environment Variables

Add these to your `.env` file:

```env
# Azure AD Configuration
AZURE_CLIENT_ID=your_application_client_id
AZURE_CLIENT_SECRET=your_client_secret_value
AZURE_TENANT_ID=your_tenant_id

# Microsoft Graph API
MICROSOFT_GRAPH_API_URL=https://graph.microsoft.com/v1.0

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

### Install Required Packages

```bash
npm install next-auth @azure/msal-node @microsoft/microsoft-graph-client
npm install --save-dev @types/microsoft-graph
```

## Implementation

### Step 1: Configure NextAuth

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import AzureADProvider from 'next-auth/providers/azure-ad'

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      tenantId: process.env.AZURE_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email User.Read Tasks.ReadWrite Group.Read.All offline_access'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
})

export { handler as GET, handler as POST }
```

### Step 2: Create Microsoft Graph Client

Create `lib/microsoft-graph.ts`:

```typescript
import { Client } from '@microsoft/microsoft-graph-client'

export function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    }
  })
}

export async function getUserTasks(accessToken: string) {
  const client = getGraphClient(accessToken)

  try {
    const tasks = await client
      .api('/me/todo/lists/tasks/tasks')
      .get()

    return tasks.value
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export async function createTask(accessToken: string, task: any) {
  const client = getGraphClient(accessToken)

  const newTask = {
    title: task.title,
    body: {
      content: task.description,
      contentType: 'text'
    },
    importance: 'normal'
  }

  try {
    const createdTask = await client
      .api('/me/todo/lists/tasks/tasks')
      .post(newTask)

    return createdTask
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export async function updateTask(accessToken: string, taskId: string, updates: any) {
  const client = getGraphClient(accessToken)

  try {
    const updatedTask = await client
      .api(`/me/todo/lists/tasks/tasks/${taskId}`)
      .patch(updates)

    return updatedTask
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}
```

### Step 3: Add Authentication to Layout

Update `app/layout.tsx`:

```typescript
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### Step 4: Add Sign In Button

Create `components/SignInButton.tsx`:

```typescript
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">
          Welcome, {session.user?.name}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/50 text-white"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('azure-ad')}
      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/50 text-white"
    >
      Sign in with Microsoft
    </button>
  )
}
```

## Sync Tasks with Office 365

### Create API Route for Task Sync

Create `app/api/tasks/sync/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getUserTasks } from '@/lib/microsoft-graph'

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tasks = await getUserTasks(session.accessToken)
    return NextResponse.json({ tasks })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
```

## Integration with Microsoft Planner

For Planner integration, use these Graph API endpoints:

```typescript
// Get all plans
client.api('/me/planner/plans').get()

// Get tasks in a plan
client.api(`/planner/plans/{planId}/tasks`).get()

// Create task in Planner
client.api('/planner/tasks').post({
  planId: 'plan-id',
  bucketId: 'bucket-id',
  title: 'Task title'
})
```

## Testing

### Test Authentication

1. Start your application
2. Click "Sign in with Microsoft"
3. Authorize the requested permissions
4. Verify you're redirected back to the board

### Test Task Sync

1. Create a task in Microsoft To Do
2. Refresh the kanban board
3. The task should appear in the appropriate column

## Security Considerations

1. **Token Security**
   - Store access tokens securely
   - Use refresh tokens for long-lived sessions
   - Never expose tokens in client-side code

2. **API Rate Limits**
   - Microsoft Graph has throttling limits
   - Implement caching where possible
   - Use webhooks for real-time updates

3. **Permissions**
   - Request minimum required permissions
   - Use delegated permissions (not application permissions)
   - Regularly audit granted permissions

## Troubleshooting

### Common Issues

**Error: AADSTS50011 - No reply address configured**
- Solution: Add redirect URI in Azure Portal

**Error: Insufficient privileges**
- Solution: Grant admin consent for API permissions

**Error: Invalid client secret**
- Solution: Regenerate client secret and update .env

### Debug Mode

Enable debug logging:

```typescript
// In your NextAuth configuration
debug: process.env.NODE_ENV === 'development'
```

## Next Steps

1. Implement two-way sync between board and Office 365
2. Add real-time updates using Microsoft Graph webhooks
3. Integrate with Teams for notifications
4. Add calendar integration for task deadlines
5. Implement SharePoint document linking

## Resources

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [NextAuth.js Azure AD Provider](https://next-auth.js.org/providers/azure-ad)
- [Microsoft Graph JavaScript Client](https://github.com/microsoftgraph/msgraph-sdk-javascript)
