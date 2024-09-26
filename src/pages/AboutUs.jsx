import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-black dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold border-b-4 border-buttonColor inline-block pb-2">
            About BagelAcademy
          </h1>
        </div>

        <div className="space-y-8 bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">
            Welcome to <strong>BagelAcademy</strong>, your go-to platform for engaging, gamified learning! 
            Our unique approach to education combines interactive lessons with personalized motivational support from the Bagel family—Dad Bagel, Mom Bagel, and their two enthusiastic kids.
          </p>

          <p className="text-lg">
            At BagelAcademy, we believe that learning should be both productive and enjoyable. 
            Whether you're mastering new skills or perfecting your craft, our virtual Bagel family is here to support you every step of the way. 
            Each family member brings their own unique personality and encouragement to help you stay motivated.
          </p>
{/* 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 border-l-4 border-borderColor bg-lightBackground dark:bg-darkBackground shadow-md">
              <h2 className="text-2xl font-semibold">Dad Bagel</h2>
              <p className="mt-2">Full of wisdom and perseverance, Dad Bagel encourages you to keep pushing forward with hard work and dedication.</p>
            </div> */}
{/* 
            <div className="p-4 border-l-4 border-borderColor bg-lightBackground dark:bg-darkBackground shadow-md">
              <h2 className="text-2xl font-semibold">Mom Bagel</h2>
              <p className="mt-2">Nurturing and caring, Mom Bagel is always there to remind you to stay balanced, take care of yourself, and keep moving forward.</p>
            </div> */}

            {/* <div className="p-4 border-l-4 border-borderColor bg-lightBackground dark:bg-darkBackground shadow-md">
              <h2 className="text-2xl font-semibold">Child 1 Bagel</h2>
              <p className="mt-2">Fun and energetic, Child 1 Bagel makes learning a game and helps you turn every study session into a victory!</p>
            </div> */}
{/* 
            <div className="p-4 border-l-4 border-borderColor bg-lightBackground dark:bg-darkBackground shadow-md">
              <h2 className="text-2xl font-semibold">Child 2 Bagel</h2>
              <p className="mt-2">Short, simple, and to the point—Child 2 Bagel is your biggest cheerleader, helping you stay upbeat and focused.</p>
            </div>
          </div> */}

          <p className="text-lg">
            Join us at BagelAcademy and let our Bagel family guide you through your educational journey, one fun and motivating step at a time!
          </p>
        </div>

        {/* <div className="text-center mt-12">
         
          <button className="px-6 py-3 bg-buttonColor text-white font-bold rounded hover:bg-red-700 transition-all dark:bg-gray-600 dark:hover:bg-gray-700">
            Start Your Learning Journey!
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AboutUs;
