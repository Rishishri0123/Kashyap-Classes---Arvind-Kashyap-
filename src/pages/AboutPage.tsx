import React from 'react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { AboutMentor } from '../components/AboutMentor';
import { TestimonialsSection } from '../components/TestimonialsSection';

interface AboutPageProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenInquiry }) => {
  return (
    <>
      <PageBreadcrumb
        current="About Arvind Kashyap Sir"
        subtitle="20+ Years Physics Mentorship & Student Hall of Fame"
      />
      <AboutMentor onOpenInquiry={onOpenInquiry} />
      <TestimonialsSection />
    </>
  );
};

export default AboutPage;
