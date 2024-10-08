import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Button } from '../components/ui/button';
import { Check } from 'lucide-react';

const SubscriptionCard = ({ title, price, discountPrice, period, isHighlighted, isBestOffer, features }) => (
  <Card className={`w-72 rounded-3xl overflow-hidden ${isHighlighted ? 'border-2 border-red-500' : ''} relative`}>
    {isBestOffer && (
      <div className="absolute top-0 right-0 bg-yellow-400 text-black font-bold py-1 px-4 rounded-bl-lg transform rotate-45 translate-x-8 -translate-y-1">
        Best Offer
      </div>
    )}
    <CardHeader className="text-center">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      {discountPrice ? (
        <>
          <span className="text-2xl font-bold line-through">${price}</span>
          <span className="text-3xl font-bold text-green-500 ml-2">${discountPrice}</span>
        </>
      ) : (
        <span className="text-3xl font-bold">${price}</span>
      )}
      <p className="text-sm text-gray-500">per {period}</p>
      <ul className="mt-4 text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-2">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="justify-center">
      <Button className="rounded-full">Subscribe Now</Button>
    </CardFooter>
  </Card>
);

const SubscriptionCards = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 className="text-3xl font-bold mb-8">Choose Your Subscription</h1>
    <div className="flex flex-wrap justify-center gap-6">
      <SubscriptionCard
        title="Monthly"
        price="6.00"
        discountPrice="3.99"
        period="month"
        isHighlighted={true}
        features={[
          "Full access to all features",
          "24/7 customer support",
          "Cancel anytime"
        ]}
      />
      <SubscriptionCard
        title="6 Months"
        price="30.00"
        period="6 months"
        isBestOffer={true}
        features={[
          "All monthly features",
          "Priority support",
          "Exclusive content",
          "50% off first month"
        ]}
      />
      <SubscriptionCard
        title="Yearly"
        price="60.00"
        period="year"
        features={[
          "All 6-month features",
          "2 months free",
          "Annual performance review",
          "Early access to new features"
        ]}
      />
    </div>
  </div>
);

export default SubscriptionCards;