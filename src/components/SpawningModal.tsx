import type { FunctionComponent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import classNames from "classnames";
import type { Parents } from "./SpawningCard";
import Image from "next/image";
import Link from "next/link";
import ky, { HTTPError } from "ky";
import { BiError } from "react-icons/bi";
import type { Child } from "../pages/api/claim";
import { CONTRACTS, IPFS_CID, STARGAZE_URL } from "../config";
import ranks from "../ranks.json";
import { useSpawnState } from "../stores/spawningStore";

const NftImage = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(url);
  useEffect(() => {
    if (url !== imageSrc) {
      setLoading(true);
      setImageSrc(url);
    }
  }, [url, imageSrc]);
  return (
    <>
      <Image
        width={250}
        height={250}
        alt=""
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        className={classNames(
          "absolute left-0 top-0 h-full w-full rounded-md",
          loading ? "invisible" : "visible"
        )}
        src={imageSrc}
      />
      {loading && <Spinner className="-mt-4 z-20" />}
    </>
  );
};

export const SpawningModal: FunctionComponent<{
  isOpen: boolean;
  handleClose: () => void;
}> = ({ isOpen, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { increase, currentParentsIndex, children, addChild, parents } =
    useSpawnState((state) => state);
  const handleSpawn = async () => {
    setLoading(true);
    try {
      const response: { child: Child } = await ky
        .post("/api/claim", {
          json: { parents: parents[currentParentsIndex] },
          timeout: false,
        })
        .json();
      if (!response.child) {
        throw new Error("An unexpected error occurred. Please try again.");
      }
      addChild(response.child);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof HTTPError) {
        setErrorMsg(await error.response.text());
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
      setIsError(true);
    }
    setLoading(false);
  };
  const handleNext = () => {
    increase();
  };
  const handleRetry = () => {
    setIsError(false);
    handleSpawn();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent bgColor="gray.600" className="pt-5">
        <ModalCloseButton onClick={handleClose} />
        <h1 className="ml-5 mb-6 text-xl text-white">
          Spawning child{" "}
          <span className="ml-1 font-semibold">
            {currentParentsIndex + 1} / {parents?.length}
          </span>
        </h1>
        <div className="flex w-full justify-around px-8">
          <Link
            href={`${STARGAZE_URL}/media/${CONTRACTS.female.sg721}/${parents[currentParentsIndex]?.female}`}
            target="_blank"
            className="flex relative aspect-square h-full w-44 items-center justify-center gap-2 rounded-t-md bg-black/80"
          >
            <NftImage
              url={`https://ipfs.stargaze.zone/ipfs/${IPFS_CID.female}/${parents[currentParentsIndex]?.female}.png`}
            />
            <h2 className="absolute bottom-0 left-0 w-full bg-black/70 py-1 text-center font-semibold text-base text-white">
              Female #{parents[currentParentsIndex]?.female}
            </h2>
          </Link>
          <Link
            href={`${STARGAZE_URL}/media/${CONTRACTS.male.sg721}/${parents[currentParentsIndex]?.male}`}
            target="_blank"
            className="flex relative aspect-square h-full w-44 items-center justify-center gap-2 rounded-t-md bg-black/80"
          >
            <NftImage
              url={`https://ipfs.stargaze.zone/ipfs/${IPFS_CID.male}/${parents[currentParentsIndex]?.male}.png`}
            />
            <h2 className="absolute bottom-0 left-0 w-full bg-black/70 py-1 text-center font-semibold text-base text-white">
              Male #{parents[currentParentsIndex]?.male}
            </h2>
          </Link>
        </div>
        <div className="mx-auto w-full max-w-sm py-6">
          <Progress
            value={loading ? 64 : children[currentParentsIndex] ? 100 : 0}
            colorScheme={isError ? "red" : "purple"}
            bgColor="black"
            isIndeterminate={loading}
            className="rounded-md"
          />
        </div>
        <div className="flex w-full justify-around px-8">
          <div className="flex relative aspect-square h-full w-44 items-center justify-center gap-2 rounded-md bg-black/80">
            {children[currentParentsIndex] ? (
              <>
                <NftImage
                  url={`https://ipfs.stargaze.zone/ipfs/${IPFS_CID.children}/${children[currentParentsIndex]?.token_id}.png`}
                />
                <h2 className="absolute bottom-0 left-0 w-full bg-black/70 rounded-b-md py-1 text-center font-semibold text-base text-white">
                  Child #{children[currentParentsIndex]?.token_id}
                </h2>
              </>
            ) : (
              <>
                <div className="flex relative aspect-square h-full w-full items-center justify-center rounded-md">
                  {isError ? (
                    <BiError className="-mt-4 h-8 w-8 fill-red-600" />
                  ) : (
                    loading && <Spinner className="-mt-4" />
                  )}
                </div>
                <h2 className="absolute bottom-0 left-0 w-full rounded-b-md bg-black/70 py-1 text-center font-semibold text-base text-white">
                  Child # ??
                </h2>
              </>
            )}
          </div>
          <ul className="flex h-full w-fit flex-col gap-2 rounded-md bg-black/70 p-4">
            <li className="font-semibold">
              Skin Tone:{" "}
              <span
                className={
                  parents[currentParentsIndex]?.skin_tone === "BT"
                    ? "text-blue-600"
                    : parents[currentParentsIndex]?.skin_tone === "NBT"
                    ? "text-green-500"
                    : "text-orange-500"
                }
              >
                {parents[currentParentsIndex]?.skin_tone}
              </span>
            </li>
            <li className="font-semibold">
              Rank:{" "}
              {children[currentParentsIndex]
                ? ranks.find(
                    (rank) =>
                      parseInt(rank.tokenId) ===
                      children[currentParentsIndex]?.token_id
                  )?.rank
                : "??"}
            </li>
            <li className="fill-[#ab3ef9] text-sm text-[#ab3ef9]">
              <Link
                href={
                  children[currentParentsIndex]
                    ? `${STARGAZE_URL}/media/${CONTRACTS.children.sg721}/${children[currentParentsIndex]?.token_id}`
                    : "#"
                }
                className={classNames(
                  "flex items-center gap-2",
                  !children[currentParentsIndex] && "hover:cursor-not-allowed"
                )}
                target={children[currentParentsIndex] && "_blank"}
              >
                View on Stargaze
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-3 w-3 fill-[hsl(275,94%,61%)]"
                >
                  <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z" />
                </svg>
              </Link>
            </li>
            <button
              onClick={
                loading || children.length >= parents.length
                  ? () => null
                  : isError
                  ? handleRetry
                  : children[currentParentsIndex]
                  ? handleNext
                  : handleSpawn
              }
              className={classNames(
                "my-1.5 mx-auto w-3/4 rounded-lg bg-white/30 px-3 py-2 font-semibold hover:bg-white/40",
                (loading || children.length >= parents.length) &&
                  "hover:cursor-not-allowed"
              )}
            >
              {isError
                ? "Retry ↻"
                : children[currentParentsIndex] || loading
                ? "Next →"
                : "Spawn"}
            </button>
          </ul>
        </div>
        <span
          className={classNames(
            "py-3 text-center text-sm font-semibold text-red-500",
            isError ? "visible" : "invisible"
          )}
        >
          Error: {errorMsg}
        </span>
      </ModalContent>
    </Modal>
  );
};

export const SpawningButton: FunctionComponent<{
  disabled: boolean;
  parents: Parents[];
  refetch: () => void;
}> = ({ disabled, parents, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reset = useSpawnState((state) => state.reset);
  const addParents = useSpawnState((state) => state.addParents);
  const handleClose = () => {
    setIsOpen(false);
    refetch();
    reset();
  };
  const handleOpen = () => {
    addParents(parents);
    setIsOpen(true);
  };
  return (
    <>
      <button
        onClick={handleOpen}
        className={classNames(
          "mb-7 rounded-lg bg-white/30 px-3 py-2 text-lg font-semibold hover:bg-white/40",
          disabled && "hover:cursor-not-allowed"
        )}
        disabled={disabled}
      >
        Begin Spawning
      </button>
      {isOpen && <SpawningModal handleClose={handleClose} isOpen={isOpen} />}
    </>
  );
};
