import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import './AnimeBarChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const sourceDefinitions = {
  Manga: {
    items: ['Manga', 'Digital manga', '4-koma manga', 'Web manga'],
    description:
      'Many anime are adapted from manga, which are Japanese comic books or graphic novels. "Manga" can appear in several formats: traditional print manga sold in books and magazines; digital manga designed for online reading; 4-koma manga, which are short, four-panel comic strips often used for humor; and web manga, which are self-published or officially serialized comics released on the internet. Manga is one of the most common sources for anime stories, ranging across genres from action and fantasy to romance and slice of life.',
    link: 'https://en.wikipedia.org/wiki/Manga',
    // image: process.env.PUBLIC_URL  '/images/manga_example.jpg'
  },
  Original: {
    description:
      '"Original" anime are not based on any pre-existing material like books, manga, or games. Instead, they are created entirely for television or film by anime studios and writers. Since there is no source material, original anime can be highly unpredictable in terms of story and character development. They offer fresh narratives that are crafted directly for the anime format, sometimes leading to more creative storytelling but also carrying a risk of inconsistent pacing or endings.',
    link: 'https://en.wikipedia.org/wiki/Original_anime',
    // image: process.env.PUBLIC_URL  '/images/original_example.jpg'
  },
  Novel: {
    items: ['Novel', 'Light novel', 'Visual novel'],
    description:
      'Novels are longer prose works, often aimed at a general or adult audience. Most common novels are Light novels, which are shorter, more accessible books often targeted at young adults, typically featuring anime-style illustrations and fast-paced storytelling. Many popular anime start from light novels that already have a strong fan following.',
    link: 'https://en.wikipedia.org/wiki/Light_novel',
    // image: process.env.PUBLIC_URL  '/images/novel_example.jpg'
  },
  Game: {
    items: ['Game', 'Card game', 'Visual novel'],
    description:
      "Some anime are adapted from video games or card games. These might expand on a game's storyline, deepen character backgrounds, or reimagine the gameplay as a full narrative. Popular examples include role-playing games (RPGs), fighting games, or collectible card games that already have built-in worlds and lore. Game-based anime sometimes aim to promote the original game while offering standalone entertainment. Games also include visual novels, where players read a story and make choices that affect the outcome.",
    link: 'https://en.wikipedia.org/wiki/Adaptation_(arts)#Anime',
    // image: process.env.PUBLIC_URL  '/images/game_example.jpg'
  },
  Other: {
    items: ['Unknown', 'Music', 'Radio', 'etc.'],
    description:
      'This category covers anime based on unusual or less common sources, such as radio shows, public service announcements, short stories, or even completely unknown sources. Some anime are adapted from scripts that were performed live on the radio, while others might be inspired by promotional materials or one-off creative projects.',
    link: 'https://en.wikipedia.org/wiki/Media_mix',
    // image: process.env.PUBLIC_URL  '/images/other_example.jpg'
  },
  Book: {
    items: ['Book', 'Picture book'],
    description:
      "This refers to anime adapted from books that aren't traditional novels. Examples include children's picture books, illustrated storybooks, or non-fiction works. These source materials tend to have simpler plots and imagery, leading to anime that might be aimed at younger audiences or that have a very artistic, whimsical feel.",
    link: 'https://en.wikipedia.org/wiki/Japanese_novel',
    // image: process.env.PUBLIC_URL  '/images/book_example.jpg'
  },
  Music: {
    items: ['Music'],
    description:
      "Some anime are created as visual accompaniments to a song or musical track, often in the form of anime music videos (AMVs) or short projects. These are usually tied to a specific musical work rather than a full narrative. They might feature original songs by music artists, Vocaloid productions, or concept projects where the animation and music are closely integrated. Instead of adapting a long story, these anime focus on creating a visual experience that complements the music.",
    link: 'https://en.wikipedia.org/wiki/Japanese_novel',
    // image: process.env.PUBLIC_URL  '/images/book_example.jpg'
  }
};


const AnimeBarChart = ({ selectedState, setAllStates }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    const states = new Set();
    const counts = {};

    Papa.parse(`${process.env.PUBLIC_URL}/cleaned_usa_data.csv`, {
      download: true,
      header: true,
      chunk: ({ data: rows }) => {
        rows.forEach(r => {
          if (r.state) {
            states.add(r.state);
          }
          if (r.state === selectedState) {
            const src = r.source || 'Unknown';
            counts[src] = (counts[src] || 0) + 1;
          }
        });
      },
      complete: () => {
        // populate dropdown list of states (branch1 behavior)
        setAllStates([...states]);

        // build chart
        const labels = Object.keys(counts);
        const values = labels.map(l => counts[l]);
        setChartData({
          labels,
          datasets: [{
            label: 'Anime Count by Source',
            data: values,
            backgroundColor: 'rgba(100,100,255,0.6)'
          }]
        });
      },
      error: (err) => console.error('CSV load error:', err),
    });
  }, [selectedState, setAllStates]);


  const styledData = chartData && {
    labels: chartData.labels,
    datasets: [{
      ...chartData.datasets[0],
      // borderColor and width arrays per‐bar:
      borderColor: chartData.labels.map(
        label => label === selectedSource ? 'black' : 'rgba(100,100,255,0.6)'
      ),
      borderWidth: chartData.labels.map(
        label => label === selectedSource ? 3 : 0
      )
    }]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false }
    },
    onClick: (evt, elements) => {
      if (elements.length) {
        // elements[0].index is the bar index clicked
        const idx = elements[0].index;
        setSelectedSource(styledData.labels[idx]);
      }
    },
    // (keep any other options you already had)
  };

  return (
    <div className="chart-container">
      <h3>Anime Count by Source</h3>
      {selectedSource ? (
      <div className="source-def-selected">
        <h4>{selectedSource}</h4>
        <p>{sourceDefinitions[selectedSource].description}</p>
        <a href={sourceDefinitions[selectedSource].link}
          target="_blank" rel="noopener noreferrer">
          Learn more
        </a>
      </div>
      ) : (
        <p className="source-def-selected">

        </p>
      )}
      {chartData
      ? <Bar data={styledData} options={chartOptions} />
      : <p>Loading...</p>}

<p className="source-def-selected">
    Curious about the Anime sources? Select the bars to find out more!
  </p>
    </div>
  );
};

export default AnimeBarChart;