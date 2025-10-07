import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 animate-fade-in-down">{t('terms.title')}</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.acceptance.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('terms.acceptance.description')}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.userAccount.title')}</h2>
          <div className="px-4">
            <h3 className="text-xl font-medium mb-2">{t('terms.userAccount.accountCreation.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('terms.userAccount.accountCreation.item1')}</li>
              <li className="mx-4">{t('terms.userAccount.accountCreation.item2')}</li>
              <li className="mx-4">{t('terms.userAccount.accountCreation.item3')}</li>
              <li className="mx-4">{t('terms.userAccount.accountCreation.item4')}</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">{t('terms.userAccount.accountTermination.title')}</h3>
            <p className="text-gray-700 dark:text-gray-300">{t('terms.userAccount.accountTermination.description')}</p>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('terms.userAccount.accountTermination.item1')}</li>
              <li className="mx-4">{t('terms.userAccount.accountTermination.item2')}</li>
              <li className="mx-4">{t('terms.userAccount.accountTermination.item3')}</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.courseContent.title')}</h2>
          <div className="px-4">
            <h3 className="text-xl font-medium mb-2">{t('terms.courseContent.intellectualProperty.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('terms.courseContent.intellectualProperty.item1')}</li>
              <li className="mx-4">{t('terms.courseContent.intellectualProperty.item2')}</li>
              <li className="mx-4">{t('terms.courseContent.intellectualProperty.item3')}</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">{t('terms.courseContent.contentLimitations.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('terms.courseContent.contentLimitations.item1')}</li>
              <li className="mx-4">{t('terms.courseContent.contentLimitations.item2')}</li>
              <li className="mx-4">{t('terms.courseContent.contentLimitations.item3')}</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.payments.title')}</h2>
          <div className="px-4">
            <h3 className="text-xl font-medium mb-2">{t('terms.payments.pricing.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('terms.payments.pricing.item1')}</li>
              <li className="mx-4">{t('terms.payments.pricing.item2')}</li>
              <li className="mx-4">{t('terms.payments.pricing.item3')}</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">{t('terms.payments.refundPolicy.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('terms.payments.refundPolicy.item1')}</li>
              <li className="mx-4">{t('terms.payments.refundPolicy.item2')}</li>
              <li className="mx-4">{t('terms.payments.refundPolicy.item3')}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('terms.contact.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('terms.contact.email')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('privacy.contactInformation.phoneNumber')} : {t("Mobile Phone")}</p>

        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
