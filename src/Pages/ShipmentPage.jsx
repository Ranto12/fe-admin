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
    address: "",
    cost: "10000",
  });

  const handleCreateShipment = async (e) => {
    const { shippingMethod, trackingNumber } = data;
    if (
      shippingMethod === "" ||
      trackingNumber === "" 
    ) {
      alert("lengkapi data pengiriman");
    }

    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shipments/create",
        data
      );

      if (
        response.data.message ===
        "Shipment created successfully"
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
                <option value="JNT">JNT</option>
                {/* <option value="Express">Ekspress</option>
                <option value="Overnight">Satu Hari</option> */}
              </Form.Select>
            </Form.Group>
            {/* <Form.Group className="field">
              <Form.Label>Alamat Lengkap</Form.Label>
              <FloatingLabel controlId="floatingTextarea2">
                <Form.Control
                  as="textarea"
                  placeholder="Alamat lengkap"
                  style={{ height: "100px" }}
                  value={data.address}
                  onChange={(e) =>
                    setData({
                      ...data,
                      address: e.target.value,
                    })
                  }
                />
              </FloatingLabel>
            </Form.Group> */}
          </Col>

          <Col>
            {/* <Form.Group className="field">
              <Form.Label>Provinsi</Form.Label>
              <Form.Select
                value={data.province}
                onChange={handleProvinceChange}
                required
              >
                <option disabled={datas.province}>Provinsi</option>
                {shippingCosts.map((province, index) => (
                  <option key={index} value={province.provinsi}>
                    {province.provinsi}
                  </option>
                ))}
              </Form.Select>
            </Form.Group> */}
            {/* <Form.Group className="field">
              <Form.Label>Ekstimasi Pembayaran</Form.Label>
              <Form.Control
                type="text"
                className="input"
                value={formatRupiah(data.cost)}
                disabled
                required
              />
            </Form.Group> */}
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
