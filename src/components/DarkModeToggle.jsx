import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const DARK_MODE_KEY = 'music-looper-dark-mode';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDark));
  }, [isDark]);

  const tooltip = (
    <Tooltip id="dark-mode-tooltip">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</Tooltip>
  );

  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <button
        className="dark-mode-toggle"
        onClick={() => setIsDark(!isDark)}
      >
        <FontAwesomeIcon 
          icon={isDark ? faSun : faMoon} 
          style={isDark ? { color: '#ffc107' } : { color: '#6c757d' }}
        />
      </button>
    </OverlayTrigger>
  );
}

export default DarkModeToggle;
