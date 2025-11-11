const letterValues = {
    E: 1,
    T: 2, A: 2, O: 2,
    I: 3, N: 3, S: 3, H: 3, R: 3,
    D: 4, L: 4,
    C: 5,
    U: 6, M: 6,
    W: 7, F: 7,
    G: 8, Y: 8, P: 8,
    B: 10,
    V: 15,
    K: 20,
    J: 100, X: 100,
    Q: 150,
    Z: 200
  };

  const MAX_POWER = 50;
  let usedPower = 0;
  let currentWord = [];
  let submittedWords = [];
  let validWords = new Set(); // will load from file

  const keyboard = document.getElementById("keyboard");
  const wordArea = document.getElementById("wordArea");
  const usedPowerEl = document.getElementById("usedPower");
  const powerLeftEl = document.getElementById("powerLeft");
  const submittedWordsEl = document.getElementById("submittedWords");
  const submitBtn = document.getElementById("submitBtn");

  // Generate keyboard
  Object.keys(letterValues).forEach(letter => {
    const key = document.createElement("div");
    key.className = "key";
    key.innerHTML = `${letter}<br><small>${letterValues[letter]}</small>`;
    key.onclick = () => addLetter(letter);
    keyboard.appendChild(key);
  });

  // Load CSW word list from local text file
  async function loadWordList() {
    try {
      const response = await fetch("csw.txt");
      const text = await response.text();
      validWords = new Set(
        text.split(/\r?\n/).map(w => w.trim().toUpperCase()).filter(Boolean)
      );
      console.log(`Loaded ${validWords.size} valid words.`);
    } catch (err) {
      console.error("Error loading wordlist:", err);
      alert("Could not load wordlist. Make sure csw.txt is in the same folder as this HTML file.");
    }
  }

  loadWordList();

  function addLetter(letter) {
    const value = letterValues[letter];
    if (usedPower + value > MAX_POWER) {
      alert("You don’t have enough power to add that letter!");
      return;
    }

    currentWord.push(letter);
    usedPower += value;
    updateDisplay();
  }

  function updateDisplay() {
    wordArea.innerHTML = "";
    currentWord.forEach(letter => {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = letter;
      wordArea.appendChild(tile);
    });

    usedPowerEl.textContent = usedPower;
    powerLeftEl.textContent = MAX_POWER - usedPower;

    submittedWordsEl.innerHTML = "";
    submittedWords.forEach(word => {
      const wordBox = document.createElement("div");
      wordBox.style.display = "flex";
      wordBox.style.gap = "5px";
      wordBox.style.margin = "5px";

      for (const letter of word) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.textContent = letter;
        wordBox.appendChild(tile);
      }
      submittedWordsEl.appendChild(wordBox);
    });

    if (MAX_POWER - usedPower <= 0) {
      disableKeyboard();
      submitBtn.disabled = true;
      alert("You used up all your power points! Game over.");
    }
  }

  function clearWord() {
    usedPower -= currentWord.reduce((sum, l) => sum + letterValues[l], 0);
    currentWord = [];
    if (usedPower < 0) usedPower = 0;
    updateDisplay();
  }

  function submitWord() {
    if (currentWord.length === 0) return alert("You haven’t formed a word yet!");
    const formedWord = currentWord.join("").toUpperCase();

    if (!validWords.has(formedWord)) {
      alert(`"${formedWord}" is NOT a valid CSW word! Try another.`);
      return; // invalid word → no submission
    }

    submittedWords.push(formedWord);
    currentWord = [];
    updateDisplay();
  }

  function disableKeyboard() {
    document.querySelectorAll(".key").forEach(k => k.style.pointerEvents = "none");
  }

  updateDisplay();
