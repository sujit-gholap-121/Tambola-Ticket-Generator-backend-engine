const express = require("express")
const env=require("dotenv").config()
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const tambolaTicketGenerator = require("./ticketGenerator")

const filePath = path.join(__dirname, "ticketStore.db")
const app = express()
app.use(express.json())


let DB = null;
// Used to create schema for ticketStore table in SQLite Database
const createDB = async () => {
    const q1 = "create table ticketStore (id INTEGER primary key,ticket TEXT unique)"
    const result = await DB.run(q1)
}

//Connection to the Database
const ConnectToDB = async () => {
    try {
        DB = await open({
            filename: filePath,
            driver: sqlite3.Database
        })
    }
    catch (e) {
        console.log("Error Connecting To Database:", e.message)
    }
    // createDB()
}

ConnectToDB()

//API to generate a set of Tambola Tickets(6)
app.get("/generate-ticket", async (req, res) => {
    let result = null;
    try {
        const tickets=tambolaTicketGenerator(6);
       result= await pushAllTickets(tickets)
     const formatedData= formattResponseData(result)
    
        res.send({ tickets:formatedData })
    }
    catch (err) {
        res.send({ "Error": err.message })
    }
})

app.get("/tambola-tickets",async(req,res)=>{
    let result;
    const responseObject={};
    try{
        const getTicketsQuery=`select * from ticketStore`
        const result=await DB.all(getTicketsQuery)
        let cnt=0
        let counter=1
        while(cnt<result.length){
            let obj=formattResponseData(result.slice(cnt,cnt+6))
            console.log(obj)
            responseObject[`Ticket ${counter}`]=obj
            cnt+=6
            counter+=1
        }
        res.send(responseObject)
    }
    catch(err){
        res.send({"Error: ":err.message})
    }
})

//It will format the ticket properly and create original array of number representing the tambola-ticket.
function  formattResponseData(arr){
    const Obj={}
    const  formattedResult=arr.forEach(ele=>{
        const {id,ticket}=ele
        const splittedArr=ticket.split(",")
        const intArr=splittedArr.map(ele=>parseInt(ele))
        const groupedIntArr=[[...intArr.slice(0,9)],[...intArr.slice(9,18)],[...intArr.slice(18,27)]]
        Obj[id]=groupedIntArr
    })
    return Obj

}

async function pushAllTickets(tickets) {
    console.log(tickets)
    let result;
    //If any dublicate ticket is present it will raise error and handled.
    //In case of error function will again re-generate new set of Tambola-tickets.
    try {
        const pushTicketsToDatabase = `insert into ticketStore(ticket) values(${tickets[0]}),(${tickets[1]}),(${tickets[2]}),(${tickets[3]}),(${tickets[4]}),(${tickets[5]})`
        result = await DB.run(pushTicketsToDatabase)
       try{ const getTicketsQuery = `select * from ticketStore limit 6 offset ${result.lastID - result.changes} `
        const newTickets = await DB.all(getTicketsQuery)
        return newTickets}
        catch(error){
            return 
        }
    }
    catch (err) {
        console.log("Error while inserting the tickets:", err)
        tickets = tambolaTicketGenerator(6)
        pushAllTickets(tickets)
    }

}


try {
    app.listen(process.env.PORT, () => {
        console.log("Server listening at port: http://localhost:3000",app)
    })
}
catch (e) {
    console.log("Error listening the port:", e)
}

// createDB()