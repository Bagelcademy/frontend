import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const StatsCard = ({ icon: Icon, label, value, gradient }) => (
    
        <Card className="overflow-hidden border-0 bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${gradient}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      

);
const StatsGrid = ({ user, t }) => (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          
<StatsCard
  icon={Calendar}
  label={t('subscription')}
  value={`${user.subscriptionDaysLeft} ${t('daysLeft')}`}
  gradient="bg-gradient-to-r from-blue-500 to-blue-600"
/>
<StatsCard
  icon={CreditCard}
  label={t('credits')}
  value={user.credit || 0}
  gradient="bg-gradient-to-r from-purple-500 to-purple-600"
/>
</div>
);


export default StatsGrid;
