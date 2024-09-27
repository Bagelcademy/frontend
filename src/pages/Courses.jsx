import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/selectIndex";
import CourseCard from '../components/ui/coursecard';
import '../css/courses.css';

const ITEMS_PER_PAGE = 20;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); // Use useNavigate to navigate programmatically

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, courses, page]);

  const fetchCourses = async () => {
    const response = await fetch('http://127.0.0.1:8000/courses/courses/get_all_courses/');
    const data = await response.json();
    setCourses(data);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setDisplayedCourses(filtered.slice(0, page * ITEMS_PER_PAGE));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Function to navigate to the ./ask page
  const handleAskClick = () => {
    navigate('/ask');
  };

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 animate-fade-in-down">Courses</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="md:w-1/2 border border-borderColor dark:border-gray-700"
          />
          <Select onValueChange={handleCategoryChange} value={selectedCategory} className="md:w-1/4">
            <SelectTrigger className="border border-borderColor dark:border-gray-700">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-lightBackground dark:bg-darkBackground">
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAskClick} 
            className="md:w-1/4 bg-buttonColor text-white py-2 px-4 rounded relative overflow-hidden animate-light-effect"
          >
            Did'nt you find what you were looking for?
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-light-move"></span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {displayedCourses.length < courses.length && (
          <div className="mt-8 text-center">
            <Button onClick={handleLoadMore} className="bg-buttonColor  text-white py-2 px-4 rounded ">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
