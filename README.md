# BTWT Daily Digest

A React + Vite web app that transforms messy daily notes into polished Discord status updates for team leaders using Claude AI.

## Features

- **Brain dump interface**: Paste raw notes without worrying about formatting
- **AI-powered transformation**: Claude cleans up notes into structured updates
- **Discord preview**: See exactly how your message will look
- **One-click copy**: Copy formatted message directly to clipboard
- **Dark theme**: GitHub-inspired design optimized for night work

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com/account/keys))

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd btwt-daily-digest
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage

1. Enter today's date (auto-filled)
2. Enter hours worked
3. Paste your raw notes (messy is fine!)
4. Click "Format for Nicole →"
5. Copy the formatted message
6. Paste into Discord

### Example Input
```
1810 Waco - ordered termite, waiting on report
1404 N 18th - sent what's next email to seller, they need to respond by Friday
social media - three templates done, posting schedule set for next week
Lofty migration - halfway through contacts
901 68th Ln - emailed listing agent re: mouse issue, no response yet
```

### Example Output
```
6/17/26 - 5 hours

• 1810 Waco: Ordered termite inspection — waiting on report
• 1404 N 18th: Sent next steps email to seller — awaiting response by Friday
• Social media: Completed three templates — posting schedule set for next week
• Lofty migration: Processed contacts — halfway through
• 901 68th Ln: Emailed listing agent about mouse issue — no response yet
```

## Deployment

### Railway (Recommended)

1. Push your repository to GitHub
2. Create Railway account at [railway.app](https://railway.app)
3. Create new project → GitHub → Select repository
4. Add environment variable:
   - `VITE_ANTHROPIC_API_KEY` = your API key
5. Railway auto-deploys on push
6. Access at `your-app.railway.app`

### Vercel

1. Push your repository to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable:
   - `VITE_ANTHROPIC_API_KEY` = your API key
4. Deploy

### Docker

```bash
docker build -t btwt-daily-digest .
docker run -p 3000:3000 \
  -e VITE_ANTHROPIC_API_KEY="your_api_key" \
  btwt-daily-digest
```

## Project Structure

```
btwt-daily-digest/
├── src/
│   ├── App.jsx          # Main component
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── .env.example         # Environment template
└── index.html           # HTML template
```

## Building & Testing Locally

### Development
```bash
npm run dev          # Start dev server with HMR
npm run lint         # Check code style
```

### Production Build
```bash
npm run build        # Build optimized bundle
npm run preview      # Preview production build
```

The build output is in the `dist/` directory, ready for deployment.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | Yes | API key from Anthropic console |

**Note**: Variables prefixed with `VITE_` are exposed to the browser. Never commit `.env.local` to version control.

## Architecture

- **Frontend**: React 19 + Vite
- **Styling**: Inline CSS (no dependencies)
- **AI**: Anthropic Claude API (Sonnet 4.6 model)
- **Package Manager**: npm
- **Build Tool**: Vite (fast HMR, optimized production builds)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not configured" | Copy `.env.example` to `.env.local` and add your key |
| Deployment fails on Railway | Ensure `VITE_ANTHROPIC_API_KEY` is set in Railway Variables |
| Build errors | Run `npm install` to ensure all dependencies are installed |
| API rate limit | Wait a few minutes between requests; upgrade Anthropic plan if needed |

## Development Notes

- Component is fully self-contained with inline styles
- No external CSS files or component libraries
- API calls use standard Fetch API
- Error handling includes user-friendly messages
- Loading states show spinner animation

## Future Enhancements

- [ ] Multiple output formats (Slack, email, etc.)
- [ ] Custom templates for different teams
- [ ] Multi-language support
- [ ] Browser localStorage for note history
- [ ] Keyboard shortcuts (Cmd+Enter to format)

## License

MIT
