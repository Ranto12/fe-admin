import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Pagination, Dropdown } from "react-bootstrap";
import CustomTable from "../Components/Table";
import Layout from "../Components/Layout";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const getOrders = async () => {
    try {
      // Hitung offset berdasarkan currentPage dan itemsPerPage
      const response = await axios.get(
        `http://localhost:5000/api/orders/getAllComplated?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update data pesanan dan total halaman
      setOrders(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  const orderStatus = {
    Pending: "Menunggu Pembayaran",
    Confirmed: "Sedang Dikemas",
    Shipped: "Pesanan Sedang Dikirim",
    Accepted: "Pesanan Sudah Diterima",
    Completed: "Pesanan Selesai",
    Canceled: "Pesanan Dibatalkan",
  };

  const columns = [
    "No",
    "Nama Customer",
    "Alamat",
    "Pesanan",
    "Total",
    "Status Pesanan",
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = orders.slice(indexOfFirstItem, indexOfLastItem);

  const data = currentData.map((order, index) => ({
    No: index + 1 + (currentPage - 1) * itemsPerPage,
    "Nama Customer": order.customerName,
    Alamat: order.address,
    "No Handphone": order.phoneNumber,
    Pesanan: order.OrderItems.map((item) => item.productName),
    Total: parseInt(order.totalAmount),
    "Status Pesanan": (
      <Dropdown>
        <Dropdown.Toggle
          variant="secondary"
          id={`dropdown-status-produk-${index}`}
          disabled={order.status === "Canceled" || order.status === "Completed"}
        >
          {orderStatus[order.status] ||
            "Pilih Status Produk"}{" "}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="Menunggu Pembayaran">
            Menunggu Pembayaran
          </Dropdown.Item>
          <Dropdown.Item eventKey="Sedang Dikemas">
            Sedang Dikemas
          </Dropdown.Item>
          <Dropdown.Item eventKey="Pesanan Sedang Dikirim">
            Pesanan Sedang Dikirim
          </Dropdown.Item>
          <Dropdown.Item eventKey="Pesanan Sudah Diterima">
            Pesanan Sudah Diterima
          </Dropdown.Item>
          <Dropdown.Item eventKey="Pesanan Selesai">
            Pesanan Selesai
          </Dropdown.Item>
          <Dropdown.Item eventKey="Pesanan Dibatalkan">
            Pesanan Dibatalkan
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    ),

    Action: (
      <Button
        variant="warning"
        disabled={order.status === "Canceled" || order.status === "Completed"}
      >
        Update
      </Button>
    ),
  }));

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div>
        <h1>Data Pesanan</h1>
        <CustomTable columns={columns} data={data} />
      </div>
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
    </Layout>
  );
};

export default OrdersHistory;
