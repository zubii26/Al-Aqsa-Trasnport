export const splitRouteName = (name: string): [string, string] => {
    if (!name) return ['', ''];
    // Handle arrows, "to", or other common delimiters
    const parts = name.split(/\s*(?:->|to|\u2192|\u2194)\s*/i);
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
};
