import Link from "next/link";


const Navbar = () => {
  return (
    <div className="w-full bg-green-400 p-4 text-white font-space-grotesk">
      <ul className="flex  justify-around">
        <li>
          {" "}
          <Link href="/"> Home</Link>
        </li>
        <li>
          {" "}
          <Link href="/about"> About</Link>
        </li>

        <li>
          {" "}
          <Link href="/contact"> contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
