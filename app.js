// ─── State ────────────────────────────────────────────────────────────────────
let userScore = 0;
let compScore = 0;

// ─── DOM Refs ──────────────────────────────────────────────────────────────────
const choices       = document.querySelectorAll(".choice");
const msgEl         = document.querySelector("#msg");
const userScoreEl   = document.querySelector("#user-score");
const compScoreEl   = document.querySelector("#comp-score");
const resetBtn      = document.querySelector("#reset-btn");
const userDisplay   = document.querySelector("#user-display");
const compDisplay   = document.querySelector("#comp-display");
const userCard      = document.querySelector("#user-card");
const compCard      = document.querySelector("#comp-card");

// ─── Emoji map for arena icons ─────────────────────────────────────────────────
const imgMap = {
    rock:     "./images/rock.png",
    paper:    "./images/paper.png",
    scissors: "./images/scissors.png",
};

// ─── Generate Computer Choice ──────────────────────────────────────────────────
const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    return options[Math.floor(Math.random() * 3)];
};

// ─── Update Arena Display ──────────────────────────────────────────────────────
const updateArena = (side, choice) => {
    const displayEl = side === "user" ? userDisplay : compDisplay;
    displayEl.innerHTML = `<img src="${imgMap[choice]}" alt="${choice}">`;
};

const resetArena = () => {
    userDisplay.innerHTML = `<span class="placeholder-icon">?</span>`;
    compDisplay.innerHTML = `<span class="placeholder-icon">?</span>`;
    userDisplay.className = "arena-display";
    compDisplay.className = "arena-display";
};

// ─── Animate Score ─────────────────────────────────────────────────────────────
const bumpScore = (el) => {
    el.classList.remove("score-bump");
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add("score-bump");
};

// ─── Set Message ───────────────────────────────────────────────────────────────
const setMsg = (text, type = "neutral") => {
    msgEl.textContent = text;
    msgEl.className = "msg " + type;
};

// ─── Draw Game ─────────────────────────────────────────────────────────────────
const drawGame = (choice) => {
    updateArena("user", choice);
    updateArena("comp", choice);
    userDisplay.classList.add("draw-glow");
    compDisplay.classList.add("draw-glow");
    setMsg("🤝 It's a draw! Try again.", "draw");
};

// ─── Show Winner ───────────────────────────────────────────────────────────────
const showWinner = (userWin, userChoice, compChoice) => {
    updateArena("user", userChoice);
    updateArena("comp", compChoice);

    if (userWin) {
        userScore++;
        userScoreEl.textContent = userScore;
        bumpScore(userScoreEl);
        userCard.classList.add("winner-flash");
        setTimeout(() => userCard.classList.remove("winner-flash"), 600);
        userDisplay.classList.add("win-glow");
        compDisplay.classList.add("lose-glow");
        setMsg(`🎉 You win! ${capitalize(userChoice)} beats ${capitalize(compChoice)}`, "win");
    } else {
        compScore++;
        compScoreEl.textContent = compScore;
        bumpScore(compScoreEl);
        compCard.classList.add("winner-flash");
        setTimeout(() => compCard.classList.remove("winner-flash"), 600);
        userDisplay.classList.add("lose-glow");
        compDisplay.classList.add("win-glow");
        setMsg(`😔 You lose! ${capitalize(compChoice)} beats ${capitalize(userChoice)}`, "lose");
    }
};

// ─── Capitalize Helper ─────────────────────────────────────────────────────────
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// ─── Play Game ─────────────────────────────────────────────────────────────────
const playGame = (userChoice) => {
    const compChoice = genCompChoice();

    // Visual: highlight selected choice
    choices.forEach(c => c.classList.remove("selected"));
    document.getElementById(userChoice)?.classList.add("selected");

    if (userChoice === compChoice) {
        drawGame(userChoice);
    } else {
        let userWin;
        if (userChoice === "rock")          userWin = compChoice !== "paper";
        else if (userChoice === "paper")    userWin = compChoice !== "scissors";
        else                                userWin = compChoice !== "rock";

        showWinner(userWin, userChoice, compChoice);
    }
};

// ─── Reset ─────────────────────────────────────────────────────────────────────
resetBtn.addEventListener("click", () => {
    userScore = 0;
    compScore = 0;
    userScoreEl.textContent = "0";
    compScoreEl.textContent = "0";
    setMsg("Pick your move to start!", "neutral");
    resetArena();
    choices.forEach(c => c.classList.remove("selected"));
});

// ─── Choice Click Handlers ─────────────────────────────────────────────────────
choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        if (!userChoice) return;  // guard against missing id
        playGame(userChoice);
    });
});