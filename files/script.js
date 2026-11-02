
// ==================================
// 1. LOADING SCREEN
// ==================================

const loadingScreen = document.getElementById("loadingScreen");
const gardenScreen = document.getElementById("gardenScreen");

const progressFill = document.getElementById("progressFill");
const progressNumber = document.getElementById("progressNumber");
const loadingCaption = document.getElementById("loadingCaption");

const unlockArea = document.getElementById("unlockArea");
const fingerprint = document.getElementById("fingerprint");
const fingerprintProgress = document.getElementById("fingerprintProgress");
const fingerprintInstruction = document.getElementById("fingerprintInstruction");
const holdProgress = document.getElementById("holdProgress");
const completedArea = document.getElementById("completedArea");

let loadingProgress = 0;
let unlocked = false;
let isHolding = false;
let holdStartTime = 0;
let animationFrame;

const loadingMessages = [
    "Đang chuẩn bị món quà tri ân thầy cô...",
    "Đang chọn những lời chúc ý nghĩa nhất...",
    "Đang gửi gắm lòng biết ơn...",
    "Món quà tri ân sắp hoàn thành rồi!"
];

const loadingInterval = setInterval(() => {

    loadingProgress++;

    progressFill.style.width = loadingProgress + "%";
    progressNumber.textContent = loadingProgress + "%";

    if (loadingProgress % 25 === 0) {

        const index = Math.min(
            loadingProgress / 25 - 1,
            loadingMessages.length - 1
        );

        loadingCaption.textContent = loadingMessages[index];
    }

    if (loadingProgress >= 100) {

        clearInterval(loadingInterval);

        setTimeout(() => {
            unlockArea.classList.remove("hidden");
        }, 500);
    }

}, 30);


// ==================================
// 2. XÁC THỰC VÂN TAY
// ==================================

function startHolding() {

    if (unlocked || isHolding) return;

    isHolding = true;
    holdStartTime = performance.now();

    fingerprint.classList.add("holding");

    fingerprintInstruction.textContent = "Đang xác nhận...";

    animateHolding();
}


function stopHolding() {

    if (!isHolding || unlocked) return;

    isHolding = false;

    cancelAnimationFrame(animationFrame);

    holdProgress.style.width = "0%";

    fingerprintProgress.style.background =
        "conic-gradient(#d65e87 0deg, #f2dce4 0deg)";

    fingerprint.classList.remove("holding");

    fingerprintInstruction.textContent =
        "Hãy giữ thêm một chút nhé!";
}


function animateHolding() {

    if (!isHolding || unlocked) return;

    const elapsed = performance.now() - holdStartTime;

    const percent = Math.min(elapsed / 2000, 1);

    const degree = percent * 360;

    holdProgress.style.width = percent * 100 + "%";

    fingerprintProgress.style.background =
        `conic-gradient(#d65e87 ${degree}deg, #f2dce4 ${degree}deg)`;

    if (percent >= 1) {

        finishUnlock();

        return;
    }

    animationFrame = requestAnimationFrame(animateHolding);
}


function finishUnlock() {

    unlocked = true;
    isHolding = false;

    cancelAnimationFrame(animationFrame);

    holdProgress.style.width = "100%";

    fingerprintInstruction.textContent =
        "Xác nhận thành công!";

    fingerprint.classList.remove("holding");

    completedArea.classList.add("show");

    setTimeout(() => {

        loadingScreen.classList.add("hidden");

        gardenScreen.classList.remove("hidden");

    }, 1600);
}


fingerprint.addEventListener("pointerenter", (event) => {

    if (event.pointerType === "mouse") {
        startHolding();
    }

});


fingerprint.addEventListener("pointerleave", (event) => {

    if (event.pointerType === "mouse") {
        stopHolding();
    }

});


fingerprint.addEventListener("pointerdown", (event) => {

    if (event.pointerType !== "mouse") {

        event.preventDefault();

        startHolding();
    }

});


window.addEventListener("pointerup", stopHolding);
window.addEventListener("pointercancel", stopHolding);


fingerprint.addEventListener("keydown", (event) => {

    if (event.code === "Space" || event.code === "Enter") {

        event.preventDefault();

        startHolding();
    }

});


fingerprint.addEventListener("keyup", (event) => {

    if (event.code === "Space" || event.code === "Enter") {

        stopHolding();
    }

});


// ==================================
// 3. QUẢN LÝ MINIGAME
// ==================================

const gameModal = document.getElementById("gameModal");
const gameContent = document.getElementById("gameContent");
const closeGame = document.getElementById("closeGame");

