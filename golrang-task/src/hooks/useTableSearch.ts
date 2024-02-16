import { useState, useEffect } from "react";
import { User } from "types";

export const useTableSearch = ({
  searchVal,
  retrieve,
}: {
  searchVal: string;
  retrieve: any;
}) => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [origData, setOrigData] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [loading, setLoading] = useState(true);

  const crawl = (user: any, allValues?: any[]) => {
    if (!allValues) allValues = [];
    type UserProperty = keyof User;

    for (const key in user) {
      if (typeof user[key as UserProperty] === "object") {
        const x = user[key as UserProperty]
        crawl(x, allValues);
      } else allValues.push(user[key as UserProperty] + " ");
    }
    return allValues;
  };
  type CrawlOutputType = ReturnType<typeof crawl>
  
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const { data: users } = await retrieve();
      setOrigData(users);
      setFilteredData(users);
      const searchInd = users.map((user: User) => {
        const allValues = crawl(user);
        return { allValues: allValues.toString() };
      });
      setSearchIndex(searchInd);
      if (users) setLoading(false);
    };
    fetchData();
  }, [retrieve]);

  useEffect(() => {
    if (searchVal) {
      const reqData = searchIndex.map((user: any, index) => {
        if (user.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0)
          return origData[index];
        return null;
      });
      setFilteredData(
        reqData.filter((user) => {
          if (user) return true;
          return false;
        })
      );
    } else setFilteredData(origData);
  }, [searchVal, origData, searchIndex]);

  return { filteredData, loading, setFilteredData };
};
