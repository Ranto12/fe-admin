import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Pagination, Dropdown, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomTable from "../Components/Table";
import Layout from "../Components/Layout";
import { useNavigate } from "react-router-dom";

const GaunPage = () => {
  const [gauns, setGaun] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const handleTambahData = () => navigate("add-gaun");

  // Fetching data based on category, page, and items per page
  useEffect(() => {
    const getGauns = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          params: {
            category: selectedCategory === "All" ? "all" : selectedCategory,
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        setGaun(response.data.products); // Mengatur data produk
        setTotalPages(Math.ceil(response.data.total / itemsPerPage)); // Total halaman
      } catch (error) {
        console.error("Error fetching gauns:", error);
      }
    };

    getGauns();
  }, [currentPage, itemsPerPage, selectedCategory]);

  const columns = [
    "No",
    "Nama",
    "Kategori",
    "Harga",
    "Jumlah",
    "Detail",
    "Status",
    "Foto",
    "Action",
  ];

  const handlePageChange = (page) => setCurrentPage(page);
  const handleCategoryChange = (kategori) => {
    setSelectedCategory(kategori);
    setCurrentPage(1);
  };

  const handleShowModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setDeleteId(null);
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/products/delete/${deleteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert(response?.data?.message)
      } catch (error) {
        console.error("Error deleting gaun:", error);
      }
      handleCloseModal();
    }
  };

  const data = gauns.map((gaun, index) => ({
    No: (currentPage - 1) * itemsPerPage + index + 1,
    id: gaun.id,
    Nama: gaun.name,
    Kategori: gaun.category,
    // Ukuran: gaun.size,
    // Warna: gaun.color,
    Harga: gaun.price,
    Jumlah: gaun.ProductSizes.reduce((total, count) => total + count.stock, 0),
    Detail: gaun.details,
    Status: gaun.status,
    Foto: (
      <div
        style={{
          width: "100px",
          height: "100px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={gaun?.ProductImages[0]?.imagePath} alt={`Foto ${gaun.productName}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", 
            objectPosition: "center",
            borderRadius: '10px'
          }}
        />
      </div>
    ),
    Action: (
      <div>
        <Link to={`edit-gaun/${gaun.id}`}>
          <Button>Edit</Button>
        </Link>
        <Button onClick={() => handleShowModal(gaun.id)} variant="danger">
          Hapus
        </Button>
      </div>
    ),
  }));

  return (
    <Layout>
      <div>
        <h1>Data Barang</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Kategori: {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {["All", "Gaun Pengantin", "Jas", "Kebaya", "Batik", "Aksesoris Pernikahan"].map(
                (category) => (
                  <Dropdown.Item
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="success"
            style={{ marginLeft: "10px" }}
            onClick={handleTambahData}
          >
            Tambah Data
          </Button>
        </div>

        <CustomTable columns={columns} data={data} />

        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus</Modal.Title>
          </Modal.Header>
          <Modal.Body>Apakah Anda yakin ingin menghapus?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default GaunPage;