const wishModal = document.getElementById("wishModal");
const wishTitle = document.getElementById("wishTitle");
const wishIcon = document.getElementById("wishIcon");
const wishText = document.getElementById("wishText");
const wishContinue = document.getElementById("wishContinue");

const inviteModal = document.getElementById("inviteModal");
const inviteTeacher = document.getElementById("inviteTeacher");
const greetingCardModal = document.getElementById("greetingCardModal");
const finalClose = document.getElementById("finalClose");

const gardenFlowers = document.querySelectorAll(".garden-flower");

const completedGames = [false, false, false, false];

let currentGame = -1;
let gameFinished = false;


const wishes = [

    {
        title: "Bạn đã tìm thấy món quà tri ân!",
        icon: "🌷",
        text: "Mong thầy cô luôn giữ mãi ngọn lửa đam mê với nghề, có thật nhiều niềm vui trong công việc và luôn nhận được tình yêu thương từ các thế hệ học trò."
    },

    {
        title: "Trí nhớ thật tuyệt vời!",
        icon: "🌻",
        text: "Mỗi bài học thầy cô trao đi đều là một hạt giống tri thức. Chúc thầy cô luôn mạnh khỏe, nhiệt huyết và tiếp tục truyền cảm hứng cho nhiều thế hệ học trò."
    },

    {
        title: "Gom góp những điều tốt đẹp!",
        icon: "🌸",
        text: "Mong thầy cô luôn nhận được những bông hoa điểm tốt, những lời cảm ơn chân thành và thật nhiều khoảnh khắc đáng nhớ bên học trò."
    },

    {
        title: "Lời tri ân đã được hoàn thiện!",
        icon: "💌",
        text: "Mỗi câu trả lời đúng là một lời cảm ơn được gửi đến thầy cô. Mong thầy cô luôn mạnh khỏe, hạnh phúc và giữ mãi ngọn lửa yêu nghề."
    }

];


function updateGardenProgress() {

    const count = completedGames.filter(Boolean).length;

    document.getElementById("gameCount").textContent =
        `${count} / 4 trò chơi hoàn thành`;

    document.getElementById("gardenProgress").style.width =
        count * 25 + "%";

    gardenFlowers.forEach((flower, index) => {

        if (completedGames[index]) {

            flower.classList.add("completed");

            flower.querySelector(".flower-status").textContent =
                "Đã nở hoa ✓";
        }

    });

}


function openGame(index) {

    if (completedGames[index]) {

        showWish(index);

        return;
    }

    currentGame = index;
    gameFinished = false;

    gameModal.classList.add("show");

    if (index === 0) startMemoryGame();

    if (index === 1) startColorGame();

    if (index === 2) startCatchGame();

    if (index === 3) startGiftGame();

}


gardenFlowers.forEach((flower) => {

    flower.addEventListener("click", () => {

        openGame(Number(flower.dataset.game));

    });

});


function finishGame() {

    if (gameFinished) return;

    gameFinished = true;

    completedGames[currentGame] = true;

    stopCatchGame();

    gameModal.classList.remove("show");

    updateGardenProgress();

    showWish(currentGame);

}


function showWish(index) {

    wishTitle.textContent = wishes[index].title;

    wishIcon.textContent = wishes[index].icon;

    wishText.textContent = wishes[index].text;

    wishModal.classList.add("show");

}


wishContinue.addEventListener("click", () => {

    wishModal.classList.remove("show");

    if (completedGames.every(Boolean)) {

        setTimeout(() => {

            inviteModal.classList.add("show");

        }, 500);

    }

});


inviteTeacher.addEventListener("click", () => {

    inviteModal.classList.remove("show");

    setTimeout(() => {
        greetingCardModal.classList.add("show");
    }, 350);

});


finalClose.addEventListener("click", () => {

    greetingCardModal.classList.remove("show");

});


closeGame.addEventListener("click", () => {

    stopCatchGame();

    gameModal.classList.remove("show");

});


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        stopCatchGame();

        gameModal.classList.remove("show");

        wishModal.classList.remove("show");
        inviteModal.classList.remove("show");
        greetingCardModal.classList.remove("show");
    }

});


// ==================================
// 4. MINIGAME: LẬT THẺ TÌM CẶP
// ==================================

let memoryCards = [];
let firstCard = null;
let secondCard = null;
let memoryLock = false;
let matchedPairs = 0;
let memoryMoves = 0;


