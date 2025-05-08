// src/components/Map.jsx

// import React, { useRef, useEffect } from 'react';
import React, { useRef, useEffect /*, useState*/ } from 'react';
import * as d3 from 'd3';
import './Map.css';

const Map = ({ selectedState, setSelectedState, setAllStates }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const height = 600;

  useEffect(() => {
    const containerWidth = containerRef.current.clientWidth;
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${containerWidth} ${height}`)
      .style('width', '100%')
      .style('height', `${height}px`)
      .style('background', '#1a1a1a');

    // clear any existing drawing
    svg.selectAll('*').remove();
    const statesG = svg.append('g').attr('id', 'states');

    Promise.all([
      d3.csv('/filtered_usa_data_v2.csv'),
      d3.json('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
    ]).then(([data, us]) => {
      // count entries
      const counts = d3.rollup(
        data,
        v => v.length,
        d => d.state.trim()
      );
      setAllStates(Array.from(counts.keys()).sort());

      // color scale
      const maxCount = d3.max(counts.values());
      const color = d3.scaleSequential([0, maxCount], d3.interpolateYlOrRd);

      // projection & path
      const projection = d3
        .geoAlbersUsa()
        .fitExtent([[20, 20], [containerWidth - 20, height - 20]], us);
      const path = d3.geoPath(projection);

    //   const [tooltipOffset, setTooltipOffset] = useState({ left: 0, top: 0 });
      // draw states
      statesG
        .selectAll('path')
        .data(us.features)
        .join('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('fill', f => {
          const n = counts.get(f.properties.name) || 0;
          return n > 0 ? color(n) : 'none';
        })
        .attr('opacity', 0.75)
        .style('cursor', f => (counts.get(f.properties.name) || 0) > 0 ? 'pointer' : 'default')
        .on('mouseover', (event, f) => {
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = event.clientX - containerRect.left + 10;
            const y = event.clientY - containerRect.top  + 10;
            const n = counts.get(f.properties.name) || 0;
          
            d3.select(containerRef.current).select('.tooltip')
              .html(`<strong>${f.properties.name}</strong><br/>Entries: ${n}`)
              .style('left',  `${x}px`)
              .style('top',   `${y}px`)
              .style('opacity', 1);
          })
          .on('mousemove', (event) => {
            const containerRect = containerRef.current.getBoundingClientRect();
            d3.select(containerRef.current).select('.tooltip')
              .style('left', `${event.clientX - containerRect.left + 10}px`)
              .style('top',  `${event.clientY - containerRect.top  + 10}px`);
          })
          .on('mouseout', () => {
            d3.select(containerRef.current).select('.tooltip')
              .style('opacity', 0);
          })
          .on('click', (event,f) => {
            const name = f.properties.name;
            if (counts.has(name)) setSelectedState(name);
            });

      // highlight current selection
      statesG
        .selectAll('.state')
        .classed('selected', f => f.properties.name === selectedState);

      // add legend near Florida (bottom-right of Florida's bounding box)
      const fmt = d3.format('.2s');
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient').attr('id', 'legend');
      grad.append('stop').attr('offset', '0%').attr('stop-color', color(0));
      grad.append('stop').attr('offset', '100%').attr('stop-color', color(maxCount));

      const florida = us.features.find(f => f.properties.name === 'Florida');
      if (florida) {
        const [[, ], [maxX, maxY]] = path.bounds(florida);
        const legendWidth = 100;
        const legendHeight = 15;
        const offsetX = 40; // margin to the right
        const offsetY = 10; // margin above

        const lx = maxX + offsetX;
        const ly = maxY - legendHeight - offsetY;

        svg.append('rect')
          .attr('x', lx)
          .attr('y', ly)
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .attr('fill', 'url(#legend)');

        svg.append('text')
          .attr('x', lx)
          .attr('y', ly - 2)
          .attr('font-size', '15px')
          .attr('fill', '#ffa500')  // 👈 orange fill
          .text('0');

        svg.append('text')
          .attr('x', lx + legendWidth)
          .attr('y', ly - 2)
          .attr('text-anchor', 'end')
          .attr('font-size', '15px')
          .attr('fill', '#ffa500')  // 👈 orange fill
          .text(fmt(maxCount));
      }
    });
  }, [setAllStates, setSelectedState]);

  // update border on selection
  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll('#states > .state')
      .classed('selected', f => f.properties.name === selectedState);
  }, [selectedState]);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: `${height}px`, background: '#fafafa' }} />
      <div className="tooltip" style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }} />
    </div>
  );
};

export default Map;
