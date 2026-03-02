const pickLocalizedValue = (dict, language) => {
  if (!dict || typeof dict !== "object") return "";

  const keys = Object.keys(dict);
  if (!keys.length) return "";

  const lang = (language || "").toLowerCase().trim();
  const base = lang.split("-")[0];
  const lowerKeys = keys.map((k) => k.toLowerCase());

  let idx = lowerKeys.findIndex((k) => k === lang);
  if (idx !== -1) return dict[keys[idx]];

  idx = lowerKeys.findIndex(
    (k) => k === base || k.startsWith(base) || base.startsWith(k)
  );
  if (idx !== -1) return dict[keys[idx]];

  idx = lowerKeys.findIndex((k) => k === "english" || k === "en" || k.startsWith("en"));
  if (idx !== -1) return dict[keys[idx]];

  return dict[keys[0]];
};

export const localizeTag = (tag, language) => {
  if (!tag || typeof tag !== "object") return tag;
  return {
    ...tag,
    category: pickLocalizedValue(tag.category, language),
    superCategory: pickLocalizedValue(tag.superCategory, language),
  };
};

export const localizeTags = (input, language) => {
  return Array.isArray(input)
    ? input.map((t) => localizeTag(t, language))
    : localizeTag(input, language);
};
