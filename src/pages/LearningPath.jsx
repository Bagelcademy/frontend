// LearningPath.jsx
import React, { useState, useEffect } from 'react';
import { Search, Clock, BookOpen, Star, Filter, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CareerPathsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    { id: 'all', name: t('All Paths') },
    { id: 'web', name: t('Web Development') },
    { id: 'data', name: t('Data Science') },
    { id: 'mobile', name: t('Mobile Development') },
    { id: 'ai', name: t('AI & Machine Learning') }
  ];

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await fetch('https://bagelapi.bagelcademy.org/courses/learning-paths/');
        if (!response.ok) {
          throw new Error('Failed to fetch paths');
        }
        const data = await response.json();
        // Transform API data to match your UI structure
        const transformedData = data.map(path => ({
          id: path.id,
          title: path.title,
          category: path.category || 'other',
          description: path.description,
          duration: path.duration || '6 months',
          lessons: path.lessons || 0,
          level: path.level,
          popular: path.popular || false,
          image: path.image || '/api/placeholder/400/200'
        }));
        setPaths(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  const filteredPaths = activeFilter === 'all' 
    ? paths 
    : paths.filter(path => path.category === activeFilter);

  const handlePathClick = (pathId) => {
    navigate(`/learning-path/${pathId}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 dark:bg-darkBase">
      {/* Header */}
      <div className="bg-white border-b dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-4">{t("Career Paths")}</h1>
          <p className="text-xl text-gray-600 mb-6 dark:text-gray-400">
            {t("Choose path")}
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("Search path")}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-gray-100 dark:bg-gray-800 dark:text-white" 
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-slate-600">
              <Filter className="w-4 h-4" />
              {t("Filters")}
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
              className="whitespace-nowrap bg-gray-500 text-white"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map(path => (
            <Card 
              key={path.id} 
              className="group hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handlePathClick(path.id)}
            >
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
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {path.lessons} {t("lessons")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {path.level}
                  </div>
                </div>

                <Button             
                  onClick={() => navigate(`/learning-paths/${path.id}`)}
                  className="w-full mt-4 bg-buttonColor text-white">
                  {t("View Path")}
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

