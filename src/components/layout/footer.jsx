import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import the hook

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-zinc-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="text-gray-600 dark:text-gray-400 text-xl font-bold mb-4">{t('Bagelcademy')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('Stay Curious. Keep Growing.')}</p>
            <div className="flex w-[40%] items-center justify-center p-3 rounded-xl border-2 border-secondary mt-4">
              <a referrerpolicy="origin" target="_blank"
                className="w-[110px] h-[110px] sm:w-[75px] sm:h-[75px]"
                href="https://trustseal.enamad.ir/?id=535351&amp;Code=skYskz5wo6Y6CbKTJeDAv8nNaxupOMFE">
                <img referrerpolicy="origin"  width="110" height="110"
                  src="https://trustseal.enamad.ir/logo.aspx?id=535351&amp;Code=skYskz5wo6Y6CbKTJeDAv8nNaxupOMFE"
                  alt="" className="cursor-pointer"
                  code="skYskz5wo6Y6CbKTJeDAv8nNaxupOMFE" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">{t('Quick Links')}</h4>
            <ul className="space-y-2 text-center">
              <li><Link to="/" className="hover:text-buttonColor transition-colors">{t('Home')}</Link></li>
              <li><Link to="/ask" className="hover:text-buttonColor transition-colors">{t('AI course design')}</Link></li>
              <li><Link to="/courses" className="hover:text-buttonColor transition-colors">{t('Courses')}</Link></li>
              <li><Link to="/shop" className="hover:text-buttonColor transition-colors">{t('Shop')}</Link></li>
              <li><Link to="/about-us" className="hover:text-buttonColor transition-colors">{t('About us')}</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">{t('Contact')}</h4>
            <p className="text-gray-600 dark:text-gray-400">{t('Email')}: info@bagelcademy.com</p>
            <p className="text-gray-600 dark:text-gray-400">{t('Phone')}: 02433052676</p>
            <div className="mt-4 text-black">
            <img referrerpolicy='origin' id='rgvjjzpeapfuoeukapfuwlao' style={{cursor: 'pointer'}} 
              onClick={() => window.open("https://logo.samandehi.ir/Verify.aspx?id=375854&p=xlaojyoedshwmcsidshwaods", "Popup", "toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30")} 
              alt='logo-samandehi' 
              src='https://logo.samandehi.ir/logo.aspx?id=375854&p=qftiyndtujynaqgwujynshwl' />
          </div>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">{t('Follow Us')}</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-buttonColor transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-buttonColor transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-buttonColor transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-buttonColor transition-colors"><Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-buttonColor text-center text-gray-400">
          <p>&copy;2025 Bagelcademy. {t('All rights reserved.')}</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
