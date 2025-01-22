import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import Layout from "../Components/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

const ShipmentPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const { id } = useParams();
  const [datas, setDatas] = useState({
    shippingMethod: "",
    province: "",
    ongkir: 0,
  });

  const shippingCosts = [
    {
      provinsi: "Nanggroe Aceh Darussalam (Ibu Kota Banda Aceh)",
      ongkir: 60000,
    },
    { provinsi: "Sumatera Utara (Ibu Kota Medan)", ongkir: 28000 },
    { provinsi: "Sumatera Selatan (Ibu Kota Palembang)", ongkir: 23000 },
    { provinsi: "Sumatera Barat (Ibu Kota Padang)", ongkir: 26000 },
    { provinsi: "Bengkulu (Ibu Kota Bengkulu)", ongkir: 23000 },
    { provinsi: "Riau (Ibu Kota Pekanbaru)", ongkir: 27000 },
    { provinsi: "Kepulauan Riau (Ibu Kota Tanjung Pinang)", ongkir: 38000 },
    { provinsi: "Jambi (Ibu Kota Jambi)", ongkir: 24000 },
    { provinsi: "Lampung (Ibu Kota Bandar Lampung)", ongkir: 21000 },
    { provinsi: "Bangka Belitung (Ibu Kota Pangkal Pinang)", ongkir: 6000 },
    { provinsi: "Kalimantan Barat (Ibu Kota Pontianak)", ongkir: 51000 },
    { provinsi: "Kalimantan Timur (Ibu Kota Samarinda)", ongkir: 24000 },
    { provinsi: "Kalimantan Selatan (Ibu Kota Banjarbaru)", ongkir: 29000 },
    { provinsi: "Kalimantan Tengah (Ibu Kota Palangkaraya)", ongkir: 6000 },
    { provinsi: "Kalimantan Utara (Ibu Kota Tanjung Selor)", ongkir: 31000 },
    { provinsi: "Banten (Ibu Kota Serang)", ongkir: 33000 },
    { provinsi: "DKI Jakarta (Ibu Kota Jakarta)", ongkir: 17000 },
    { provinsi: "Jawa Barat (Ibu Kota Bandung)", ongkir: 19000 },
    { provinsi: "Jawa Tengah (Ibu Kota Semarang)", ongkir: 19000 },
    {
      provinsi: "Daerah Istimewa Yogyakarta (Ibu Kota Yogyakarta)",
      ongkir: 20000,
    },
    { provinsi: "Jawa Timur (Ibu Kota Surabaya)", ongkir: 22000 },
    { provinsi: "Bali (Ibu Kota Denpasar)", ongkir: 22000 },
    { provinsi: "Nusa Tenggara Timur (Ibu Kota Kupang)", ongkir: 30000 },
    { provinsi: "Nusa Tenggara Barat (Ibu Kota Mataram)", ongkir: 40000 },
    { provinsi: "Gorontalo (Ibu Kota Gorontalo)", ongkir: 29000 },
    { provinsi: "Sulawesi Barat (Ibu Kota Mamuju)", ongkir: 55000 },
    { provinsi: "Sulawesi Tengah (Ibu Kota Palu)", ongkir: 29000 },
    { provinsi: "Sulawesi Utara (Ibu Kota Manado)", ongkir: 28000 },
    { provinsi: "Sulawesi Tenggara (Ibu Kota Kendari)", ongkir: 27000 },
    { provinsi: "Sulawesi Selatan (Ibu Kota Makassar)", ongkir: 40000 },
    { provinsi: "Maluku Utara (Ibu Kota Sofifi)", ongkir: 97000 },
    { provinsi: "Maluku (Ibu Kota Ambon)", ongkir: 44000 },
    { provinsi: "Papua Barat (Ibu Kota Manokwari)", ongkir: 120000 },
    { provinsi: "Papua (Ibu Kota Jayapura)", ongkir: 82000 },
    { provinsi: "Papua Tengah (Ibu Kota Nabire)", ongkir: 108000 },
    { provinsi: "Papua Pegunungan (Ibu Kota Jayawijaya)", ongkir: 108000 },
    { provinsi: "Papua Selatan (Ibu Kota Merauke)", ongkir: 85000 },
    { provinsi: "Papua Barat Daya (Ibu Kota Sorong)", ongkir: 130000 },
  ];

  const [data, setData] = useState({
    orderId: id,
    trackingNumber: "",
    shippingMethod: "",
    address: "",
    cost: "",
  });

  const handleCreateShipment = async (e) => {
    const { address, cost, shippingMethod, trackingNumber } = data;
    if (
      address === "" ||
      shippingMethod === "" ||
      cost === "" ||
      trackingNumber === "" ||
      cost === ""
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

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    const provinceData = shippingCosts.find(
      (province) => province.provinsi === selectedProvince
    );
    setDatas({
      ...datas,
      province: selectedProvince,
    });
    setData({
      ...data,
      cost: provinceData ? provinceData.ongkir : 0,
    });
  };

  function formatRupiah(amount) {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

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
            <Form.Group className="field">
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
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="field">
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
            </Form.Group>
            <Form.Group className="field">
              <Form.Label>Ekstimasi Pembayaran</Form.Label>
              <Form.Control
                type="text"
                className="input"
                value={formatRupiah(data.cost)}
                disabled
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
