import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { putUpdateUser } from "../services/UserService";

const ModalEditUser = (props) => {
  const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  const handleEditUser = async () => {
    let res = await putUpdateUser(name, job);
    console.log(res);
    if (res && res.updatedAt) {
      //success
      handleEditUserFromModal({ first_name: name, id: dataUserEdit.id });
      handleClose();
      toast.success("Update user succeed !");
    }
  };

  useEffect(() => {
    if (show) {
      setName(dataUserEdit.first_name);
      console.log(dataUserEdit);
    }
  }, [dataUserEdit]);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
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
          <Button variant="primary" onClick={() => handleEditUser()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditUser;
