import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import type { QueryFunctionContext } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import ky, { HTTPError } from "ky";
import type { FunctionComponent } from "react";
import { useRef } from "react";
import type { ToastId } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { CONTRACTS, RPC_ENDPOINT } from "../config";
import { env } from "../env/client.mjs";
import { SpawningButton } from "./SpawningModal";

export const SpawningCard: FunctionComponent = () => {
  const { address, openView } = useWallet();
  const {
    isLoading: isLoadingInventory,
    error: inventoryError,
    data: inventory,
    refetch: refetchInventory,
  } = useQuery(["inventory", address], fetchInventory);
  const {
    isLoading: isLoadingParents,
    error: parentsError,
    data: eligibleParents,
    refetch,
  } = useQuery(["inventory", inventory], fetchEligibleParents);
  const toast = useToast();
  const toastId = useRef<ToastId>();
  if (parentsError) console.error({ parentsError });
  if (inventoryError) console.error({ inventoryError });
  const handleFaucet = async (address: string) => {
    if (!toast.isActive("faucet") || !toastId.current) {
      toastId.current = toast({
        description: "Requesting from faucet...",
        status: "loading",
        isClosable: false,
        duration: 30000,
        id: "faucet",
      });
    }
    try {
      const response = await ky
        .post("/api/faucet", {
          json: { address: address },
        })
        .text();
      toast.update(toastId.current, {
        description: response,
        isClosable: true,
        status: "success",
        duration: 30000,
      });
      refetchInventory().then(() => refetch());
      refetch();
    } catch (error: unknown) {
      console.error(error);
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (error instanceof HTTPError) {
        errorMsg = await error.response.text();
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.update(toastId.current, {
        description: errorMsg,
        isClosable: true,
        status: "error",
        duration: 30000,
      });
    }
  };
  return (
    <>
      <div className="flex w-full justify-around text-center text-2xl font-semibold">
        <h3 className="flex flex-col">
          Male{" "}
          <span className="text-3xl text-[hsl(275,94%,61%)]">
            {isLoadingInventory
              ? "..."
              : inventoryError
              ? "N/A"
              : inventory?.male?.length}
          </span>
        </h3>
        <h3 className="flex flex-col">
          Female{" "}
          <span className="text-3xl text-[hsl(275,94%,61%)]">
            {isLoadingInventory
              ? "..."
              : inventoryError
              ? "N/A"
              : inventory?.female.length}
          </span>
        </h3>
      </div>
      <h4 className="mt-1 text-lg">
        You have{" "}
        <span className="text-xl font-semibold text-[hsl(275,94%,61%)]">
          {isLoadingParents
            ? "..."
            : parentsError
            ? "N/A"
            : eligibleParents?.parents.length}
        </span>{" "}
        couple(s) eligible for spawning.
      </h4>
      <SpawningButton
        parents={eligibleParents?.parents}
        disabled={!eligibleParents || eligibleParents.parents.length <= 0}
        refetch={refetch}
      />
      {env.NEXT_PUBLIC_NETWORK_TYPE === "testnet" && address && (
        <span
          className="text-md absolute top-2 right-4 hover:cursor-pointer hover:text-white"
          onClick={() => handleFaucet(address)}
        >
          Faucet
        </span>
      )}

      <div className="flex absolute bottom-2 w-full items-end justify-between px-3 text-gray-200">
        <span className="truncate text-sm">{address}</span>
        <span
          className="text-md hover:cursor-pointer hover:text-white"
          onClick={openView}
        >
          Switch Wallet
        </span>
      </div>
    </>
  );
};

const fetchEligibleParents = async ({
  queryKey,
}: QueryFunctionContext<[string, string | null | undefined | Inventory]>) => {
  const [_, inventory] = queryKey;
  if (!inventory) {
    return {
      parents: [],
    };
  }
  const response = await fetch("/api/eligibility", {
    method: "POST",
    body: JSON.stringify({
      inventory: inventory,
    }),
  });
  const data = await response.json();
  if (data.parents) {
    return {
      parents: data.parents,
    };
  }
  return {
    parents: [],
  };
};

const fetchInventory = async ({
  queryKey,
}: QueryFunctionContext<[string, string | null | undefined]>) => {
  const [_, address] = queryKey;
  const client = await CosmWasmClient.connect(RPC_ENDPOINT);
  const femaleInventoryResponse = await client.queryContractSmart(
    CONTRACTS.female.sg721,
    {
      tokens: {
        owner: address,
        limit: 300,
      },
    }
  );
  const maleInventoryResponse = await client.queryContractSmart(
    CONTRACTS.male.sg721,
    {
      tokens: {
        owner: address,
        limit: 300,
      },
    }
  );
  const inventory: Inventory = {
    male: [],
    female: [],
  };
  if (femaleInventoryResponse.tokens)
    inventory.female = femaleInventoryResponse.tokens;
  if (maleInventoryResponse.tokens)
    inventory.male = maleInventoryResponse.tokens;
  return inventory;
};

export type Inventory = {
  male: string[];
  female: string[];
};

export type Parents = {
  male: string;
  female: string;
  skin_tone: string;
};
