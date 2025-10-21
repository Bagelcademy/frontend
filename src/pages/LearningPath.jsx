import React, { useState, useEffect } from 'react';
import { Search, Clock, BookOpen, Users, Star, Filter, Briefcase, Award, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Link } from "react-router-dom";
import StarRating from '../components/ui/StarRatingImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LearningPathCard from '../components/ui/LearningPathCard';

const CareerPathsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [paths, setPaths] = useState([]);
  const [displayedPaths, setDisplayedPaths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchPaths();
    fetchCategories();
  }, [i18n.language]);

  useEffect(() => {
    filterPaths();
  }, [searchTerm, selectedCategory, paths]);

  const fetchPaths = async () => {
    try {
      const response = await fetch('https://api.tadrisino.org/courses/learning-paths/');
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
      const response = await fetch('https://api.tadrisino.org/courses/Category/');
      const data = await response.json();
  
      // Translate category names dynamically
      const translatedCategories = data.map(category => ({
        id: category.id,
        name: t(category.name) // Translate category name dynamically
      }));
  
      setCategories(translatedCategories);
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
    return <LoadingSpinner />;
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
                <Filter className="w-4 h-4 mx-2" />
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
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPathsPage;