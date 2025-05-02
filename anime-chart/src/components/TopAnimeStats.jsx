import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './TopAnimeStats.css';

const trophyEmojis = ['🥇', '🥈', '🥉'];

const fallbackDescriptions = {
  'One Piece': 'Many years ago, Woonan, a legendary pirate, plundered one-third of the world\'s gold and stashed it away on his secret island shrouded in mystery. In the present, Luffy and the rest of the Straw Hats continue on their journey to the Grand Line.',
  'InuYasha': 'Kagome Higurashi\'s 15th birthday takes a sudden turn when she is forcefully pulled by a demon into the old well of her family\'s shrine. Brought to the past, when demons were a common sight in feudal Japan, Kagome finds herself persistently hunted by these vile creatures, all yearning for an item she unknowingly carries: the Shikon Jewel, a small sphere holding extraordinary power.',
  'Bleach': 'Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo\'s family from the assailant.'
};


const fallbackImages = {
  'Bleach': 'https://cdn.myanimelist.net/images/anime/3/40451.jpg',
  'InuYasha': 'https://cdn.myanimelist.net/images/anime/4/19644.jpg',
  'One Piece': 'https://cdn.myanimelist.net/images/anime/6/73245.jpg'
};

const TopAnimeStats = ({ selectedState = 'Michigan' }) => {
  const [totalUnique, setTotalUnique] = useState(0);
  const [topAnimes, setTopAnimes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + '/cleaned_usa_data.csv', {
      download: true,
      header: true,
      complete: async (results) => {
        const allData = results.data.filter(row => row.state === selectedState);

        const uniqueTitles = new Set(allData.map(row => row.title));
        setTotalUnique(uniqueTitles.size);

        const animeCounts = {};
        allData.forEach(row => {
          const title = row.title || 'Unknown';
          animeCounts[title] = (animeCounts[title] || 0) + 1;
        });

        const sortedAnimes = Object.entries(animeCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        const animeWithDetails = await Promise.all(
          sortedAnimes.map(async ([title], index) => {
            try {
              const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
              const data = await res.json();
              const entry = data?.data?.[0];

              const imageUrl = entry?.images?.jpg?.image_url || fallbackImages[title] || 'https://via.placeholder.com/60x90?text=No+Image';
              const synopsis = entry?.synopsis
                ? entry.synopsis.split('. ').slice(0, 2).join('. ') + '.'
                : fallbackDescriptions[title] || 'An epic anime adventure awaits!';

              return {
                rank: index + 1,
                title,
                imageUrl,
                synopsis
              };
            } catch {
              return {
                rank: index + 1,
                title,
                imageUrl: fallbackImages[title] || 'https://via.placeholder.com/60x90?text=No+Image',
                synopsis: fallbackDescriptions[title] || 'An epic anime adventure awaits!'
              };
            }
          })
        );

        setTopAnimes(animeWithDetails);

        const userCounts = {};
        allData.forEach(row => {
          const username = row.username || 'Anonymous';
          const total = parseInt(row['Total Entries']) || 0;
          userCounts[username] = Math.max(userCounts[username] || 0, total);
        });

        const sortedUsersRaw = Object.entries(userCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        const sortedUsers = [0, 1, 2].map(index => {
          const entry = sortedUsersRaw[index];
          if (entry) {
            const [username] = entry;
            return {
              rank: index + 1,
              username,
              avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(username)}`
            };
          } else {
            return {
              rank: index + 1,
              username: `Anonymous_${index + 1}`,
              avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=placeholder${index}`
            };
          }
        });

        setTopUsers(sortedUsers);
      }
    });
  }, [selectedState]);

  return (
    <div className="anime-container">
      <div className="anime-left">
        <h3>MOST POPULAR ANIMES</h3>
        {topAnimes.map((anime, idx) => (
          <div key={anime.title} className="anime-entry">
            <span className="emoji-medal">{trophyEmojis[idx]}</span>
            <img src={anime.imageUrl} alt={anime.title} className="anime-img" />
            <div className="anime-info">
              <div className="anime-title-text">{anime.title}</div>
              <div className="anime-description">{anime.synopsis}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="anime-right">
        <div className="unique-circle sparkle">
          <svg width="160" height="160" className="rotating-circle">
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7fbcff" />
                <stop offset="100%" stopColor="#4a91e2" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r="75" fill="url(#circleGradient)" stroke="#fff" strokeWidth="2" />
            <text x="80" y="80" textAnchor="middle" dy="0.3em" fontSize="26" fill="white" fontWeight="bold">
              {totalUnique}
            </text>
            <text x="80" y="100" textAnchor="middle" fontSize="12" fill="white">
              UNIQUE ANIME
            </text>
          </svg>
        </div>

        <h3 className="raters-header">BEST RATERS</h3>
        <div className="raters-list">
          {topUsers.map((user, idx) => (
            <div key={user.rank} className="rater-entry">
              <span className="emoji-medal">{trophyEmojis[idx]}</span>
              <img src={user.avatarUrl} className="rater-avatar" alt={user.username} />
              <div className="rater-name">{user.username}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopAnimeStats;
