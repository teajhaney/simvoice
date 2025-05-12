export const LooadingSpinner = ({ className }: { className: string }) => {
  return (
    <div className="center h-full">
      <div className={`  rounded-full  animate-spin ${className}`}></div>{" "}
    </div>
  );
};

export const inputDiv = "flex flex-col gap-2 ";
export const errorStyles = "text-red500 text-sm";
export const resetPasswordStyles = "text-green-500 text-sm";
export const lableStyles = "block text-sm lg:text-md text-primary ";
export const inputStyles =
  "w-full text-primary  pl-10 border-1 border-gray200 p-2 rounded  focus:border-1 focus:outline-none focus:border-gray200 transition-colors duration-200 focus:shadow-md";
