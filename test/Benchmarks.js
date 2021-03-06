/* global Benchmark */

import DOMRenderer from 'mobiledoc-dom-renderer';
import ReactRenderer from '../src/MobiledocRenderer';
import React from 'react';
import ReactDOM from 'react-dom';

const suite = new Benchmark.Suite('Mobiledoc Renderers');

const mobiledoc = {"version":"0.3.0","atoms":[],"cards":[["ImageCard",{"mobiledoc":{"version":"0.3.0","atoms":[],"cards":[],"markups":[],"sections":[[1,"p",[[0,[],0,"By Johann Anderson (1674-1743), former mayor of Hamburg, Germany [Public domain], via Wikimedia Commons"]]]]},"src":"https://upload.wikimedia.org/wikipedia/commons/6/66/Cachalot_-_Sperm_whale_-_Drawing_by_Johann_Anderson_1746.JPG"}]],"markups":[["i"],["strong"]],"sections":[[10,0],[1,"p",[[0,[],0,"Again, I always go to sea as a sailor, because they make a point of paying me for my trouble, whereas they never pay passengers a single penny that I ever heard of. On the contrary, passengers themselves must pay. And there is all the difference in the world between paying and being paid. The act of paying is perhaps the most uncomfortable infliction that the two orchard thieves entailed upon us. But "],[0,[0],1,"being paid"],[0,[],0,",—what will compare with it? The urbane activity with which a man receives money is really marvellous, considering that we so earnestly believe money to be the root of all earthly ills, and that on no account can a monied man enter heaven. Ah! how cheerfully we consign ourselves to perdition!"]]],[1,"p",[[0,[],0,"Finally, I always go to sea as a sailor, because of the wholesome exercise and pure air of the fore-castle deck. For as in this world, head winds are far more prevalent than winds from astern (that is, if you never violate the Pythagorean maxim), so for the most part the Commodore on the quarter-deck gets his atmosphere at second hand from the sailors on the forecastle. He thinks he breathes it first; but not so. In much the same way do the commonalty lead their leaders in many other things, at the same time that the leaders little suspect it. But wherefore it was that after having repeatedly smelt the sea as a merchant sailor, I should now take it into my head to go on a whaling voyage; this the invisible police officer of the Fates, who has the constant surveillance of me, and secretly dogs me, and influences me in some unaccountable way—he can better answer than any one else. And, doubtless, my going on this whaling voyage, formed part of the grand programme of Providence that was drawn up a long time ago. It came in as a sort of brief interlude and solo between more extensive performances. I take it that this part of the bill must have run something like this:"]]],[1,"p",[[0,[],0,"“"],[0,[0],1,"Grand Contested Election for the Presidency of the United States."],[0,[],0," “WHALING VOYAGE BY ONE ISHMAEL. "],[0,[1],1,"“BLOODY BATTLE IN AFFGHANISTAN.”"]]],[1,"p",[[0,[],0,"Though I cannot tell why it was exactly that those stage managers, the Fates, put me down for this shabby part of a whaling voyage, when others were set down for magnificent parts in high tragedies, and short and easy parts in genteel comedies, and jolly parts in farces—though I cannot tell why this was exactly; yet, now that I recall all the circumstances, I think I can see a little into the springs and motives which being cunningly presented to me under various disguises, induced me to set about performing the part I did, besides cajoling me into the delusion that it was a choice resulting from my own unbiased freewill and discriminating judgment."]]]]};

const ReactImageCard = ({ payload }) => <div>
  <img src={payload.src} />
  <ReactRenderer mobiledoc={payload.mobiledoc} sectionElementRenderer={{ p: 'small' }} />
</div>;
ReactImageCard.displayName = 'ImageCard';

const reactRenderer = React.createElement(ReactRenderer, { mobiledoc, cards: [ReactImageCard]});

suite.add('React rendering', () => {
  const target = document.createElement('div');
  document.body.appendChild(target);
  ReactDOM.render(reactRenderer, target);
});

const captionRenderer = new DOMRenderer.default({
  sectionElementRenderer: {
    P: function(_, dom) { return dom.createElement('small'); },
  }
});

const DOMImageCard = {
  name: "ImageCard",
  type: "dom",
  render: ({ payload }) => {
    const img = document.createElement('img');
    img.src = payload.src;

    const caption = captionRenderer.render(payload.mobiledoc);

    const root = document.createElement('div');

    root.appendChild(img);
    root.appendChild(caption.result);
    return root;
  }
};

const domRenderer = new DOMRenderer.default({ cards: [DOMImageCard]});

suite.add('Mobiledoc DOM renderer', () => {
  const result = domRenderer.render(mobiledoc).result;
  document.body.appendChild(result);
});

