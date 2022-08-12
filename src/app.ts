const startApp = async () => {
  let currentPage: number = 1;
  const baseURL = (page: number): string =>
    `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${page}`;

  let dataTable = {};

  // declare DOM elements
  const pageViewLabel = document.querySelector(
    "label[data-pageview]"
  ) as HTMLLabelElement;
  const previousButton = document.querySelector(
    "[data-prevbtn]"
  ) as HTMLButtonElement;
  const nextButton = document.querySelector(
    "[data-nextbtn]"
  ) as HTMLButtonElement;

  const tableBody = document.querySelector(
    "[data-sink]"
  ) as HTMLTableSectionElement;

  console.log(pageViewLabel);
  console.log(previousButton);
  console.log(nextButton);
  console.log(tableBody);

  const onNextButtonClick = async () => {
    currentPage += 1;
    if (currentPage === 2) {
      enablePreviousButton();
    }
    populateTableBody();
  };

  const onPreviousButtonClick = async () => {
    if (currentPage > 1) {
      currentPage -= 1;
      if (currentPage === 1) {
        disablePreviousButton();
      }
      populateTableBody();
    }
  };

  const disablePreviousButton = () => {
    previousButton.setAttribute("disabled", "true");
  };

  const enablePreviousButton = () => {
    previousButton.removeAttribute("disabled");
  };

  const fetchData = async () => {
    try {
      if (dataTable[currentPage]) {
        return dataTable[currentPage];
      } else {
        const res = await fetch(baseURL(currentPage));
        const data = await res.json();

        dataTable[currentPage] = data.results[0][currentPage];
        dataTable[currentPage + 1] = data.results[0][currentPage + 1];

        return data.results[0];
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const populateTableBody = async () => {
    await fetchData();

    const currentPageData = dataTable[currentPage];
    const tableRows = tableBody.children;

    for (let i = 0; i < tableRows.length; i++) {
      const rowCount = i + (currentPage - 1) * 5 + 1;
      const rowData = currentPageData.find((res) => res.row === rowCount);

      tableRows[i].setAttribute("data-entryid", `${rowData.id}`);
      console.log("row", tableRows);

      const currentRowChildren = tableRows[i].children;

      currentRowChildren[0].textContent = rowData.row;
      currentRowChildren[1].textContent = rowData.gender;
      currentRowChildren[2].textContent = rowData.age;
    }
  };

  disablePreviousButton();
  populateTableBody();

  nextButton.addEventListener("click", onNextButtonClick);
  previousButton.addEventListener("click", onPreviousButtonClick);
};

document.addEventListener("DOMContentLoaded", startApp);
