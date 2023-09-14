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
            "stars1jehtatssqsqzuec92qjeadh3fysakdece3drnfdeyzf9va285vwq6wq2xy",
          minter:
            "stars1lcr2rjenkxz3t9d2k373a86sqw7q802ft5fnzpukf0jkn6yyaynq5ljtd2",
        },
        male: {
          sg721:
            "stars1clw2ea3cyga0lfa8jgkddlzek549l3sr7vxlyxrgszhz8rsmps2stdyhrv",
          minter:
            "stars156q86v9a2zgcvdaqffseu8ey875p9ac7njp2f7eyj0cfulyhv8wqt8vues",
        },
        children: {
          sg721:
            "stars1hk0ez5mwmjfenqx7dgztwegmtggr8l36qagslh2q0asezw9eqaaq27mlaj",
          minter:
            "stars1ct320we24scgxaqhthg6p4s6lt36xxuff32drc28vfspju4kyn4szan43s",
        },
      }
    : {
        female: {
          sg721:
            "stars1q30dl4860s5l5xm36swwdv9g8j50j4h8y2f7ynd35ya0jlp5gzts7c6vt0",
          minter:
            "stars1d0h3e0pjtyfrcpps7xczp6qx6jvxt8pl99kkyk4gxayj6wfau04qsvc95t",
        },
        male: {
          sg721:
            "stars1atmccal7mpum6hvn6ayev9xp0nnjscrk6w9xsfjkhre5fa47z5jsetzvwd",
          minter:
            "stars1ekhzkjes36smfzx3k3aewvyf70yhlppxagcshp05pc4n9jqmtt7q2ndd9k",
        },
        children: {
          sg721:
            "stars18zcnj2taxnj9mf9hzec75exdyj9fpqc6hz8epqrfagezg8e7y6rql8s8gx",
          minter:
            "stars1w4wygjgjg8c2lzvxeycgq4epzqa8509699acn634ycm685yntpqqm9zlrn",
        },
      };

export const RPC_ENDPOINT =
  env.NEXT_PUBLIC_NETWORK_TYPE === "testnet"
    ? "https://rpc.elgafar-1.stargaze-apis.com"
    : "https://rpc.stargaze-apis.com/";

export const STARGAZE_URL =
  env.NEXT_PUBLIC_NETWORK_TYPE === "testnet"
    ? "https://testnet.publicawesome.dev"
    : "https://stargaze.zone";
