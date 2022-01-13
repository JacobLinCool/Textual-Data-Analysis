# Textual Data Analysis

文本分析

## Features

This library provides two main Analyzer classes: `Analyzer` and `GroupAnalyzer`.

The `Analyzer` class is used to analyze a single text object, such as a sentence, a paragraph, or a whole document. It can do handy processes like **N-gram Analysis**, **Authority Words Analysis**, and **Meaningful Extraction**.

In contrast, the `GroupAnalyzer` class aims to analyze a group of texts, such as a collection of documents.

It provides the same functionality as `Analyzer` and more advanced features, such as **Co-word Analysis** and **TF-IDF Analysis**.

### Analyzer

It is very simple to setup an `Analyzer`.

```javascript
const { Analyzer, Dictionary, sort_map } = require("textual-data-analysis");

const text = `
自然語言處理（英語：Natural Language Processing，縮寫作 NLP）是人工智慧和語言學領域的分支學科。此領域探討如何處理及運用自然語言；自然語言處理包括多方面和步驟，基本有認知、理解、生成等部分。

自然語言認知和理解是讓電腦把輸入的語言變成有意思的符號和關係，然後根據目的再處理。自然語言生成系統則是把計算機數據轉化為自然語言。
`;

const analyzer = new Analyzer(text)
    .split(Dictionary.english_letters)
    .split(Dictionary.punctuations);
```

Now you have an `Analyzer` that:

  - analyzes the `text`
  - splits the `text` by `english_letters` and `punctuations` before performing analysis

#### N-gram Analysis

**N-gram Analysis** is a process of analyzing the frequency of words in a text.

After the pre-processing (`split`, `ignore`, `case`) is done, the `Analyzer` splits the text into n-length word slices and counts the frequency of each word slice.

```javascript
console.log(sort_map(analyzer.ngram(4)));
```

```
Map(90) {
    '自然語言' => 6,
    '然語言處' => 2,
    '語言處理' => 2,
    '是人工智' => 1,
    '人工智慧' => 1,
    ...
}
```

#### Authority Words Analysis

**Authority Words Analysis** is also a process of analyzing the frequency of words in a text.

By giving a list of words, the `Analyzer` will count the frequency of each word in the text after pre-processing.

It use *long-word-first* strategy to match the words in the list.

```javascript
console.log(sort_map(analyzer.count(["自然語言處理", "自然", "語言"])));
```

```
Map(3) { 
    '語言' => 6, 
    '自然' => 4, 
    '自然語言處理' => 2 
}
```

#### Meaningful Extraction

**Meaningful Extraction** is a special kind of N-gram Analysis.

By giving the `min_count` (default: `2`) and `min_length` (default: `2`), the `Analyzer` will try to extract meaningful words from the text.

It will perform a series of `length/min_count`-gram to `min_length`-gram, and after each step it will filter out (`split`) the words that fulfill the match condition.

```javascript
console.log(sort_map(analyzer.meaningful()));
```

```
Map(8) {
    '自然語言' => 4,
    '自然語言處理' => 2,
    '語言' => 2,
    '領域' => 2,
    '處理' => 2,
    '認知' => 2,
    '理解' => 2,
    '生成' => 2
}
```

### GroupAnalyzer

Setting up a `GroupAnalyzer` is similar to setting up an `Analyzer`, but you can feed it a list (`Array` or `Set`) of texts.

```javascript
const { GroupAnalyzer, Dictionary, sort_map } = require("textual-data-analysis");

const characters = [
    `
淺井惠（浅井 ケイ（あさい ケイ），Asai Kei，聲：石川界人、山村響（少年）；演：野村周平）
本作男主角，特徵是藍髮、藍瞳的少年。蘆原橋高中一年級生，參加校內「服務社」，解決超能力引發的問題，並受「管理局」監視。面無表情，但情感豐富，正義感非常高，對心中少許惡意有著潔癖，因此覺得自己是個「偽善者」。喜歡吃甜食、看書。摯友評價他個性彆扭，就像「披著羊皮的羊」。
擁有「記憶保持」能力，只要是自己五感與意識曾經感受過的事物，無論是畫面、聲音，甚至是情緒，只要回想就能完整的回憶起來。強度高於春埼的「重啟」，能不受她能力的影響，因此能夠記得世界重啟前的記憶。
此外擁有超高的智謀與別人所沒有的應變能力，加上腦袋思緒快速且清晰，能夠當機立斷地做出計劃與選擇，很容易就直接切中核心，擅長驅動自己的智略。不斷利用智謀不讓任何人受傷，夢想通過一己之力令咲良田保持超能力。
初次來到咲良田時（故事開始的4年前），受管理局監視，沒有自由。車站初遇浦地正宗，浦地幫他修復過鑰匙圈，之後鑰匙圈再度裂開，惠得以推算浦地能力的有效時間。為了探尋在這個半數人民具備超能力的神奇城市以及管理局的秘密還有幕後的真相，自己展開了行動。
在就讀七坂國中的時代（故事開始的2年前）因為同年級的相麻菫叫到天台的關係結識了春埼美空。在得知春埼的超能力是最多將世界倒帶3天的「重啟」能力後決定與春埼一起聯合自身的能力行動。但一次個人原因要求春埼使用「重啟」能力時，相麻菫卻意外過世，因為此事後決定要讓大家都獲得幸福，不希望有人因為自己的原因而死去。
`,
    `
