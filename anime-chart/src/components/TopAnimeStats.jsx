import React, { useEffect, useState, useRef } from 'react';
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
  const [dataRows, setDataRows] = useState([]);
  const posterCache = useRef({});

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/stats_data.csv`, {
      download: true,
      header: true,
      complete: ({ data }) => setDataRows(data),
      error: err => console.error('CSV parse error:', err),
    });
  }, []);

  // recompute when dataRows or selectedState changes
  useEffect(() => {
    if (!dataRows.length) return;

    const animeCounts = {};
    const userCounts = {};
    dataRows.forEach(r => {
      if (r.state !== selectedState) return;
      const title = r.title || 'Unknown';
      animeCounts[title] = (animeCounts[title] || 0) + 1;
      const user = r.username || 'Unknown';
      const total = parseInt(r['Total Entries'], 10) || 0;
      userCounts[user] = Math.max(userCounts[user] || 0, total);
    });

    setTotalUnique(Object.keys(animeCounts).length);

    // fetch top 3 anime posters & synopses
    Promise.all(
      Object.entries(animeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(async ([title], idx) => {
          if (posterCache.current[title]) {
            return { rank: idx + 1, title, ...posterCache.current[title] };
          }
          try {
            const res = await fetch(
              `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`
            );
            const json = await res.json();
            const entry = json?.data?.[0] || {};
            const imageUrl = entry.images?.jpg?.image_url
              || 'https://via.placeholder.com/60';
            const synopsis = entry.synopsis
              ? entry.synopsis.split('. ').slice(0, 2).join('. ') + '.'
              : fallbackDescriptions[title] || '';
            posterCache.current[title] = { imageUrl, synopsis };
            return { rank: idx + 1, title, imageUrl, synopsis };
          } catch {
            const placeholder = {
              imageUrl: fallbackImages[title] || 'https://via.placeholder.com/60',
              synopsis: fallbackDescriptions[title] || ''
            };
            posterCache.current[title] = placeholder;
            return { rank: idx + 1, title, ...placeholder };
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
        avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(username)}`
      }));
    setTopUsers(topUsersList);
  }, [dataRows, selectedState]);

  return (
    <div className="anime-container">
      <div className="panel anime-left">
        <h3>Most Popular Animes</h3>
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

      <div className="panel anime-right">
        <div className="unique-circle">
          <div>{totalUnique}</div>
          <div className="circle-label">Unique Anime</div>
        </div>

        <h3 className="raters-header">Best Raters</h3>
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
