import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './TopAnimeStats.css';

const TopAnimeStats = ({ selectedState }) => {
  const [totalUnique, setTotalUnique] = useState(0);
  const [topAnimes, setTopAnimes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + '/cleaned_usa_data.csv', {
      download: true,
      header: true,
      complete: async (results) => {
        const allData = results.data.filter(row => row.state === selectedState);

        // Unique Anime Count
        const uniqueTitles = new Set(allData.map(row => row.title));
        setTotalUnique(uniqueTitles.size);

        // Top 3 Animes
        const animeCounts = {};
        allData.forEach(row => {
          const title = row.title || 'Unknown';
          animeCounts[title] = (animeCounts[title] || 0) + 1;
        });

        const sortedAnimes = Object.entries(animeCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        const animeWithPosters = await Promise.all(
          sortedAnimes.map(async ([title], index) => {
            try {
              const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
              const data = await res.json();
              const imageUrl = data?.data?.[0]?.images?.jpg?.image_url || 'https://via.placeholder.com/60';
              return { rank: index + 1, title, imageUrl };
            } catch (err) {
              console.error('Error fetching image for:', title);
              return { rank: index + 1, title, imageUrl: 'https://via.placeholder.com/60' };
            }
          })
        );

        setTopAnimes(animeWithPosters);

        // Top 3 Best Raters with human avatars
        const userCounts = {};
        allData.forEach(row => {
          const username = row.username || 'Unknown';
          const total = parseInt(row['Total Entries']) || 0;
          userCounts[username] = Math.max(userCounts[username] || 0, total);
        });

        const sortedUsersRaw = Object.entries(userCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        const sortedUsers = Array.from({ length: 3 }).map((_, index) => {
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
              username: 'Anonymous',
              avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=placeholder${index}`
            };
          }
        });

        setTopUsers(sortedUsers);
      }
    });
  }, [selectedState]);

  return (
    <div className="anime-bar-chart-container">
      <div className="anime-bar-chart-grid">

        {/* Total Unique Anime */}
        <div className="anime-unique">
          <div className="unique-circle">
            <div>#TOTAL<br />UNIQUE<br />ANIME</div>
            <div className="unique-number">{totalUnique}</div>
          </div>
        </div>

        {/* Most Popular Animes */}
        <div className="anime-most-popular">
          <h3>MOST POPULAR ANIMES</h3>
          {topAnimes.map(anime => (
            <div key={anime.title} className="anime-rank-row">
              <span className="rank-badge">🏆 #{anime.rank}</span>
              <img
                className="anime-poster"
                src={anime.imageUrl}
                alt={anime.title}
                loading="lazy"
                title={anime.title}
              />
              <span className="anime-title">{anime.title}</span>
            </div>
          ))}
        </div>

        {/* Best Raters */}
        <div className="anime-best-raters">
          <h3>BEST RATERS</h3>
          {topUsers.map(user => (
            <div key={user.rank} className={`anime-rank-row rater-card`}>
              <div className={`avatar-wrapper rank-${user.rank}`}>
                <img
                  className="anime-avatar"
                  src={user.avatarUrl}
                  alt={user.username}
                  loading="lazy"
                  title={user.username}
                />
              </div>
              <div className="rater-info">
                <span className="rank-badge">🏆 #{user.rank}</span>
                <span className={`anime-title ${user.username === 'Anonymous' ? 'anonymous' : ''}`}>
                  {user.username}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TopAnimeStats;
