import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { ArrowLeft, Star, Upload } from "lucide-react";
import { useState } from "react";

const RateProductPage = ({ onBack, productRating }) => {
    const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  return (
  <>
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          {/* Product info and rating form */}
          <div className="flex gap-6 mb-8 flex-col sm:flex-row">
            <img
              src={productRating?.image || "/product-image.png"}
              className="w-32 h-32 rounded object-cover"
              alt="Product"
            />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Black LIVA Straight Printed 2 Piece Set
              </h3>
              <p className="text-sm text-gray-600">Amount Paid: ₹ 1900</p>
              <p className="text-sm text-gray-600">Total QTY: 02</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">Rate US</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star
                    className={`h-10 w-10 ${star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">
              Add Product Photos (Max 5 Images)
            </h4>
            <div className="flex gap-4 flex-wrap">
              <img
                src="/rate-us.webp"
                className="w-24 h-24 rounded border object-cover"
                alt="Review"
              />
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <Upload className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">Write Your Review</h4>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength={300}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {300 - reviewText.length} characters remaining
            </p>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 bg-[#FF8A18] text-white rounded-md font-medium hover:bg-orange-600">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)
}
export default RateProductPage