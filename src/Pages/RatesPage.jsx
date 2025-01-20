import React, { useEffect, useState } from "react";
import CustomTable from "../Components/Table";
import Layout from "../Components/Layout";
import axios from "axios";
import { Button, Pagination } from "react-bootstrap";

const RatesPage = () => {
  const [data, setData] = useState({
    reviews: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleGetData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/all?category=all&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(response?.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };


  useEffect(() => {
    handleGetData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

const handleRemoveData = async (id) => {
  try {
    await axios.post(`http://localhost:5000/api/reviews/remove/${id}`)
    alert("success remove ulasan")
    handleGetData();
  } catch (error) {
    console.log(error)
  }
}

  const handlePageChange = (page) => setCurrentPage(page);


  const columns = ["No", "NamaCustomer", "Komentar", "Nama Product", "Action"];

  const datatable = data?.reviews?.map((review, index) => ({
    No: (currentPage - 1) * itemsPerPage + index + 1,
    NamaCustomer: review?.user?.name,
    Komentar: review?.reviewText,
    "Nama Product": review?.Product?.name,
    Action: (
      <div>
        <Button onClick={() => handleRemoveData(review.id)} variant="danger">
          Hapus
        </Button>
      </div>
    ),
  }));

  return (
    <Layout>
      <div>
        <h1>Data Barang</h1>
        <CustomTable columns={columns} data={datatable} />

        <Pagination>
          {[...Array(data?.totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Layout>
  );
};

export default RatesPage;
