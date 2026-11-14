# Daily Flirt 💕

A beautiful, interactive web app that provides daily flirty comments for every special day of the year. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **Tear-off calendar**: Every day of the year is a page on a desk calendar pad. Changing the date tears the page away
- **Three flirt levels**: Innocent, Flirty, or Risqué. The colors warm up as the level does
- **Opens on today**: Step day by day with the buttons, the arrow keys, or a swipe, or jump to any date from the month picker
- **Surprise me**: Jump to a random day
- **Copy and share**: Copy the line, or share a link to that day and level
- **Daily photo**: An Unsplash photo for the day, clipped to the pad
- **Responsive and accessible**: Works on phones and desktops, with keyboard focus styles and reduced-motion support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-flirty-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env.local` file with:

```bash
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

This key is now read only on the server through `src/app/api/unsplash/route.ts`. Do not use `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Bodoni Moda and Schibsted Grotesk, self-hosted via Fontsource
- **UI Effects**: Animated shader background, tear-off page animation
- **Data**: JSON file with flirty comments

## 📱 Usage

1. **Pick a date**: Click the month at the top of the pad, or step through days with the buttons, arrow keys, or a swipe
2. **Choose a flirt level**: Innocent, Flirty, or Risqué
3. **Copy or share**: Copy the line, or share a link to it
4. **Surprise me**: Jump to a random day

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy your Daily Flirt app:

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project" and import your repository
4. Add `UNSPLASH_ACCESS_KEY` in Project Settings → Environment Variables
5. Vercel will automatically detect it's a Next.js app with a server runtime
6. Click "Deploy" - that's it!

This app is no longer configured as a static export because hiding the Unsplash key requires a server-side route.

### Other Platforms

- **Netlify**: Also very easy with automatic deployments
- **Railway**: Good for full-stack apps
- **Render**: Simple deployment with free tier

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

---

## 🚀 **Ready to Deploy!**

Your Daily Flirt app is ready for the world! 

### **Quick Deploy to Vercel:**
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repository
4. Click "Deploy" - you'll have a live URL in minutes!

### **Features Ready:**
- ✨ Tear-off calendar UI
- 🔞 Age-verified graphic content
- 💕 Copy to clipboard functionality
- 🎲 Random comment discovery
- 📱 Fully responsive design
- 🎨 Modern animations and effects

---

Made with 💕 by **LaskoCreative** using Next.js and Tailwind CSS
