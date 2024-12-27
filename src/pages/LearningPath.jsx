import React, { useState, useEffect } from 'react';
import { Search, Clock, BookOpen, Star, Filter, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const CareerPathsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [paths, setPaths] = useState([]);
  const [displayedPaths, setDisplayedPaths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        image: path.image || '/api/placeholder/400/200'
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 dark:bg-darkBase">
      <div className="bg-white border-b dark:bg-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-4">{t("Career Paths")}</h1>
          <p className="text-xl text-gray-600 mb-6 dark:text-gray-400">
            {t("Choose path")}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="md:w-1/4 relative z-[10]">
              <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                <SelectTrigger className="w-full border border-borderColor dark:border-gray-700">
                  <SelectValue placeholder={t('Select Category')} />
                </SelectTrigger>
                <SelectContent
                  className="absolute bg-lightBackground dark:bg-darkBackground shadow-lg rounded-md overflow-hidden"
                  style={{
                    minWidth: '100%',
                    top: 'calc(100% + 5px)',
                    left: 0,
                  }}
                >
                  <SelectItem value="">{t('All Categories')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {t(`categories.${category.name}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              placeholder={t('Search paths...')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="md:w-1/2 border border-borderColor dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPaths.map(path => (
            <Card 
              key={path.id} 
              className="group hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/learning-path/${path.id}`)}
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