春埼美空（春埼 美空（はるき みそら），Haruki Misora，聲：花澤香菜；演：黑島結菜）
本作第一女主角，特徵是棕髮紅瞳的少女。蘆原橋高中一年級生，與惠一同參加服務社。對一切事物同等看待的冷淡少女，只相信惠的指示會聽從惠所說的任何話，並以他為中心思考和行動。喜歡習慣收集與貓有關的小物品。
擁有「重啟」能力，能將「一切重新配置，重現世界過去的型態」，表面上效果如同時間倒回。倒回到昨天或前天都可，最大限度是到回到三天前。但是使用限制多，例如重啟後自己的記憶也會重啟，所以不會記得自己使用過能力。惠是例外，因此才聽從惠的指示發動重啟。有存檔才能重啟；存檔過72小時或重啟會使存檔失效；重啟後過24小時才能再存檔。
在國中時代（故事開始的2年前）因為相麻菫的關係而結識了淺井惠。內在缺乏自我認知，故外表面無表情，幾乎不會表露出感情來，但是自從結識惠之後，與惠相處久了，感情有了些許的改變，對惠抱有特殊的情感。
因沈默寡言而不擅長與人交流，主要原因是由於幼年時缺乏自我意識所造成的影響，從而會將其他人遭受的痛苦歸咎於自己身上。因為悲傷會磨損情感，即使失去情感，也要繼續做出正確選擇。後來受淺井惠介紹，與野之尾盛夏成為時常聊天的好友。
與相麻菫雖然並非朋友，但是與相麻菫是互相認可對方的。雙方有困難之時還會盡其所能去幫助對方。與惠說過還是想要和相麻菫有一定的程度的對立會比較好，即意指擔任對方的情敵。
`,
    `
相麻菫（相麻 菫（そうま すみれ），Sōma Sumire，聲：悠木碧；演：平祐奈）
本作第二女主角，特徵是棕髮棕瞳的少女。惠和春埼國中時的同學。稱作「野貓般的少女」，喜歡用比喻、假設性對話的奇妙少女。也是介紹春埼給惠認識的撮合者，對惠抱有特殊的情感。
擁有「看到別人未來的記憶」的能力，這個未來沒有時間限制，因此理論上可以看到這個人一直到死的所有記憶。必須透過對話能看見對話對象的未來，該能力無法對自身起效。與管理局魔女的「預知未來」的能力相似，魔女認為是下一代繼承人的最佳人選。
在國中時代（故事開始的2年前）的惠和春埼使用重啟後，相麻卻意外過世(8/31)，因為重啟過的存檔不能重啟第二次，兩人認為已無法復活。
但惠集結春埼、村瀨陽香、坂上央介等能力者，惠與三人透過佐佐野宏幸「重現過去」的能力，進入照片世界後，惠藉由春埼加上村瀨陽香以及坂上央介等人的能力，使照片世界中的相麻菫(8/17)成功復活（或是成功複製）。
在與浦地正宗對話中，為了隱藏身分，而向對方自稱自己為「二代魔女」(對相麻菫而言，「一代魔女」指的是創立管理局的初代魔女還是兩年前死掉的自己，這點就不得而知)。在逃離浦地正宗的追捕時，為了協助惠而替惠爭取5分鐘的時間，向浦地正宗說出自己計劃：為了繞過三年後與浦地「不會妨礙」的協定，相麻菫在兩年前先透過智樹下達指令後自殺，之後在三年後讓惠一群人把自己「複製」出來。認為真正的「相麻菫」在兩年前就已經過世了，自己只是「相麻菫」的複製人，沒有真正的名字，只是個無名的系統。妨礙浦地的人不是自己而是「相麻菫」，所以在索引小姐面前說的是「實話」。
在結局的會談中，被惠道破當初確確實實地聽見了智樹傳遞來的聲音訊息，但相麻菫一直無法相信自己真的復活，認為自己仍有可能是「相麻菫」的複製人。與惠交談後，承認自己的脆弱和接受自己就是相麻菫。
與春埼美空雖然非朋友的關係，但是與春埼是互相認可對方的，雙方有困難之時還會盡其所能去幫助對方，與惠的交談可看出想與春埼保持著一定的程度的對立。
`,
];

const ganalyzer = new GroupAnalyzer(characters)
    .split(Dictionary.punctuations)
    .split(Dictionary.english_letters);
```

First, we generate an authority word list by using the built-in `meaningful` method.

```javascript
const meaningful = ganalyzer.meaningful();
```

#### Co-word Analysis

**Co-word Analysis** is a method to analyze the co-occurrence of words in multiple text objects.

By giving a list of targets, we can get a co-occurrence matrix.

```javascript
const cowords = ganalyzer.coword([...meaningful.keys()]);
console.log("cowords", cowords);
```

```
cowords Map(94) {
    '故事開始的' => Set(3) { 0, 1, 2 },
    '超能力' => Set(1) { 0 },
    '管理局' => Set(2) { 0, 2 },
    '春埼的' => Set(1) { 0 },
    '能力的' => Set(1) { 0 },
    '自己的' => Set(3) { 0, 1, 2 },
    '咲良田' => Set(1) { 0 },
    '鑰匙圈' => Set(1) { 0 },
    '相麻菫' => Set(3) { 0, 1, 2 },
    ...
}
```

#### TF-IDF Analysis

**TF-IDF Analysis** is a method to find important words in a collection of text objects.

By giving a list of targets, the `GroupAnalyzer` can calculate the TF-IDF of each word in the list.

```javascript
const tfidf = ganalyzer.tfidf([...meaningful.keys()]);
console.log("tfidf", sort_map(tfidf));
```

```
tfidf Map(94) {
    '超能力' => 1.9084850188786497,
    '對話' => 1.9084850188786497,
    '未來' => 1.9084850188786497,
    '認為' => 1.9084850188786497,
    '透過' => 1.4313637641589874,
    '無法' => 1.4313637641589874,
    '復活' => 1.4313637641589874,
    ...
}
```
