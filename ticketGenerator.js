function generateTicket(){
    //Initializing the array to ensure we get exact 5 numbers in a row
    const arr = [[true, true, true, true, true, false, false, false, false],
    [true, true, true, true, true, false, false, false, false],
    [true, true, true, true, true, false, false, false, false]]
    let lt = []
    let i = 0
    //randomly sort the elements inside each row 
    lt = arr.map(ele => ele.sort(() => Math.random() - .5))
    for (let i = 0; i < 9; i++) {
        let a = [lt[0][i], lt[1][i], lt[2][i]]
        let cnt = 0
        a.forEach(ele => {
            if (ele === true) {
                cnt += 1
            }
        })
    //To Generate numbers in increasing order in a column,
    //check how many random numbers are needed in that specific column of specific range
    //without duplicate numbers and assign them in increasing order 
        let randomValues = []
        while (cnt > 0) {
            let x = randomGeneraterInInterval(i)
            if (!randomValues.includes(x)) {

                randomValues.push(x)
                cnt -= 1
            }

        }
        randomValues.sort((a, b) => a - b)
        for (let j = 0; j < 3; j++) {
            if (lt[j][i] === true) {
                lt[j][i] = randomValues.shift()
            } else {
                lt[j][i] = 0
            }
        }
    }
    //To store numbers in the Database as JSON string convert array in some sort of string format
    const z = (lt.join(","))
    return JSON.stringify(z)
}

// It will create random numbers in specific range
function randomGeneraterInInterval(x) {
    if (x == 0) {
        return Math.floor(Math.random() * 10) + 1
    }
    return Math.floor(Math.random() * 10) + 10 * x
}

function tambolaTicketGenerator(num) {
    let tickets=[];
    for(let i =0;i<num;i++){
        tickets.push(generateTicket())
    }
    return tickets
}




module.exports = tambolaTicketGenerator;