import React, { useState, useEffect } from 'react';
import { Search, Clock, BookOpen,Users, Star, Filter, Briefcase, Award, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Link } from "react-router-dom";
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3 h-3 ${
          star <= rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-300 text-gray-300'
        }`}
      />
    ))}
    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
      {rating.toFixed(1)}
    </span>
  </div>
);

const CareerPathsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [paths, setPaths] = useState([]);
  const [displayedPaths, setDisplayedPaths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
    const [Language, setLanguage] = useState({
      label: t('English'),
      value: 'English',
    });
    const [Level, setLevel] = useState({
      label: t('Beginner'),
      value: 'beginner',
    });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchPaths();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterPaths();
  }, [searchTerm, selectedCategory, paths]);

  const fetchPaths = async () => {
    try {
      const response = await fetch('https://bagelapi.bagelcademy.org/courses/learning-paths/');
      if (!response.ok) throw new Error('Failed to fetch paths');
      const data = await response.json();
      const transformedData = data.map(path => ({
        id: path.id,
        title: path.title,
        category: path.category || 'other',
        description: path.description,
        duration: path.duration || '6 months',
        lessons: path.lessons || 0,
        level: path.level,
        popular: path.popular || false,
        image: path.image || '/api/placeholder/400/200',
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        enrolledCount: Math.floor(Math.random() * 10000) + 1000 // Random number of enrolled students
      }));
      setPaths(transformedData);
      setDisplayedPaths(transformedData);
    } catch (error) {
      console.error("Error fetching paths:", error);
      enqueueSnackbar(t('Failed to fetch paths. Please try again later.'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://bagelapi.bagelcademy.org/courses/Category/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      enqueueSnackbar(t('Failed to fetch categories. Please try again later.'), { variant: 'error' });
    }
  };

  const filterPaths = () => {
    let filtered = paths;
    if (searchTerm) {
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(path => path.category === selectedCategory);
    }
    setDisplayedPaths(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="max-w-6xl mx-auto px-6 py-16 pt-32">
          <h1 className="text-4xl font-bold mb-4 text-white">{t("Career Paths")}</h1>
          <p className="text-xl text-white/80 mb-8">
            {t("Choose your learning journey and advance your career")}
          </p>
          
          <div className="max-w-4xl space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t('Search paths...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pl-12 rounded-lg bg-white dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="w-full md:w-64 bg-white dark:bg-gray-800 border-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('Select Category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('All Categories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Paths Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPaths.map(path => (
            <Card 
              key={path.id} 
              className="group h-full overflow-hidden border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-102"
              onClick={() => navigate(`/learning-path/${path.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={path.image}
                  alt={path.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <StarRating rating={parseFloat(path.rating)} />
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {path.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {path.description}
                  </p>
                  
                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{path.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>{path.lessons} </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{path.level}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{path.enrolledCount.toLocaleString()} </span>
                      </div>
                    </div>
          <Link 
            to={`/learning-paths/${path.id}`}
            className="block mt-4 text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
          >         
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
                    >
                      <span className="mr-2">{t("Start Learning")}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPathsPage;