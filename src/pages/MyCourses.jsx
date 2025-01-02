import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Award, Zap, Search, Users,
  Clock, ChevronRight, Star, Filter, Globe2
} from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

const ITEMS_PER_PAGE = 12;
const TOTAL_LESSONS = 15; // Total lessons per course

const motivationalQuotes = [
  { quote: "Every bagel was once just flour and water. Your potential is limitless!", author: "Mama Bagel" },
  { quote: "Rise and shine like a fresh-baked bagel!", author: "Papa Bagel" },
  { quote: "Keep rolling through your lessons, you're on a roll!", author: "Mama Bagel" },
  { quote: "A journey of a thousand miles begins with a single bite!", author: "Papa Bagel" },
  { quote: "You're getting more well-rounded every day!", author: "Mama Bagel" }
];

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3 h-3 ${star <= rating
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

const MyCourses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategoryId, setFilteredCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    fetchMyCourses();
    fetchCategories();
    fetchUserProfile();
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, courses, page]);


  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://bagelapi.bagelcademy.org/account/user-info/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };


  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://bagelapi.bagelcademy.org/courses/courses/get_user_courses/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCourses(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://bagelapi.bagelcademy.org/courses/Category/');
      const data = await response.json();
      // Map categories with translated names
      const translatedCategories = data.map(category => ({
        ...category,
        translatedName: t(`categories.${category.name}`)
      }));
      setCategories(translatedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };


  const filterCourses = () => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filteredCategoryId) {
      filtered = filtered.filter(item => item.course.category === filteredCategoryId);
    }
    setDisplayedCourses(filtered.slice(0, page * ITEMS_PER_PAGE));
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const selectedCategoryId = categories.find(category => category.name === value)?.id;
    setFilteredCategoryId(selectedCategoryId || '');
    setPage(1);
  };


  const CourseCard = ({ item }) => {
    const { course, progress } = item;
    const completedLessons = progress.completed_lessons.length;
    const progressPercentage = (completedLessons / TOTAL_LESSONS) * 100;

    return (
      <Card className="group h-full overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-102">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center space-x-2 text-white mb-2">
              <StarRating rating={4.5} />
            </div>
          </div>
        </div>

        <CardContent className="relative p-6">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-3 line-clamp-2">
              {course.title}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 mx-1" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Globe2 className="w-4 h-4 mx-1" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Award className="w-4 h-4 mx-1 text-purple-500" />
                  <span>{progress.points_earned} pts</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mx-1 text-yellow-500" />
                  <span>{progress.streak} streak</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{completedLessons}/{TOTAL_LESSONS} lessons</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={() => navigate(`/course/${course.id}`)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group-hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">
              {progress.course_completed ? t('Review Course') : t('Continue Learning')}
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="container mx-auto px-4 py-16 pt-32">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={userProfile?.profile_picture}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-white mt-4 text-xl font-semibold">Welcome back, {userProfile?.username}!</h2>

            {/* Motivational Quote */}
            <div className="mt-4 text-center max-w-2xl">
              <p className="text-white/90 italic">"{quote.quote}"</p>
              <p className="text-white/70 text-sm mt-2">- {quote.author}</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pl-12 rounded-lg bg-white dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Select
                onValueChange={handleCategoryChange}
                value={selectedCategory}
                className="w-full md:w-64"
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-0">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allCategories')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.translatedName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => navigate('/courses')}
                className="w-full md:w-auto bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-white/90"
              >
                {t('Explore More Courses')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-12">
        {displayedCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 inline-flex mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('noCourses')}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('Try adjusting your search or filters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((item, index) => (
              <CourseCard key={`${item.course.id}-${index}`} item={item} />
            ))}
          </div>
        )}

        {displayedCourses.length < courses.length && (
          <div className="mt-12 text-center">
            <Button
              onClick={() => setPage(p => p + 1)}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;