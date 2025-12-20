import { useApiStore } from "@/store/apiStore";

const GlobalLoader = () => {
  const { loading, error, setError } = useApiStore();

  return (
    <>
      {/* GLOBAL LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-3">
            {/* Spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
            <p className="text-sm text-white font-medium">
              Loading, please wait...
            </p>
          </div>
        </div>
      )}

      {/* GLOBAL ERROR */}
      {error && (
        <div className="fixed bottom-6 left-1/2 z-[2000] w-[90%] max-w-md -translate-x-1/2 rounded-lg bg-red-600 px-4 py-3 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
