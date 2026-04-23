# 🌌 GeoAurora

![GeoAurora Banner](https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80)

**GeoAurora** is a modern, real-time dashboard designed to visualize Earth and space events using data directly from NASA APIs. It serves as an accessible, interactive, and visually stunning platform for space enthusiasts, researchers, and the curious public.

---

## 🎯 The Motive Behind the Project

Our planet does not exist in isolation; it is deeply connected to the dynamic environment of our solar system. The motive behind GeoAurora is to bridge the gap between complex NASA datasets and user-friendly visualization. 

I wanted to create a single, centralized hub where users can effortlessly monitor terrestrial events (like wildfires and earthquakes) alongside cosmic phenomena (like solar flares and near-Earth asteroids). By presenting this data in a sleek, easily digestible format, GeoAurora aims to foster a greater appreciation for Earth sciences and space weather among the general public.

---

## ✨ Key Features

*   🌍 **Earth Events (EONET):** Track natural events like wildfires, severe storms, and volcanoes on interactive maps.
*   ☀️ **Space Weather (DONKI):** Get real-time updates on solar activity, including Solar Flares, Coronal Mass Ejections (CMEs), and high-speed solar winds.
*   🪨 **Near-Earth Objects (NEO):** Monitor approaching asteroids, complete with their estimated size, miss distance, velocity, and hazard classifications.
*   📱 **Fully Responsive:** A custom-built, responsive UI that provides an optimal viewing experience on both desktop and mobile devices.
*   🎨 **Modern UI/UX:** Features a beautiful dark-mode interface styled with Tailwind CSS, utilizing glassmorphism and neon accents.

---

## 🛠️ Technologies Used

This repository contains the frontend application for GeoAurora. It is built using:

*   **React (v18)** - Core UI framework
*   **Vite** - Next-generation frontend tooling and bundler
*   **Tailwind CSS** - Utility-first CSS framework for rapid styling
*   **React Router (v6)** - Client-side routing
*   **Leaflet & React-Leaflet** - Interactive mapping
*   **Axios** - HTTP client for API requests

---

## 🚀 Getting Started (Local Development)

To run the GeoAurora frontend locally on your machine, follow these steps:

### Prerequisites
*   Node.js installed on your machine.
*   The **GeoAurora-Backend** running locally (or configured to point to the production backend).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/geoaurora-frontend.git
   cd geoaurora-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Configuration
By default, the application is configured to look for a local backend at `http://127.0.0.1:8000` during development. You can modify this in the `vite.config.js` file if your backend is hosted elsewhere.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
[MIT License](LICENSE) (or specify your preferred license here)
