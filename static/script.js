
const input = document.getElementById("textInput");
const button = document.getElementById("checkButton");
const result = document.getElementById("result");
const details = document.getElementById("details");

button.addEventListener("click", async () => {
    try {
        const response = await fetch("/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input.value })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to check input.");
        }

        result.textContent = data.message;
        details.textContent = `Input: ${data.input}`;
    } catch (error) {
        result.textContent = error.message;
        details.textContent = "";
    }
});
