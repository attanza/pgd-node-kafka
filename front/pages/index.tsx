import axios from "axios";
import moment from "moment";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge, Button, Spinner, Stack } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import Layout from "../src/components/layout";
import { useMqtt } from "../src/contexts/mqtt.context";
import useMyTable from "../src/hooks/my-table.hook";
import { ETransactionStatus, ITransaction } from "../src/types/transaction";
import { errorParser } from "../src/utils/error-parser";
const Home: NextPage = () => {
  const [data, setData, handlePerRowsChange, handlePageChange, handleSort] =
    useMyTable({
      url: "/transactions",
    });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { client } = useMqtt();

  const topic = "node-kafka/Transaction/#";

  const getBadgeBg = (status: ETransactionStatus): string => {
    switch (status) {
      case ETransactionStatus.PENDING:
        return "danger";
      case ETransactionStatus.FAILED:
        return "secondary";
      case ETransactionStatus.PROCESS1:
        return "info";
      case ETransactionStatus.PROCESS2:
        return "dark";
      case ETransactionStatus.PROCESS3:
        return "warning";
      case ETransactionStatus.COMPLETED:
        return "success";

      default:
        return "secondary";
    }
  };

  const columns: TableColumn<ITransaction>[] = [
    {
      name: "No",
      cell: (row) => (
        <NextLink passHref href={`/transactions/${row._id}`}>
          {row._id}
        </NextLink>
      ),
      sortable: true,
      sortField: "_id",
    },
    {
      name: "Status",
      selector: (row) => row.statuses[row.statuses.length - 1].status,
      cell: (row) => (
        <Badge bg={getBadgeBg(row.statuses[row.statuses.length - 1].status)}>
          {row.statuses[row.statuses.length - 1].status}
        </Badge>
      ),
    },
    {
      name: "Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY hh:mm:ss"),
      sortable: true,
      sortField: "createdAt",
    },
  ];
  const createTransaction = async () => {
    try {
      setLoading(true);
      const resp = await axios.post("/transactions").then((res) => res.data);
      // router.push(`/transactions/${resp.data._id}`);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorParser(error);
    }
  };

  const subscribe = () => {
    if (client && data) {
      client.unsubscribe(topic);
      client.subscribe(topic);
      console.log(`mqtt subscribe to ${topic}`);
      client.on("message", (topic, message) => {
        const mqttData = JSON.parse(message.toString()) as ITransaction;
        const docs: ITransaction[] = data ? data.docs : [];
        const index = docs.findIndex(
          (d: ITransaction) => d._id === mqttData._id
        );
        if (index === -1) {
          docs.unshift(mqttData);
          setData({ ...data, docs });
        } else {
          docs[index] = mqttData;
          setData({ ...data, docs });
        }
      });
    }
  };

  const unsubscribe = () => {
    if (client) {
      client.unsubscribe(topic);
      console.log(`unsubscribe from ${topic}`);
    }
  };

  useEffect(() => {
    subscribe();
    return () => {
      unsubscribe();
    };
  }, [client, data]);

  return (
    <Layout>
      <h3 className="my-4">Transactions</h3>
      <Button
        variant="success"
        className="mb-4"
        onClick={createTransaction}
        disabled={loading}
      >
        <Stack direction="horizontal" gap={3}>
          {loading && <Spinner animation="grow" size="sm" />}
          <span>Create Transaction</span>
        </Stack>
      </Button>

      <DataTable
        columns={columns}
        data={data?.docs}
        sortServer
        onSort={handleSort}
        pagination
        paginationServer
        paginationTotalRows={data?.totalDocs}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        defaultSortAsc={false}
      />
    </Layout>
  );
};

export default Home;
