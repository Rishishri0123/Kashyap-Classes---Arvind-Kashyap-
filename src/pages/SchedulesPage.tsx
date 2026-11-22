import React from 'react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { ScheduleSection } from '../components/ScheduleSection';

interface SchedulesPageProps {
  onOpenInquiry: (initialCourse?: string) => void;
}

export const SchedulesPage: React.FC<SchedulesPageProps> = ({ onOpenInquiry }) => {
  return (
    <>
      <PageBreadcrumb
        current="Batch Schedules"
        subtitle="100% In-Person Offline Classroom Timetables (Session 2026–27)"
      />
      <ScheduleSection onOpenInquiry={onOpenInquiry} />
    </>
  );
};

export default SchedulesPage;
