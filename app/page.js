"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";

// The main App component that renders the SpinWheel
export default function App() {
  const handleWin = (prize) => {
    // You can add further logic here, like updating user prizes
  };

  return (
    <div className="App">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");
        
        /* Mobile optimization */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
        }
        
        /* Prevent zoom on mobile */
        input, button, select, textarea {
          font-size: 16px !important;
        }
      `}</style>
      <SpinWheel onWin={handleWin} />
    </div>
  );
}

// --- UPDATED PRIZE CONFIGURATION WITH NEW ODDS ---
const prizes = [
  {
    name: "50% OFF Next Game",
    color: "#FF6B9D",
    emoji: "🎯",
    textColor: "white",
    weight: 1, // Lowest chance
  },
  {
    name: "40% OFF Next Game",
    color: "#FF8E2B",
    emoji: "🎮",
    textColor: "white",
    weight: 8, // Low chance
  },
  {
    name: "Choki Choki Chocolate",
    color: "#8B4513",
    emoji: "🍫",
    textColor: "white",
    weight: 10, // Medium-low chance
  },
  {
    name: "20% OFF Next Game",
    color: "#5DADE2",
    emoji: "💰",
    textColor: "white",
    weight: 30, // Medium chance
  },
  {
    name: "30% OFF Next Game",
    color: "#4ECDC4",
    emoji: "💰",
    textColor: "white",
    weight: 25, // High chance
  },
  {
    name: "Better Luck Next Time",
    color: "#95A5A6",
    emoji: "🍀",
    textColor: "white",
    weight: 40, // Highest chance
  },
];

// CLIENT-ONLY BACKGROUND PARTICLES COMPONENT
const BackgroundParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only on client
    const newParticles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4,
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-float"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
    </>
  );
};

const SpinWheel = ({ onWin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const segmentAngle = useMemo(() => 360 / prizes.length, []);

  // Client-only flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getWeightedRandomPrize = useCallback(() => {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < prizes.length; i++) {
      random -= prizes[i].weight;
      if (random <= 0) return i;
    }
    return prizes.length - 1;
  }, []);

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    const targetIndex = getWeightedRandomPrize();
    const segmentStartAngle = targetIndex * segmentAngle;
    const randomOffset =
      Math.random() * (segmentAngle * 0.8) + segmentAngle * 0.1;
    const finalTargetAngleOnWheel = segmentStartAngle + randomOffset;

    const spins = 10;
    const targetRotation = 360 - finalTargetAngleOnWheel;
    const currentRotation = rotation % 360;
    const rotationAdjustment = (targetRotation - currentRotation + 360) % 360;
    const rotationToDo = spins * 360 + rotationAdjustment;
    const finalRotationValue = rotation + rotationToDo;

    const duration = 6000;
    let startTime = null;
    const startRotation = rotation;
    const easeOutQuart = (t) => 1 - --t * t * t * t;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const easedProgress = easeOutQuart(progress);
        setRotation(startRotation + rotationToDo * easedProgress);
        requestAnimationFrame(animate);
      } else {
        // Immediate modal trigger - no delay
        setRotation(finalRotationValue);
        setIsSpinning(false);
        
        const winnerData = {
          ...prizes[targetIndex],
          displayName: prizes[targetIndex].name,
        };
        
        // INSTANT TRIGGER - No setTimeout delay
        setWinner(winnerData);
        setShowWinModal(true);
        if (onWin) onWin(winnerData);
      }
    };

    setIsSpinning(true);
    requestAnimationFrame(animate);
  }, [isSpinning, rotation, onWin, getWeightedRandomPrize, segmentAngle]);

  const closeModal = () => {
    setShowWinModal(false);
    setWinner(null);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Enhanced Background - STATIC ELEMENTS ONLY */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 via-purple-500/30 to-cyan-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/10 via-red-500/20 to-pink-500/15 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Static floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-radial from-purple-400/30 to-transparent rounded-full animate-pulse blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-radial from-pink-400/25 to-transparent rounded-full animate-pulse blur-3xl" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-28 sm:w-56 h-28 sm:h-56 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full animate-pulse blur-2xl" style={{animationDelay: '3s'}}></div>
        
        {/* CLIENT-ONLY PARTICLES */}
        {isClient && (
          <div suppressHydrationWarning>
            <BackgroundParticles />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-orange-300 mb-4 sm:mb-6 drop-shadow-2xl">
              LUCKY SPIN
            </h1>
            <div className="absolute inset-0 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-cyan-300/30 blur-2xl" aria-hidden="true">
              LUCKY SPIN
            </div>
            <div className="absolute inset-0 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-pink-300/20 blur-3xl animate-pulse" aria-hidden="true">
              LUCKY SPIN
            </div>
          </div>
          <p className="text-white/80 text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
            🎲 Spin the wheel and win amazing rewards! 🎁
          </p>
          
          <div className="mt-4 sm:mt-6 flex justify-center items-center gap-2 sm:gap-4">
            <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-cyan-400"></div>
            <div className="text-cyan-400 text-xl sm:text-2xl">✨</div>
            <div className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-cyan-400"></div>
          </div>
        </div>

        {/* Enhanced Wheel Container */}
        <div className="relative w-[85vw] h-[85vw] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] max-w-[450px] max-h-[450px] flex items-center justify-center mb-8 sm:mb-12">
          
          <div className="absolute -inset-8 sm:-inset-12 md:-inset-16 rounded-full bg-gradient-to-r from-cyan-400/30 sm:from-cyan-400/40 via-pink-500/40 sm:via-pink-500/50 to-orange-400/30 sm:to-orange-400/40 blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute -inset-6 sm:-inset-8 md:-inset-12 rounded-full bg-gradient-to-r from-pink-400/20 sm:from-pink-400/30 via-purple-500/30 sm:via-purple-500/40 to-cyan-500/20 sm:to-cyan-500/30 blur-xl sm:blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          
          <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 rounded-full bg-gradient-to-r from-cyan-300 via-pink-400 to-orange-300 p-1 sm:p-1.5 md:p-2 shadow-2xl">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner"></div>
          </div>

          {/* REFINED 3D ARROW DESIGN */}
          <div className="absolute -top-6 sm:-top-8 md:-top-10 left-1/2 transform -translate-x-1/2 z-30">
            <div className="relative">
              <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-yellow-400/70 blur-xl animate-pulse"></div>
              <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-orange-400/90 blur-lg animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-red-400/80 blur-md animate-pulse" style={{animationDelay: '0.6s'}}></div>
              
              <div className="relative">
                <div
                  style={{ clipPath: "polygon(50% 100%, 15% 15%, 85% 15%)" }}
                  className="absolute top-1 left-0 w-10 h-12 sm:w-12 sm:h-14 md:w-16 md:h-18 bg-black/40 blur-sm"
                ></div>
                
                <div
                  style={{ clipPath: "polygon(50% 100%, 15% 15%, 85% 15%)" }}
                  className="relative w-10 h-12 sm:w-12 sm:h-14 md:w-16 md:h-18 bg-gradient-to-b from-yellow-200 via-orange-400 to-red-600 shadow-2xl border border-white/50"
                >
                  <div className="w-full h-full bg-gradient-to-br from-white/40 via-transparent to-black/30" style={{ clipPath: "polygon(50% 100%, 15% 15%, 85% 15%)" }}></div>
                  
                  <div 
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 sm:h-6 bg-white/60 rounded-full blur-sm"
                    style={{ clipPath: "polygon(50% 0%, 40% 100%, 60% 100%)" }}
                  ></div>
                </div>
                
                <div
                  style={{ clipPath: "polygon(50% 100%, 15% 15%, 85% 15%)" }}
                  className="absolute inset-0 w-10 h-12 sm:w-12 sm:h-14 md:w-16 md:h-18 border-2 border-white/80 bg-gradient-to-t from-transparent via-white/20 to-white/40"
                ></div>
              </div>
            </div>
          </div>

          {/* Enhanced Wheel */}
          <div
            className="relative w-full h-full rounded-full shadow-2xl overflow-hidden border-2 sm:border-3 md:border-4 border-white/20"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 400"
              className="absolute inset-0"
            >
              {prizes.map((prize, index) => {
                const startAngle = index * segmentAngle * (Math.PI / 180);
                const endAngle = (index + 1) * segmentAngle * (Math.PI / 180);
                const midAngle = startAngle + (segmentAngle * Math.PI) / 180 / 2;
                const radius = 200;
                const x1 = 200 + Math.cos(startAngle - Math.PI / 2) * radius;
                const y1 = 200 + Math.sin(startAngle - Math.PI / 2) * radius;
                const x2 = 200 + Math.cos(endAngle - Math.PI / 2) * radius;
                const y2 = 200 + Math.sin(endAngle - Math.PI / 2) * radius;

                return (
                  <g key={index}>
                    <defs>
                      <radialGradient id={`gradient-${index}`} cx="50%" cy="50%" r="80%">
                        <stop offset="0%" stopColor={prize.color} />
                        <stop offset="100%" stopColor={`${prize.color}CC`} />
                      </radialGradient>
                    </defs>
                    <path
                      d={`M 200 200 L ${x1} ${y1} A ${radius} ${radius} 0 ${
                        segmentAngle > 180 ? 1 : 0
                      } 1 ${x2} ${y2} Z`}
                      fill={`url(#gradient-${index})`}
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeOpacity="0.8"
                    />
                    
                    <g
                      transform={`translate(${
                        200 + Math.cos(midAngle - Math.PI / 2) * 130
                      }, ${
                        200 + Math.sin(midAngle - Math.PI / 2) * 130
                      }) rotate(${(midAngle * 180) / Math.PI})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <text
                        x="0"
                        y="-16"
                        fontSize="28"
                        className="sm:text-3xl"
                        filter="drop-shadow(3px 3px 6px rgba(0,0,0,0.8)) drop-shadow(0px 0px 10px rgba(255,255,255,0.3))"
                      >
                        {prize.emoji}
                      </text>
                      
                      <text
                        x="0"
                        y="20"
                        fill={prize.textColor}
                        fontSize="11"
                        className="sm:text-sm"
                        fontWeight="bold"
                        filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.9))"
                      >
                        {prize.name.split(" ").map((word, i) => (
                          <tspan key={i} x="0" dy={i === 0 ? 0 : 12}>
                            {word}
                          </tspan>
                        ))}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 shadow-2xl border-4 sm:border-5 md:border-6 border-white flex items-center justify-center z-20">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 shadow-inner border-2 sm:border-3 md:border-4 border-slate-400">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Center Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`absolute z-30 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full text-white font-black text-base sm:text-lg md:text-xl uppercase transition-all duration-300 transform border-2 sm:border-3 md:border-4 border-white/80 flex items-center justify-center text-center shadow-2xl touch-manipulation
              ${
                isSpinning
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed scale-90 opacity-70"
                  : "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:border-white active:duration-75"
              }`}
            style={{
              background: isSpinning 
                ? undefined 
                : 'linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)',
              boxShadow: isSpinning 
                ? undefined 
                : '0 0 20px rgba(236, 72, 153, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              minWidth: '44px',
              minHeight: '44px'
            }}
          >
            <div className="relative">
              {isSpinning ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin text-xl sm:text-2xl mb-1">⚡</div>
                  <span className="text-xs sm:text-sm">SPIN</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-xl sm:text-2xl mb-1 group-hover:animate-bounce">🎲</div>
                  <span className="text-xs sm:text-sm font-bold">SPIN</span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Prize Display */}
        <div className="text-center max-w-6xl px-4">
          <p className="text-white/90 text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            🎁 Available Prizes 🎁
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {prizes.map((prize, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl md:rounded-2xl px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 touch-manipulation"
                style={{ minHeight: '44px' }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl md:text-2xl">{prize.emoji}</span>
                  <span className="text-white font-medium text-xs sm:text-sm md:text-base">{prize.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Winning Modal */}
      {showWinModal && winner && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-40 p-4">
          <div className="relative overflow-hidden max-w-[90vw] w-full max-w-lg">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl border border-white/20 relative">
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl sm:rounded-3xl animate-pulse"></div>
              
              <div className="relative z-10">
                {winner.name === "Better Luck Next Time" ? (
                  <>
                    <div className="text-6xl sm:text-7xl md:text-8xl mb-6 sm:mb-8 animate-pulse filter drop-shadow-2xl">
                      {winner.emoji}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6">
                      {winner.displayName}
                    </h2>
                    <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 leading-relaxed">
                      Don&apos;t give up! Every spin brings new opportunities! 🌟
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-7xl sm:text-8xl md:text-9xl mb-6 sm:mb-8 animate-bounce filter drop-shadow-2xl">
                      {winner.emoji}
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-orange-400 mb-4 sm:mb-6 drop-shadow-2xl">
                      🎉 AMAZING! 🎉
                    </h2>
                    <p className="text-xl sm:text-2xl text-white/90 mb-2 sm:mb-4 font-medium">You won:</p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10 leading-tight">
                      {winner.displayName}
                    </p>
                  </>
                )}

                <button
                  onClick={closeModal}
                  className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-lg sm:text-xl md:text-2xl rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 border-2 border-white/20 touch-manipulation"
                  style={{
                    boxShadow: '0 0 30px rgba(236, 72, 153, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    minHeight: '44px'
                  }}
                >
                  {winner.name === "Better Luck Next Time" ? "🎲 Spin Again!" : "🎁 Awesome!"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-15px) scale(1.05);
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        button, .hover\\:scale-105 {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        * {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};
