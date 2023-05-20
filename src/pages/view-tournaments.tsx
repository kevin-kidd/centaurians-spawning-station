import { type NextPage } from "next";
import Head from "next/head";
import { Footer } from "../components/Footer";
import { useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  const [key, setKey] = useState("");
  const [data, setData] = useState([]);
  const toast = useToast();
  const getData = async () => {
    await axios
      .post("/api/get-tournaments", { key })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        let errorMsg = err;
        if (err.response && err.response.data) {
          errorMsg = err.response.data;
        }
        toast({
          title: "Error",
          description: errorMsg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };
  return (
    <>
      <Head>
        <title>Tournaments Data</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-image" />
      <main className="flex min-h-[92vh] flex-col items-center justify-center">
        {data.length > 0 ? (
          <TableContainer className="bg-white/20 rounded-lg">
            <Table variant="striped">
              <TableCaption>Latest DB dump</TableCaption>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Winner</Th>
                  <Th>Created at</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map(
                  (item: {
                    created_at: string;
                    id: number;
                    winner: string;
                  }) => (
                    <Tr key={item.id}>
                      <Td>{item.id}</Td>
                      <Td>{item.winner}</Td>
                      <Td isNumeric>{item.created_at}</Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <div className="flex gap-3 rounded-md p-8 bg-white/20">
            <Input
              type="text"
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter the API key"
              className="w-full max-w-xs"
              value={key}
            />
            <Button onClick={getData}>Grab Data</Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Home;
