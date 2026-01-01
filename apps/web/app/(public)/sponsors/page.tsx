import TitleSponsors from "@/components/sponsors/title";
import React, { JSX } from "react";
import PlatinumSponsors from "../../../components/sponsors/platinum";

const background =
  "https://res.cloudinary.com/drf3eatfm/image/upload/v1767283927/nitrutsav-2026/ggdb93tvuuukh6csh745.webp";

export default function SponsorsPage(): JSX.Element {
  return (
    <div className="bg-[#010005] w-full  relative text-white grid place-items-center min-h-screen">
      <img
        className=" inset-0 w-full h-full object-cover  fixed"
        alt="Carnival Background"
        src={background}
      />

      <div>
        <TitleSponsors />
        <PlatinumSponsors />
      </div>
    </div>
  );
}
