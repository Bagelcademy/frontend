import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  Coffee,
  Heart,
  Laptop,
  Monitor,
  Terminal,
  Cpu,
  Radio,
  Wifi,
  Binary,
  Box,
  Cloud
} from 'lucide-react';
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img3 from '../assets/7.png';

const RainingIcons = () => {
  const [icons, setIcons] = useState([]);
  const availableIcons = [
    Coffee, Heart, Laptop, Monitor, Terminal, 
    Cpu, Radio, Wifi, Binary, Box, Cloud
  ];

  useEffect(() => {
    const createIcon = () => {
      const IconComponent = availableIcons[Math.floor(Math.random() * availableIcons.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 7 + Math.random() * 7;
      const size = 12 + Math.random() * 12;
      const opacity = 0.1 + Math.random() * 0.2;
      
      return {
        id: Date.now() + Math.random(),
        Icon: IconComponent,
        style: {
          left: `${left}%`,
          animation: `fall ${duration}s linear ${delay}s infinite`,
          fontSize: `${size}px`,
          opacity
        }
      };
    };

    // Create initial icons
    const initialIcons = Array(20).fill(null).map(createIcon);
    setIcons(initialIcons);

    // Add new icons periodically
    const interval = setInterval(() => {
      setIcons(prev => [...prev.slice(-19), createIcon()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ id, Icon, style }) => (
        <div key={id} className="absolute text-gray-400" style={style}>
          <Icon size={16} />
        </div>
      ))}
    </div>
  );
};

const BagelFamilyIntro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const { t } = useTranslation();

  // ... rest of the teamMembers data ...
  const teamMembers = [
    {
      name: t('team.bagelMama.name'),
      role: t('team.bagelMama.role'),
      description: t('team.bagelMama.description'),
      image: img4,
      expertise: [
        t('team.bagelMama.expertise.programming'),
        t('team.bagelMama.expertise.webDev'),
        t('team.bagelMama.expertise.digitalLiteracy'),
        t('team.bagelMama.expertise.csEducation'),
        t('team.bagelMama.expertise.curriculum'),
        t('team.bagelMama.expertise.assessment')
      ],
      stats: {
        teachingSkills: 98,
        techExpertise: 95,
        problemSolving: 92,
        studentSupport: 96
      },
      achievements: [
        t('team.bagelMama.achievements.mentored'),
        t('team.bagelMama.achievements.curriculum'),
        t('team.bagelMama.achievements.innovation'),
        t('team.bagelMama.achievements.teaching'),
        t('team.bagelMama.achievements.inclusion'),
        t('team.bagelMama.achievements.researcher')
      ],
      icon: Brain,
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: t('team.bagelPapa.name'),
      role: t('team.bagelPapa.role'),
      description: t('team.bagelPapa.description'),
      image: img5,
      expertise: [
        t('team.bagelPapa.expertise.dataStructures'),
        t('team.bagelPapa.expertise.algorithms'),
        t('team.bagelPapa.expertise.softwareEng'),
        t('team.bagelPapa.expertise.architecture'),
        t('team.bagelPapa.expertise.cloud'),
        t('team.bagelPapa.expertise.leadership')
      ],
      stats: {
        teachingSkills: 94,
        techExpertise: 98,
        problemSolving: 96,
        studentSupport: 92
      },
      achievements: [
        t('team.bagelPapa.achievements.techLead'),
        t('team.bagelPapa.achievements.mentorship'),
        t('team.bagelPapa.achievements.stemChampion'),
        t('team.bagelPapa.achievements.experience'),
        t('team.bagelPapa.achievements.author'),
        t('team.bagelPapa.achievements.innovation')
      ],
      icon: Code,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: t('team.jill.name'),
      role: t('team.jill.role'),
      description: t('team.jill.description'),
      image: img6,
      expertise: [
        t('team.jill.expertise.creativeCoding'),
        t('team.jill.expertise.uiux'),
        t('team.jill.expertise.digitalArt'),
        t('team.jill.expertise.interactive'),
        t('team.jill.expertise.frontend'),
        t('team.jill.expertise.designThinking')
      ],
      stats: {
        teachingSkills: 96,
        techExpertise: 94,
        problemSolving: 90,
        studentSupport: 98
      },
      achievements: [
        t('team.jill.achievements.campLeader'),
        t('team.jill.achievements.specialist'),
        t('team.jill.achievements.studentChoice'),
        t('team.jill.achievements.innovation'),
        t('team.jill.achievements.excellence'),
        t('team.jill.achievements.impact')
      ],
      icon: Rocket,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: t('team.jackie.name'),
      role: t('team.jackie.role'),
      description: t('team.jackie.description'),
      image: img3,
      expertise: [
        t('team.jackie.expertise.ai'),
        t('team.jackie.expertise.gameDev'),
        t('team.jackie.expertise.mobile'),
        t('team.jackie.expertise.emerging'),
        t('team.jackie.expertise.projectMgmt'),
        t('team.jackie.expertise.agile')
      ],
      stats: {
        teachingSkills: 92,
        techExpertise: 96,
        problemSolving: 95,
        studentSupport: 94
      },
      achievements: [
        t('team.jackie.achievements.clubFounder'),
        t('team.jackie.achievements.hackathon'),
        t('team.jackie.achievements.champion'),
        t('team.jackie.achievements.aiPioneer'),
        t('team.jackie.achievements.gameJudge'),
        t('team.jackie.achievements.diversity')
      ],
      icon: Lightbulb,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const StatBar = ({ value, label, color }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-sm text-blue-600 dark:text-blue-400">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`bg-gradient-to-r ${color} h-2 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RainingIcons />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="flex flex-col items-center mb-8">
            <div className="flex justify-center mb-4">
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
          {filteredMembers.map((member) => {
            const Icon = member.icon;
            const isExpanded = expandedCard === member.name;

            return (
              <Card
                key={member.name}
                className="overflow-hidden border-0 bg-white dark:bg-gray-800 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <Icon className="w-6 h-6 text-white" />
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
                  <div className={`space-y-4 overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[1000px]' : 'max-h-0'
                  }`}>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.description}
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Book className="w-3 h-3 mr-1 text-blue-500" />
                        Expertise
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((exp) => (
                          <span
                            key={exp}
                            className={`px-2 py-0.5 bg-gradient-to-r ${member.color} text-white rounded-full text-xs`}
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Stats</h4>
                      <StatBar value={member.stats.teachingSkills} label="Teaching" color={member.color} />
                      <StatBar value={member.stats.techExpertise} label="Tech" color={member.color} />
                      <StatBar value={member.stats.problemSolving} label="Problem Solving" color={member.color} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center">
                        <Award className="w-3 h-3 mr-1 text-purple-500" />
                        Achievements
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {member.achievements.map((achievement) => (
                          <li key={achievement} className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            <span className="text-gray-600 dark:text-gray-400">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => setExpandedCard(isExpanded ? null : member.name)}
                    className={`w-full mt-3 bg-gradient-to-r ${member.color} text-white text-sm`}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        {t('More')}
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





















