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
import img1 from '../assets/7.png';
import img2 from '../assets/7.png';
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

  // ... rest of the teamMembers data ...
  const teamMembers = [
    {
      name: 'Bagel Mama',
      role: 'Tech Education Expert',
      description: 'A brilliant computer science educator who makes complex coding concepts feel as warm and comforting as freshly baked bread. With her nurturing approach and deep technical expertise, she transforms intimidating programming challenges into digestible, delicious learning experiences.',
      image: img4,
      expertise: [
        'Programming Fundamentals',
        'Web Development',
        'Digital Literacy',
        'Computer Science Education',
        'Curriculum Design',
        'Learning Assessment'
      ],
      stats: {
        teachingSkills: 98,
        techExpertise: 95,
        problemSolving: 92,
        studentSupport: 96
      },
      achievements: [
        '10,000+ Students Mentored',
        'Award-Winning Curriculum',
        'EdTech Innovation Prize',
        'Best Teaching Practices Award',
        'Digital Inclusion Champion',
        'CS Education Researcher of the Year'
      ],
      icon: Brain,
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Bagel Papa',
      role: 'STEM Solutions Architect',
      description: 'A seasoned engineer turned educator who brings real-world tech experience to the classroom. His blend of industry expertise and dad jokes creates an engaging learning environment where complex concepts become surprisingly simple and memorable.',
      image: img1,
      expertise: [
        'Data Structures',
        'Algorithm Design',
        'Software Engineering',
        'System Architecture',
        'Cloud Computing',
        'Technical Leadership'
      ],
      stats: {
        teachingSkills: 94,
        techExpertise: 98,
        problemSolving: 96,
        studentSupport: 92
      },
      achievements: [
        'Former Tech Lead at BagelSoft',
        'Created Mentorship Program',
        'STEM Education Champion',
        '20+ Years Industry Experience',
        'Published Technical Author',
        'Innovation in Teaching Award'
      ],
      icon: Code,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Jill',
      role: 'Creative Tech Guide',
      description: 'A dynamic educator who specializes in creative coding and interactive design. She bridges the gap between art and technology, helping students discover the beauty in both worlds while building impressive digital projects that showcase their creativity.',
      image: img2,
      expertise: [
        'Creative Coding',
        'UI/UX Design',
        'Digital Art',
        'Interactive Media',
        'Front-end Development',
        'Design Thinking'
      ],
      stats: {
        teachingSkills: 96,
        techExpertise: 94,
        problemSolving: 90,
        studentSupport: 98
      },
      achievements: [
        'Youth Coding Camp Leader',
        'Digital Arts Specialist',
        'Student Choice Award',
        'Creative Tech Innovation Prize',
        'Design Education Excellence',
        'Community Impact Award'
      ],
      icon: Rocket,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Jackie',
      role: 'Innovation Coach',
      description: 'A tech enthusiast who helps students explore cutting-edge technologies. With boundless energy and forward-thinking approach, she guides learners through the exciting frontiers of AI, gaming, and mobile development, turning complex concepts into exciting discoveries.',
      image: img3,
      expertise: [
        'Artificial Intelligence',
        'Game Development',
        'Mobile Apps',
        'Emerging Technologies',
        'Project Management',
        'Agile Methodologies'
      ],
      stats: {
        teachingSkills: 92,
        techExpertise: 96,
        problemSolving: 95,
        studentSupport: 94
      },
      achievements: [
        'Tech Club Founder',
        'Hackathon Mentor',
        'Innovation Champion',
        'AI Education Pioneer',
        'Game Dev Competition Judge',
        'Tech Diversity Advocate'
      ],
      icon: Lightbulb,
      color: 'from-orange-500 to-amber-500'
    },
    {
      name: 'Java Joe',
      role: 'Backend Specialist',
      description: 'A methodical and passionate educator specializing in server-side technologies and database design. He brews up perfect analogies that help students understand complex backend concepts, making distributed systems and data structures as smooth as his morning coffee.',
      image: img5,
      expertise: [
        'Java Development',
        'Database Design',
        'API Architecture',
        'Microservices',
        'Performance Optimization',
        'Security Best Practices'
      ],
      stats: {
        teachingSkills: 95,
        techExpertise: 97,
        problemSolving: 94,
        studentSupport: 93
      },
      achievements: [
        'Database Design Expert',
        'Security Certification Trainer',
        'Backend Excellence Award',
        'Open Source Contributor',
        'Enterprise Architecture Guru',
        'Performance Optimization Specialist'
      ],
      icon: Code,
      color: 'from-blue-600 to-cyan-500'
    },
    {
      name: 'Ruby Rachel',
      role: 'Full-Stack Mentor',
      description: 'A versatile educator who excels at teaching both frontend and backend development. Her holistic approach to web development education helps students build complete, production-ready applications while understanding the interconnections between all system components.',
      image: img6,
      expertise: [
        'Ruby on Rails',
        'Full-Stack Development',
        'DevOps Practices',
        'Testing Strategies',
        'Web Security',
        'Deployment Automation'
      ],
      stats: {
        teachingSkills: 97,
        techExpertise: 95,
        problemSolving: 96,
        studentSupport: 95
      },
      achievements: [
        'Full-Stack Development Lead',
        'Testing Framework Creator',
        'DevOps Education Pioneer',
        'Continuous Integration Expert',
        'Agile Team Leader',
        'Mentorship Excellence Award'
      ],
      icon: Rocket,
      color: 'from-red-500 to-pink-500'
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





















