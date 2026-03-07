🌙 Yaya Sleep

Yaya Sleep is a personalized web application (mainly made for my girlfriend) designed to track sleep patterns, analyze statistical data, and improve sleep hygiene. Built with a modern tech stack, the application focuses on performance, reliability, and an intuitive user experience.
🚀 Tech Stack

    - Frontend: React (Vite)

    - Backend & Database: Supabase (PostgreSQL)

    - Authentication: Google OAuth

    - Deployment: Vercel (CI/CD integration)

    - Formatting: Intl.DateTimeFormat for localization

📋 Key Features

1.  Sleep Management

    Sleep Logging: Simple interface to input bedtime and wake-up times.

    Automated Calculations: Automatically computes total sleep duration in hours and minutes.

    Dynamic Sync: Real-time UI updates using React Context API, ensuring data is always fresh without manual page refreshes.

2.  Analytics & Statistics

    History Logs: A chronological list of sleep records.

    Smart Insights:

        - Average Sleep: Calculates average duration across the entire history.

        - Personal Best: Tracks the longest sleep duration as a motivational milestone.

    Visual Feedback:

        - Color-coded badges for sleep quality (Red for <6h, Green for 8h+).

        - Random motivational messages for hitting the 8-hour goal.

3.  User Experience (UX)

    Personalization: Displays a warm greeting using the user's Google account name.

    Localized Formatting: Elegant date and weekday representation using Intl.DateTimeFormat.

    Mobile-First: Fully responsive design, optimized for use as a "pocket" sleep tracker.

🛠 Installation & Development

To work on the project locally:

    Clone the repository:
    git clone <your-repo-link>

    Install dependencies:
    npm install

    Configure environment variables:
    Create a .env file in the root directory:

    Run in development mode:
    npm run dev -- --host

📦 Deployment

The project is optimized for automated deployment via Vercel.

    Every git push to the main branch triggers an automated build and deployment.

    Ensure you add your production URL to the Supabase Auth Redirect URLs configuration to maintain OAuth functionality.
