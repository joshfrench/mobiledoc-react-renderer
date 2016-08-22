const TAGNAME = 0;

/*
 * {
 *   markups: [
 *     ['b'],
 *     ['a', { rel: 'nofollow' }]
 *   ],
 *   sections: [
 *     [1, 'p', [
 *       [[], 0, 'Normal '],
 *       [[1], 0, 'Linked '],
 *       [[0], 1, 'and bold.]
 *     ]]
 *   ]
 * }
 */

const toMarkup = (markups) =>
  ([tagsToOpen = [], ...marker]) => [tagsToOpen.map((i) => markups[i][TAGNAME]), ...marker];

const addMarkups = (markups, markers) => markers.map(toMarkup(markups));
export default addMarkups;
