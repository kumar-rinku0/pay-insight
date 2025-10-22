import { Button } from "../ui/button";

const NoPage = () => {
  return (
    <>
      <div className="min-h-[80vh] min-w-[100vw]">
        <div className="h-[90vh] w-full flex flex-col items-center justify-center gap-4 md:text-left md:mr-12">
          <h1 className="text-9xl font-bold text-red-500 mb-4 animate-bounce">
            404
          </h1>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Page Not Found
          </p>
          <p className="text-lg font-bold text-center text-gray-500 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => location.assign("/")}
            variant="secondary"
            className="flex justify-center w-40"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default NoPage;
