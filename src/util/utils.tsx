export const LooadingSpinner = ({ className }: { className: string }) => {
  return (
    <div className="center h-full">
      <div
        className={`border-dashed border-t-4  rounded-full  animate-spin ${className}`}></div>{" "}
    </div>
  );
};
