import { ChangeEvent, FC, useState } from "react";
import { useTableSearch } from "../../hooks/useTableSearch";

import { Table, Input, Button, TableProps, Modal } from "antd";
import axios from "axios";
import { userColumns } from "../../constants/columns";
import { User } from "types";
import CustomForm from "../../components/Form";
import useApi from "../../hooks/useApi";

const { Search } = Input;

const fetchUsers = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users/"
  );
  return { data };
};

const deleteUser = async (id: string) => {
  if (!id) {
    return;
  }

  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/users/3`
  );

  return response;
};

const createUser = async (user: User) => {
  const response = axios.post(
    "https://jsonplaceholder.typicode.com/users",
    {
      ...user,
    },
    {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  return response;
};

const updateUser = async (user: User) => {
  const response = await axios.put(
    `https://jsonplaceholder.typicode.com/users/${user?.id}`,
    {
      ...user,
    },
    {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  return response;
};

const TableContainer: FC = () => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [mode, setMode] = useState<"ADD" | "UPDATE">("ADD");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getApi = useApi({
    key: ["users"],
    method: "GET",
    url: `users`,
  })?.get;

  const updateApi = useApi({
    key: ["users"],
    method: "PUT",
    url: `users/`,
  })?.put;

  const deleteApi = useApi({
    key: ["users"],
    method: "DELETE",
    url: `users`,
  })?.deleteObj;

  const postApi = useApi({
    key: ["users"],
    method: "POST",
    url: `users`,
  })?.post;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedUserId(selectedRows?.[0]?.id?.toString() ?? "");
    },
    getCheckboxProps: (record: User) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  const { filteredData, loading, setFilteredData } = useTableSearch({
    searchVal,
    retrieve: getApi?.refetch,
  });

  const onChange: TableProps<User>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleSubmit = async (user: User) => {
    const sendRequest =
      mode === "ADD"
        ? () =>
            postApi?.mutate(user, {
              onSuccess: (response) => {
                setFilteredData((prevState) => [...prevState, { ...response }]);
              },
            })
        : () =>
            updateApi?.mutate(user, {
              onSuccess: (response) => {
                const updatedUser: User = response;
                const staleUserIndex = filteredData?.findIndex(
                  (user: User) => user?.id === updatedUser?.id
                );

                setFilteredData((prevState) => {
                  const newFiltered = [...prevState];
                  newFiltered[staleUserIndex] = updatedUser;
                  return newFiltered;
                });
              },
            });

    const response = sendRequest();

    console.log("xxx:", response);

    // if (response?.status === 200) {
    //   const updatedUser: User = await response?.data;
    //   const staleUserIndex = filteredData?.findIndex(
    //     (user: User) => user?.id === updatedUser?.id
    //   );

    //   setFilteredData((prevState) => {
    //     const newFiltered = [...prevState];
    //     newFiltered[staleUserIndex] = updatedUser;
    //     return newFiltered;
    //   });
    // }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div>
        <Search
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchVal(e.target.value)
          }
          placeholder="Search"
          enterButton
          style={{ position: "sticky", top: "0", left: "0" }}
        />
        <div>
          <Button
            type="primary"
            danger
            onClick={async () => {
              // const response = await deleteUser(selectedUserId ?? "");
              deleteApi?.mutate(selectedUserId ?? "", {
                onSuccess: (data) => {
                  setFilteredData(
                    filteredData?.filter(
                      (user: User) => user?.id?.toString() !== selectedUserId
                    )
                  );
                }
              });
              
            }}
          >
            Delete
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setMode("ADD");
              showModal();
            }}
          >
            Add
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setMode("UPDATE");
              showModal();
            }}
          >
            Update
          </Button>
        </div>
      </div>
      <br /> <br />
      <Table
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        rowKey="name"
        dataSource={filteredData}
        columns={userColumns}
        onChange={onChange}
        loading={loading}
        pagination={false}
        bordered
      />
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CustomForm
          defaultValues={
            selectedUserId && filteredData[parseInt(selectedUserId) - 1]
          }
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default TableContainer;
