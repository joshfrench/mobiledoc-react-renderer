export const E_UNKNOWN_ATOM = (name) => `Atom "${name}" not found but no unknownAtomHandler was registered.`;

export const E_NO_ATOM_AT_INDEX = (idx) => `No atom definition found at index ${idx}.`;

export const E_UNKNOWN_SECTION_TAG = (tag) => `Cannot validate tagName for unknown section type "${tag}".`;
