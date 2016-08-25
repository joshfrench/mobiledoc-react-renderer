const TAGNAME = 0;

const toMarkup = (markups) => {
  const mapMarkup = ([idx, children = []]) => [markups[idx][TAGNAME], children.map(toMarkup(markups))];
  return (child) => Array.isArray(child) ? mapMarkup(child) : child;
};

export default toMarkup;
