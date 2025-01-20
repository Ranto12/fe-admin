import React, { useState } from "react";
import axios from "axios";
import Layout from "../Layout";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import Camera from "../icons/Camera.jsx";

const AddDress = () => {
  const [nama_produk, setNama_produk] = useState("");
  const [kategori, setKategori] = useState("");
  const [ukuran, setUkuran] = useState("");
  const [warna, setWarna] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("");
  const [foto, setFoto] = useState([]);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto((prevFotos) => [...prevFotos, file]); // Append file ke array
    }
  };

  const handleRemoveImage = (index) => {
    setFoto((prevFotos) => prevFotos.filter((_, i) => i !== index)); // Hapus gambar berdasarkan index
  };

  const saveGaun = async (e) => {
    e.preventDefault();

    // Pastikan semua data diisi dengan benar
    if (
      !nama_produk ||
      !kategori ||
      !ukuran ||
      !warna ||
      !harga ||
      !jumlah ||
      !detail ||
      !status ||
      foto.length === 0
    ) {
      console.error("All fields are required");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", nama_produk);
      formData.append("category", kategori);
      formData.append("price", harga);
      formData.append("details", detail);
      formData.append("colors", warna);
      formData.append(
        "status",
        status === "Tersedia" ? "Available" : "Unavailable"
      );
      formData.append(
        "sizes",
        JSON.stringify([
          {
            size: ukuran,
            stock: jumlah,
          },
        ])
      );

      // Tambahkan file gambar ke FormData
      foto.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/gaun-page"); // Navigasi setelah berhasil simpan
    } catch (error) {
      console.error("Error while saving dress:", error);
    }
  };

  return (
    <Layout>
      <h2>Tambah Data Barang</h2>
      <Form onSubmit={saveGaun}>
        <Row>
          <Col>
            <Form.Group className="field">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                className="input"
                value={nama_produk}
                onChange={(e) => setNama_produk(e.target.value)}
                placeholder="Nama"
                required
              />
            </Form.Group>

            <Form.Group className="field">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                required
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="Gaun Pengantin">Gaun Pengantin</option>
                <option value="Kebaya">Kebaya</option>
                <option value="Jas">Jas</option>
                <option value="Batik">Batik</option>
                <option value="Baju Adat">Baju Adat</option>
                <option value="Aksesoris Pernikahan">Aksesoris Pernikahan</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="field">
              <Form.Label>Ukuran</Form.Label>
              <Form.Select
                value={ukuran}
                onChange={(e) => setUkuran(e.target.value)}
                required
              >
                <option value="" disabled>Pilih Ukuran</option>
                <option value="s">S</option>
                <option value="m">M</option>
                <option value="l">L</option>
                <option value="xl">XL</option>
                <option value="xxl">XXL</option>
                <option value="xxxl">XXXL</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="field">
              <Form.Label>Warna</Form.Label>
              <Form.Control
                type="text"
                placeholder="Warna"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="field">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                placeholder="Harga"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="field">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control
                type="number"
                placeholder="Jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Detail</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="field">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Tidak Tersedia">Tidak tersedia</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Foto Utama</Form.Label>
              <div className="preview-container">
                {foto.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index}`}
                      width="100"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => document.getElementById("mainPhoto").click()}
                style={{
                  marginTop: "5px",
                }}
              >
                <Camera />
              </Button>
              <Form.Control
                type="file"
                id="mainPhoto"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Form.Group>
              <Button
                style={{
                  marginTop: "5px",
                }}
                type="submit"
                variant="success"
              >
                Simpan
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default AddDress;