function startMemoryGame() {

    const symbols = ["📚", "✏️", "🍎", "🎓", "🖍️"];

    memoryCards = [...symbols, ...symbols];

    memoryCards.sort(() => Math.random() - 0.5);

    firstCard = null;
    secondCard = null;

    memoryLock = false;
    matchedPairs = 0;
    memoryMoves = 0;

    gameContent.innerHTML = `

        <h2 class="game-title">
            📚 Lật thẻ tìm cặp
        </h2>

        <p class="game-description">
            Có 10 thẻ hình đang bị úp xuống.
            Hãy tìm đủ 5 cặp hình giống nhau nhé!
        </p>

        <div class="game-info">

            Số lượt lật:
            <span id="memoryMoves">0</span>

            &nbsp; | &nbsp;

            Đã tìm:
            <span id="memoryPairs">0</span>/5

        </div>

        <div class="memory-grid" id="memoryGrid"></div>

    `;

    const grid = document.getElementById("memoryGrid");

    memoryCards.forEach((symbol) => {

        const card = document.createElement("button");

        card.className = "memory-card";

        card.textContent = "❔";

        card.addEventListener("click", () => {

            flipCard(card, symbol);

        });

        grid.appendChild(card);

    });

}


function flipCard(card, symbol) {

    if (
        memoryLock ||
        card.classList.contains("open") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("open");

    card.textContent = symbol;

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    memoryMoves++;

    document.getElementById("memoryMoves").textContent =
        memoryMoves;

    if (firstCard.textContent === secondCard.textContent) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        matchedPairs++;

        document.getElementById("memoryPairs").textContent =
            matchedPairs;

        firstCard = null;
        secondCard = null;

        if (matchedPairs === 5) {

            setTimeout(finishGame, 600);

        }

    } else {

        memoryLock = true;

        setTimeout(() => {

            firstCard.textContent = "❔";

            secondCard.textContent = "❔";

            firstCard.classList.remove("open");

            secondCard.classList.remove("open");

            firstCard = null;

            secondCard = null;

            memoryLock = false;

        }, 800);

    }

}


// ==================================
// 5. MINIGAME: GHI NHỚ MÀU SẮC
// ==================================

const colorOptions = [

    {
        name: "Đỏ",
        color: "#ef6c75",
        symbol: "🔴"
    },

    {
        name: "Vàng",
        color: "#f5c95c",
        symbol: "🟡"
    },

    {
        name: "Xanh",
        color: "#65b99a",
        symbol: "🟢"
    },

    {
        name: "Tím",
        color: "#a78bda",
        symbol: "🟣"
    }

];


let colorSequence = [];
let colorAnswer = [];
let colorInputEnabled = false;
let colorRound = 0;
let colorShowTimer = null;


function startColorGame() {

    colorSequence = [];
    colorAnswer = [];

    colorRound = 0;

    colorInputEnabled = false;

    gameContent.innerHTML = `

        <h2 class="game-title">
            🎨 Ghi nhớ màu sắc
        </h2>

        <p class="game-description">
            Hãy quan sát thứ tự màu xuất hiện.
            Sau đó nhấn các màu theo đúng thứ tự nhé!
        </p>

        <div class="game-info" id="colorInfo">
            Vòng 1 / 3
        </div>

        <div class="color-sequence" id="colorButtons"></div>

        <div class="color-answer" id="colorAnswer"></div>

        <button class="game-button" id="colorStart">
            Bắt đầu
        </button>

    `;

    const container = document.getElementById("colorButtons");

    colorOptions.forEach((item, index) => {

        const button = document.createElement("button");

        button.className = "color-tile";

        button.style.background = item.color;

        button.disabled = true;

        button.addEventListener("click", () => {

            selectColor(index);

        });

        container.appendChild(button);

    });


    document.getElementById("colorStart").addEventListener("click", () => {

        colorRound = 1;

        startColorRound();

    });

}


function startColorRound() {

    colorAnswer = [];

    colorInputEnabled = false;

    colorSequence = Array.from(
        { length: colorRound + 2 },
        () => Math.floor(Math.random() * 4)
    );

    document.getElementById("colorInfo").textContent =
        `Vòng ${colorRound} / 3`;

    document.getElementById("colorAnswer").innerHTML = "";

    const buttons = document.querySelectorAll(".color-tile");

    buttons.forEach(button => {

        button.disabled = true;

        button.classList.remove("active");

    });

    const startButton = document.getElementById("colorStart");

    startButton.disabled = true;

    let index = 0;

    colorShowTimer = setInterval(() => {

        buttons.forEach(button => {

            button.classList.remove("active");

        });

        if (index >= colorSequence.length) {

            clearInterval(colorShowTimer);

            buttons.forEach(button => {

                button.disabled = false;

            });

            colorInputEnabled = true;

            startButton.disabled = false;

            startButton.textContent = "Xem lại chuỗi";

            return;
        }

        buttons[colorSequence[index]].classList.add("active");

        index++;

    }, 800);

}


