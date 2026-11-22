import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { NotesStorefront } from '../components/NotesStorefront';
import { NoteSectionId, SECTION_LABEL_MAP } from '../types/notesStore';

interface NotesPageProps {
  section?: NoteSectionId;
}

export const NotesPage: React.FC<NotesPageProps> = ({ section }) => {
  const [searchParams] = useSearchParams();
  const querySection = searchParams.get('section') as NoteSectionId | null;
  const activeId: NoteSectionId =
    section ||
    (querySection && SECTION_LABEL_MAP[querySection] ? querySection : 'class-12-physics');

  const label = SECTION_LABEL_MAP[activeId];

  return (
    <>
      <PageBreadcrumb
        current={label}
        subtitle="Class 11 Physics, Class 12 Physics & JEE Notes — Single PDFs & Discounted Bundles"
      />
      <NotesStorefront initialSection={section} />
    </>
  );
};

export default NotesPage;
