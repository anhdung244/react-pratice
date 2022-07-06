import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteUser } from "../services/UserService";

const ModalDeleteUser = (props) => {
  const { show, handleClose, dataUserDelete, handleDeleteUserFromModal } =
    props;

  const handleDeleteUser = async () => {
    console.log(dataUserDelete);
    let res = await deleteUser(dataUserDelete.id);
    if (res && +res.statusCode === 204) {
      handleDeleteUserFromModal(dataUserDelete);
      handleClose();
      toast.success("Delete user successfuly !");
    } else {
      toast.error("Delete Error !");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>
                Do you want to delete user <b>{dataUserDelete.email}</b> ?
              </Form.Label>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" onClick={() => handleDeleteUser()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDeleteUser;
