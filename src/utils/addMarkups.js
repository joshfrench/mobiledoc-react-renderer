const TAGNAME = 0;

/*
 * {
 *   markups: [
 *     ['b'],
 *     ['a', { rel: 'nofollow' }]
 *   ],
 *   tree: [
 *     [1, [[0, ['a bold link']]]]
 *   ]
 * }
 */

const addMarkups = (markups, [marker, children = []]) => {
  const makeChild = (c) => Array.isArray(c) ? addMarkups(markups, c) : c;
  return [markups[marker][TAGNAME], children.map(makeChild)];
};


export default addMarkups;
