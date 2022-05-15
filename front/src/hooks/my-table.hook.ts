import axios from "axios";
import { useEffect, useState } from "react";
import { SortOrder, TableColumn } from "react-data-table-component";
import { ITransaction } from "../types/transaction";
import { errorParser } from "../utils/error-parser";

type Props = {
  url: string;
};
export default function useMyTable<T>({ url }: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState<string | undefined>("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const address = `${url}?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`;
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>(undefined);
  // const { data, error } = useSWR(address);

  if (error) {
    errorParser(error);
  }

  const handlePerRowsChange = (newPerPage: number) => {
    setLimit(newPerPage);
  };
  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const handleSort = (
    column: TableColumn<ITransaction>,
    direction: SortOrder
  ) => {
    const sortField = column.sortField || "createdAt";
    setSortField(sortField);
    setSortDirection(direction);
  };

  const getData = async () => {
    try {
      const resp = await axios.get(address).then((res) => res.data);

      setData(resp.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getData();
  }, [page, limit, sortDirection, sortField, sortDirection]);

  return [
    data,
    setData,
    handlePerRowsChange,
    handlePageChange,
    handleSort,
    address,
  ];
}
