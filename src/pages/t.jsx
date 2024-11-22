import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Bot, 
  Sparkles, 
  BookOpen, 
  Rocket, 
  Lightbulb 
} from 'lucide-react';

const Loginpagee = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const aiFeatures = [
    {
      icon: Sparkles,
      title: "Adaptive Learning",
      description: "AI personalizes your learning path in real-time"
    },
    {
      icon: Brain,
      title: "Intelligent Insights",
      description: "Generate study summaries and key takeaways"
    },
    {
      icon: Rocket,
      title: "Skill Acceleration",
      description: "AI-powered recommendations for rapid skill development"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating AI Particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${5 + Math.random() * 15}px`,
              height: `${5 + Math.random() * 15}px`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Login Container */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-[500px] relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Bot className="mx-auto text-white/80 animate-pulse" size={64} />
          <h1 className="text-3xl font-bold tracking-wider text-white uppercase mt-4">
            AI Learning Hub
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="email" 
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            required 
          />
          
          <button 
            type="submit" 
            className="w-full py-3 bg-purple-600 text-white uppercase tracking-wider hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Lightbulb className="mr-2" size={20} />
            Launch Learning
          </button>
        </form>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {aiFeatures.map((feature, index) => (
            <div 
              key={index}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
              className={`p-4 text-center border rounded-lg transition-all cursor-pointer ${
                activeFeature === index 
                  ? 'bg-white/20 border-white/50' 
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <feature.icon className="mx-auto text-white/70 mb-2" size={32} />
              <h3 className="text-sm text-white uppercase">{feature.title}</h3>
              {activeFeature === index && (
                <p className="text-xs text-white/70 mt-2">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loginpagee;