'use client';

import Image from "next/image";
import Link from "next/link";

const ExploreBtn = () => {
  return (
      <Link
        id="explore-btn"
        href="#events"
        className="mt-7 mx-auto"
      >
        Explore Events
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
      </Link>
  )
}

export default ExploreBtn

