import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { postCreateUser } from "../services/UserService";
import { toast } from "react-toastify";

const ModalAddNew = (props) => {
  const { show, handleClose, handleUpdateTable } = props;

  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleSaveUser = async () => {
    console.log(">>> Check state:", name, " + ", job);
    let res = await postCreateUser(name, job);
    console.log(">>> Check res:", res);

    if (res && res.id) {
      handleClose();
      setName("");
      setJob("");
      toast.success("A user is created succeed");
      handleUpdateTable({ first_name: name, id: res.id });
    } else {
      toast.error("An error...");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Job</Form.Label>
              <Form.Control
                type="text"
                placeholder="Job"
                value={job}
                onChange={(event) => setJob(event.target.value)}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAddNew;
