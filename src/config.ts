import { env } from "./env/client.mjs";

export const IPFS_CID = {
  male: "bafybeia7uiqs7rw3kahhl33in3tdo4rggzfl3wnv2ust6d4ymyk2kq45ra",
  female: "bafybeifxnqvhkylow3jj3r7udamjihjp3qjalbzwcx2tnqkih5p46shnmq",
  children: "bafybeihvgwdzcppm67lgqxtp2kqhpwz3e7hxxos5tsscmboxkcx76qutrq",
};

export const CONTRACTS =
  env.NEXT_PUBLIC_NETWORK_TYPE === "testnet"
    ? {
        female: {
          sg721:
            "stars1awr5sx4aga3aucx7l8a9rxgwmgpxuv8af6zg2k5tdtx8jp0n2tqs6sspyr",
          minter:
            "stars1559gw2e9mq48mthtzngxawqtlxrt8kfxh4jlfalflyl3fckm4q8svuydgv",
        },
        male: {
          sg721:
            "stars1j8q4fe32rwepqtkkusguqz2p2lkhctzuk5vd5aemcxkd9xdlwrys7ja33z",
          minter:
            "stars1mjr0waxnzhmftz6u7g6d3k9uluxymwze8sakkd8xfy2skjf4cu3s38v4ty",
        },
        children: {
          sg721:
            "stars15z2f5uqf7vulyfjzw206tnsx2qns7ny777n30lsxe0l04xa3xh4q040m06",
          minter:
            "stars1a2rlrj5gera2w5d9ve0ugkz77d6n869422j6exxvve4nkafk67cs7a4vhx",
        },
      }
    : {
        female: {
          sg721:
            "stars1q30dl4860s5l5xm36swwdv9g8j50j4h8y2f7ynd35ya0jlp5gzts7c6vt0",
          minter: "",
        },
        male: {
          sg721:
            "stars1atmccal7mpum6hvn6ayev9xp0nnjscrk6w9xsfjkhre5fa47z5jsetzvwd",
          minter: "",
        },
        children: {
          sg721: "",
          minter: "",
        },
      };

export const RPC_ENDPOINT =
  env.NEXT_PUBLIC_NETWORK_TYPE === "testnet"
    ? "https://rpc.elgafar-1.stargaze-apis.com"
    : "https://rpc.stargaze-1.publicawesome.dev/";

export const STARGAZE_URL =
  env.NEXT_PUBLIC_NETWORK_TYPE === "testnet"
    ? "https://testnet.publicawesome.dev"
    : "https://app.stargaze.zone";
