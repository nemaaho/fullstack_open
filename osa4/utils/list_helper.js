const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initialValue = 0;
  const summary = blogs.reduce(
    (accumulator, currentValue) => accumulator + currentValue.likes,
    initialValue
  );
  return summary;
};

module.exports = {
  dummy,
  totalLikes,
};
