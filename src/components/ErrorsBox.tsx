type ErrorsBoxProps = {
  errors: string[];
};

const ErrorsBox = ({ errors }: ErrorsBoxProps) => {
  return (
    <>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <h2>Error</h2>
          <ul className="mb-0">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ErrorsBox;
