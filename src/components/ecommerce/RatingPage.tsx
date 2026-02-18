import { useApi } from "@/hooks/useApi";
import { Layout } from "../common";
import { Star, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { NO_IMAGE } from "@/api/endpoints";

interface RatingsPageProps {
  onBack: () => void;
  id: string;
}

export const RatingsPage = ({ onBack, id }: RatingsPageProps) => {
  const { data, request } = useApi(productService.getRatings);

  useEffect(() => {
    if (id) request(id);
  }, [id]);

  const body = data?.body || {};
  const ratingInfo = body?.ratings_and_reviews || {};
  const feedback = body?.feedback || {};
  const reviews = feedback?.feedback_list || [];

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: ratingInfo?.[star] || 0,
  }));

  const totalRatings = ratingInfo?.total_ratings || 0;

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Back */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to details
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div>
              <img
                src={
                  body?.product_image ||
                  NO_IMAGE
                }
                alt="Product"
                className="rounded-lg border border-gray-200"
              />
            </div>

            {/* Ratings & Reviews */}
            <div className="lg:col-span-2">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {body?.product_title || "Product Title"}
              </h1>

              {/* Ratings Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-6">
                  <Star className="h-6 w-6 fill-orange-400 text-orange-400 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">
                    {totalRatings}
                  </span>
                  <span className="ml-3 text-gray-600 text-sm">
                    {ratingInfo?.total_buyers}
                  </span>
                </div>

                {/* Breakdown */}
                <div className="space-y-2">
                  {ratingBreakdown?.map((rating) => {
                    const percent =
                      totalRatings > 0
                        ? (rating.count / totalRatings) * 100
                        : 0;

                    return (
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
                            className={`h-2 rounded-full ${rating.stars >= 4
                                ? "bg-green-500"
                                : rating.stars === 3
                                  ? "bg-yellow-500"
                                  : rating.stars === 2
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                              }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <span className="text-sm text-gray-600 w-8">
                          {rating.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customers Feedback ({feedback?.customers_feedback || 0})
              </h2>

              <div className="space-y-6">
                {reviews?.map((review: any, idx: number) => (
                  <div key={idx} className="border-b border-gray-200 pb-4">
                    {review.comments && (
                      <p className="text-gray-700 mb-3">{review.comments}</p>
                    )}

                    {/* Images */}
                    {review.feedback_image?.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.feedback_image.map(
                          (img: string, index: number) => (
                            <img
                              key={index}
                              src={img}
                              alt="review"
                              className="w-16 h-16 object-cover rounded"
                            />
                          )
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {review.customer_name} | {review.time}
                      </span>

                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                        {review.customer_rating} ★
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
