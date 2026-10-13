
const form = document.getElementById("checkerForm");
const input = document.getElementById("textInput");
const button = document.getElementById("checkButton");
const buttonText = document.getElementById("buttonText");
const clearButton = document.getElementById("clearButton");

const resultPanel = document.getElementById("resultPanel");
const resultIcon = document.getElementById("resultIcon");
const resultLabel = document.getElementById("resultLabel");
const resultHeading = document.getElementById("result");
const details = document.getElementById("details");

const originalStack = document.getElementById("originalStack");
const reverseStack = document.getElementById("reverseStack");
const comparisonMessage = document.getElementById("comparisonMessage");

const exampleButtons = document.querySelectorAll(".example-chip");

function normalizeText(text) {
    // Ignore spaces, punctuation and uppercase/lowercase differences.
    return Array.from(text)
        .filter(character => /[\p{L}\p{N}]/u.test(character))
        .map(character => character.toLowerCase())
        .join("");
}

function showCharacters(container, text, reverseMode = false) {
    container.replaceChildren();

    const characters = Array.from(text);

    if (characters.length === 0) {
        const empty = document.createElement("span");
        empty.className = "char-chip";
        empty.textContent = "—";
        container.appendChild(empty);
        return;
    }

    characters.forEach((character, index) => {
        const chip = document.createElement("span");

        chip.className = reverseMode
            ? "char-chip reverse-chip"
            : "char-chip";

        chip.textContent = character;

        chip.style.animationDelay = `${index * 45}ms`;

        container.appendChild(chip);
    });
}

function updateStackVisualization(text, isPalindrome = null) {
    const cleaned = normalizeText(text);
    const reversed = Array.from(cleaned).reverse().join("");

    showCharacters(originalStack, cleaned);
    showCharacters(reverseStack, reversed, true);

    comparisonMessage.replaceChildren();

    const icon = document.createElement("span");
    icon.textContent = "✦";

    const message = document.createElement("span");

    if (!cleaned) {
        message.textContent =
            "Enter some letters or numbers to explore the Stack.";
    } else if (isPalindrome === true) {
        message.textContent =
            "Match found! Original and reversed text are identical.";
    } else if (isPalindrome === false) {
        message.textContent =
            "The two sequences differ. This is not a palindrome.";
    } else {
        message.textContent =
            "The reversed sequence is shown above.";
    }

    comparisonMessage.append(icon, message);
}

function showError(message) {
    resultPanel.className = "result-panel error";
    resultIcon.textContent = "!";
    resultLabel.textContent = "CHECK YOUR INPUT";
    resultHeading.textContent = "Something needs attention";
    details.textContent = message;
}

function resetResult() {
    resultPanel.className = "result-panel";
    resultIcon.textContent = "✧";
    resultLabel.textContent = "YOUR RESULT";
    resultHeading.textContent = "Your result will appear here.";
    details.textContent =
        "Enter something above and click the button.";
}

function setLoading(isLoading) {
    button.disabled = isLoading;
    input.disabled = isLoading;

    buttonText.textContent = isLoading
        ? "Checking your text..."
        : "Check My Palindrome";
}

input.addEventListener("input", () => {
    clearButton.style.display = input.value ? "grid" : "none";
});

clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.style.display = "none";
    input.focus();

    resetResult();
    updateStackVisualization("");
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value;

    if (!text.trim()) {
        showError("Please enter a word, number or sentence first.");
        input.focus();
        return;
    }

    if (text.length > 500) {
        showError("Please enter no more than 500 characters.");
        return;
    }

    if (!normalizeText(text)) {
        showError("Enter at least one letter or number.");
        updateStackVisualization("");
        return;
    }

    setLoading(true);
    resultPanel.className = "result-panel";
    resultIcon.textContent = "⌛";
    resultLabel.textContent = "ANALYSING";
    resultHeading.textContent = "Checking your text...";
    details.textContent = "Python is processing your input.";

    updateStackVisualization(text);

    try {
        const response = await fetch("/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "The server could not check your text."
            );
        }

        if (typeof data.is_palindrome !== "boolean") {
            throw new Error("The server returned an invalid result.");
        }

        if (data.is_palindrome) {
            resultPanel.className = "result-panel success";
            resultIcon.textContent = "✓";
            resultLabel.textContent = "PALINDROME FOUND";
            resultHeading.textContent = "Yes! It's a palindrome.";
            details.textContent =
                `"${text}" reads the same forward and backward.`;
        } else {
            resultPanel.className = "result-panel failure";
            resultIcon.textContent = "↔";
            resultLabel.textContent = "NOT A PALINDROME";
            resultHeading.textContent = "Not this time!";
            details.textContent =
                `"${text}" does not read the same in both directions.`;
        }

        updateStackVisualization(text, data.is_palindrome);

    } catch (error) {
        showError(
            error.message ||
            "Unable to connect. Make sure the Flask server is running."
        );
    } finally {
        setLoading(false);
    }
});

// Example buttons fill the input and immediately check the example.
exampleButtons.forEach((exampleButton) => {
    exampleButton.addEventListener("click", async () => {
        input.value = exampleButton.dataset.example;
        clearButton.style.display = "grid";

        input.focus();

        form.requestSubmit();
    });
});

// Initial demonstration
updateStackVisualization("MADAM");
