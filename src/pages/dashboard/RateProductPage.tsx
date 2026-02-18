import { NO_IMAGE } from "@/api/endpoints";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { useApi } from "@/hooks/useApi";
import { uploadImage } from "@/services/cms.service";
import { productService } from "@/services/productService";
import { ArrowLeft, Star, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGES = 5;

const RateProductPage = ({ onBack, productRating, orderId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // const { request: submitRating, loading } = useApi(productService.ratingForm);
  /* ---------------- Image Upload ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log(files, 'files')
    if (images.length + files.length > MAX_IMAGES) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validImages = files.filter((file) =>
      file.type.startsWith("image/")
    );
    // const uniqueImages = validImages.filter(
    //   file => !images.some(img =>
    //     img.name === file.name && img.size === file.size
    //   )
    // );
    setImages((prev) => [...prev, ...validImages]);
  };

  const removeImage = (index: number) => {
    console.log(index, 'remove image')
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (fileRef.current) {
      fileRef.current.value = "";
    }

  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // if (reviewText.trim().length < 10) {
    //   toast.error("Review must be at least 10 characters");
    //   return;
    // }
    try {
      toast.loading("Uploading images...");
      // 🔥 1. Upload all images first
      const uploadedPaths: string[] = [];
      for (const file of images) {
        const res:any = await uploadImage(file);
        uploadedPaths.push(res?.body?.path); // only PATH required
      }
      toast.dismiss();
       
      //  2. Send rating API with PATH array
    const payload = {
      product_id: productRating?.product_id,
      rating,
      review: reviewText || "",
      order_id: orderId,
      review_images: uploadedPaths, // ✅ correct format
    };
      await productService.ratingForm(payload)

      toast.success("Review submitted successfully");
      onBack?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit review"
      );
    }

  };

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          {/* Product Info */}
          <div className="flex gap-6 mb-8 flex-col sm:flex-row">
            <img
              src={productRating?.image || NO_IMAGE}
              className="w-32 h-32 rounded object-cover"
              alt="Product"
            />
            {/* <h3 className="font-medium text-gray-900">
              {productRating?.product_title || "N/A"}
            </h3> */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2"> {productRating?.product_title || "N/A"} </h3>
              <p className="text-sm text-gray-600">Amount Paid: ₹ 1900</p>
              <p className="text-sm text-gray-600">Total QTY: 02 </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-8">
            <h4 className="font-medium mb-4">Rate Us</h4>
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

          {/* Image Upload */}
          <div className="mb-8">
            <h4 className="font-medium mb-4">
              Add Product Photos (Max 5)
            </h4>

            <div className="flex gap-4 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-24 h-24 rounded object-cover border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center"
                >
                  <Upload className="h-8 w-8 text-orange-500" />
                </button>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </div>

          {/* Review Text */}
          <div className="mb-8">
            <h4 className="font-medium mb-4">Write Your Review</h4>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full h-32 p-4 border rounded-lg"
              maxLength={300}
              placeholder="Write your review here..."
            />
            <p className="text-xs text-gray-500 text-right">
              {300 - reviewText.length} characters remaining
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#FF8A18] text-white rounded-md hover:bg-orange-600"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateProductPage;
