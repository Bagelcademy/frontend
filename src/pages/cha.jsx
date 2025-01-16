import React, { useState, useEffect } from 'react';
import {
  Brain,
  Code,
  Rocket,
  Lightbulb,
  Search,
  GraduationCap,
  Book,
  Star,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Sparkles,
  Heart,
  Coffee,
  Cpu,
  Database,
  Globe,
  Layout,
  Monitor,
  Smartphone,
  Terminal,
  Wifi
} from 'lucide-react';
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const IconRain = () => {
  const [icons, setIcons] = useState([]);
  const iconComponents = [Heart, Coffee, Cpu, Database, Globe, Layout, Monitor, Smartphone, Terminal, Wifi];

  useEffect(() => {
    const createIcon = () => {
      const IconComponent = iconComponents[Math.floor(Math.random() * iconComponents.length)];
      const left = Math.random() * 10;
      const animationDuration = 3 + Math.random() * 4;
      const size = 1 + Math.random() * 1.5;
      const opacity = 0.1 + Math.random() * 0.2;
      
      return {
        id: Date.now() + Math.random(),
        left: `${left}%`,
        component: IconComponent,
        style: {
          position: 'absolute',
          top: '-20px',
          animation: `fallDown ${animationDuration}s linear`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          color: 'currentColor'
        }
      };
    };

    const addIcon = () => {
      setIcons(prev => [...prev, createIcon()]);
    };

    const removeOldIcons = () => {
      setIcons(prev => prev.filter(icon => {
        const element = document.getElementById(`icon-${icon.id}`);
        return element && element.getBoundingClientRect().top < window.innerHeight;
      }));
    };

    const interval = setInterval(addIcon, 300);
    const cleanup = setInterval(removeOldIcons, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none text-gray-400 dark:text-gray-600 overflow-hidden">
      {icons.map(icon => {
        const IconComponent = icon.component;
        return (
          <div
            key={icon.id}
            id={`icon-${icon.id}`}
            style={{
              ...icon.style,
              left: icon.left,
            }}
          >
            <IconComponent />
          </div>
        );
      })}
    </div>
  );
};

const BagelFamilyIntro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const teamMembers = [
    {
      name: 'Bagel Mama',
      role: 'Tech Education Expert',
      description: 'A brilliant computer science educator who makes complex coding concepts feel as warm and comforting as freshly baked bread.',
      image: '/api/placeholder/400/400',
      expertise: ['Programming', 'Web Dev', 'Digital'],
      icon: Brain,
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Bagel Papa',
      role: 'STEM Architect',
      description: 'A seasoned engineer turned educator who brings real-world tech experience to the classroom.',
      image: '/api/placeholder/400/400',
      expertise: ['Data', 'Algorithms', 'Engineering'],
      icon: Code,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Jill',
      role: 'Creative Guide',
      description: 'A dynamic educator who specializes in creative coding and interactive design.',
      image: '/api/placeholder/400/400',
      expertise: ['UI/UX', 'Design', 'Art'],
      icon: Rocket,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Jackie',
      role: 'Innovation Coach',
      description: 'A tech enthusiast who helps students explore cutting-edge technologies.',
      image: '/api/placeholder/400/400',
      expertise: ['AI', 'Games', 'Mobile'],
      icon: Lightbulb,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <IconRain />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="flex flex-col items-center mb-8">
            <div className="flex justify-center mb-4 animate-bounce">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Meet Your Tech Education Team
            </h1>
            <p className="text-xl text-white/90 text-center max-w-2xl">
              A family of tech-savvy educators dedicated to making your learning journey deliciously engaging
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, role, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pl-12 rounded-lg bg-white dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMembers.map((member, index) => {
            const Icon = member.icon;
            const isSelected = selectedMember === member.name;
            const isHovered = hoveredCard === member.name;

            return (
              <Card
                key={member.name}
                className={`group overflow-hidden border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-500 
                  ${isHovered ? 'ring-2 ring-purple-500' : ''}`}
                onMouseEnter={() => setHoveredCard(member.name)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animation: `fadeSlideIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 
                    transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-40'}`} />
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transition-all duration-700 
                      ${isHovered ? 'scale-110 blur-sm' : 'scale-100'}`}
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <div className="relative">
                      <Icon className={`w-6 h-6 text-white transform transition-all duration-300 
                        ${isHovered ? 'rotate-12' : ''}`} />
                      {isHovered && (
                        <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 z-20">
                    <h3 className="text-sm font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <div className="flex items-center text-white/90 text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      {member.role}
                    </div>
                  </div>
                </div>

                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {member.expertise.map((exp) => (
                      <span
                        key={exp}
                        className={`px-2 py-0.5 bg-gradient-to-r ${member.color} text-white rounded-full text-xs`}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  <Button
                    onClick={() => setSelectedMember(isSelected ? null : member.name)}
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                  >
                    {isSelected ? (
                      <>
                        <ChevronUp className="w-3 h-3 mr-1" />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 mr-1" />
                        More
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 inline-flex mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No team members found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default BagelFamilyIntro;





















