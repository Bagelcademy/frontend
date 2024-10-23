import React, { useState } from 'react';
import { Search, Clock, BookOpen, Star, Filter, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const CareerPathsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'All Paths' },
    { id: 'web', name: 'Web Development' },
    { id: 'data', name: 'Data Science' },
    { id: 'mobile', name: 'Mobile Development' },
    { id: 'ai', name: 'AI & Machine Learning' }
  ];

  const paths = [
    {
      id: 1,
      title: 'Full-Stack Engineering',
      category: 'web',
      description: 'Learn to build complete web applications from start to finish',
      duration: '6 months',
      lessons: 35,
      level: 'Beginner Friendly',
      popular: true,
      image: '/api/placeholder/400/200'
    },
    {
      id: 2,
      title: 'Data Scientist',
      category: 'data',
      description: 'Master data analysis, visualization, and machine learning',
      duration: '8 months',
      lessons: 42,
      level: 'Intermediate',
      popular: true,
      image: '/api/placeholder/400/200'
    },
    {
      id: 3,
      title: 'Mobile Development',
      category: 'mobile',
      description: 'Build iOS and Android apps with React Native',
      duration: '5 months',
      lessons: 28,
      level: 'Intermediate',
      popular: false,
      image: '/api/placeholder/400/200'
    },
    {
      id: 4,
      title: 'Machine Learning Engineer',
      category: 'ai',
      description: 'Build and deploy machine learning models',
      duration: '9 months',
      lessons: 45,
      level: 'Advanced',
      popular: false,
      image: '/api/placeholder/400/200'
    }
  ];

  const filteredPaths = activeFilter === 'all' 
    ? paths 
    : paths.filter(path => path.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-4">Career Paths</h1>
          <p className="text-xl text-gray-600 mb-6">
            Choose your path and start your journey to a new career in tech
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a path..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              onClick={() => setActiveFilter(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map(path => (
            <Card key={path.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={path.image}
                  alt={path.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors">
                      {path.title}
                    </CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </div>
                  {path.popular && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Popular
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {path.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {path.level}
                  </div>
                </div>

                <Button className="w-full mt-4">
                  View Path
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPathsPage;