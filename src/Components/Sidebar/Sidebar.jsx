// Sidebar.jsx

import React from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillHouseDoorFill } from "react-icons/bs";
import { RiSettingsLine } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FaCalendarDay } from "react-icons/fa";
import { MdOutlineDataset } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import './Sidebar.css'

function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const sidebarClass = isOpen ? "open" : "";

  const handleLogoutClick = async () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    
    <div className={`full-height-sidebar${sidebarClass} ${isOpen ? "open" : ""}`}>
      <Row>
        <Col className="bg-primary p-4" id="sidebar">
          <Nav className="flex-column">
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/dashboard"
                style={{ textDecoration: "none" }}
              >
                <BsFillHouseDoorFill className="sidebar-icon" />
                <span className="ml-2">Dashboard</span>
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/gaun-page"
                style={{ textDecoration: "none" }}
              >
                <RiSettingsLine className="sidebar-icon" />
                <span className="ml-2">Kelola Barang</span>
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/manage-user"
                style={{ textDecoration: "none" }}
              >
                <MdOutlineDataset className="sidebar-icon" />
                <span className="ml-2">Data Pengguna</span>
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/manage-orders"
                style={{ textDecoration: "none" }}
              >
                <RiSettingsLine className="sidebar-icon" />
                <span className="ml-2">Kelola Pesanan</span>
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/rates-page"
                style={{ textDecoration: "none" }}
              >
                <RiSettingsLine className="sidebar-icon" />
                <span className="ml-2">Kelola Ulasan</span>
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/calendar"
                style={{ textDecoration: "none" }}
              >
                <FaCalendarDay className="sidebar-icon" />
                <span className="ml-2">Kalender</span>
              </Link>
            </Nav.Item>
            <Nav.Item className="mb-3">
              <Link
                className="text-white sidebar-link"
                to="/orders-history"
                style={{ textDecoration: "none" }}
              >
                <FaHistory className="sidebar-icon" />
                <span className="ml-2">Riwayat Pesanan</span>
              </Link>
            </Nav.Item>
            <Nav.Item onClick={handleLogoutClick}>
              <Link
                className="text-white sidebar-link"
                style={{ textDecoration: "none" }}
              >
                <BiLogOut className="sidebar-icon" />
                <span className="ml-2">LogOut</span>
              </Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </div>
  );
}

export default Sidebar;
