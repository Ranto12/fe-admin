import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";
import Navigation from "./Navigation";
// import Footer from "./Footer";
import SidebarToggle from "./Sidebar/SidebarToggle";

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navigation />
      <Row>
        <Col xs={8} sm={4} md={2} id="sidebar">
          {/* <SidebarToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
          <Sidebar isOpen={isSidebarOpen} />
        </Col>
        <Col
          style={{
            paddingRight: "30px",
          }}
          xs={4}
          sm={8}
          md={10}
          id="main-content"
          className={`content ${isSidebarOpen ? "open" : ""}`}
        >
          {children}
        </Col>
      </Row>
          {/* <Footer/> */}
    </div>
  );
};

export default Layout;
