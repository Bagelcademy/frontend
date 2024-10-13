import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LearningPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://bagelapi.artina.org/courses/learning-paths/')
      .then(res => res.json())
      .then(data => {
        setPaths(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">Learning Paths</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map(path => (
          <div key={path.id} className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="mb-4 text-2xl font-bold">{path.name}</h2>
            <p className="mb-4 text-gray-600">{path.description}</p>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
              <div className="h-full w-0 bg-blue-500 transition-all duration-1000 ease-out group-hover:w-full"></div>
            </div>
            <Link to={`/learning-paths/${path.id}`} className="mt-4 inline-block rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
              Explore Path
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPathsPage;