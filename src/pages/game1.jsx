import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Make game dimensions responsive
const getGameDimensions = () => {
  const isMobile = window.innerWidth < 768;
  return {
    width: isMobile ? window.innerWidth - 32 : 800, // 32px for padding
    height: isMobile ? 400 : 600,
    itemSize: isMobile ? 30 : 40,
    bucketWidth: isMobile ? 70 : 100,
    bucketHeight: isMobile ? 56 : 80,
    fallingSpeed: isMobile ? 2 : 3
  };
};

const REWARD_SCORE = 50;
const FRUIT_IMAGES = ['1.png', '2.png', '3.png', '4.png', '5.png'];
const DONUT_IMAGES = ['6.png', '7.png', '8.png'];

const DonutCatcherGame = () => {
  const [dimensions, setDimensions] = useState(getGameDimensions());
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bucketPosition, setBucketPosition] = useState(dimensions.width / 2);
  const [fallingItems, setFallingItems] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const gameRef = useRef(null);
  const animationFrameRef = useRef();
  const lastSpawnTimeRef = useRef(0);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = getGameDimensions();
      setDimensions(newDimensions);
      // Adjust bucket position for new dimensions
      setBucketPosition(prev => 
        Math.min(Math.max(newDimensions.bucketWidth / 2, prev), 
        newDimensions.width - newDimensions.bucketWidth / 2)
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRandomImage = (type) => {
    const images = type === 'donut' ? DONUT_IMAGES : FRUIT_IMAGES;
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleMove = (e) => {
    if (!gameStarted || gameOver) return;
    
    const gameRect = gameRef.current.getBoundingClientRect();
    let x;
    
    if (e.type.startsWith('touch')) {
      e.preventDefault(); // Prevent scrolling while playing
      x = e.touches[0].clientX - gameRect.left;
    } else {
      x = e.clientX - gameRect.left;
    }
    
    x = Math.max(
      dimensions.bucketWidth / 2, 
      Math.min(x, dimensions.width - dimensions.bucketWidth / 2)
    );
    setBucketPosition(x);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const updateGame = () => {
      const now = Date.now();
      
      if (now - lastSpawnTimeRef.current > 1000) {
        const itemType = Math.random() > 0.3 ? 'donut' : 'fruit';
        const newItem = {
          id: now,
          x: Math.random() * (dimensions.width - dimensions.itemSize),
          y: -dimensions.itemSize,
          type: itemType,
          image: getRandomImage(itemType)
        };
        setFallingItems(prev => [...prev, newItem]);
        lastSpawnTimeRef.current = now;
      }

      setFallingItems(prev => prev.map(item => {
        const newY = item.y + dimensions.fallingSpeed;
        
        if (newY + dimensions.itemSize > dimensions.height - dimensions.bucketHeight &&
            item.x + dimensions.itemSize > bucketPosition - dimensions.bucketWidth / 2 &&
            item.x < bucketPosition + dimensions.bucketWidth / 2) {
          
          if (item.type === 'donut') {
            setScore(s => s + 10);
            toast.success('+10 points!', { duration: 1000 });
          } else {
            setLives(l => l - 1);
            toast.error("Don't catch fruits!", { duration: 1000 });
          }
          return null;
        }
        
        if (newY > dimensions.height) {
          if (item.type === 'donut') {
            setLives(l => l - 1);
          }
          return null;
        }
        
        return { ...item, y: newY };
      }).filter(Boolean));

      animationFrameRef.current = requestAnimationFrame(updateGame);
    };

    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, bucketPosition, dimensions]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      setGameStarted(false);
    }
  }, [lives]);

  const claimReward = async () => {
    try {
      const response = await fetch('api/getreward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        setRewardClaimed(true);
        toast.success('Reward claimed successfully!');
      }
    } catch (error) {
      toast.error('Failed to claim reward. Please try again.');
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setFallingItems([]);
    setGameOver(false);
    setRewardClaimed(false);
    setGameStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <Toaster position="top-right" />
      
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span className="text-xl font-bold text-white">{lives}</span>
        </div>
      </div>

      <div
        ref={gameRef}
        className="relative w-full rounded-lg overflow-hidden shadow-2xl touch-none"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          background: 'url(9.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {fallingItems.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: dimensions.itemSize,
              height: dimensions.itemSize,
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: bucketPosition - dimensions.bucketWidth / 2,
            width: dimensions.bucketWidth,
            height: dimensions.bucketHeight,
            backgroundImage: 'url(10.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            transition: 'left 0.1s ease-out'
          }}
        />

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <button
              className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-lg md:text-xl font-bold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all"
              onClick={() => setGameStarted(true)}
            >
              Start Game
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="bg-white/90 p-6 md:p-8 rounded-lg shadow-xl text-center w-4/5 max-w-sm">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-lg md:text-xl mb-4">Final Score: {score}</p>
              {score >= REWARD_SCORE && !rewardClaimed && (
                <button
                  className="mb-4 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg font-bold hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all w-full"
                  onClick={claimReward}
                >
                  Claim Reward!
                </button>
              )}
              <button
                className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all w-full"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 w-full max-w-4xl bg-white/10 p-4 rounded-lg shadow-lg text-white text-sm md:text-base">
        <h3 className="font-bold mb-2">How to Play</h3>
        <p>
          Move your bucket left and right to catch falling donuts. Avoid catching fruits!
          Get {REWARD_SCORE} points to win a special reward. You have {lives} lives.
        </p>
      </div>
    </div>
  );
};

export default DonutCatcherGame;