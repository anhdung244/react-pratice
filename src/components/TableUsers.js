import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUser from "./ModalEditUser";
import _ from "lodash";
import { debounce } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";

import ModalDeleteUser from "./ModalDeleteUser";
import "./TableUsers.scss";
import { toast } from "react-toastify";
import Papa from "papaparse";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);

  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [keyword, setKeyword] = useState("");

  const [dataExport, setDataExport] = useState([]);

  //CloseModal
  const handleCloseModal = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  //Update table
  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  //Update table after edit
  function handleEditUserFromModal(user) {
    console.log(user);
    let updateListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    updateListUsers[index].first_name = user.first_name;
    setListUsers(updateListUsers);
  }

  //Update table after Delete
  function handleDeleteUserFromModal(user) {
    console.log(user);
    let updateListUsers = _.cloneDeep(listUsers);
    updateListUsers = updateListUsers.filter((item) => item.id !== user.id);
    setListUsers(updateListUsers);
  }

  //Call API
  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);

    //dùng điều kiện "và" bởi vì có một số trường hợp res không trả về thì dùng mỗi res.data sẽ gây lỗi
    if (res && res.data) {
      setListUsers(res.data);
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
    }
    console.log(">> check res:", res);
  };

  //PAGINATION
  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };

  // Handle Edit user
  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  //Handle Delete user
  const handleDeleteUser = (user) => {
    setDataUserDelete(user);
    setIsShowModalDelete(true);
  };

  //SORT
  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  };

  //SEACRH USER BY EMAIL
  // dùng hàm debounce của lodash để giảm số lựong lần call API xuống
  // nó sẽ set time để gửi API
  const handleSearch = debounce((event) => {
    let term = event.target.value;
    console.log(term);
    if (term) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item.email.includes(term)
      );
      console.log(cloneListUsers);
      setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 500);

  //Download CSV Custom
  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  const getUsersExport = (event, done) => {
    let result = [];
    result.push(["Id", "Email", "First name", "Last name"]);
    if (listUsers && listUsers.length > 0) {
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
    }
    setDataExport(result);
    done();
  };

  //IMPORT CSV dùng thư viện để có thể import file
  const handleImportCSV = (event) => {
    if (event.target && event.target.files) {
      let file = event.target.files[0];

      //check type của file hoặc có thể check dung lượng của file
      if (file.type !== "text/csv") {
        toast.error("Only accept CSV file...");
      }

      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format CSV file");
              } else {
                let final = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    final.push(obj);
                  }
                });
                setListUsers(final);
              }
            } else {
              toast.error("Wrong format CSV file");
            }
          }
        },
      });
    }
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List Users:</b>
        </span>
        <div className="group-btns">
          <label htmlFor="import" className="btn btn-warning">
            <i class="fa-solid fa-file-import"></i> Import
          </label>
          <input
            type="file"
            id="import"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />
          <CSVLink
            filename={"users.csv"}
            className="btn btn-primary"
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            <i class="fa-solid fa-file-arrow-down"></i> Download
          </CSVLink>

          <button
            className="btn btn-success"
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"> </i> Add new user
          </button>
        </div>
      </div>

      <div>
        <input
          className="col-4 my-3"
          placeholder="Search user by email...."
          // value={keyword}
          onChange={(event) => handleSearch(event)}
        ></input>
      </div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span> ID</span>
                <span>
                  {" "}
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Email</th>
            <th>
              <div className="sort-header">
                <span> First name</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length >= 1 &&
            listUsers.map((item, index) => {
              return (
                <tr key={`users-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-3"
                      onClick={() => handleEditUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleCloseModal}
        handleUpdateTable={handleUpdateTable}
      ></ModalAddNew>
      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleCloseModal}
        handleEditUserFromModal={handleEditUserFromModal}
      ></ModalEditUser>
      <ModalDeleteUser
        show={isShowModalDelete}
        handleClose={handleCloseModal}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      ></ModalDeleteUser>
    </>
  );
};

export default TableUsers;
