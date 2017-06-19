export const E_UNKNOWN_ATOM = (name) => `Atom "${name}" not found but no unknownAtomHandler was registered.`;

export const E_NO_ATOM_AT_INDEX = (idx) => `No atom definition found at index ${idx}.`;

export const E_UNKNOWN_SECTION_TAG = (tag) => `Cannot validate tagName for unknown section type "${tag}".`;

export const E_UNALLOWED_SECTION_TAG = (tag) => `Unknown section tag or tag not allowed here: "${tag}".`;

export const E_UNKNOWN_MARKER_TYPE = (tag) => `Cannot validate marker type for unknown tag "${tag}".`;
