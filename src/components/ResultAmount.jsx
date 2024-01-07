/* eslint-disable react/prop-types */

export const ResultAmount = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};
