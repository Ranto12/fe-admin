import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Pagination, Card, InputGroup, FormControl, Container, Row, Col, Modal } from "react-bootstrap";
import Layout from "../Components/Layout";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io('http://localhost:3001'); 

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatModal, setShowChatModal] = useState(false); // State untuk modal chat
  const [selectedUser, setSelectedUser] = useState(null); // State untuk pengguna yang dipilih
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    if (!selectedUser) return;

    const handleMessage = (data) => {
      if (data.recipient_id === 1 && data.sender_id === selectedUser.id) {
        setChat((prevChat) => [...prevChat, data]);
      }
    };

    socket.on('message', handleMessage);
    return () => socket.off('message', handleMessage);
  }, [selectedUser]);

  useEffect(() => {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [chat]);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          role: "user",
        }
      });
      const filteredUsers = response.data;
      setUsers(filteredUsers);
      setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const payload = {
        sender_id: 1, // ID admin
        recipient_id: selectedUser.id,
        message,
      };

      await axios.post('http://localhost:3000/api/messages/send', payload);
      socket.emit('message', payload);
      setChat((prevChat) => [...prevChat, { sender: 'Admin', message, createdAt: new Date().toISOString() }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const openChatModal = async (user) => {
    setSelectedUser(user);
    setChat([]); 
    setShowChatModal(true);

    try {
        const response = await axios.get(`http://localhost:3000/api/messages/conversation/1/${user.id}`);
        setChat(response.data.data);
    } catch (error) {
        console.error("Error fetching messages:", error);
        alert("Gagal mengambil pesan. Coba lagi nanti.");
    }
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
                  <Button variant="primary" onClick={() => openChatModal(user)}>Kirim Pesan</Button>
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
            <div className="chat-box" style={{ border: '1px solid black', height: '300px', overflowY: 'scroll' }}>
              {chat.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.sender}: </strong>{msg.message}
                  <small className="text-muted" style={{ marginLeft: '10px' }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
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
