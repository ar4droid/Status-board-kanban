# Digital Marketing Operations Board

An iridescent, transparent kanban board for managing digital marketing operations with Office 365 integration.

## Features

- 🎨 **Iridescent Glass-Morphic Design** - Beautiful green-to-gold-to-purple gradient with transparency effects
- 🎯 **Drag & Drop** - Intuitive card movement between columns
- 📊 **Visual Metrics** - Integrated charts and progress indicators
- 🔄 **Real-time Updates** - Live board updates
- 🔐 **Office 365 Integration** - (Coming soon) Sync with Microsoft Tasks and Planner

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @hello-pangea/dnd
- **Authentication**: (To be added) NextAuth.js with Azure AD

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Status-board-kanban
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
Status-board-kanban/
├── app/
│   ├── globals.css       # Global styles with Tailwind
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page with board data
├── components/
│   ├── KanbanBoard.tsx   # Main kanban board component
│   └── KanbanCard.tsx    # Individual card component
├── public/               # Static assets
└── package.json
```

## Deployment to VPS

### Build for Production

```bash
npm run build
npm start
```

### VPS Setup (Ubuntu/Debian)

1. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2** (Process Manager):
```bash
sudo npm install -g pm2
```

3. **Clone and Setup**:
```bash
git clone <your-repo-url> /var/www/kanban
cd /var/www/kanban
npm install
npm run build
```

4. **Start with PM2**:
```bash
pm2 start npm --name "kanban-board" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx** (create `/etc/nginx/sites-available/kanban`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable site and SSL**:
```bash
sudo ln -s /etc/nginx/sites-available/kanban /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

## Office 365 Integration (Coming Soon)

To integrate with Office 365:

1. Register an app in [Azure Portal](https://portal.azure.com)
2. Configure API permissions for Microsoft Graph
3. Add credentials to `.env` file
4. Implement authentication flow

## Customization

### Colors

The iridescent gradient can be customized in `components/KanbanBoard.tsx`:

```tsx
// Main gradient
from-emerald-500/20 via-amber-500/20 to-purple-600/20

// Board overlay
from-emerald-400/10 via-amber-400/10 to-purple-500/10
```

### Columns

Modify the columns in `app/page.tsx` by editing the `initialData` array.

## License

ISC

## Support

For issues and questions, please open a GitHub issue.
