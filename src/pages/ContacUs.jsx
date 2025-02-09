import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Mail, Phone, Smartphone, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>{t("Contact Us")} | Bagelcademy</title>
        <meta name="description" content={t("Get in touch with the Bagelcademy team")} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t("Contact Us")}
            </h1>
          </div>

          <Card className="overflow-hidden border-0 bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t("Ways to Contact")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 space-x-reverse">
                    <Mail className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{t("Email")}</p>
                      <p className="text-gray-600 dark:text-gray-400">support@bagelcademy.org</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 space-x-reverse">
                    <Smartphone className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{t("Mobile")}</p>
                      <p className="text-gray-600 dark:text-gray-400">09039179491</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 space-x-reverse">
                    <Phone className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{t("Landline")}</p>
                      <p className="text-gray-600 dark:text-gray-400">02433052676</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 space-x-reverse">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{t("Address")}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t("University of Zanjan, Thecnology Incubator Center - Arman Ertebat Vira Knowledge-Based Company")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 space-x-reverse border-b dark:border-gray-700 pb-6 mb-6">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {t("Live Chat")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("For online support, use Gofteeno chat. Our team is available during working hours.")}
                    </p>
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