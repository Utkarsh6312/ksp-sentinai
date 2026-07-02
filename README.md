# 🛡️ KSP SentinAI - Intelligent Command Center

**KSP SentinAI** is a premium, unified hybrid platform built for the **Hack2Skill Datathon 2026 (Karnataka State Police)**. 

Rather than choosing between the two problem statements, SentinAI merges **Track 1 (Conversational AI)** and **Track 2 (AI-Driven Analytics)** into a single, cohesive Command Center dashboard powered by Zoho Catalyst.

## 🌟 Key Features

### 1. AI-Driven Analytics Dashboard (Track 2)
*   **Live KPI Metrics**: Real-time tracking of Active Cases, Total Arrests, and Heinous Crimes.
*   **Geospatial Crime Heatmap**: Built with `Leaflet.js`, plotting FIR coordinate data (`latitude`, `longitude`) directly onto an interactive map.
*   **Severity Breakdown**: Visualizing the gravity of offences (Heinous vs. Non-Heinous) using `Recharts`.

### 2. Intelligent AI Co-Pilot (Track 1)
*   **Slide-Out Conversational Interface**: A sleek chatbot embedded directly into the dashboard.
*   **Multi-Lingual Support**: Accepts natural language queries in both **English and Kannada**.
*   **Text-to-ZCQL Engine**: Simulates the conversion of natural language into **Zoho Catalyst Query Language (ZCQL)** scripts to query the Data Store on the fly.

### 3. Suspect Network Visualizer
*   **Relationship Mapping**: Utilizes `vis-network` to draw connections between FIRs (Cases), Accused individuals, and Victims based on the official Datathon ER Diagram.

---

## 🛠️ Technology Stack

*   **Frontend Framework**: React 18 + Vite
*   **Styling**: Tailwind CSS v3 (Custom Dark Navy/Gold/Crimson KSP Theme)
*   **Data Visualization**: Recharts, Leaflet, React-Leaflet, Vis-Network
*   **Icons**: Lucide React
*   **Deployment & Hosting**: Zoho Catalyst (Web Client Hosting)

---

## 🚀 Local Development Setup

To run this project locally on your machine:

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd ksp-sentinai
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

4. **View the App**: Open `http://localhost:5173` in your browser.

---

## ☁️ Zoho Catalyst Deployment

This project is strictly configured for deployment on Zoho Catalyst Serverless. 

1. **Build the production assets**:
   ```bash
   npm run build
   ```

2. **Copy to the Catalyst client folder**:
   Move the contents of the generated `dist` folder into the Catalyst `client` directory.
   ```powershell
   Copy-Item -Path .\dist\* -Destination .\client\ -Recurse -Force
   ```

3. **Deploy using the Catalyst CLI**:
   Ensure you are logged into the CLI (`catalyst login`) and run:
   ```bash
   catalyst deploy
   ```
   *Your live Web App URL will be printed in the terminal!*

---

> Built with precision for the **Karnataka State Police Datathon 2026**.
