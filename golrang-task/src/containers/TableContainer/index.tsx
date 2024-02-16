import { ChangeEvent, FC, useState } from "react";
import { useTableSearch } from "../../hooks/useTableSearch";

import { Table, Input, Button } from "antd";
import axios from "axios";
import { userColumns } from "../../constants/columns";
import { User } from "types";

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

const TableContainer: FC = () => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>();

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
    retrieve: fetchUsers,
  });

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
              const response = await deleteUser(selectedUserId ?? "");
              if (response?.status === 200) {
                setFilteredData(
                  filteredData?.filter(
                    (user: User) => user?.id?.toString() !== selectedUserId
                  )
                );
              }
            }}
          >
            Delete
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
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default TableContainer;
