import Layout from '../Components/Layout';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const CalendarAdmin = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch data jadwal dari API (dengan menyertakan endpoint lengkap)
    axios.get("http://localhost:3000/api/schedules").then((response) => {
      const formattedEvents = response.data.map((schedule) => ({
        title: schedule.items, // Nama item yang disewa
        start: schedule.date, // Tanggal penyewaan
        id: schedule.id,
      }));
      setEvents(formattedEvents);
    }).catch((error) => {
      console.error("Error fetching schedules:", error);
    });
  }, []);

  return (
    <Layout>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={(eventInfo) => (
              <div>
                <b>{eventInfo.timeText}</b>
                <span>{eventInfo.event.title}</span>
              </div>
            )}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default CalendarAdmin;
