import React from 'react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { EnrollmentSection } from '../components/EnrollmentSection';
import { FaqSection } from '../components/FaqSection';

interface InquiryPageProps {
  initialCourse?: string;
}

export const InquiryPage: React.FC<InquiryPageProps> = ({ initialCourse }) => {
  return (
    <>
      <PageBreadcrumb
        current="Admissions & FAQs"
        subtitle="Book a Free 2-Hour Trial Demo or Ask Common Parent Questions"
      />
      <EnrollmentSection initialCourse={initialCourse} />
      <FaqSection />
    </>
  );
};

export default InquiryPage;
