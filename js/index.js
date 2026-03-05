document.addEventListener("DOMContentLoaded", function () {
    setupNavigation();
    setupDivisibility();
    setupGrades();
});

// ---------------- Навігація між задачами ----------------

function setupNavigation() {
    const buttons = document.querySelectorAll(".nav-btn");
    const divisibilitySection = document.getElementById("divisibility-section");
    const gradeSection = document.getElementById("grade-section");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const target = button.dataset.target;

            // показуємо потрібну секцію
            if (target === "divisibility-section") {
                divisibilitySection.classList.remove("hidden");
                gradeSection.classList.add("hidden");
            } else if (target === "grade-section") {
                gradeSection.classList.remove("hidden");
                divisibilitySection.classList.add("hidden");
            }
        });
    });
}

// ---------------- Задача 1: подільність ----------------

function setupDivisibility() {
    const form = document.getElementById("divisibility-form");
    const input = document.getElementById("number-input");
    const errorEl = document.getElementById("divisibility-error");
    const resultsEl = document.getElementById("divisibility-results");
    const resetBtn = document.getElementById("divisibility-reset");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        errorEl.textContent = "";
        resultsEl.innerHTML = "";

        const raw = (input.value || "").trim();
        if (!raw) {
            errorEl.textContent = "Будь ласка, введіть натуральне число.";
            return;
        }

        const number = Number(raw);
        if (!Number.isFinite(number) || !Number.isInteger(number) || number <= 0) {
            errorEl.textContent =
                "Число має бути натуральним (цілим і більшим за 0).";
            return;
        }

        // сума цифр і остання цифра
        const str = Math.abs(number).toString();
        let digitsSum = 0;
        for (let i = 0; i < str.length; i++) {
            digitsSum += Number(str[i]);
        }
        const lastDigit = Number(str[str.length - 1]);

        // перевірка подільності
        const divisors = [
            {
                d: 2,
                isDivisible: lastDigit % 2 === 0,
                positive: "остання цифра парна",
                negative: "остання цифра непарна",
            },
            {
                d: 3,
                isDivisible: digitsSum % 3 === 0,
                positive: "сума цифр ділиться на 3",
                negative: "сума цифр не ділиться на 3",
            },
            {
                d: 5,
                isDivisible: lastDigit === 0 || lastDigit === 5,
                positive: "остання цифра дорівнює 0 або 5",
                negative: "остання цифра не дорівнює 0 або 5",
            },
            {
                d: 9,
                isDivisible: digitsSum % 9 === 0,
                positive: "сума цифр ділиться на 9",
                negative: "сума цифр не ділиться на 9",
            },
            {
                d: 10,
                isDivisible: lastDigit === 0,
                positive: "остання цифра дорівнює 0",
                negative: "остання цифра не дорівнює 0",
            },
        ];

        const summaryHtml = `
      <ul class="results-summary">
        <li><span class="result-list__label">Введене число:</span> ${number}</li>
        <li><span class="result-list__label">Сума цифр:</span> ${digitsSum}</li>
        <li><span class="result-list__label">Остання цифра:</span> ${lastDigit}</li>
      </ul>
    `;

        let listHtml = "<p><strong>Результати подільності:</strong></p><ul class=\"result-list\">";

        divisors.forEach(function (item) {
            const status = item.isDivisible ? "ділиться" : "не ділиться";
            const reason = item.isDivisible ? item.positive : item.negative;
            listHtml +=
                "<li>" +
                '<span class="result-list__label">Дільник ' +
                item.d +
                ":</span> " +
                "число " +
                status +
                " на " +
                item.d +
                " (" +
                reason +
                ")" +
                "</li>";
        });

        listHtml += "</ul>";

        resultsEl.innerHTML = summaryHtml + listHtml;
    });
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            input.value = "";
            errorEl.textContent = "";
            resultsEl.innerHTML = "";
            input.focus();
        });
    }
}

