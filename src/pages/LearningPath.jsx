import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from "../components/ui/input";
import { Search, Clock, BookOpen, Users, Star, Filter, Briefcase, Award, Zap, ChevronRight, ChevronDown, Check } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Link } from "react-router-dom";
import StarRating from '../components/ui/StarRatingImage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LearningPathCard from '../components/ui/LearningPathCard';

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Listbox = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* دکمه اصلی */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full md:w-64 flex items-center justify-between py-3 px-4 bg-white dark:bg-gray-800 border-0 rounded-lg text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>{value ? value.name : placeholder}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* لیست بازشو */}
      <AnimatePresence>
        {isOpen && (
         <motion.div
         initial={{ opacity: 0, y: -8 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -8 }}
         transition={{ duration: 0.2 }}
         className="absolute z-10 mt-2 w-60 max-h-64 bg-white dark:bg-white dark:text-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-y-auto overflow-x-hidden"
       >
         {options.map((option) => (
           <button
             key={option.id}
             onClick={() => {
               onChange(option);
               setIsOpen(false);
             }}
             className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-600 dark:hover:bg-gray-700 transition ${
               value && value.id === option.id
                 ? "font-semibold text-blue-600 dark:text-blue-400"
                 : ""
             }`}
           >
             <span className="break-words">{option.name}</span>
             {value && value.id === option.id && (
               <Check className="w-4 h-4 text-blue-500" />
             )}
           </button>
         ))}
       </motion.div>
       
        )}
      </AnimatePresence>
    </div>
  );
};


const CareerPathsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [paths, setPaths] = useState([]);
  const [displayedPaths, setDisplayedPaths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Store rawName instead of id
  const [userProgress, setUserProgress] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false)
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
        rating: 4.5, // fixed rating
        enrolledCount: path.enroll_count ?? 0,
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
  
      const translatedCategories = data.map(category => ({
        id: category.id,
        name: t(category.name),
        rawName: category.name
      }));

      setCategories(translatedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      enqueueSnackbar(t('Failed to fetch categories. Please try again later.'), { variant: 'error' });
    }
  };
//////////////////
  // Fetch user progress for a learning path
  const fetchUserProgress = async (id) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const token = localStorage.getItem('accessToken');
      const url = `https://api.tadrisino.org/courses/paths/${id}/user_progress/`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserProgress(data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  };
//////////////
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-br dark:from-blue-950/100 dark:via-blue-950/95 dark:to-purple-950/100">
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

            <Listbox
              value={selectedCategory ? categories.find(c => c.rawName === selectedCategory) : null}
              onChange={(selected) => setSelectedCategory(selected.rawName)}
              options={[
                { id: '', name: t('All Categories'), rawName: '' },
                ...categories.map(c => ({ id: c.id, name: c.name, rawName: c.rawName })),
              ]}
              placeholder={t('Select Category')}
            />

          </div>
        </div>
      </div>

      {/* Paths Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 ">
        {displayedPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPaths.map(path => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('No paths found')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? t('No paths match your search')
                : t('No paths available in this category')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathsPage;