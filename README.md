# 🎵 MoodWave — AI Playlist Generator

MoodWave is a fully anonymous, immersive web application that detects your emotional state through a beautiful Liquid Glass interface and uses the Google Gemini AI to generate a personalized playlist tailored perfectly to that mood. No login, no external music API — just pure AI-powered curation.

## ✨ Features

- **Liquid Glass UI**: A premium, responsive interface featuring stunning translucent glass elements and a soft, breathing gradient background.
- **AI-Powered Curation**: Integrates with the **Google Gemini API** (`gemini-2.5-flash`) to intelligently generate 10-song Bollywood playlists complete with artists, genres, and a personalized "vibe note."
- **Immersive Animations**: Smooth transitions, floating orbs, hover effects, and full-page routing powered by **Framer Motion** and custom CSS keyframes.
- **YouTube Integration**: Easily play any recommended track via an automatic YouTube search shortcut.

## 🛠️ Tech Stack

- **Framework**: React 18+ with TypeScript (Vite)
- **Styling**: Tailwind CSS v3 (JIT mode)
- **Animations**: Framer Motion & CSS Keyframes
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter + Playfair Display)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have Node.js and npm installed.

### Installation

1. **Clone the repository** (if you haven't already):
   \`\`\`bash
   git clone <your-repo-url>
   cd moodwave
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up your environment variables**:
   Create a \`.env\` file in the root of the project directory. You will need a Google Gemini API key, which you can get from [Google AI Studio](https://aistudio.google.com/).
   
   Add your API key to the \`.env\` file:
   \`\`\`env
   VITE_GEMINI_API_KEY=your_actual_key_here
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open the app**:
   Navigate to \`http://localhost:5173\` in your browser to start generating playlists!

## 📂 Project Structure

- \`src/components/\`: UI components like MoodOrbs, Header, LoadingPulse, and Playlist views.
- \`src/hooks/\`: Custom React hooks, including \`useGemini.ts\` for the API integration.
- \`src/utils/\`: Configurations and constants like mood definitions.
- \`src/types/\`: TypeScript interfaces for strong typing.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is open-source and available under the MIT License.
