import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import heroImage from '../assets/3.png';
import quizGif from '../assets/2.gif'; // Import the GIFs
import signupGif from '../assets/3.gif';
import aiGif from '../assets/ai_section.gif'
const HomePage = ({ isDarkTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/courses/courses/get_all_courses/');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main>
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-down">Welcome to Learning</h2>
            <Link to="./courses">
              <Button size="lg" className="animate-bounce bg-buttonColor text-white hover:bg-opacity-80">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-lightBackground dark:bg-darkBackground">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Popular Courses</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="w-64 transition-transform hover:scale-105 border border-borderColor">
              <img src={course.image_url} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-between py-12 px-4 bg-white dark:bg-black text-black dark:text-white">
      <div className="md:w-1/2 text-center mt-6 md:mt-0 md:text-right"> {/* Added padding-left and padding-right */}
        <h2 className="text-3xl font-bold mb-4">Ready to design your own course?</h2>
        <p className="mb-6">Design a course based on any subject or any languages you want!</p>
        <Link to="/ask">
          <Button variant="secondary" size="lg" className="bg-buttonColor text-white hover:bg-gray-800">
            go to AI
          </Button>
        </Link>
      </div>
      <div className="md:w-1/2 md:pl-20 md:pr-8 flex justify-center">
        <img src={aiGif} alt="Sign Up" className="w-64 md:w-96" />
      </div>
    </section>

      <section className="flex flex-col md:flex-row items-center justify-between py-12 px-4 bg-lightBackground dark:bg-gray-800">
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img src={quizGif} alt="Quiz" className="w-64 md:w-96" />
        </div>
        <div className="md:w-1/2 text-center md:text-left md:pl-8 md:pr-8"> {/* Added padding-left and padding-right */}
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Not sure what to learn?</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">Take our quiz to find the perfect course for you!</p>
          <Link to="/quiz">
            <Button size="lg" className="animate-pulse bg-buttonColor text-white hover:bg-opacity-80">
              Take Quiz
            </Button>
          </Link>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-between py-12 px-4 bg-white dark:bg-black text-black dark:text-white">
        <div className="md:w-1/2 text-center mt-6 md:mt-0 md:text-right"> {/* Added padding-left and padding-right */}
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="mb-6">Sign up now and get access to all our courses!</p>
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="bg-buttonColor text-white hover:bg-gray-800">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2 md:pl-20 md:pr-8 flex justify-center">
          <img src={signupGif} alt="Sign Up" className="w-64 md:w-96" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
