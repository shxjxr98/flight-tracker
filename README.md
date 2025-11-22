# ✈️ FlightTracker

A modern, real-time flight tracking web application built with Next.js and the AviationStack API.

![FlightTracker Screenshot](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

## 🌟 Features

- **Real-time Flight Data**: Search for any flight by flight number (e.g., BA11, AA100)
- **Live Status Updates**: Get current flight status (On Time, Delayed, Cancelled)
- **Route Information**: View departure and arrival airports with IATA codes
- **Flight Schedule**: See departure and arrival times with timezone information
- **Responsive Design**: Fully optimized for mobile and desktop devices
- **Dark Mode**: Beautiful dark theme for comfortable viewing

## 🚀 Live Demo

Visit the live application: [FlightTracker on Vercel](https://ancient-triangulum.vercel.app)

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with custom design system
- **API**: [AviationStack](https://aviationstack.com/) for real-time flight data
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/shxjxr98/flight-tracker.git
cd flight-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your AviationStack API key:
```env
AVIATIONSTACK_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 Getting an API Key

1. Sign up for a free account at [AviationStack](https://aviationstack.com/)
2. Navigate to your dashboard to get your API key
3. Add the key to your `.env.local` file

## 📱 Usage

1. Enter a flight number in the search box (e.g., `BA11`, `AA100`, `LH400`)
2. Click "Track Flight" or press Enter
3. View real-time flight information including:
   - Airline and flight number
   - Current status
   - Departure and arrival airports
   - Scheduled times

## 🎨 Design Features

- **Modern UI**: Clean, minimalist interface with smooth animations
- **Mobile-First**: Optimized font sizes and layouts for mobile devices
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Performance**: Optimized build with Next.js static generation

## 🏗️ Project Structure

```
flight-tracker/
├── app/
│   ├── actions.ts          # Server actions for API calls
│   ├── globals.css         # Global styles and responsive design
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main flight search page
├── public/                 # Static assets
└── .env.local             # Environment variables (not in repo)
```

## 🚢 Deployment

This app is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the `AVIATIONSTACK_API_KEY` environment variable
4. Deploy!

## 📄 License

This project is open source and available under the MIT License.

## 📂 GitHub Repository

**Repository**: [https://github.com/shxjxr98/flight-tracker](https://github.com/shxjxr98/flight-tracker)

### Quick Links
- 🌐 [Live Demo](https://ancient-triangulum.vercel.app)
- 📝 [Issues](https://github.com/shxjxr98/flight-tracker/issues)
- 🔀 [Pull Requests](https://github.com/shxjxr98/flight-tracker/pulls)

### Repository Stats
![GitHub stars](https://img.shields.io/github/stars/shxjxr98/flight-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/shxjxr98/flight-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/shxjxr98/flight-tracker)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js and AviationStack API
