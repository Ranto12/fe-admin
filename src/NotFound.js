import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "4rem", color: "#ff4a4a" }}>404</h1>
      <h2>Oops! Halaman tidak ditemukan.</h2>
      <p>Halaman yang Anda cari mungkin telah dihapus atau URL-nya salah.</p>
      <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
