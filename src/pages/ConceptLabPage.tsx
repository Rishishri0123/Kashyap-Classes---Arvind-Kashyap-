import React from 'react';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { InteractiveConceptResolver } from '../components/InteractiveConceptResolver';

export const ConceptLabPage: React.FC = () => {
  return (
    <>
      <PageBreadcrumb
        current="Interactive Concept Lab"
        subtitle="Real-Time Physics Simulators · YDSE, Lenz's Law, Photoelectric Effect & Kinematics"
      />
      <InteractiveConceptResolver />
    </>
  );
};

export default ConceptLabPage;
