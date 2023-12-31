'use strict'

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 
// TODO: in seat details, show available seats around 
// TODO: Upload to GitHub Pages

var gCinema
var gElSelectedSeat = null

function onInit() {
    gCinema = createCinema()
    console.log('gCinema:', gCinema)
    renderCinema()
}

function createCinema() {
    const cinema = []
    for (var i = 0; i < 6; i++) {
        cinema[i] = []
        for (var j = 0; j < 10; j++) {
            const cell = {
                isSeat: (j !== 2 && j !== 7 && i !== 3)
            }
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
            }

            cinema[i][j] = cell
        }
    }

    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]
            // For cell of type SEAT add seat class:
            var className = (cell.isSeat) ? 'seat' : ''
            if (cell.isBooked) {
                className += ' booked'
            }
            // Add a seat title:
            const title = `Seat: ${i + 1}, ${j + 1}`

            // TODO: for cell that is booked add booked class

            strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]
    // ignore none seats and booked
    if (!cell.isSeat || cell.isBooked) return

    console.log('Cell clicked: ', elCell, i, j)

    // Support selecting a seat
    elCell.classList.add('selected')

    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }

    // Only a single seat should be selected
    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null

    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        showSeatDetails({ i, j })
    } else {
        hideSeatDetails()
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]
    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)
    const elBtn = elPopup.querySelector('button.book')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function closePopUp() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn)
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    console.log('i:', i)
    console.log('j:', j)
    gCinema[i][j].isBooked = true
    renderCinema()

    hideSeatDetails()
}


function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            console.log('currCell:', currCell)
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }
    return count
}

function onHighlight(){
    var board = gCinema
    var rowIdx = +gElSelectedSeat.dataset.i
    var colIdx = +gElSelectedSeat.dataset.j

    highlightAvailableSeatsAround(board,rowIdx,colIdx)
}

function highlightAvailableSeatsAround(board,rowIdx,colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            const currCell = board[i][j]
            console.log('currCell:', currCell)
            const elCurrCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            // [data-i=1][data-j=1]
            // <td data-i="1" data-j="1"></td>
            console.log('elCurrCell:', elCurrCell)
            if (currCell.isSeat && !currCell.isBooked) {
                // get the current cell (<td> - DOM el) and add highlight class to it
                // elCurrCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`) 
                elCurrCell.classList.add('highlight')
                // after 2.5s remove the class
                setTimeout(()=>{
                    elCurrCell.classList.remove('highlight')
                },2500)
            }
        }
    }
}