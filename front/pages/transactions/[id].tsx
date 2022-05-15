import moment from "moment";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Badge, ListGroup, Spinner, Stack } from "react-bootstrap";
import useSWR from "swr";
import Layout from "../../src/components/layout";
import { IResponseDetail } from "../../src/types/response";
import {
  ETransactionStatus,
  ITransaction,
  ITransactionStatus,
} from "../../src/types/transaction";
import { errorParser } from "../../src/utils/error-parser";

const TransactionDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR<IResponseDetail<ITransaction>>(
    `/transactions/${id}`
  );
  if (error) {
    errorParser(error);
  }
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
  const getStatusText = (status: ETransactionStatus) => {
    const statuses = data?.data.statuses;
    if (statuses) {
      const index = statuses.findIndex(
        (s: ITransactionStatus) => s.status === status
      );
      if (index !== -1) {
        return <Badge bg={getBadgeBg(status)}>{status}</Badge>;
      } else {
        return <Badge bg="secondary">{status}</Badge>;
      }
    }
  };
  const getStatusDate = (status: ETransactionStatus) => {
    const statuses = data?.data.statuses;
    if (statuses) {
      const index = statuses.findIndex(
        (s: ITransactionStatus) => s.status === status
      );
      if (index !== -1) {
        return (
          <span>
            {moment(statuses[index].date).format("DD MMM YYYY hh:mm:ss")}
          </span>
        );
      } else {
        return <Spinner animation="border" variant={getBadgeBg(status)} />;
      }
    }
  };

  return (
    <Layout>
      <Stack gap={3} className="mt-4">
        <h3>Transaction {data?.data._id}</h3>
        <h4>Status</h4>
        <ListGroup>
          {Object.values(ETransactionStatus).map(
            (status: ETransactionStatus) => {
              if (
                status !== ETransactionStatus.FAILED &&
                status !== ETransactionStatus.SUCCESS
              ) {
                return (
                  <ListGroup.Item key={status}>
                    <Stack direction="horizontal" gap={3}>
                      <div>{getStatusText(status)}</div>
                      <div className="ms-auto">{getStatusDate(status)}</div>
                    </Stack>
                  </ListGroup.Item>
                );
              }
            }
          )}
        </ListGroup>
      </Stack>
    </Layout>
  );
};

export default TransactionDetail;
