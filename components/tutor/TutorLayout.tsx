import React from 'react';

interface TutorLayoutProps {
  center: React.ReactNode;
  right: React.ReactNode;
}

const TutorLayout: React.FC<TutorLayoutProps> = ({ center, right }) => {
  return (
    <div className="ta-tutor-layout">
      <main className="ta-tutor-center no-scrollbar">{center}</main>
      <aside className="ta-tutor-right no-scrollbar">{right}</aside>
      <style>{`
        .ta-tutor-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
          height: calc(100vh - 160px); /* Full height minus header & stepper */
        }
        .ta-tutor-center, .ta-tutor-right {
          overflow-y: auto;
          height: 100%;
          padding-right: 8px; /* For scrollbar gap */
        }
        @media (max-width: 1024px) {
          .ta-tutor-layout {
            grid-template-columns: 1fr;
          }
          .ta-tutor-right { display: none; }
        }
      `}</style>
    </div>
  );
};

export default TutorLayout;