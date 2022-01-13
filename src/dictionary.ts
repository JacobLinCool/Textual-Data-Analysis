// #region punctuations
const english_punctuations = [...",.!?;:\"'“”‘’„<>‹›«»_"];
const chinese_punctuations = [..."。，、；：「」『』（）─？！…﹏《》〈〉＿·—﹝﹞【】"];

export const punctuations = new Set([...english_punctuations, ...chinese_punctuations]);
// #endregion

// #region english letters
const english_lowercase_letters = [..."abcdefghijklmnopqrstuvwxyz"];
const english_uppercase_letters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export const english_letters = new Set([...english_lowercase_letters, ...english_uppercase_letters]);
// #endregion

// #region spaces
export const spaces = new Set([..." 　\n\t"]);
// #endregion

// #region numbers
export const numbers = new Set([..."0123456789"]);
// #endregion
