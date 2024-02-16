import { ChangeEvent, FC, useState } from 'react';
import { useTableSearch } from 'hooks/useTableSearch';

import { Table, Input } from 'antd';
import axios from 'axios';
import { userColumns } from '@constants/columns';

const { Search } = Input;

const fetchUsers = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users/');
  return { data };
};

const TableContainer: FC = () => {
  const [searchVal, setSearchVal] = useState<string>('');

  // const { filteredData, loading } = useTableSearch({
  //   searchVal,
  //   retrieve: fetchUsers,
  // });
  return (
    <div>
      <Search
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{ position: 'sticky', top: '0', left: '0' }}
      />
      <br /> <br />
      <Table 
      rowKey="name" dataSource={filteredData} columns={userColumns} loading={loading} pagination={false} />
    </div>
  );
};

export default TableContainer;
