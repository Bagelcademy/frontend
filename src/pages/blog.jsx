import React, { useState, useEffect } from 'react';
import { Moon, Sun, Loader2 } from 'lucide-react';

const AINewsPage = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data simultaneously
        const [
          featuredResponse,
          latestResponse,
          storiesResponse,
          categoriesResponse
        ] = await Promise.all([
          fetch('https://api.tadrisino.org/blog/posts/all/'),
          fetch('https://api.tadrisino.org/blog/posts/newest/'),
          fetch('https://api.tadrisino.org/blog/posts/all/'),
          fetch('https://api.tadrisino.org/courses/Category/')
        ]);

        // Check if all responses are ok
        if (!featuredResponse.ok || !latestResponse.ok || !storiesResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse JSON responses
        const featuredData = await featuredResponse.json();
        const latestData = await latestResponse.json();
        const storiesData = await storiesResponse.json();
        const categoriesData = await categoriesResponse.json();

        // Helper function to extract array from response
        const extractArray = (data) => {
          if (Array.isArray(data)) {
            return data;
          }
          if (data && typeof data === 'object') {
            // Check common property names that might contain the array
            const possibleArrays = ['results', 'data', 'posts', 'articles', 'items', 'content'];
            for (const prop of possibleArrays) {
              if (Array.isArray(data[prop])) {
                return data[prop];
              }
            }
            // If no array found, return the object as single item array
            return [data];
          }
          return [];
        };

        // Set data with limits using helper function
        const featuredArray = extractArray(featuredData);
        const latestArray = extractArray(latestData);
        const storiesArray = extractArray(storiesData);
        const categoriesArray = extractArray(categoriesData);

        setFeaturedArticles(featuredArray.slice(0, 4)); // Limit to 4 for grid layout
        setLatestNews(latestArray.slice(0, 3)); // Limit to 3 for sidebar
        setTopStories(storiesArray.slice(0, 3)); // Limit to 3 for main content
        setCategories(categoriesArray.slice(0, 10)); // Limit to 10 categories

        console.log('API Response Structure:', {
          featured: featuredData,
          latest: latestData,
          stories: storiesData,
          categories: categoriesData
        });

      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Navigation function to handle blog post clicks
  const handleBlogClick = (postId) => {
    if (postId) {
      // Navigate to blog post detail page
      window.location.href = `/blog/${postId}`;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">خطا در بارگذاری</h2>
          <p className="text-gray-600 dark:text-gray-400">لطفاً دوباره تلاش کنید</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                مجله هوش مصنوعی
              </h1>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Featured Articles Grid */}
        <div className="grid grid-cols-6 gap-6 mb-12" dir="rtl">
          {featuredArticles.length > 0 && (
            <>
              {/* First Column - Large Article */}
              <div 
                className="col-span-6 md:col-span-2 relative group overflow-hidden rounded-lg h-[400px] cursor-pointer"
                onClick={() => handleBlogClick(featuredArticles[0].id)}
              >
                <img
                  src={featuredArticles[0].image || featuredArticles[0].featured_image || '/api/placeholder/400/400'}
                  alt={featuredArticles[0].title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-sm w-fit mb-3 text-white">
                    {featuredArticles[0].category?.name || 'هوش مصنوعی'}
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white leading-relaxed">
                    {featuredArticles[0].title}
                  </h2>
                  <div className="text-gray-300 text-sm">
                    {featuredArticles[0].author?.name || featuredArticles[0].author || 'نویسنده'} • 
                    {featuredArticles[0].created_at ? new Date(featuredArticles[0].created_at).toLocaleDateString('fa-IR') : featuredArticles[0].date}
                  </div>
                </div>
              </div>

              {/* Middle Column - Two Medium Articles */}
              <div className="col-span-6 md:col-span-2 space-y-6">
                {featuredArticles.slice(1, 3).map((article, index) => (
                  <div 
                    key={article.id || index} 
                    className="relative group overflow-hidden rounded-lg h-[190px] cursor-pointer"
                    onClick={() => handleBlogClick(article.id)}
                  >
                    <img
                      src={article.image || article.featured_image || '/api/placeholder/400/200'}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/200';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                      <h2 className="text-base font-bold mb-2 text-white leading-relaxed">
                        {article.title}
                      </h2>
                      <div className="text-gray-300 text-sm">
                        {article.author?.name || article.author || 'نویسنده'} • 
                        {article.created_at ? new Date(article.created_at).toLocaleDateString('fa-IR') : article.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Last Column - Large Article */}
              {featuredArticles[3] && (
                <div 
                  className="col-span-6 md:col-span-2 relative group overflow-hidden rounded-lg h-[400px] cursor-pointer"
                  onClick={() => handleBlogClick(featuredArticles[3].id)}
                >
                  <img
                    src={featuredArticles[3].image || featuredArticles[3].featured_image || '/api/placeholder/400/400'}
                    alt={featuredArticles[3].title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-sm w-fit mb-3 text-white">
                      {featuredArticles[3].category?.name || 'مقاله'}
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white leading-relaxed">
                      {featuredArticles[3].title}
                    </h2>
                    <div className="text-gray-300 text-sm">
                      {featuredArticles[3].author?.name || featuredArticles[3].author || 'نویسنده'} • 
                      {featuredArticles[3].created_at ? new Date(featuredArticles[3].created_at).toLocaleDateString('fa-IR') : featuredArticles[3].date}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Latest News & Top Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir="rtl">
          {/* Latest News Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center">
              آخرین اخبار
              <span className="text-sm font-normal mr-auto hover:text-blue-600 cursor-pointer text-gray-600 dark:text-gray-400">
                مشاهده همه
              </span>
            </h2>
            <div className="space-y-6">
              {latestNews.map((item, index) => (
                <div 
                  key={item.id || index} 
                  className="flex gap-4 group cursor-pointer"
                  onClick={() => handleBlogClick(item.id)}
                >
                  <div className="flex-grow">
                    <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      {item.author?.name || item.author || 'نویسنده'} • 
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : item.date}
                    </p>
                  </div>
                  <img
                    src={item.image || item.featured_image || '/api/placeholder/96/96'}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/96/96';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top Stories Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center">
              مطالب برگزیده
              <span className="text-sm font-normal mr-auto hover:text-blue-600 cursor-pointer text-gray-600 dark:text-gray-400">
                مشاهده همه
              </span>
            </h2>
            <div className="grid gap-6">
              {topStories.map((story, index) => (
                <div 
                  key={story.id || index} 
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-6 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => handleBlogClick(story.id)}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {story.description || story.excerpt || story.content?.substring(0, 150) + '...'}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        {story.author?.name || story.author || 'نویسنده'} • 
                        {story.created_at ? new Date(story.created_at).toLocaleDateString('fa-IR') : story.date}
                      </div>
                    </div>
                    <img
                      src={story.image || story.featured_image || '/api/placeholder/192/128'}
                      alt={story.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/192/128';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mt-12" dir="rtl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              دسته‌بندی‌ها
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <span
                  key={category.id || index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all duration-300 transform hover:scale-105"
                >
                  {category.name || category.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AINewsPage;