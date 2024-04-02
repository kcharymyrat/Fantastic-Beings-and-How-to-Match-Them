console.log("works")

const mapTable = document.querySelector("#map");

const zouwu = "zouwu"
const swooping = "swooping"
const salamander = "salamander"
const puffskein = "puffskein"
const kelpie = "kelpie"
const fantasticBeings = [zouwu, swooping, salamander, puffskein,kelpie]

const threeOrMoreNeighborCoords = [];
let filledFantasticBeingsArr = createRandomFantasticBeingsArr(5, 5, fantasticBeings)

let firstClickedElement = null

registerAllNeighbors()
console.log("threeOrMoreNeighbors =", threeOrMoreNeighborCoords)

function createRandomFantasticBeingsArr(rowNum, colNum, animalTypes) {
    const randomMap = []
    for (let i = 0; i < rowNum; i++) {
        randomMap.push(randomBeingsRow(colNum, animalTypes))
    }
    return randomMap;
}

function randomBeingsRow(rowLength, animalTypesArr) {
    let numbers = Array.from(
        { length: rowLength },
        (_, index) => {
            if (index < animalTypesArr.length) {
                return animalTypesArr[index]
            } else {
                // return animalTypesArr[index % animalTypesArr.length]
                return animalTypesArr[Math.floor(Math.random() * animalTypesArr.length)]
            }
        }
    );

    // Shuffle the array
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

function handleCellClick(event, i, j, td) {
    console.log("i =", i, ", j=", j, ", td =", td)
    if (!firstClickedElement) {
        td.style.backgroundImage = 'url("images/cell-selected-bg.png")';
        td.style.backgroundSize = "contain";
        // neighbors
        firstClickedElement = {"i": i, "j": j, "element": td}
    } else {
        const i1 = firstClickedElement.i;
        const j1 = firstClickedElement.j;
        const e1 = firstClickedElement.element;

        const isLeft = i === i1 && j === j1 - 1;
        const isTop = i === i1 - 1 && j === j1;
        const isRight = i === i1 && j === j1 + 1;
        const isBottom = i === i1 + 1 && j === j1;

        console.log(isLeft, isTop, isRight, isBottom)

        if (isLeft || isTop || isRight || isBottom) {
            firstClickedElement = null;
            td.style.backgroundImage = "none";
            const tempBeing = filledFantasticBeingsArr[i1][j1];
            filledFantasticBeingsArr[i1][j1] = filledFantasticBeingsArr[i][j];
            filledFantasticBeingsArr[i][j] = tempBeing;
            registerAllNeighbors()
            deleteSameNeighbors()
            console.log("threeOrMoreNeighbors =", threeOrMoreNeighborCoords)
            redrawMap(filledFantasticBeingsArr);
            console.log(filledFantasticBeingsArr);

            setTimeout(fillDeleted, 100)

            console.log(filledFantasticBeingsArr)
        }
    }
}

function registerHorizontalNeighbors(colIndexStart, colIndexStop, rowIndex) {
    const i = rowIndex;

    for (let j = colIndexStart; j <= colIndexStop; j++) {
        const current = filledFantasticBeingsArr[i][j];
        const neighbors = [{"i": i, "j": j}];

        for (let k = j + 1; k <= colIndexStop; k++) {
            const next = filledFantasticBeingsArr[i][k];
            if (current === next) {
                neighbors.push({"i": i, "j": k})
            } else {
                j = k - 1
                break
            }
        }

        if (neighbors.length >= 3) {
            threeOrMoreNeighborCoords.push(neighbors);
        }
    }
}


function registerVerticalNeighbors(rowIndexStart, rowIndexStop, colIndex) {
    const j = colIndex;

    for (let i = rowIndexStart; i <= rowIndexStop; i++) {
        const current = filledFantasticBeingsArr[i][j];
        const neighbors = [{"i": i, "j": j}];

        for (let k = i + 1; k <= rowIndexStop; k++) {
            const next = filledFantasticBeingsArr[k][j];
            if (current === next) {
                neighbors.push({"i": k, "j": j})
            } else {
                i = k - 1
                break
            }
        }

        if (neighbors.length >= 3) {
            threeOrMoreNeighborCoords.push(neighbors);
        }
    }
}



function registerAllNeighbors() {
    for (let i = 0; i < filledFantasticBeingsArr.length; i++) {
        registerHorizontalNeighbors(0, filledFantasticBeingsArr.length - 1, i)
    }
    for (let j = 0; j < filledFantasticBeingsArr[0].length; j++) {
        registerVerticalNeighbors(0, filledFantasticBeingsArr[j].length - 1, j)
    }
}

function deleteSameNeighbors() {
    if (threeOrMoreNeighborCoords.length < 1) {
        return false
    }
    let isDeleted = false
    for (const coords of threeOrMoreNeighborCoords) {
        for (const coord of coords) {
            filledFantasticBeingsArr[coord.i][coord.j] = ""
            isDeleted = true
        }
    }
    threeOrMoreNeighborCoords.length = 0
    return isDeleted
}


function fillDeleted() {
    for (let i = 0; i < filledFantasticBeingsArr.length; i++) {
        for (let j = 0; j < filledFantasticBeingsArr[i].length; j++) {
            if (!filledFantasticBeingsArr[i][j]){
                filledFantasticBeingsArr[i][j] = window.generateRandomBeingName()
            }
        }
    }

    redrawMap(filledFantasticBeingsArr)
    registerAllNeighbors()
    const isDeleted = deleteSameNeighbors()
    if (isDeleted) {
        fillDeleted()
    }
}

window.renderMap = (rowsCount, colsCount) => {
    for (let i = 0; i < rowsCount; i++) {
        const tr = document.createElement("tr")
        tr.classList.add("row");
        for (let j = 0; j < colsCount; j++) {
            const td = document.createElement("td");
            td.classList.add("cell");
            td.addEventListener("click", (event) => {
                handleCellClick(event, i, j, td);
            })

            if (filledFantasticBeingsArr[i][j]) {
                const img = document.createElement("img");
                img.src = `images/${filledFantasticBeingsArr[i][j]}.png`;
                img.dataset.coords = `x${j}_y${i}`;
                img.style.width = 100 + 'px';
                img.style.height = 100 + 'px'
                td.dataset.being = filledFantasticBeingsArr[i][j];
                td.appendChild(img)
            } else {
                td.dataset.being = "";
                td.textContent = "";
            }

            tr.appendChild(td);
        }
        mapTable.appendChild(tr);
    }
    console.log(mapTable);
}

window.clearMap = () => {
    while (mapTable.firstChild) {
        mapTable.removeChild(mapTable.firstChild);
    }
    console.log(mapTable);
}


window.redrawMap = (arr) => {
    if (!Array.isArray(arr) || arr.length < 3 || arr.find(el => !Array.isArray(el) || el.length < 3))
        return false;

    clearMap();

    filledFantasticBeingsArr = arr

    renderMap(arr.length, arr[0].length);

    return true
}

window.generateRandomBeingName = () => {
    return fantasticBeings[Math.floor(Math.random() * fantasticBeings.length)]
}

window.renderMap(5, 5)
// window.redrawMap([
//     ['kelpie', 'puffskein', 'puffskein'],
//     ['swooping', 'zouwu', 'puffskein'],
//     ['kelpie', 'puffskein', 'zouwu']
// ]);






