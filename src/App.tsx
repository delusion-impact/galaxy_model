import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  orbitRadius: number; // pixels for visualization
  size: number; // pixels for visualization
  color: string;
  glowColor: string;
  description: string;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitRadius: 70,
    size: 6,
    color: '#b5b5b5',
    glowColor: '#8a8a8a',
    description: 'Самая маленькая и ближайшая к Солнцу планета.',
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    orbitRadius: 105,
    size: 10,
    color: '#e8cda0',
    glowColor: '#d4a84b',
    description: 'Самая горячая планета с плотной атмосферой из CO₂.',
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    orbitRadius: 145,
    size: 11,
    color: '#4da6ff',
    glowColor: '#2980b9',
    description: 'Наш дом — единственная планета с известной жизнью.',
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitRadius: 190,
    size: 8,
    color: '#e74c3c',
    glowColor: '#c0392b',
    description: 'Красная планета — цель будущих межпланетных миссий.',
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    orbitRadius: 260,
    size: 22,
    color: '#e8a954',
    glowColor: '#d4843a',
    description: 'Крупнейшая планета — газовый гигант с Большим Красным Пятном.',
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    orbitRadius: 330,
    size: 19,
    color: '#f0d58c',
    glowColor: '#c9a83a',
    description: 'Знаменита своими великолепными кольцами из льда и камней.',
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    orbitRadius: 395,
    size: 15,
    color: '#7ecfc0',
    glowColor: '#45b7a0',
    description: 'Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°.',
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    orbitRadius: 450,
    size: 14,
    color: '#3498db',
    glowColor: '#2471a3',
    description: 'Самая далёкая планета с самыми сильными ветрами в Солнечной системе.',
  },
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [angles, setAngles] = useState<number[]>(() =>
    planets.map(() => Math.random() * Math.PI * 2)
  );
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setAngles((prev) =>
          prev.map((angle, i) => {
            // Base speed: complete orbit proportional to orbital period
            // Earth completes orbit in ~20 seconds at speed=1
            const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod * 0.055);
            return angle + baseSpeed * delta * speed * 0.06;
          })
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isPlaying, speed]
  );

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const getSpeedLabel = (s: number): string => {
    if (s === 0.25) return '0.25×';
    if (s === 0.5) return '0.5×';
    if (s === 1) return '1×';
    if (s === 2) return '2×';
    if (s === 5) return '5×';
    if (s === 10) return '10×';
    return `${s}×`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ru-RU');
  };

  // Generate stars
  const stars = useRef(
    Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: Math.random() * 3,
    }))
  ).current;

  return (
    <div className="w-full h-screen bg-[#0a0a1a] overflow-hidden relative flex flex-col">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          🌌 Интерактивная Солнечная система
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Нажмите на планету для получения информации
        </p>
      </div>

      {/* Solar System Container */}
      <div
        ref={containerRef}
        className="relative flex-1 flex items-center justify-center"
      >
        <div className="relative" style={{ width: '920px', height: '920px' }}>
          {/* Sun */}
          <div
            className="absolute rounded-full cursor-pointer"
            style={{
              width: '50px',
              height: '50px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #fff7a1 0%, #ffd700 30%, #ff8c00 70%, #ff4500 100%)',
              boxShadow: '0 0 40px 15px rgba(255, 165, 0, 0.5), 0 0 80px 30px rgba(255, 69, 0, 0.3), 0 0 120px 50px rgba(255, 165, 0, 0.15)',
            }}
            onClick={() => setSelectedPlanet(null)}
          />

          {/* Orbit paths */}
          {planets.map((planet, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute rounded-full border border-white/10"
              style={{
                width: `${planet.orbitRadius * 2}px`,
                height: `${planet.orbitRadius * 2}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {/* Planets */}
          {planets.map((planet, i) => {
            const x = Math.cos(angles[i]) * planet.orbitRadius;
            const y = Math.sin(angles[i]) * planet.orbitRadius;
            const isSelected = selectedPlanet?.name === planet.name;
            const isHovered = hoveredPlanet === planet.name;

            return (
              <div
                key={planet.name}
                className="absolute cursor-pointer transition-transform duration-200"
                style={{
                  width: `${planet.size + 8}px`,
                  height: `${planet.size + 8}px`,
                  left: `calc(50% + ${x}px - ${(planet.size + 8) / 2}px)`,
                  top: `calc(50% + ${y}px - ${(planet.size + 8) / 2}px)`,
                  zIndex: isHovered || isSelected ? 20 : 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlanet(planet);
                }}
                onMouseEnter={() => setHoveredPlanet(planet.name)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                {/* Planet body */}
                <div
                  className="w-full h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${planet.size}px`,
                    height: `${planet.size}px`,
                    margin: '4px',
                    background: `radial-gradient(circle at 35% 35%, ${planet.color}, ${planet.glowColor})`,
                    boxShadow: isSelected
                      ? `0 0 12px 4px ${planet.color}, 0 0 24px 8px ${planet.color}80`
                      : isHovered
                      ? `0 0 8px 3px ${planet.color}90`
                      : `0 0 4px 1px ${planet.color}60`,
                    transform: isHovered ? 'scale(1.3)' : isSelected ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
                {/* Saturn rings */}
                {planet.name === 'Saturn' && (
                  <div
                    className="absolute rounded-full border-2 border-yellow-200/60 pointer-events-none"
                    style={{
                      width: `${planet.size + 14}px`,
                      height: `${planet.size * 0.35}px`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%) rotate(-20deg)',
                    }}
                  />
                )}
                {/* Planet label on hover */}
                {(isHovered || isSelected) && (
                  <div
                    className="absolute text-xs text-white font-medium whitespace-nowrap pointer-events-none"
                    style={{
                      bottom: `${planet.size + 12}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      textShadow: '0 0 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    {planet.nameRu}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 md:right-8 z-30 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-5 w-72 shadow-2xl animate-fade-in">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            onClick={() => setSelectedPlanet(null)}
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${selectedPlanet.color}, ${selectedPlanet.glowColor})`,
                boxShadow: `0 0 10px 3px ${selectedPlanet.color}60`,
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
              <p className="text-xs text-gray-400">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">{selectedPlanet.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-gray-700/50">
              <span className="text-gray-400 text-sm">📏 Диаметр</span>
              <span className="text-white font-medium text-sm">
                {formatNumber(selectedPlanet.diameter)} км
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-700/50">
              <span className="text-gray-400 text-sm">☀️ Расстояние</span>
              <span className="text-white font-medium text-sm">
                {formatNumber(selectedPlanet.distanceFromSun)} млн км
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-400 text-sm">🔄 Орбитальный период</span>
              <span className="text-white font-medium text-sm">
                {selectedPlanet.orbitalPeriod >= 365
                  ? `${(selectedPlanet.orbitalPeriod / 365.25).toFixed(1)} лет`
                  : `${selectedPlanet.orbitalPeriod} дней`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 pb-4 pt-2 px-4">
        <div className="max-w-2xl mx-auto bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-indigo-500/30"
            >
              {isPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Пауза
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Воспроизведение
                </>
              )}
            </button>

            {/* Speed Control */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Скорость:</span>
              <div className="flex gap-1">
                {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      speed === s
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {getSpeedLabel(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Planet quick-select */}
          <div className="flex flex-wrap justify-center gap-2 mt-3 pt-3 border-t border-gray-700/50">
            {planets.map((planet) => (
              <button
                key={planet.name}
                onClick={() => setSelectedPlanet(planet)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-200 ${
                  selectedPlanet?.name === planet.name
                    ? 'bg-gray-700 text-white ring-1 ring-gray-500'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${planet.color}, ${planet.glowColor})`,
                  }}
                />
                {planet.nameRu}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
