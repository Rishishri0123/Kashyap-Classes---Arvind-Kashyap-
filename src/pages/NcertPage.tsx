import React from 'react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { NcertBooksSection } from '../components/NcertBooksSection';

interface NcertPageProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const NcertPage: React.FC<NcertPageProps> = ({ onOpenInquiry }) => {
  return (
    <>
      <PageBreadcrumb
        current="NCERT Physics Hub"
        subtitle="Official Class 11 & Class 12 NCERT Textbooks & Chapter PDFs"
      />
      <NcertBooksSection onOpenInquiry={onOpenInquiry} />
    </>
  );
};

export default NcertPage;
