import React from 'react';
import { Moon, Sun } from 'lucide-react';

const AINewsPage = () => {
  const featuredArticles = [
    {
      title: "۱۰ کتاب صوتی برای گسترش دانش هوش مصنوعی",
      author: "یاسر هویدی",
      date: "۳۰ دی ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Fe2300f71-7084-47be-86bf-87b52c66fd93.png",
      size: "large"
    },
    {
      title: "نگاهی به جی‌پی‌تی ۵؛ سیاسی‌ترین مدل هوش مصنوعی",
      author: "محبوبه آذرین",
      date: "۲ اسفند ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Fe35a6aac-b85c-4c18-a2a3-885387cca79f.png",
      size: "medium"
    },
    {
      title: "۱۶ کتاب انگیزشی هوش مصنوعی که حالتان را بهتر می‌کند",
      author: "بهار نجد",
      date: "۷ بهمن ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Fcdd775f7-d6e3-45a7-9dc1-b68f2049b951.png",
      size: "medium"
    },
    {
      title: "۱۰ کتاب صوتی عالی برای سفرهای طولانی",
      author: "یاسر هویدی",
      date: "۷ بهمن ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Ff9c0f6b7-ce55-441a-95e5-820fb247259d.png",
      size: "medium"
    }
  ];

  const latestNews = [
    {
      title: "۸ مقاله برتر هوش مصنوعی که باید بخوانید",
      author: "تیم تحقیقات هوش مصنوعی",
      date: "۱۰ بهمن ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F7568d8c5-f4eb-4900-b849-bbfa0b33147c.png"
    },
    {
      title: "تأثیرگذارترین محققان هوش مصنوعی ۱۴۰۳",
      author: "مجله تک",
      date: "۱۰ بهمن ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F62932371-81c5-4ff0-a9a6-9a8469a4ca02.png"
    },
    {
      title: "پرفروش‌ترین کتاب‌های هوش مصنوعی",
      author: "مرور کتاب",
      date: "۱۰ بهمن ۱۴۰۳",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Fa3429fa7-7402-4ed4-9502-464b0c3b0bf3.png"
    }
  ];

  const topStories = [
    {
      title: "۵ نکته که درباره رایانش کوانتومی نمی‌دانستید",
      author: "روزنامه کوانتوم",
      date: "۱۰ بهمن ۱۴۰۳",
      description: "رایانش کوانتومی در حال متحول کردن دنیای هوش مصنوعی و یادگیری ماشین است.",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2Fa5bfe5f6-f50d-445f-8f11-2f9ad0dae893.png"
    },
    {
      title: "بهترین کتاب‌های هوش مصنوعی برای دانشجویان",
      author: "آموزش هوش مصنوعی",
      date: "۱۰ بهمن ۱۴۰۳",
      description: "آینده آموزش در درک مفاهیم اساسی هوش مصنوعی نهفته است.",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F664c6427-69d1-4b40-93ff-d2c8afa8a2db.png"
    },
    {
      title: "توصیه‌های مطالعاتی هوش مصنوعی",
      author: "کتابخانه تک",
      date: "۱۰ بهمن ۱۴۰۳",
      description: "در دنیای سریع تکنولوژی امروز، به‌روز ماندن اهمیت حیاتی دارد.",
      image: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F2bb7ca94-6dc3-4567-bc19-88d4e149f40a.png"
    }
  ];

  return (
    <div className={`min-h-screen dark:bg-gray-900 dark:text-white : 'bg-gray-50 text-gray-900'}`}>


      <div className="p-8">
        {/* Featured Articles Grid */}
        <div className="grid grid-cols-6 gap-6 mb-12" dir="rtl">
          {/* First Column - Large Article */}
          <div className="col-span-6 md:col-span-2 relative group overflow-hidden rounded-lg h-[400px]">
            <img
              src={featuredArticles[0].image}
              alt={featuredArticles[0].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-sm w-fit mb-3 text-white">هوش مصنوعی</div>
              <h2 className="text-xl font-bold mb-2 text-white leading-relaxed">{featuredArticles[0].title}</h2>
              <div className="text-gray-300 text-sm">
                {featuredArticles[0].author} • {featuredArticles[0].date}
              </div>
            </div>
          </div>

          {/* Middle Column - Two Medium Articles */}
          <div className="col-span-6 md:col-span-2 space-y-6">
            {featuredArticles.slice(1, 3).map((article, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg h-[190px]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                  <h2 className="text-base font-bold mb-2 text-white leading-relaxed">{article.title}</h2>
                  <div className="text-gray-300 text-sm">
                    {article.author} • {article.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last Column - Small Article */}
          <div className="col-span-6 md:col-span-2 relative group overflow-hidden rounded-lg h-[400px]">
            <img
              src={featuredArticles[3].image}
              alt={featuredArticles[3].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-sm w-fit mb-3 text-white">کتاب صوتی</div>
              <h2 className="text-xl font-bold mb-2 text-white leading-relaxed">{featuredArticles[3].title}</h2>
              <div className="text-gray-300 text-sm">
                {featuredArticles[3].author} • {featuredArticles[3].date}
              </div>
            </div>
          </div>
        </div>
        
        {/* Latest News & Top Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir="rtl">
          {/* Latest News Section */}
          <div className="lg:col-span-1">
            <h2 className={`text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center`}>
              آخرین اخبار
              <span className={`text-sm font-normal mr-auto hover:text-blue-600 cursor-pointer`}>
                مشاهده همه
              </span>
            </h2>
            <div className="space-y-6">
              {latestNews.map((item, index) => (
                <div key={index} className="flex gap-4 group cursor-pointer">
                  <div className="flex-grow">
                    <h3 className={`font-semibold group-hover:text-blue-600 transition-colors`}>
                      {item.title}
                    </h3>
                    <p className=" dark:text-gray-400  dark:text-gray-600 text-sm mt-2">
                      {item.author} • {item.date}
                    </p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top Stories Section */}
          <div className="lg:col-span-2">
            <h2 className={`text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center`}>
              مطالب برگزیده
              <span className={`text-sm font-normal mr-auto hover:text-blue-600 cursor-pointer`}>
                مشاهده همه
              </span>
            </h2>
            <div className="grid gap-6">
              {topStories.map((story, index) => (
                <div 
                  key={index} 
                  className=" dark:bg-gray-800 hover:bg-gray-200 
                  bg-white hover:bg-gray-50 rounded-lg p-6 
                  transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                      <p className="dark:text-gray-400 text-gray-600 mb-4">{story.description}</p>
                      <div className="text-sm dark:text-gray-500 text-gray-600">
                        {story.author} • {story.date}
                      </div>
                    </div>
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINewsPage;