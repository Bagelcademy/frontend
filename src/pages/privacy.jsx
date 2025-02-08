import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 min-h-screen bg-lightBackground dark:bg-darkBackground text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.informationWeCollect.title')}</h2>
          <div className="px-4">
            <h3 className="text-xl font-medium mb-2">{t('privacy.informationWeCollect.personalInformation.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('privacy.informationWeCollect.personalInformation.item1')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.personalInformation.item2')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.personalInformation.item3')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.personalInformation.item4')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.personalInformation.item5')}</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">{t('privacy.informationWeCollect.usageData.title')}</h3>
            <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
              <li className="mx-4">{t('privacy.informationWeCollect.usageData.item1')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.usageData.item2')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.usageData.item3')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.usageData.item4')}</li>
              <li className="mx-4">{t('privacy.informationWeCollect.usageData.item5')}</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.howWeUse.title')}</h2>
          <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
            <li className="mx-4">{t('privacy.howWeUse.item1')}</li>
            <li className="mx-4">{t('privacy.howWeUse.item2')}</li>
            <li className="mx-4">{t('privacy.howWeUse.item3')}</li>
            <li className="mx-4">{t('privacy.howWeUse.item4')}</li>
            <li className="mx-4">{t('privacy.howWeUse.item5')}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.userRights.title')}</h2>
          <ul className="list-disc px-5 text-gray-700 dark:text-gray-300">
            <li className="mx-4">{t('privacy.userRights.item1')}</li>
            <li className="mx-4">{t('privacy.userRights.item2')}</li>
            <li className="mx-4">{t('privacy.userRights.item3')}</li>
            {/* <li>{t('privacy.userRights.item4')}</li> */}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.contactInformation.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{t('privacy.contactInformation.email')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('privacy.contactInformation.phoneNumber')} : 09039179491</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;