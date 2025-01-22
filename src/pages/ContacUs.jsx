import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '../components/ui/card';
import { Mail, Phone, Smartphone, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen mt-24 bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>تماس با ما | Bagelcademy</title>
        <meta name="description" content="تماس با تیم Bagelcademy" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              درباره بیگل
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              بیگل یک پلتفرم آموزشی نوآورانه است که با هدف ارائه آموزش‌های با کیفیت و شخصی‌سازی شده طراحی شده است. ما با ترکیب تکنولوژی‌های پیشرفته و هوش مصنوعی و متدهای آموزشی مدرن، تجربه‌ای منحصر به فرد در یادگیری ایجاد می‌کنیم. هدف ما توانمندسازی دانش‌آموزان برای دستیابی به اهداف آموزشی خود است.
            </p>
          </div>

          <Card className="overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="flex items-center space-x-4 space-x-reverse border-b dark:border-gray-700 pb-6 mb-6">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      گفتگوی آنلاین
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      برای پشتیبانی آنلاین، از چت گفتینو استفاده کنید. همکاران ما در ساعات کاری آماده پاسخگویی به شما هستند.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  راه‌های ارتباطی
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Mail className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">ایمیل</p>
                      <p className="text-gray-600 dark:text-gray-400">support@bagelcademy.org</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Smartphone className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">همراه</p>
                      <p className="text-gray-600 dark:text-gray-400">09391242565</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Phone className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">تلفن ثابت</p>
                      <p className="text-gray-600 dark:text-gray-400">02433052676</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 space-x-reverse">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">آدرس</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        دانشگاه زنجان، مرکز رشد دانشگاه زنجان-شرکت دانش‌بنیان آرمان ارتباطات ویر
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;