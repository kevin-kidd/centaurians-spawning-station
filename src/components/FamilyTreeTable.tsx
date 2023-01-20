import type { SearchResult } from "minisearch";
import MiniSearch from "minisearch";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, FunctionComponent } from "react";
import { useState } from "react";
import type { NFT_DATA } from "../pages/api/eligibility";

export const FamilyTreeTable: FunctionComponent<{
  males: NFT_DATA[];
  females: NFT_DATA[];
}> = ({ males, females }) => {
  const [selectedCollection, setSelectedCollection] = useState("Females");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>();
  const [filteredMales, setFilteredMales] = useState<NFT_DATA[]>(males);
  const [filteredFemales, setFilteredFemales] = useState<NFT_DATA[]>(females);
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
    if (!event.target.value) {
      selectedCollection === "Females"
        ? setFilteredFemales(females)
        : setFilteredMales(males);
      return;
    }
    const miniSearch = new MiniSearch({
      fields: ["token_id"],
      storeFields: ["token_id", "skin_tone", "fertile"],
    });
    miniSearch.addAll(
      selectedCollection === "Females"
        ? females.map((female: NFT_DATA, index: number) => ({
            ...female,
            id: index,
          }))
        : males.map((male: NFT_DATA, index: number) => ({
            ...male,
            id: index,
          }))
    );
    const data = miniSearch.search(event.target.value, {
      fields: ["token_id"],
      prefix: true,
    });
    const searchResults: NFT_DATA[] = data.map((result: SearchResult) => ({
      token_id: result.token_id,
      fertile: result.fertile,
      skin_tone: result.skin_tone,
    }));
    selectedCollection === "Females"
      ? setFilteredFemales(searchResults)
      : setFilteredMales(searchResults);
  };
  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 px-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex h-10 w-fit items-center gap-2">
          <div
            className="button-gradient flex h-full w-full rounded-2xl border border-transparent"
            onClick={() => {
              setSelectedCollection(
                selectedCollection === "Females" ? "Males" : "Females"
              );
              setFilteredFemales(females);
              setFilteredMales(males);
              setSearchValue("");
              setCurrentPage(1);
            }}
          >
            <button
              className={classNames(
                "flex group w-1/2 items-center",
                selectedCollection === "Females" &&
                  "toggle-active rounded-2xl bg-[#383838]"
              )}
            >
              <a
                className={classNames(
                  "mr-1 px-3 py-2 text-sm sm:px-5 sm:text-base",
                  selectedCollection === "Females"
                    ? "text-[#eeeeee]"
                    : "text-[#8c8c8c] group-hover:text-white"
                )}
              >
                Females
              </a>
            </button>
            <button
              className={classNames(
                "flex group w-1/2 items-center",
                selectedCollection === "Males" &&
                  "toggle-active rounded-2xl bg-[#383838]"
              )}
            >
              <a
                className={classNames(
                  "ml-1 px-3 py-2 text-sm sm:px-5 sm:text-base",
                  selectedCollection === "Males"
                    ? "text-[#eeeeee]"
                    : "text-[#8c8c8c] group-hover:text-white"
                )}
              >
                Males
              </a>
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search Token ID..."
          onChange={handleSearch}
          value={searchValue}
          className="button-gradient flex h-10 max-w-lg rounded-lg border border-transparent px-2 focus:outline-none"
        />
      </div>
      <div className="flex w-full flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden rounded-lg border border-white/20 shadow">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-[#141414]">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Skin Tone
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-white sm:block"
                    >
                      View
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20 bg-[#222222]">
                  {(selectedCollection === "Females"
                    ? filteredFemales
                    : filteredMales
                  )
                    .slice(currentPage * 5 - 5, currentPage * 5)
                    .map((nftData: NFT_DATA) => (
                      <tr
                        key={`table-item-${nftData.token_id}-${selectedCollection}`}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-full w-full rounded-full"
                                width={50}
                                height={50}
                                src={`https://ipfs.stargaze.zone/ipfs/${
                                  selectedCollection === "Females"
                                    ? "bafybeifxnqvhkylow3jj3r7udamjihjp3qjalbzwcx2tnqkih5p46shnmq"
                                    : "bafybeia7uiqs7rw3kahhl33in3tdo4rggzfl3wnv2ust6d4ymyk2kq45ra"
                                }/${nftData.token_id}.png`}
                                alt=""
                              />
                            </div>
                            <div className="ml-4 font-medium text-white">
                              {selectedCollection === "Females"
                                ? "Female"
                                : "Male"}{" "}
                              #{nftData.token_id}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span
                            className={classNames(
                              "inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-green-800",
                              nftData.skin_tone === "BT"
                                ? "bg-blue-100"
                                : nftData.skin_tone === "NBT"
                                ? "bg-green-100"
                                : "bg-orange-100"
                            )}
                          >
                            {nftData.skin_tone}
                          </span>
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 sm:table-cell">
                          <Link
                            href={`https://app.stargaze.zone/marketplace/${
                              selectedCollection === "Females"
                                ? "stars1q30dl4860s5l5xm36swwdv9g8j50j4h8y2f7ynd35ya0jlp5gzts7c6vt0"
                                : "stars1atmccal7mpum6hvn6ayev9xp0nnjscrk6w9xsfjkhre5fa47z5jsetzvwd"
                            }/${nftData.token_id}`}
                            target="_blank"
                            className="flex items-center gap-2 text-sm text-[#ab3ef9]"
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
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap px-3 py-4 text-sm",
                            nftData.fertile ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {nftData.fertile ? "Fertile" : "Infertile"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-x-4">
        <button
          className={classNames(
            "text-xl text-white/90 hover:text-white",
            currentPage === 1 ? "hover:cursor-not-allowed" : "hover:text-white"
          )}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ←
        </button>
        Page {currentPage}/
        {selectedCollection === "Females"
          ? Math.ceil(filteredFemales.length / 5)
          : Math.ceil(filteredMales.length / 5)}
        <button
          className={classNames(
            "text-xl text-white/90",
            (selectedCollection === "Females"
              ? Math.ceil(filteredFemales.length / 5)
              : Math.ceil(filteredMales.length / 5)) === currentPage
              ? "hover:cursor-not-allowed"
              : "hover:text-white"
          )}
          disabled={
            (selectedCollection === "Females"
              ? Math.ceil(filteredFemales.length / 5)
              : Math.ceil(filteredMales.length / 5)) === currentPage
          }
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          →
        </button>
      </div>
    </>
  );
};
