import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Pagination } from "react-bootstrap";
import CustomTable from "../Components/Table";
import Layout from "../Components/Layout";
import { format } from "date-fns";
import { useNavigate } from "react-router";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      // Hitung offset berdasarkan currentPage dan itemsPerPage
      const response = await axios.get(
        `http://localhost:5000/api/orders/all?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders(response.data?.data);
      setTotalPages(response.data?.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  const handleReturnPaymentStatus = (payments) => {
    if (!Array.isArray(payments) || payments.length === 0) {
      return "Tidak ada pembayaran.";
    }

    if (payments.length === 1) {
      const payment = payments[0];
      if (payment.paymentStatus === "Pending") {
        return "Menunggu Pembayaran";
      } else if (payment.paymentStatus === "Completed") {
        return "Lunas";
      }
    }

    if (payments.length === 2) {
      const completedPayments = payments.filter(
        (payment) => payment.paymentStatus === "Completed"
      ).length;

      if (completedPayments === 2) {
        return "Lunas";
      } else if (completedPayments === 1) {
        return "Sudah bayar DP";
      } else {
        return "Belum Bayar";
      }
    }

    return "Data pembayaran tidak valid.";
  };

  const columns = [
    "No",
    "Tanggal Pesanan",
    "Nama customer",
    "produk",
    "Total",
    "No Resi",
    "No Resi Pengembalian",
    "Status Pengiriman",
    "Status Pembayaran",
    "Pembayaran",
    "Action",
  ];

  const getOrderStatusTranslation = (status) => {
    switch (status) {
      case "Pending":
        return "Sedang Dikemas";
      case "Shipped":
        return "Sedang Dikirim";
      case "In Transit":
        return "Dalam Perjalanan";
      case "Delivered":
        return "Terkirim";
      case "Returned":
        return "DiKembalikan";
      default:
        return "----";
    }
  };

  function formatRupiah(amount) {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  const handleUpdateStatus = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/orders/status", {
        status: "Completed",
        orderId: id,
      });
      getOrders();
    } catch (error) {
      console.log("Success");
    }
  };

  const data = orders.map((order, index) => ({
    No: index + 1 + (currentPage - 1) * itemsPerPage,
    "Tanggal Pesanan": format(new Date(order?.rentalStartDate), "MM/dd/yyyy"),
    "Nama customer": order.customerName,
    produk: order.OrderItems.map((item) => item.productName),
    Total: formatRupiah(parseInt(order.totalAmount)),
    "No Resi": (
      <div>
        <p>{order?.Shipment?.trackingNumber}</p>
        {!order?.Shipment?.trackingNumber && (
          <button
            disabled={
              !order?.Payments?.some(
                (payment) => payment.paymentStatus === "Completed"
              )
            }
            style={{
              borderRadius: "8px",
              backgroundColor: "ButtonShadow",
            }}
            onClick={() => navigate(`/shipment/${order.id}`)}
          >
            {order?.Shipment ? "Edit" : "Add"}
          </button>
        )}
      </div>
    ),
    "Status Pengiriman": (
      <p>{getOrderStatusTranslation(order?.Shipment?.shippingStatus)}</p>
    ),
    "Status Pembayaran": <p>{handleReturnPaymentStatus(order?.Payments)}</p>,
    Action: (
      <Button
        onClick={() => handleUpdateStatus(order.id)}
        disabled={
          order?.status !== "Accepted" ||
          handleReturnPaymentStatus(order?.Payments) !== "Lunas"
        }
      >
        {order.status === "Completed" ? "Selesai" : "Selesaikan Order"}
      </Button>
    ),
    Pembayaran: (
      <Button onClick={() => navigate(`/order/${order.id}`)}>view</Button>
    ),
    "No Resi Pengembalian": <p>{order?.ReturnShipment?.noResi}</p>
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

export default ManageOrders;
