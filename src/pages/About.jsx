import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 px-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          alt="RJ Golds Storefront"
          className="w-full md:max-w-[450px]"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4">
          <p><b>RJ Golds</b> is a renowned jewellery business based in Kolkata, celebrated for our commitment to quality craftsmanship and reasonable pricing. With years of experience in the industry, we have become a trusted name for customers seeking authentic gold and silver jewellery that blends tradition with modern elegance.</p>
          <p>Our collection features a wide range of exquisite pieces, from classic gold chains and rings to contemporary designs in silver and diamond. Every item is carefully crafted to meet the highest standards, ensuring both beauty and durability.</p>
          <b>Our Promise</b>
          <p>At RJ Golds, we believe that everyone deserves to shine. We are dedicated to offering genuine jewellery at prices that are fair and accessible, without compromising on quality. Our transparent pricing and customer-first approach have earned us the loyalty of clients across Kolkata and beyond.</p>
        </div>
      </div>
      <div className="text-xl py-4 px-10">
        <Title text1={'WHY'} text2={'RJ GOLDS?'}/>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Unmatched Quality: </b>
          <p className="text-gray-600">Every piece is crafted with precision and care, using only the finest materials to ensure lasting value and beauty.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Reasonable Pricing: </b>
          <p className="text-gray-600">We are committed to honest, transparent pricing so you can shop with confidence and peace of mind.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Trusted by Kolkata: </b>
          <p className="text-gray-600">Our reputation is built on years of trust, reliability, and a deep connection with our community.</p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default About;
