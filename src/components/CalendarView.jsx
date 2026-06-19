import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarView = ({ tasks, onEventClick }) => {
  const events = useMemo(() => {
    return tasks.map(task => {
      let backgroundColor = '#334155'; // default slate-700
      if (task.priority === 'HIGH') backgroundColor = '#ef4444'; // danger
      if (task.priority === 'MEDIUM') backgroundColor = '#f59e0b'; // warning
      if (task.priority === 'LOW') backgroundColor = '#10b981'; // success

      if (task.status === 'DONE') {
        backgroundColor = '#10b981'; // success for done
      }

      return {
        id: task.id,
        title: task.title,
        date: task.dueDate ? task.dueDate.split('T')[0] : undefined,
        backgroundColor,
        borderColor: backgroundColor,
        textColor: '#ffffff',
        extendedProps: { ...task }
      };
    }).filter(event => event.date); // only include tasks with dates
  }, [tasks]);

  return (
    <div className="glass-card p-6 h-[700px] overflow-hidden calendar-container">
      <style>{`
        .calendar-container .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.05);
          --fc-neutral-text-color: inherit;
          --fc-border-color: rgba(148, 163, 184, 0.2);
          --fc-button-bg-color: #00D4AA;
          --fc-button-border-color: #00D4AA;
          --fc-button-hover-bg-color: #0D9488;
          --fc-button-hover-border-color: #0D9488;
          --fc-button-active-bg-color: #0D9488;
          --fc-button-active-border-color: #0D9488;
          --fc-today-bg-color: rgba(0, 212, 170, 0.1);
          color: inherit;
          font-family: inherit;
        }

        /* Dark mode overrides */
        html.dark .calendar-container .fc {
          --fc-border-color: rgba(255, 255, 255, 0.1);
          --fc-today-bg-color: rgba(255, 255, 255, 0.05);
          --fc-button-text-color: #0f172a;
          --fc-button-bg-color: #ffffff;
          --fc-button-border-color: #ffffff;
          --fc-button-hover-bg-color: #f8fafc;
          --fc-button-hover-border-color: #f8fafc;
          --fc-button-active-bg-color: #e2e8f0;
          --fc-button-active-border-color: #e2e8f0;
        }

        .fc-theme-standard th {
          padding: 12px 0;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          color: #64748b;
        }

        html.dark .fc-theme-standard th {
          color: #94a3b8;
        }

        .fc .fc-toolbar-title {
          font-weight: 800;
          font-size: 1.5rem;
        }

        .fc .fc-button {
          font-weight: 600;
          text-transform: capitalize;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }

        .fc-daygrid-event {
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .fc-daygrid-event:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .fc-daygrid-day-number {
          font-weight: 600;
          padding: 8px;
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        eventClick={(info) => {
          if (onEventClick) {
            onEventClick(info.event.extendedProps);
          }
        }}
        height="100%"
      />
    </div>
  );
};

export default CalendarView;
