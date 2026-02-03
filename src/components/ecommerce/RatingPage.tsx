import { Layout } from "../common";
import { Star, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface RatingsPageProps {
  onBack: () => void;
}

export const RatingsPage = ({ onBack }: RatingsPageProps) => {
  const [selectedRating, setSelectedRating] = useState("all");

  const ratingBreakdown = [
    { stars: 5, count: 450 },
    { stars: 4, count: 450 },
    { stars: 3, count: 450 },
    { stars: 2, count: 20 },
    { stars: 1, count: 10 },
  ];

  const customerReviews = [
    {
      id: 1,
      name: "Shahishta Simran",
      timeAgo: "1 Month Ago",
      comment:
        "Loved It!! Very Stylish And Comfortable! Love The Look, Fabric Is Very Soft.",
      rating: 4,
      images: [
        "/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        "/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      ],
    },
    {
      id: 2,
      name: "Shahishta Simran",
      timeAgo: "1 Month Ago",
      comment:
        "Loved It!! Very Stylish And Comfortable! Love The Look, Fabric Is Very Soft.",
      rating: 4,
      images: [
        "/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        "/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      ],
    },
    {
      id: 3,
      name: "Shahishta Simran",
      timeAgo: "1 Month Ago",
      comment:
        "Loved It!! Very Stylish And Comfortable! Love The Look, Fabric Is Very Soft.",
      rating: 4,
      images: [
        "/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
        "/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      ],
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <button
              onClick={onBack}
              className="flex items-center gap-1 hover:text-orange-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </button>
            <span>›</span>
            <span className="hover:text-orange-500 cursor-pointer">Kurtis</span>
            <span>›</span>
            <span className="hover:text-orange-500 cursor-pointer">
              Product Details
            </span>
            <span>›</span>
            <span className="text-gray-900">Rating</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SIDE - Product Image */}
            <div>
              <img
                src="/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png"
                alt="Product"
                className="rounded-lg border border-gray-200"
              />
            </div>

            {/* RIGHT SIDE - Ratings & Reviews */}
            <div className="lg:col-span-2">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Purple Lehenga Set With Hand Embroidered Blouse And Dupatta
              </h1>

              {/* Ratings Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-6">
                  <Star className="h-6 w-6 fill-orange-400 text-orange-400 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">4.5</span>
                  <span className="ml-3 text-gray-600 text-sm">
                    745 Verified Buyers
                  </span>
                </div>

                <div className="space-y-2">
                  {ratingBreakdown.map((rating) => (
                    <div
                      key={rating.stars}
                      className="flex items-center gap-3"
                    >
                      <span className="text-sm text-gray-600 w-4">
                        {rating.stars}
                      </span>
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rating.stars >= 4
                              ? "bg-green-500"
                              : rating.stars === 3
                              ? "bg-yellow-500"
                              : rating.stars === 2
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${(rating.count / 745) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Feedback */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customers Feedback (745)
              </h2>

              <div className="space-y-6">
                {customerReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="review"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {review.name} | {review.timeAgo}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                        {review.rating} ★
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
