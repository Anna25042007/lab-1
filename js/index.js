document.addEventListener("DOMContentLoaded", function () {
  setupNavigation();
  setupDivisibility();
  setupGrades();
});

function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  const divisibilitySection = document.getElementById("divisibility-section");
  const gradeSection = document.getElementById("grade-section");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const target = button.dataset.target;
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

    const str = Math.abs(number).toString();
    let digitsSum = 0;
    for (let i = 0; i < str.length; i++) {
      digitsSum += Number(str[i]);
    }
    const lastDigit = Number(str[str.length - 1]);

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

function setupGrades() {
  const form = document.getElementById("grade-form");
  const input = document.getElementById("grades-input");
  const errorEl = document.getElementById("grade-error");
  const resultsEl = document.getElementById("grade-results");
  const resetBtn = document.getElementById("grade-reset");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    errorEl.textContent = "";
    resultsEl.innerHTML = "";

    const raw = (input.value || "").trim();
    if (!raw) {
      errorEl.textContent =
        "Будь ласка, введіть принаймні одну оцінку через кому.";
      return;
    }

    const parts = raw.split(",");
    const grades = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) {
        continue;
      }

      const value = Number(part);
      if (!Number.isFinite(value) || !Number.isInteger(value)) {
        errorEl.textContent =
          "Усі оцінки мають бути цілими числами (0–100). Перевірте введені дані.";
        return;
      }
      if (value < 0 || value > 100) {
        errorEl.textContent =
          "Кожна оцінка має бути в діапазоні від 0 до 100.";
        return;
      }

      grades.push(value);
    }

    if (grades.length === 0) {
      errorEl.textContent = "Не вдалося знайти жодної оцінки.";
      return;
    }

    let min = grades[0];
    let max = grades[0];
    let sum = 0;

    for (let i = 0; i < grades.length; i++) {
      const g = grades[i];
      sum += g;
      if (g < min) min = g;
      if (g > max) max = g;
    }

    const count = grades.length;
    const averageRaw = sum / count;
    const average = Math.round(averageRaw * 10) / 10;

    let letter;
    if (average >= 90) {
      letter = "A";
    } else if (average >= 75) {
      letter = "B";
    } else if (average >= 60) {
      letter = "C";
    } else {
      letter = "D";
    }

    const html = `
      <p>
        <span class="result-list__label">Середній бал:</span>
        <span class="grade-highlight">${average}</span>
        (<span class="grade-highlight">${letter}</span>)
      </p>
      <ul class="results-summary">
        <li><span class="result-list__label">Кількість оцінок:</span> ${count}</li>
        <li><span class="result-list__label">Мінімальна оцінка:</span> ${min}</li>
        <li><span class="result-list__label">Максимальна оцінка:</span> ${max}</li>
      </ul>
    `;

    resultsEl.innerHTML = html;
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
