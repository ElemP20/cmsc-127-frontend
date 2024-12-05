const getYear = (year) => {
  const today = new Date();
  const yearNow = today.getFullYear();
  const currentYear = (yearNow - year) + 1;

  const suffixes = ["st", "nd", "rd", "th"];
  return `${year}${(suffixes[year-1])} Year`;
}

export default getYear