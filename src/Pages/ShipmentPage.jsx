import { Button, Col, Form, Row } from "react-bootstrap";
import Layout from "../Components/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

const ShipmentPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const { id } = useParams();
  const [data, setData] = useState({
    orderId: id,
    trackingNumber: "",
    shippingMethod: "",
    shippingStatus: "",
    estimatedDeliveryDate: "",
  });

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shipments/create",
        data
      );

      if (
        response.data.message ===
        "Shipment created successfully and order marked as shipped"
      ) {
        alert("success add resi");
        navigate("/manage-orders");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shipments/update/${order?.Shipment?.id}`,
        {
          shipmentId: order?.Shipment?.id,
          shippingStatus: data?.shippingStatus,
          actualDeliveryDate: order?.Shipment?.estimatedDeliveryDate,
        }
      );
      if (response.data.message === "Shipment status updated successfully") {
        alert("Update Status Success");
        navigate("/manage-orders");
      }
    } catch (error) {}
  };

  const handlegetOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/detail/${id}`
      );
      if (response.data) {
        setOrder(response.data.order);
        setData({
          ...data,
          estimatedDeliveryDate:
            response.data.order?.Shipment?.estimatedDeliveryDate,
          shippingMethod: response.data.order?.Shipment?.shippingMethod,
          shippingStatus: response.data.order?.Shipment?.shippingStatus,
          trackingNumber: response.data.order?.Shipment?.trackingNumber,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handlegetOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const generateNoresi = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan (0-indexed)
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Format waktu: YYYYMMDDHHmmss
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

    // Generate kode unik (6 karakter alfanumerik)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let uniqueCode = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      uniqueCode += chars[randomIndex];
    }

    // Gabungkan timestamp dan kode unik
    const trackingNumber = `Resi_${timestamp}-${uniqueCode}`;
    setData({ ...data, trackingNumber: trackingNumber });
  };

  return (
    <Layout>
      <h2>{order?.Shipment ? "Edit Shipment" : "Create Shiment"}</h2>
      <Form
        onSubmit={order?.Shipment ? handleUpdateShipment : handleCreateShipment}
      >
        <Row>
          <Col>
            <Form.Group className="field">
              <Form.Label>No Resi</Form.Label>
              <Form.Control
                type="text"
                className="input"
                disabled
                value={data.trackingNumber}
                onChange={(e) =>
                  setData({
                    ...data,
                    trackingNumber: e.target.value,
                  })
                }
                placeholder="No resi"
                required
              />
              <Button
                style={{
                  marginTop: "5px",
                }}
                disabled={order?.Shipment?.trackingNumber}
                variant="success"
                onClick={generateNoresi}
              >
                generate No Resi
              </Button>
            </Form.Group>

            <Form.Group className="field">
              <Form.Label>Metode Pengiriman</Form.Label>
              <Form.Select
                value={data.shippingMethod}
                onChange={(e) =>
                  setData({
                    ...data,
                    shippingMethod: e.target.value,
                  })
                }
                disabled={order?.Shipment}
                required
              >
                <option value="" disabled>
                  pilih Metode Pengiriman
                </option>
                <option value="Standard">Biasa</option>
                <option value="Express">Ekspress</option>
                <option value="Overnight">Satu Hari</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="field">
              <Form.Label>Status Pengiriman</Form.Label>
              <Form.Select
              disabled={order?.Shipment?.shippingStatus === "Delivered"}
                value={data.shippingStatus}
                onChange={(e) =>
                  setData({
                    ...data,
                    shippingStatus: e.target.value,
                  })
                }
                required
              >
                <option value="" disabled>
                  Pilih Status Pengiriman
                </option>
                <option value="Shipped">Sedang dikirim</option>
                <option value="In Transit">Dalam Perjalanan</option>
                <option value="Delivered">Terkirim</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="field">
              <Form.Label>Ekstimasi Waktu</Form.Label>
              <Form.Control
                type="date"
                className="input"
                value={data.estimatedDeliveryDate}
                onChange={(e) =>
                  setData({
                    ...data,
                    estimatedDeliveryDate: e.target.value,
                  })
                }
                placeholder="Nama"
                disabled={order?.Shipment}
                required
              />
            </Form.Group>
            <Form.Group>
              <Button
                style={{
                  marginTop: "5px",
                }}
                type="submit"
                variant="success"
                disabled={order?.Shipment?.shippingStatus === "Delivered"}
              >
                {order?.Shipment ? "Update" : "Simpan"}
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ShipmentPage;
