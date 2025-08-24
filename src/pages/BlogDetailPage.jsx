import React, { useState, useEffect } from 'react';
import { Moon, Sun, Loader2, ArrowRight, Calendar, User, Eye, Share2, Heart, BookOpen, Clock } from 'lucide-react';

const BlogDetailPage = ({ postId = 1, onNavigate }) => {
  const [post, setPost] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        
        // Fetch post detail and recommendations simultaneously
        const [postResponse, recommendationsResponse] = await Promise.all([
          fetch(`http://localhost:8000/blog/posts/${postId}/`),
          fetch('http://localhost:8000/blog/posts/all/')
        ]);

        if (!postResponse.ok) {
          throw new Error('پست یافت نشد');
        }

        const postData = await postResponse.json();
        const recommendationsData = await recommendationsResponse.json();

        // Helper function to extract array from response
        const extractArray = (data) => {
          if (Array.isArray(data)) {
            return data;
          }
          if (data && typeof data === 'object') {
            const possibleArrays = ['results', 'data', 'posts', 'articles', 'items', 'content'];
            for (const prop of possibleArrays) {
              if (Array.isArray(data[prop])) {
                return data[prop];
              }
            }
            return [data];
          }
          return [];
        };

        setPost(postData);
        // Filter out current post from recommendations
        const filteredRecommendations = extractArray(recommendationsData)
          .filter(item => item.id !== postId)
          .slice(0, 5);
        setRecommendations(filteredRecommendations);
        setLikeCount(postData.likes || 0);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching post data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  // Function to parse markdown content
  const parseMarkdown = (content) => {
    if (!content) return '';
    
    let html = content;
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-200">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6 text-gray-800 dark:text-gray-200">$1</h1>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>');
    
    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-200 dark:border-gray-700"><code class="text-sm text-gray-800 dark:text-gray-200">$1</code></pre>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gm, '<li class="mb-2 text-gray-700 dark:text-gray-300">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>');
    
    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="mb-2 text-gray-700 dark:text-gray-300">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ol class="list-decimal list-inside mb-4 space-y-1">$1</ol>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">');
    html = '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p class="[^"]*">\s*<\/p>/g, '');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">$1</blockquote>');
    
    return html;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('لینک کپی شد!');
    }
  };

  const goBack = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.history.back();
    }
  };

  const handleRecommendationClick = (id) => {
    if (onNavigate) {
      onNavigate('post', id);
    } else {
      // Fallback: reload page with new post ID
      window.location.href = `/blog/${id}`;
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
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">خطا در بارگذاری</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={goBack}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                مجله هوش مصنوعی
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Featured Image */}
              {(post.image || post.featured_image) && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={post.image || post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/800/400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {/* Article Header */}
              <div className="p-6 md:p-8" dir="rtl">
                {/* Category */}
                {post.category && (
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {post.category.name || post.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author?.name || post.author || 'نویسنده'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('fa-IR') : post.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.views || '0'} بازدید</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time || '5'} دقیقه مطالعه</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      liked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>اشتراک</span>
                  </button>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {post.description && (
                    <div className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                      {post.description}
                    </div>
                  )}
                  
                  {post.content ? (
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
                    />
                  ) : (
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                      <p className="mb-4">
                        محتوای کامل این مقاله در حال بارگذاری است. لطفاً کمی صبر کنید یا از طریق API اصلی محتوا را دریافت کنید.
                      </p>
                      <p className="mb-4">
                        این صفحه نمونه‌ای از نحوه نمایش جزئیات یک پست وبلاگ است که شامل تمام اطلاعات مربوط به پست، اعمال کاربر و پیشنهادات مرتبط می‌باشد.
                      </p>
                      <p>
                        برای مشاهده محتوای کامل، لطفاً API مربوط به جزئیات پست را پیاده‌سازی کنید.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3">برچسب‌ها:</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                        >
                          #{tag.name || tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar - Recommendations */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center" dir="rtl">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                مطالب پیشنهادی
              </h2>
              
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                      onClick={() => handleRecommendationClick(item.id)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image || item.featured_image || '/api/placeholder/80/80'}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/80/80';
                          }}
                        />
                        <div className="flex-grow min-w-0" dir="rtl">
                          <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.author?.name || item.author || 'نویسنده'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>مطالب پیشنهادی یافت نشد</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => onNavigate ? onNavigate('home') : window.location.href = '/'}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  مشاهده همه مقالات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;