import Layout from "../Components/Layout";
import React, { useEffect, useState } from "react";
import { Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import axios from "axios";
import { format } from "date-fns";
import CustomTable from "../Components/Table";

const CalendarAdmin = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectDate, setSelectDate] = useState();
  useEffect(() => {
    const handlegetData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/getallbyDate`
        );
        setEvents(response?.data?.ordersByRentalDate);
      } catch (error) {
        console.log(error);
      }
    };
    handlegetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataResponse = events.map((item) => ({
    title: item.count + " order",
    start: item.rentalDate,
  }));

  const dataDetail = events?.find((item) => item?.rentalDate === selectDate);

  const columns = ["No", "Nama Product", "Nama customer"];

  const data = dataDetail?.orders?.map((order, index) => ({
    No: index + 1,
    "Nama Product":order?.items[0]?.productName,
    "Nama customer": order?.customerName,
  })) || [];

  return (
    <Layout>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={dataResponse && dataResponse}
            eventClick={(e) => {
              setShowModal(true);
              setSelectDate(format(e.event.start, "yyyy-MM-dd"));
            }}
            dateClick={(e) => {
              setShowModal(true);
              setSelectDate(format(e.date, "yyyy-MM-dd"));
            }}
          />
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Data Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable columns={columns} data={data} />
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default CalendarAdmin;
