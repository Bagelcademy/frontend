import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../css/Norooz.css';
import fish from '../assets/fish.png';
import { useNavigate } from 'react-router-dom';

const NoroozPage = () => {
  const { t } = useTranslation();
  const [Ncourses, setNcourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNcourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/courses/courses/nowruz/');
        setNcourses(response.data.slice(0, 5)); // Limiting to 5 Ncourses for the milestone
        setLoading(false);
      } catch (err) {
        setError(t('errors.fetchFailed'));
        setLoading(false);
        console.error('Error fetching courses:', err);
      }
    };

    fetchNcourses();
  }, [t]);

  const toggleMilestone = (index) => {
    if (activeMilestone === index) {
      setActiveMilestone(null);
    } else {
      setActiveMilestone(index);
    }
  };

  const handleClick = (course) => {
    // Navigate to the course detail page using the course ID
    navigate(`/course/${course.id}`);
  };

  const startJourney = () => {
    // Scroll to milestone section
    const milestoneSection = document.getElementById('milestone-section');
    if (milestoneSection) {
      milestoneSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Activate the first milestone
    setActiveMilestone(0);
  };

  return (
    <div className="norooz-container">
      {/* Fish border animation */}
      <div className="fish-border">
        {[...Array(12)].map((_, index) => (
          <img 
            key={index}
            src={fish} 
            alt={t('decorative.fish')} 
            className={`border-fish fish-${index}`} 
          />
        ))}
      </div>
      
      {/* Hero Section */}
      <section className="norooz-hero" style={{ backgroundImage: 'url(https://test1-emgndhaqd0c9h2db.a01.azurefd.net/images/3339f310-a2ac-441a-99bd-3051e24c37ef.png)' }}>
        <div className="hero-content">
          <h1>{t('norooz.title')}</h1>
          <p className="subtitle">{t('norooz.subtitle')}</p>

          <button className="norooz-button start-button" onClick={startJourney}>
            <span className="button-text">{t('Nbuttons.startNewWay')}</span>
            <span className="button-icon">✨</span>
          </button>
        </div>
      </section>
      
      {/* Milestone Section */}
      <section id="milestone-section" className="milestone-section">
        <h2>{t('Ncourses.heading')}</h2>
        
        {loading ? (
          <div className="loading-spinner">{t('loading')}</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="milestone-container">
            <div className="milestone-path"></div>
            {Ncourses.map((course, index) => (
              <div 
                className={`milestone ${activeMilestone === index ? 'active' : ''}`} 
                key={course.id}
                onClick={() => toggleMilestone(index)}
              >
                <div className="milestone-marker">
                  <span className="milestone-number">{index + 1}</span>
                </div>
                <div className="milestone-content">
                  <h3>{course.title}</h3>
                  {activeMilestone === index && (
                    <div className="milestone-details">
                      <p>{course.description || t('Ncourses.noDescription')}</p>

                      {/* Pass the course object to handleClick */}
                      <button className="norooz-button" onClick={() => handleClick(course)}>
                        <span className="button-text">{t('Nbuttons.newWay')}</span>
                        <span className="button-icon">✨</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Spring Facts Section */}
      <section className="spring-facts-section">
      <div className="spring-decoration right"></div>

        <div className="spring-facts">
          <h2>{t('facts.heading')}</h2>
          <div className="fact-card">
            <h3>{t('facts.fact1Title')}</h3>
            <p>{t('facts.fact1Content')}</p>
          </div>
          <div className="fact-card">
            <h3>{t('facts.fact2Title')}</h3>
            <p>{t('facts.fact2Content')}</p>
          </div>
          <div className="fact-card">
            <h3>{t('facts.fact3Title')}</h3>
            <p>{t('facts.fact3Content')}</p>
          </div>
        </div>
        <div className="spring-decoration left"></div>

      </section>
      
      <div className="norooz-message">
        <p>{t('norooz.wishes')}</p>
      </div>
    </div>
  );
};

export default NoroozPage;