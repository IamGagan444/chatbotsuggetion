const LoadingDots: React.FC = () => {
    return (
      <div className="flex space-x-2 ml-2">
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></span>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></span>
      </div>
    );
  };
  export default LoadingDots;