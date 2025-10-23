import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 px-8 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={assets.contact_img}
          alt=""
          className="w-full md:max-w-[480px]"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            Ground Floor, Ravi Building, 42E, Rafi Ahmed Kidwai Road, Park St, near Allen Park, opposite to West Bengal Board of Secondary office, Kolkata, West Bengal 700016
          </p>
          <p className="text-gray-500">
            Tel: 9100000000 <br />
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@rjgolds.com" target="_blank">Email: support@rjgolds.com</a>
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at RJ Golds
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
