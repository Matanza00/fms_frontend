const LoadingButton = ({ btnText, isLoading }) => {
  return (
    <button className="btn text-slate-700" disabled={isLoading}>
      <span className="loading loading-spinner"></span>
      {btnText}
    </button>
  );
};

export default LoadingButton;
