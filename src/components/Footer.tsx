import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="pb-6 w-full flex justify-center items-center">
      <span className="w-full text-center font-semibold">
        Made with ♥ by{" "}
        <Link
          href="https://twitter.com/kevinakidd/"
          target="_blank"
          className="text-purple-500"
        >
          KevinAKidd
        </Link>
      </span>
    </footer>
  );
};
