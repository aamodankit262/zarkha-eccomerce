import React from "react";
import logoImage from "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png";

// Sample data mirroring the invoice image
const invoiceData = {
  invoiceTitle: "Tax Invoice",
  sellerName: "Zarkha",
  orderId: "OD429589084520080100",
  invoiceNo: "FAKTAK2400010947",
  gstin: "24AIFPC9101P1Z",
  orderDate: "03-11-2023, 11:48 PM",
  invoiceDate: "03-11-2023, 11:49 PM",
  pan: "AIFPC9101P",
  soldBy: {
    name: "BABUBHAI NARANBHAI CHOVATIYA,",
    addressLine1: "206,1st Floor Shantivan-2 Soc., Opp. Rajvi Shopping",
    addressLine2: "Center AboveRadhe Clinic, Sarthana Jakanaka,",
    landmark: "Landmark : Surat District : Surat State : Gujarat,",
    cityPincode: "SURAT - 395006",
    gst: "24AIFPC9101P1Z",
  },
  shippingAddress: {
    name: "Ram",
    addressLine1: "206,1st Floor Shantivan-2 Soc., Opp. Rajvi Shopping",
    addressLine2: "Center AboveRadhe Clinic, Sarthana Jakanaka,",
    landmark: "Landmark : Surat District : Surat State : Gujarat,",
    cityPincode: "SURAT - 395006",
    gst: "24AIFPC9101P1Z",
  },
  items: [
    {
      id: "#0120001",
      title: "Ruffle A-Line Dress, Size: XL",
      qty: 1,
      amount: "₹2,00",
      igst: "₹20",
      shipping: "₹20",
      discount: "₹00",
      total: "₹240",
    },
    {
      id: "#0120001",
      title: "Ruffle A-Line Dress, Size: XL",
      qty: 1,
      amount: "₹2,00",
      igst: "₹20",
      shipping: "₹20",
      discount: "₹00",
      total: "₹240",
    },
    {
      id: "#0120001",
      title: "Ruffle A-Line Dress, Size: XL",
      qty: 1,
      amount: "₹2,00",
      igst: "₹20",
      shipping: "₹20",
      discount: "₹00",
      total: "₹240",
    },
  ],
  totalAmount: "₹720",
};

export default function TaxInvoice() {
  return (
    <div className="bg-gray-200 font-sans p-4 sm:p-8">
      {/* A4 Size Container */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto p-12">
        {/* Header Section */}
        <header className="flex justify-between items-start pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {invoiceData.invoiceTitle}
            </h1>
            <p className="text-lg text-gray-600">
              By: {invoiceData.sellerName}
            </p>
          </div>
          <div className="text-right text-sm text-gray-700 grid grid-cols-2 gap-x-8 gap-y-2">
            <span className="font-semibold">Order ID:</span>
            <span>{invoiceData.orderId}</span>
            <span className="font-semibold">Invoice No:</span>
            <span>{invoiceData.invoiceNo}</span>
            <span className="font-semibold">GSTIN:</span>
            <span>{invoiceData.gstin}</span>
            <span className="font-semibold">Order Date:</span>
            <span>{invoiceData.orderDate}</span>
            <span className="font-semibold">Invoice Date:</span>
            <span>{invoiceData.invoiceDate}</span>
            <span className="font-semibold">PAN:</span>
            <span>{invoiceData.pan}</span>
          </div>
        </header>

        {/* Address & Logo Section */}
        <section className="flex justify-between items-center py-8">
          <div className="w-1/3 text-sm text-gray-700 leading-relaxed">
            <h2 className="font-bold text-base text-gray-800 mb-2">Sold By</h2>
            <p className="font-semibold">{invoiceData.soldBy.name}</p>
            <p>{invoiceData.soldBy.addressLine1}</p>
            <p>{invoiceData.soldBy.addressLine2}</p>
            <p>{invoiceData.soldBy.landmark}</p>
            <p>{invoiceData.soldBy.cityPincode}</p>
            <p className="mt-2">GST: {invoiceData.soldBy.gst}</p>
          </div>
          <div className="w-1/3 flex justify-center items-center">
            {/* Logo Placeholder */}
            <div className="w-48 h-16 bg-gray-200 flex items-center justify-center text-gray-500">
              <img src='/light-logo.webp' alt="Zarkhai" />
            </div>
          </div>
          <div className="w-1/3 text-sm text-gray-700 leading-relaxed">
            <h2 className="font-bold text-base text-gray-800 mb-2">
              Shipping Address
            </h2>
            <p className="font-semibold">{invoiceData.shippingAddress.name}</p>
            <p>{invoiceData.shippingAddress.addressLine1}</p>
            <p>{invoiceData.shippingAddress.addressLine2}</p>
            <p>{invoiceData.shippingAddress.landmark}</p>
            <p>{invoiceData.shippingAddress.cityPincode}</p>
            <p className="mt-2">GST: {invoiceData.shippingAddress.gst}</p>
          </div>
        </section>

        {/* Items Table Section */}
        <section>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F5F5] text-gray-800">
              <tr>
                <th className="p-3 font-semibold">Product ID</th>
                <th className="p-3 font-semibold">Product Title</th>
                <th className="p-3 font-semibold text-center">Qty.</th>
                <th className="p-3 font-semibold text-right">Amount</th>
                <th className="p-3 font-semibold text-right">IGST</th>
                <th className="p-3 font-semibold text-right">Shipping</th>
                <th className="p-3 font-semibold text-right">Discount</th>
                <th className="p-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 text-center">{item.qty}</td>
                  <td className="p-3 text-right">{item.amount}</td>
                  <td className="p-3 text-right">{item.igst}</td>
                  <td className="p-3 text-right">{item.shipping}</td>
                  <td className="p-3 text-right">{item.discount}</td>
                  <td className="p-3 text-right">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Total Section */}
        <section className="flex justify-end pt-4">
          <div className="w-1/3">
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-semibold text-gray-800">
                {invoiceData.totalAmount}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
