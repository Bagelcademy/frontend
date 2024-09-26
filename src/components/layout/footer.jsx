// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-6">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <p className="text-gray-600 dark:text-gray-400">&copy; 2024 Bagelcademy. All rights reserved.</p>
//         <nav className="space-x-4">
//           <Link to="/about-us" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link>
//           <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
//           <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms of Service</Link>
//         </nav>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-600 dark:text-gray-400 text-xl font-bold mb-4">Bagelcademy</h3>
            <p className="text-gray-600 dark:text-gray-400">Stay Curious. Keep Growing.</p>
          </div>
          <div>
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-buttonColor transition-colors">Home</Link></li>
              <li><Link to="/ask" className="hover:text-buttonColor transition-colors">AI course design</Link></li>
              <li><Link to="/courses" className="hover:text-buttonColor transition-colors">Courses</Link></li>
              <li><Link to="/shop" className="hover:text-buttonColor transition-colors">Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-600 dark:text-gray-400">Email: info@bagelcademy.com</p>
            <p className="text-gray-600 dark:text-gray-400">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h4 className="text-gray-600 dark:text-gray-400 text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-buttonColor transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-buttonColor transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-buttonColor transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-buttonColor transition-colors"><Linkedin /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-buttonColor text-center text-gray-400">
          <p>&copy; 2024 Bagelcademy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;