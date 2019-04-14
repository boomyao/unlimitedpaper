const intervalMap = [
  "C",
  "#C",
  "D",
  "#D",
  "E",
  "F",
  "#F",
  "G",
  "#G",
  "A",
  "#A",
  "B"
];
const keyMap = [
  "1",
  "#1",
  "2",
  "#2",
  "3",
  "4",
  "#4",
  "5",
  "#5",
  "6",
  "#6",
  "7"
];

export function getChordTone(chordName) {
  let chordArr = [];
  const rootRegex = /^(#|[A-G])|^[A-G]/g;
  const rootName = chordName.match(rootRegex)[0];
  const suffix = chordName.replace(rootName, "");
  switch (suffix) {
    case "":
      chordArr = [step(rootName), step(rootName, 4), step(rootName, 7)];
      break;
    case "m":
      chordArr = [step(rootName), step(rootName, 3), step(rootName, 7)];
      break;
    case "aug":
      chordArr = [step(rootName), step(rootName, 4), step(rootName, 8)];
      break;
    case "dim":
      chordArr = [step(rootName), step(rootName, 3), step(rootName, 6)];
      break;
    case "sus2":
      chordArr = [step(rootName), step(rootName, 2), step(rootName, 7)];
      break;
    case "sus4":
      chordArr = [step(rootName), step(rootName, 5), step(rootName, 7)];
      break;
    case "7":
      chordArr = [
        step(rootName),
        step(rootName, 4),
        step(rootName, 7),
        step(rootName, 10)
      ];
      break;
    case "Maj7":
      chordArr = [
        step(rootName),
        step(rootName, 4),
        step(rootName, 7),
        step(rootName, 11)
      ];
      break;
    case "m7":
      chordArr = [
        step(rootName),
        step(rootName, 3),
        step(rootName, 7),
        step(rootName, 10)
      ];
      break;
    case "mM7":
      chordArr = [
        step(rootName),
        step(rootName, 3),
        step(rootName, 7),
        step(rootName, 11)
      ];
      break;
    case "dim7":
      chordArr = [
        step(rootName),
        step(rootName, 3),
        step(rootName, 6),
        step(rootName, 9)
      ];
      break;
    case "dim7-5":
      chordArr = [
        step(rootName),
        step(rootName, 3),
        step(rootName, 6),
        step(rootName, 10)
      ];
      break;
    case "7+5":
      chordArr = [
        step(rootName),
        step(rootName, 4),
        step(rootName, 8),
        step(rootName, 10)
      ];
      break;
    case "Maj7+5":
      chordArr = [
        step(rootName),
        step(rootName, 3),
        step(rootName, 8),
        step(rootName, 11)
      ];
      break;
    default:
      break;
  }
  return findFrets(chordArr);
}

function step(keyName, num) {
  if (!num) {
    return keyMap[intervalMap.indexOf(keyName)];
  }
  const idx = intervalMap.indexOf(keyName);
  const nextIdx = (idx + num) % 12;
  return keyMap[nextIdx];
}

function getNote8Pos(string, fret) {
  const defaultKeys = ["3", "7", "5", "2", "6", "3"];
  const idx = (keyMap.indexOf(defaultKeys[string]) + fret) % 12;
  return {
    string,
    fret,
    key: keyMap[idx]
  };
}

export function findFrets(chordArr) {
  // 缓存0 - 5 品的所有音, 按1-6弦顺序排列
  const find2Notes = [];
  for (let i = 0; i <= 5; i++) {
    const astr = [];
    for (let j = 0; j <= 5; j++) {
      astr.push(getNote8Pos(i, j));
    }
    find2Notes.push(astr);
  }
  // 寻找根音，范围在 4- 6弦，品格最小
  let rootNote;
  for (let i = 5; i > 2; i--) {
    for (let j = 0; j < find2Notes[i].length; j++) {
      if (find2Notes[i][j].key === chordArr[0]) {
        if (!rootNote || j < rootNote.fret) {
          rootNote = find2Notes[i][j];
        }
        break;
      }
    }
  }

  // 检查是否包含所有
  let result = findOther(ruleFunc1);
  const keySet = new Set();
  result.forEach(note => {
    keySet.add(note.key);
  });
  if (keySet.size < chordArr.length) {
    result = findOther(ruleFunc2);
  }

  return result;

  function findOther(ruleFunc) {
    const leastNotes = [];
    let prevNote = null;
    for (let string = 0; string < rootNote.string; string++) {
      let bestNote = { index: -1, score: -1 };
      find2Notes[string].forEach((note, idx) => {
        if (!chordArr.includes(note.key)) return;
        if (prevNote && prevNote.key === note.key) return;
        let score = ruleFunc(note, string, prevNote);
        if (score > bestNote.score) {
          bestNote = { index: idx, score };
        }
      });
      const choosed = find2Notes[string][bestNote.index];
      prevNote = choosed;
      leastNotes.push(choosed);
    }
    return [rootNote, ...leastNotes];
  }

  function ruleFunc1(note, string, prevNote) {
    let score = 0;
    if (string < 3 && note.fret < rootNote.fret) {
      score += rootNote.fret - note.fret;
    } else if (string >= 3 && note.fret > rootNote.fret) {
      score += note.fret - rootNote.fret;
    }
    if (
      prevNote &&
      prevNote.fret === rootNote.fret &&
      note.fret > prevNote.fret
    ) {
      score += 4;
    }
    return score;
  }

  function ruleFunc2(note, string, prevNote) {
    let score = 0;
    score += note.fret - rootNote.fret;
    if (note.fret >= rootNote.fret && note.key !== rootNote.key) {
      score += 4;
    }
    return score;
  }
}
