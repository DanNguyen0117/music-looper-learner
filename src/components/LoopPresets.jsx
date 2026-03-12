import { useState, useEffect } from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { secondsToHMS } from '../utils/secondsToHMS';

const PRESETS_KEY = 'music-looper-presets';

function LoopPresets({
  videoCode,
  startMinutes,
  startSeconds,
  endMinutes,
  endSeconds,
  speed,
  onLoadPreset,
}) {
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(PRESETS_KEY);
    if (saved) {
      setPresets(JSON.parse(saved));
    }
  }, []);

  const savePreset = () => {
    const startTime = secondsToHMS(startMinutes * 60 + startSeconds);
    const endTime = secondsToHMS(endMinutes * 60 + endSeconds);
    const name = `${videoCode}: ${startTime} - ${endTime}`;

    const newPreset = {
      id: Date.now(),
      name,
      videoCode,
      startMinutes,
      startSeconds,
      endMinutes,
      endSeconds,
      speed,
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  const loadPreset = (preset) => {
    setSelectedPreset(preset.id);
    onLoadPreset(preset);
  };

  const deletePreset = (id) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
    if (selectedPreset === id) {
      setSelectedPreset('');
    }
  };

  return (
    <Container className="mb-4" style={{ maxWidth: '700px' }}>
      <Row className="justify-content-center g-2 mb-3">
        <Col xs="auto">
          <Button variant="success" onClick={savePreset}>
            Save Current Loop
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-secondary"
            onClick={() => {
              if (presets.length > 0) {
                loadPreset(presets[presets.length - 1]);
              }
            }}
            disabled={presets.length === 0}
          >
            Load Last Saved
          </Button>
        </Col>
      </Row>
      {presets.length > 0 && (
        <Row className="justify-content-center g-1">
          {presets.slice().reverse().map((preset) => (
            <Col xs="auto" key={preset.id}>
              <Button
                variant={selectedPreset === preset.id ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => loadPreset(preset)}
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                {preset.name}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePreset(preset.id);
                  }}
                  style={{
                    marginLeft: '6px',
                    cursor: 'pointer',
                    opacity: 0.7,
                  }}
                  title="Delete preset"
                >
                  ×
                </span>
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default LoopPresets;
