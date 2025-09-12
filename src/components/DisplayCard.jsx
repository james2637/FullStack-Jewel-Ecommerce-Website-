import React from "react";
import { assets } from "../assets/assets";
import malemodel from "../assets/male.png";
import femalemodel from "../assets/female.png";

const recipients = [
  {
    label: "Him",
    img: malemodel,
    link: "/shop/him"
  },
  {
    label: "Her",
    img: femalemodel,
    link: "/shop/her"
  }
];

const DisplayCard = () => (
  <div className="w-full py-8">
    <h2 className="text-center text-2xl font-semibold mb-8">Shop by Recipient</h2>
    <div className="flex justify-center gap-8">
      {recipients.map((rec) => (
        <a
          key={rec.label}
          href={rec.link}
          className="block rounded-[32px] border border-pink-200 bg-pink-50 overflow-hidden w-[420px] h-[360px] flex flex-col items-center justify-center shadow hover:shadow-lg transition-shadow"
        >
          <span className="mb-2 text-lg font-semibold text-pink-600">Shop by Recipient</span>
          <img
            src={rec.img}
            alt={rec.label}
            className="object-cover w-full h-[80%]"
          />
          <span className="mt-4 text-xl font-medium text-pink-700">{rec.label}</span>
        </a>
      ))}
    </div>
  </div>
);

export default DisplayCard;