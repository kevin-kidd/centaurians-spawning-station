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
            "stars1e43es3w3q4a45h2j0xhjdwqkp00g8ny8awankyfkmv4esnf57sjssrqwsd",
          minter:
            "stars1gsyr09wd8a85l7tguwj6j2q36j34wks6kxgkg2dvrr3ck4t6vr9qelfx8r",
        },
        male: {
          sg721:
            "stars1j0ypms4zyssv82rks6d0c3fx7y24awpke7l86u8w2pt29zs9v6uqsf7zky",
          minter:
            "stars1q6fyr0w3x8hlsl2qnw6gzd8e4yk59vxu59mr3hpvgs7ttcdd7v4s4gt8wy",
        },
        children: {
          sg721:
            "stars1zcnzghdg0ey4m0e49a0wgeqln9hs6fad7ufhkesk9wvx4qhg9g3szm5dpv",
          minter:
            "stars1tqxy2t3c3e37qfhaqvp0cr74gpg7edy3hfnj0nta95mswr2fzw7slq7zcs",
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
