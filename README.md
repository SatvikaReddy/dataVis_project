# 📊 dataVis_project

This project is an interactive data visualization application built with **React**, **Chart.js**, and **PapaParse**. It visualizes anime-related data using bar charts, line charts, area charts, and scatterplots. The app is designed to explore trends and patterns in anime datasets interactively.

---

## 🚀 Getting Started

To run the app locally, follow the steps below:

### 🔧 Setup Instructions

```bash
# Step 1: Clone the project
git clone https://github.com/SatvikaReddy/dataVis_project.git

# Step 2: Navigate to the anime-chart folder
cd dataVis_project/anime-chart

# Step 3: Unzip the data into public folder
unzip ../viz_data.zip -d ./public/
mv public/viz_data/* public/
rm -r public/viz_data/

# Step 4: Install required dependencies
npm install react-chartjs-2 chart.js papaparse d3

# Step 5: Start the development server
npm start

# Step 6: Open your browser
http://localhost:3000
```

---


## 🔍 Overview of Submission

This submission includes:

- **Project Code**: All code inside the `anime-chart/src/` folder is original and was written as part of this submission. This includes React components, visualization logic, and styling.
- **Data** - Data was too large to be unzipped via Github pages so we are accessing it via a google drive link - [Data](https://drive.google.com/drive/u/1/folders/1VZAVJwp_Wc0cnx0ltY9swUTs-X3OtCsu)
- **Libraries Used**:
  - [`React`](https://reactjs.org/): Front-end UI framework
  - [`Chart.js`](https://www.chartjs.org/) & [`react-chartjs-2`](https://react-chartjs-2.js.org/): For rendering charts
  - [`PapaParse`](https://www.papaparse.com/): For parsing CSV data
  - [`D3.js`](https://d3js.org/): Used for custom map-based heatmap rendering
- **Project Website**: [🌐 Live Demo]( https://SatvikaReddy.github.io/dataVis_project/)
- **Screencast Video**: [🎥 Watch the Demo](https://youtu.be/zkdvjr2EH7Y)


## 🧠 Non-Obvious Features

- **State-Based Filtering**: Dropdown for U.S. states dynamically updates all visualizations.
- **Interactive Heatmap**: Users can select a state by clicking on the map, this also changes the dropdown.
- **Anchored Navbar**: Navigation links smoothly scroll to individual charts.
- **Dropdown Grouping**: Chart types are grouped in a dropdown for cleaner UI.
- **BarChart Info**: If you click on the bars of the barchart you will get more information.


## 📁 Project Structure

```
dataVis_project/
└── anime-chart/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── AnimeBarChart.jsx
    │   │   ├── AnimeLineChart.jsx
    │   │   ├── AnimeAreaChart.jsx
    │   │   ├── AnimeScatterPlot.jsx
    │   │   └── ...
    │   ├── App.jsx
    │   ├── index.js
    │   └── styles/
    └── package.json
```

---

## 📦 Dependencies

```
React
Chart.js
react-chartjs-2
PapaParse
```

---

## 🎯 Features

```
📊 Interactive bar, line, area, and scatter plots
📂 CSV parsing and dynamic updates
⚡ Real-time filtering by country or category
💻 Responsive and modular design
```

---

## 💡 Future Enhancements

```
- Filter by genre, release year, or studio
- Enhance tooltips and transitions
- Add option to upload CSV files
- Export visualizations as images
```
