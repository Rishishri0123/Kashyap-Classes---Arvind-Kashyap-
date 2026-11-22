import React from 'react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { GoogleMapsSection } from '../components/GoogleMapsSection';

interface LocationPageProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ onOpenInquiry }) => {
  return (
    <>
      <PageBreadcrumb
        current="Center Location & Map"
        subtitle="Flat No. 202, B-1, M P Enclave, Bank Enclave, Shastri Nagar, Ghaziabad"
      />
      <GoogleMapsSection onOpenInquiry={onOpenInquiry} />
    </>
  );
};

export default LocationPage;