function selectColor(index) {

    if (!colorInputEnabled) return;

    colorAnswer.push(index);

    const answerBox = document.getElementById("colorAnswer");

    answerBox.innerHTML = colorAnswer.map(
        item => `<span>${colorOptions[item].symbol}</span>`
    ).join("");

    const position = colorAnswer.length - 1;

    if (colorAnswer[position] !== colorSequence[position]) {

        colorInputEnabled = false;

        document.getElementById("colorInfo").textContent =
            "Chưa đúng rồi, thử lại nhé!";

        setTimeout(() => {

            colorAnswer = [];

            answerBox.innerHTML = "";

            colorInputEnabled = true;

            document.getElementById("colorInfo").textContent =
                `Vòng ${colorRound} / 3`;

        }, 700);

        return;
    }

    if (colorAnswer.length === colorSequence.length) {

        colorInputEnabled = false;

        if (colorRound === 3) {

            setTimeout(finishGame, 500);

        } else {

            colorRound++;

            document.getElementById("colorInfo").textContent =
                "Chính xác! Chuẩn bị vòng tiếp theo...";

            setTimeout(startColorRound, 900);

        }

    }

}


// ==================================
// 6. MINIGAME: THU THẬP CÁNH HOA
// ==================================

let catchInterval = null;
let catchTimer = null;

let catchScore = 0;
let catchTime = 20;

let basketPosition = 50;

let catchActive = false;

let catchItems = [];


function startCatchGame() {

    stopCatchGame();

    catchScore = 0;
    catchTime = 20;

    basketPosition = 50;

    catchActive = false;

    catchItems = [];

    gameContent.innerHTML = `

        <h2 class="game-title">
            ⭐ Thu thập ngôi sao
        </h2>

        <p class="game-description">
            Di chuyển chiếc giỏ để hứng những ngôi sao tri thức.
            Thu thập ít nhất 10 ngôi sao trong 20 giây
        </p>

        <div class="catch-score">

            <span>
                ⭐ <span id="catchScore">0</span>/10
            </span>

            <span>
                ⏱ <span id="catchTime">20</span>s
            </span>

        </div>

        <div class="catch-game" id="catchGame">

            <div class="catch-basket" id="catchBasket">
                🧺
            </div>

        </div>

        <div class="catch-controls">

            <button id="moveLeft">◀</button>

            <button id="moveRight">▶</button>

        </div>

        <p class="game-info" id="catchInfo">
            Nhấn bắt đầu để chơi!
        </p>

        <div style="text-align:center">

            <button class="game-button" id="catchStart">
                Bắt đầu
            </button>

        </div>

    `;

    const left = document.getElementById("moveLeft");

    const right = document.getElementById("moveRight");

    left.addEventListener("click", () => moveBasket(-8));

    right.addEventListener("click", () => moveBasket(8));


    const area = document.getElementById("catchGame");

    area.addEventListener("pointermove", (event) => {

        if (!catchActive) return;

        const rect = area.getBoundingClientRect();

        basketPosition = Math.max(
            8,
            Math.min(
                92,
                ((event.clientX - rect.left) / rect.width) * 100
            )
        );

        updateBasket();

    });


    document.getElementById("catchStart").addEventListener("click", beginCatch);

}


function moveBasket(amount) {

    if (!catchActive) return;

    basketPosition = Math.max(
        8,
        Math.min(92, basketPosition + amount)
    );

    updateBasket();

}


function updateBasket() {

    const basket = document.getElementById("catchBasket");

    if (basket) {

        basket.style.left = basketPosition + "%";

    }

}


function beginCatch() {

    if (catchActive) return;

    catchActive = true;

    document.getElementById("catchStart").disabled = true;

    document.getElementById("catchInfo").textContent =
        "Thu thập thật nhiều ngôi sao tri thức nhé!";

    catchInterval = setInterval(dropPetal, 550);

    catchTimer = setInterval(() => {

        catchTime--;

        document.getElementById("catchTime").textContent =
            catchTime;

        if (catchTime <= 0) {

            stopCatchGame();

            if (catchScore >= 10) {

                finishGame();

            } else {

                document.getElementById("catchInfo").textContent =
                    "Chưa đủ 10 ngôi sao. Hãy thử lại nhé!";

                const button = document.getElementById("catchStart");

                button.disabled = false;

                button.textContent = "Chơi lại";

                button.onclick = resetCatch;

            }

        }

    }, 1000);

}


