import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import './TopAnimeStats.css';

const TopAnimeStats = ({ selectedState }) => {
  const [totalUnique, setTotalUnique] = useState(0);
  const [topAnimes, setTopAnimes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const posterCache = useRef({});

  useEffect(() => {
        Papa.parse(
          `${process.env.PUBLIC_URL}/stats_data.csv`,
          {
            download: true,
            header: true,
            complete: ({ data }) => setDataRows(data),
            error: err => console.error('CSV parse error:', err),
          }
        );
      }, []);
    
      // recompute stats when dataRows or selectedState changes
      useEffect(() => {
        if (!dataRows.length) return;
    
        const animeCounts = {};
        const userCounts = {};
        dataRows.forEach(r => {
          if (r.state !== selectedState) return;
          const title = r.title || 'Unknown';
          animeCounts[title] = (animeCounts[title] || 0)+1;
          const user = r.username || 'Unknown';
          const total = parseInt(r['Total Entries'], 10) || 0;
          userCounts[user] = Math.max(userCounts[user] || 0, total);
        });
    
        setTotalUnique(Object.keys(animeCounts).length);
    
        // fetch top 3 anime posters in parallel with cache
        Promise.all(
          Object.entries(animeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(async ([title], idx) => {
              if (posterCache.current[title]) {
                return { rank: idx + 1, title, imageUrl: posterCache.current[title] };
              }
              try {
                const res = await fetch(
                  `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`
                );
                const json = await res.json();
                const img = json?.data?.[0]?.images?.jpg?.image_url
                  || 'https://via.placeholder.com/60';
                posterCache.current[title] = img;
                return { rank: idx+1, title, imageUrl: img };
              } catch {
                const placeholder = 'https://via.placeholder.com/60';
                posterCache.current[title] = placeholder;
                return { rank: idx + 1, title, imageUrl: placeholder };
              }
            })
        ).then(setTopAnimes);
    
        // compute top 3 users
        const topUsersList = Object.entries(userCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([username], idx) => ({
            rank: idx + 1,
            username,
            avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
          }));
        setTopUsers(topUsersList);
    
      }, [dataRows, selectedState]);

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
