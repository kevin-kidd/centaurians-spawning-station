import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import type { QueryFunctionContext } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { FunctionComponent } from "react";
import classNames from "classnames";

export const SpawningCard: FunctionComponent = () => {
  const { address, openView } = useWallet();
  const {
    isLoading: isLoadingInventory,
    error: inventoryError,
    data: inventory,
  } = useQuery(["inventory", address], fetchInventory);
  const {
    isLoading: isLoadingParents,
    error: parentsError,
    data: eligibleParents,
  } = useQuery(["inventory", inventory], fetchEligibleParents);
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
              : inventory?.male.length}
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
        parent(s) eligible for spawning.
      </h4>
      <button
        className={classNames(
          "mb-7 rounded-lg bg-white/30 px-3 py-2 text-lg font-semibold hover:bg-white/40",
          !eligibleParents ||
            (eligibleParents.parents.length <= 0 && "hover:cursor-not-allowed")
        )}
        disabled={!eligibleParents || eligibleParents.parents.length <= 0}
      >
        Begin Spawning
      </button>
      <div className="absolute bottom-2 flex w-full items-end justify-between px-3 text-gray-200">
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
  const client = await CosmWasmClient.connect(
    "https://rpc.stargaze-1.publicawesome.dev/"
  );
  const femaleInventoryResponse = await client.queryContractSmart(
    "stars1q30dl4860s5l5xm36swwdv9g8j50j4h8y2f7ynd35ya0jlp5gzts7c6vt0",
    {
      tokens: {
        owner: address,
        limit: 300,
      },
    }
  );
  const maleInventoryResponse = await client.queryContractSmart(
    "stars1atmccal7mpum6hvn6ayev9xp0nnjscrk6w9xsfjkhre5fa47z5jsetzvwd",
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