function dropPetal() {

    if (!catchActive) return;

    const area = document.getElementById("catchGame");

    const petal = document.createElement("span");

    petal.className = "catch-petal";

    petal.textContent = ["⭐", "🌟", "✨"][
        Math.floor(Math.random() * 3)
    ];

    const left = Math.random() * 90 + 3;

    petal.style.left = left + "%";

    petal.style.top = "-35px";

    area.appendChild(petal);

    let top = -35;

    const fall = setInterval(() => {

        if (!catchActive) {

            clearInterval(fall);

            petal.remove();

            return;
        }

        top += 4;

        petal.style.top = top + "px";

        if (
            top >= 220 &&
            top <= 275 &&
            Math.abs(left - basketPosition) < 11
        ) {

            catchScore++;

            document.getElementById("catchScore").textContent =
                catchScore;

            clearInterval(fall);

            petal.remove();

            return;
        }

        if (top > 310) {

            clearInterval(fall);

            petal.remove();

        }

    }, 35);

    catchItems.push(fall);

}


function stopCatchGame() {

    catchActive = false;

    clearInterval(catchInterval);

    clearInterval(catchTimer);

    catchItems.forEach(clearInterval);

    catchItems = [];

}


function resetCatch() {

    stopCatchGame();

    startCatchGame();

}


// ==================================
// 7. MINIGAME: HOÀN THIỆN LỜI TRI ÂN
// ==================================

const gratitudeQuestions = [
    {
        question: "Ngày Nhà giáo Việt Nam được tổ chức vào ngày nào?",
        answers: ["20/10", "20/11", "8/3"],
        correct: 1
    },
    {
        question: "Món quà ý nghĩa nhất dành tặng thầy cô là gì?",
        answers: ["Lòng biết ơn và sự cố gắng", "Sự ồn ào", "Những lời hứa suông"],
        correct: 0
    },
    {
        question: "Thầy cô thường được ví với hình ảnh nào?",
        answers: ["Người lái đò", "Người thợ săn", "Người phi công"],
        correct: 0
    }
];

let gratitudeQuestionIndex = 0;
let gratitudeLocked = false;

function startGiftGame() {

    gratitudeQuestionIndex = 0;
    gratitudeLocked = false;
    renderGratitudeQuestion();

}

function renderGratitudeQuestion() {

    const item = gratitudeQuestions[gratitudeQuestionIndex];

    gameContent.innerHTML = `

        <h2 class="game-title">💌 Hoàn thiện lời tri ân</h2>

        <p class="game-description">
            Trả lời đúng 3 câu hỏi nhỏ để hoàn thiện thông điệp gửi thầy cô nhé!
        </p>

        <div class="game-info">
            Câu hỏi ${gratitudeQuestionIndex + 1} / ${gratitudeQuestions.length}
        </div>

        <div class="gratitude-question">${item.question}</div>

        <div class="gratitude-options">
            ${item.answers.map((answer, index) => `
                <button class="gratitude-option" data-answer="${index}">
                    ${answer}
                </button>
            `).join("")}
        </div>

        <p class="gratitude-feedback" id="gratitudeFeedback">
            Hãy chọn câu trả lời mà bạn cho là đúng!
        </p>

    `;

    document.querySelectorAll(".gratitude-option").forEach((button) => {

        button.addEventListener("click", () => {

            if (gratitudeLocked) return;

            const selected = Number(button.dataset.answer);
            const feedback = document.getElementById("gratitudeFeedback");

            if (selected === item.correct) {

                gratitudeLocked = true;
                button.classList.add("correct");
                feedback.textContent = "Chính xác! Một mảnh ghép tri ân đã được hoàn thành. ✨";

                document.querySelectorAll(".gratitude-option").forEach(option => {
                    option.disabled = true;
                });

                setTimeout(() => {

                    gratitudeQuestionIndex++;

                    if (gratitudeQuestionIndex >= gratitudeQuestions.length) {
                        finishGame();
                    } else {
                        gratitudeLocked = false;
                        renderGratitudeQuestion();
                    }

                }, 900);

            } else {

                button.classList.add("wrong");
                feedback.textContent = "Chưa chính xác, bạn thử một đáp án khác nhé!";

                setTimeout(() => button.classList.remove("wrong"), 500);

            }

        });

    });

}

updateGardenProgress();
