import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Pagination, Card, InputGroup, FormControl, Container, Row, Col, Modal } from "react-bootstrap";
import Layout from "../Components/Layout";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [idUser, setIdUser] = useState(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          role: "user",
        },
      });
      const filteredUsers = response.data;
      setUsers(filteredUsers);
      setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessagesId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${id}`);
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchQuery]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSendMessage = async () => {
    try {
      await axios.post(`http://localhost:5000/api/messages/create`, {
        senderId: localStorage.getItem("userId"),
        receiverId: idUser,
        message,
      });
      fetchMessagesId(idUser);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const openChatModal = async (id) => {
    setMessage("");
    fetchMessagesId(id);
    setShowChatModal(true);
    setIdUser(id);
    setSelectedUser(users.find((user) => user.id === id)); // Find the user by id
  };

  const closeChatModal = () => {
    setShowChatModal(false);
    setSelectedUser(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Layout>
      <Container>
        <h1 className="mb-4">Data Pengguna</h1>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Cari pengguna berdasarkan nama..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </InputGroup>

        <Row>
          {currentData.map((user) => (
            <Col md={4} className="mb-4" key={user.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                  <Card.Text>Email: {user.email}</Card.Text>
                  <Button variant="primary" onClick={() => openChatModal(user.id)}>
                    Kirim Pesan
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

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

        <Modal show={showChatModal} onHide={closeChatModal}>
          <Modal.Header closeButton>
            <Modal.Title>Chat dengan {selectedUser?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="chat-box"
              style={{
                border: "1px solid #D85C8C",
                height: "300px",
                overflowY: "scroll",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#FCE4E4", // Background warna pink muda
              }}
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent:
                        msg.sender.role === "user" ? "flex-start" : "flex-end",
                    }}
                  >
                    <p
                      style={{
                        textAlign:
                          msg.sender.role === "user" ? "start" : "end",
                        backgroundColor:
                          msg.sender.role === "user" ? "white" : "GrayText",
                        borderRadius: "10px 0 10px 0",
                        padding: "5px 10px",
                        maxWidth: "70%",
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>
                ))
              ) : (
                <p>Belum ada pesan</p>
              )}
            </div>
            <InputGroup className="mt-3">
              <FormControl
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan..."
              />
              <Button onClick={handleSendMessage}>Kirim</Button>
            </InputGroup>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default UserPage;
