import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Minimize2, Maximize2, Users, X } from 'lucide-react';

const PixelCityWorld = () => {
  const [gameState, setGameState] = useState('login'); // 'login', 'playing'
  const [playerName, setPlayerName] = useState('');
  const [playerGender, setPlayerGender] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMinimized, setChatMinimized] = useState(false);
  const [showOnlineList, setShowOnlineList] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // City districts with pixel art representations
  const districts = [
    { name: 'Programming Quarter', color: '#4CAF50', x: 50, y: 50, width: 200, height: 150, icon: '💻' },
    { name: 'Business District', color: '#2196F3', x: 300, y: 50, width: 200, height: 150, icon: '🏢' },
    { name: 'History Museum', color: '#795548', x: 550, y: 50, width: 200, height: 150, icon: '🏛️' },
    { name: 'Art Gallery', color: '#E91E63', x: 50, y: 250, width: 200, height: 150, icon: '🎨' },
    { name: 'Science Lab', color: '#9C27B0', x: 300, y: 250, width: 200, height: 150, icon: '🔬' },
    { name: 'Entertainment Zone', color: '#FF9800', x: 550, y: 250, width: 200, height: 150, icon: '🎮' }
  ];

  // Initialize game
  const startGame = () => {
    if (!playerName.trim() || !playerGender) return;
    
    const newPlayer = {
      id: Date.now(),
      name: playerName.trim(),
      gender: playerGender,
      x: 400,
      y: 300,
      color: playerGender === 'male' ? '#4CAF50' : '#E91E63',
      lastSeen: Date.now()
    };
    
    setCurrentPlayer(newPlayer);
    setPlayers([newPlayer]);
    setGameState('playing');
    
    // Add welcome message
    setChatMessages([{
      id: Date.now(),
      type: 'system',
      message: `Welcome to Pixel City, ${playerName}! Use WASD or arrow keys to move around.`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Handle player movement
  const handleKeyPress = useCallback((event) => {
    if (gameState !== 'playing' || !currentPlayer) return;
    
    const key = event.key.toLowerCase();
    const moveSpeed = 5;
    let newX = currentPlayer.x;
    let newY = currentPlayer.y;
    
    switch (key) {
      case 'w':
      case 'arrowup':
        newY = Math.max(20, currentPlayer.y - moveSpeed);
        break;
      case 's':
      case 'arrowdown':
        newY = Math.min(380, currentPlayer.y + moveSpeed);
        break;
      case 'a':
      case 'arrowleft':
        newX = Math.max(20, currentPlayer.x - moveSpeed);
        break;
      case 'd':
      case 'arrowright':
        newX = Math.min(780, currentPlayer.x + moveSpeed);
        break;
      default:
        return;
    }
    
    const updatedPlayer = { ...currentPlayer, x: newX, y: newY, lastSeen: Date.now() };
    setCurrentPlayer(updatedPlayer);
    
    // Update in players list
    setPlayers(prev => prev.map(p => p.id === currentPlayer.id ? updatedPlayer : p));
  }, [currentPlayer, gameState]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Simulate other players joining/leaving
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const simulateActivity = () => {
      // Randomly add/remove players to simulate multiplayer
      setPlayers(prev => {
        const others = prev.filter(p => p.id !== currentPlayer?.id);
        const shouldAddPlayer = Math.random() < 0.3 && others.length < 8;
        const shouldRemovePlayer = Math.random() < 0.2 && others.length > 0;
        
        let newPlayers = [...others];
        
        if (shouldAddPlayer) {
          const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
          const genders = ['male', 'female'];
          const randomName = names[Math.floor(Math.random() * names.length)];
          const randomGender = genders[Math.floor(Math.random() * genders.length)];
          
          newPlayers.push({
            id: Date.now() + Math.random(),
            name: randomName,
            gender: randomGender,
            x: Math.random() * 760 + 20,
            y: Math.random() * 360 + 20,
            color: randomGender === 'male' ? '#4CAF50' : '#E91E63',
            lastSeen: Date.now()
          });
        }
        
        if (shouldRemovePlayer && newPlayers.length > 0) {
          newPlayers.splice(Math.floor(Math.random() * newPlayers.length), 1);
        }
        
        // Move existing players randomly
        newPlayers = newPlayers.map(player => ({
          ...player,
          x: Math.max(20, Math.min(780, player.x + (Math.random() - 0.5) * 10)),
          y: Math.max(20, Math.min(380, player.y + (Math.random() - 0.5) * 10)),
          lastSeen: Date.now()
        }));
        
        return currentPlayer ? [currentPlayer, ...newPlayers] : newPlayers;
      });
      
      // Add random chat messages
      if (Math.random() < 0.1) {
        const messages = [
          "Hello everyone! 👋",
          "Anyone want to explore the Programming Quarter?",
          "The Art Gallery looks amazing!",
          "Business District has some cool buildings",
          "I love this pixel city!",
          "Science Lab is so interesting 🔬"
        ];
        const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
        
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          type: 'user',
          name: names[Math.floor(Math.random() * names.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date().toLocaleTimeString()
        }].slice(-50)); // Keep only last 50 messages
      }
    };
    
    const interval = setInterval(simulateActivity, 3000);
    return () => clearInterval(interval);
  }, [gameState, currentPlayer]);

  // Canvas rendering
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#87CEEB'; // Sky blue background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw districts
      districts.forEach(district => {
        // District background
        ctx.fillStyle = district.color;
        ctx.fillRect(district.x, district.y, district.width, district.height);
        
        // District border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(district.x, district.y, district.width, district.height);
        
        // District label
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(district.icon, district.x + district.width/2, district.y + 30);
        ctx.font = '12px monospace';
        ctx.fillText(district.name, district.x + district.width/2, district.y + 50);
      });
      
      // Draw roads
      ctx.fillStyle = '#666';
      // Horizontal roads
      ctx.fillRect(0, 200, 800, 20);
      ctx.fillRect(0, 400, 800, 20);
      // Vertical roads
      ctx.fillRect(250, 0, 20, 450);
      ctx.fillRect(520, 0, 20, 450);
      
      // Draw players
      players.forEach(player => {
        // Player shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(player.x, player.y + 15, 8, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Player body
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - 6, player.y - 10, 12, 16);
        
        // Player head
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(player.x, player.y - 15, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Player eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x - 3, player.y - 17, 1, 1);
        ctx.fillRect(player.x + 2, player.y - 17, 1, 1);
        
        // Player name
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.strokeText(player.name, player.x, player.y - 25);
        ctx.fillText(player.name, player.x, player.y - 25);
      });
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, players]);

  // Send chat message
  const sendMessage = () => {
    if (!chatInput.trim() || !currentPlayer) return;
    
    const newMessage = {
      id: Date.now(),
      type: 'user',
      name: currentPlayer.name,
      message: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, newMessage].slice(-50));
    setChatInput('');
  };

  if (gameState === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            🏙️ Welcome to Pixel City!
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your name:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name..."
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your character:
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPlayerGender('male')}
                  className={`flex-1 p-3 rounded-md border-2 transition-all ${
                    playerGender === 'male' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">🧑</div>
                  <div className="text-sm">Male</div>
                </button>
                
                <button
                  onClick={() => setPlayerGender('female')}
                  className={`flex-1 p-3 rounded-md border-2 transition-all ${
                    playerGender === 'female' 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">👩</div>
                  <div className="text-sm">Female</div>
                </button>
              </div>
            </div>
            
            <button
              onClick={startGame}
              disabled={!playerName.trim() || !playerGender}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-md font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Enter Pixel City ✨
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Use WASD or arrow keys to move around!</p>
            <p>Explore 6 different districts and chat with other players!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">🏙️ Pixel City</h1>
            <div className="text-green-400">
              Playing as: <span className="font-semibold">{currentPlayer?.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlineList(!showOnlineList)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-2"
            >
              <Users size={16} />
              Online: {players.length}
            </button>
          </div>
        </div>
        
        <div className="flex gap-4">
          {/* Game Canvas */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="border-2 border-gray-600 rounded"
                style={{ imageRendering: 'pixelated' }}
              />
              
              <div className="mt-4 text-gray-400 text-sm">
                <p>💻 Programming Quarter • 🏢 Business District • 🏛️ History Museum</p>
                <p>🎨 Art Gallery • 🔬 Science Lab • 🎮 Entertainment Zone</p>
              </div>
            </div>
          </div>
          
          {/* Side Panel */}
          <div className="w-80 space-y-4">
            {/* Online Players List */}
            {showOnlineList && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold">Online Players</h3>
                  <button
                    onClick={() => setShowOnlineList(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {players.map(player => (
                    <div key={player.id} className="flex items-center gap-2 text-gray-300">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className={player.id === currentPlayer?.id ? 'text-yellow-400 font-semibold' : ''}>
                        {player.name} {player.id === currentPlayer?.id ? '(You)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat */}
            <div className={`bg-gray-800 rounded-lg transition-all ${chatMinimized ? 'h-12' : 'h-96'}`}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageCircle size={16} />
                    City Chat
                  </h3>
                  <button
                    onClick={() => setChatMinimized(!chatMinimized)}
                    className="text-gray-400 hover:text-white"
                  >
                    {chatMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                  </button>
                </div>
                
                {!chatMinimized && (
                  <>
                    <div className="bg-gray-700 rounded p-3 h-64 overflow-y-auto mb-3 space-y-2">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className="text-sm">
                          {msg.type === 'system' ? (
                            <div className="text-yellow-400 italic">{msg.message}</div>
                          ) : (
                            <div>
                              <span className="text-blue-400 font-medium">{msg.name}</span>
                              <span className="text-gray-500 text-xs ml-2">{msg.timestamp}</span>
                              <div className="text-gray-300">{msg.message}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={200}
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelCityWorld;