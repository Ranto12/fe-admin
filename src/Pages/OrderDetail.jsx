import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import { useParams } from "react-router";
import Layout from "../Components/Layout";

const OrderDetail = () => {
  const [order, setOrder] = useState();
  const [img, setImg] = useState([]);

  const { id } = useParams();

  const handleFetchDetailInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/detail/${id}`
      );
      setOrder(response?.data?.order);
      const images = response?.data?.order?.Payments.flatMap((item) =>
        item.images.map((image) => image)
      );
      setImg(images);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchDetailInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifikasi = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/payment/update/status",
        {
          paymentId: id,
          paymentStatus: "Completed",
        }
      );
      if (response.data.payment.paymentStatus === "Completed") {
        handleFetchDetailInvoice();
        //       alert("success verifikasi");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function formatRupiah(amount) {
        return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
      }

  return (
    <Layout>
      <Container>
        <p
          style={{
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Detail pembayaran
        </p>
        <div
          style={{
            marginTop: "30px",
          }}
        >
          {img.length === 0 && "belum ada pembayaran"}
        </div>
        <Stack gap={3}>
          {order?.Payments?.map((item) => (
            <div>
              <Stack direction="horizontal" gap={3}>
                <img
                  src={item?.images[0]?.url}
                  alt={item?.images[0]?.url}
                  style={{
                    width: "1000px",
                  }}
                />
                <div>
                  <p>total pembayaran : {formatRupiah(parseInt(item.amount))}</p>
                  <Button
                    disabled={item?.paymentStatus === "Completed"}
                    onClick={() => handleVerifikasi(item.id)}
                  >
                    {item?.paymentStatus === "Pending"
                      ? "Verifikasi"
                      : "Sudah Verifikasi"}
                  </Button>
                </div>
              </Stack>
            </div>
          ))}
        </Stack>
      </Container>
    </Layout>
  );
};

export default OrderDetail;
