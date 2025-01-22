import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-zinc-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Company Info */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-600 dark:text-gray-400 text-xl font-bold mb-4">{t('Bagelcademy')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">{t('Stay Curious. Keep Growing.')}</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">{t('Quick Links')}</h4>
            <ul className="space-y-2 text-center text-gray-600 dark:text-gray-400">
              <li><Link to="/" className="hover:text-buttonColor transition-colors">{t('Home')}</Link></li>
              <li><Link to="/ask" className="hover:text-buttonColor transition-colors">{t('AI course design')}</Link></li>
              <li><Link to="/courses" className="hover:text-buttonColor transition-colors">{t('Courses')}</Link></li>
              <li><Link to="/shop" className="hover:text-buttonColor transition-colors">{t('Shop')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center">
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">{t('Contact')}</h4>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">{t('Email')}: info@bagelcademy.com</p>
              <p className="text-gray-600 dark:text-gray-400">{t('Phone')}: 02433052676</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">{t('Follow Us')}</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-buttonColor transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-buttonColor transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-buttonColor transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-buttonColor transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center items-center gap-4 mb-6">
          {/* eNamad */}
          <a 
            href="https://trustseal.enamad.ir/?id=535351&amp;Code=skYskz5wo6Y6CbKTJeDAv8nNaxupOMFE" 
            target="_blank"
            className="block"
          >
            <img 
              src="https://trustseal.enamad.ir/logo.aspx?id=535351&amp;Code=skYskz5wo6Y6CbKTJeDAv8nNaxupOMFE"
              alt="eNamad"
              className="w-16 h-16 object-contain"
            />
          </a>

          {/* Samandehi */}
          <img 
            src="https://logo.samandehi.ir/logo.aspx?id=375854&p=qftiyndtujynaqgwujynshwl"
            alt="Samandehi"
            className="w-16 h-16 object-contain cursor-pointer"
            onClick={() => window.open("https://logo.samandehi.ir/Verify.aspx?id=375854&p=xlaojyoedshwmcsidshwaods", "Popup", "toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30")}
          />

          {/* Senfi Logo */}
          <img 
            src="../../assets/senfi.png"
            alt="Senfi Logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Additional Links */}
        <div className="flex justify-center gap-4 mb-6 text-sm">
          <Link to="/about-us" className="text-gray-600 hover:text-buttonColor transition-colors">{t('About us')}</Link>
          <Link to="/FAQ" className="text-gray-600 hover:text-buttonColor transition-colors">{t('FAQ')}</Link>
          <Link to="/terms" className="text-gray-600 hover:text-buttonColor transition-colors">{t('Terms')}</Link>
          <Link to="/privacy" className="text-gray-600 hover:text-buttonColor transition-colors">{t('Privacy')}</Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm border-t border-buttonColor pt-4">
          <p>&copy; 2025 Bagelcademy. {t('All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;