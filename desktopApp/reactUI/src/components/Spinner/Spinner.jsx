export default function Spinner() {
  return(
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-grow text-primary spinner-grow-sm"
        role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
};
