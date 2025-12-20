import HeaderSearchBar from "@/components/common/HeaderSeachbar";
import React, { useState } from "react";

// You can replace this with your actual FAQ data
const faqData = [
  {
    question: "Shipping, Platform Fee, Order Tracking & Deliver",
    answer:
      "Lorem Ipsum is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry's Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And More Recently With Desktop Publishing Software Like Aldus PageMaker Including V",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and various other online payment methods. Our checkout process is secure and encrypted to protect your information.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive an email with a tracking number and a link to the carrier's website. You can use this information to track the status of your delivery.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. If you are not satisfied with your purchase, you can return it for a full refund or exchange, provided it is in its original condition.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to many countries worldwide. Shipping costs and delivery times vary depending on the destination. Please check our shipping information page for more details.",
  },
];

const FaqItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = index === openIndex;

  return (
    <div className="border-b border-gray-200/80 py-6">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-base sm:text-lg font-medium text-gray-800">
          {faq.question}
        </h3>
        <span className="text-2xl text-gray-500 font-light transition-transform duration-300">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="pt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  return (
    <>
      <HeaderSearchBar />
      <div className="flex items-center justify-center bg-[#FAF6F2] font-sans">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h1>
          <div className="space-y-2">
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                index={index}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
