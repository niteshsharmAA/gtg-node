
module.exports = app => {
    const {supportTicketController} = require("../controllers/supportTicketController");
  
    var router = require("express").Router();
    
     router.post("/raiseTicket", supportTicketController.addTicket);
     router.get("/listOfAllTickets", supportTicketController.getAllTickets);
     router.put("/updateTicket/:id", supportTicketController.updateTicket);
     router.delete("/deleteTicket/:id", supportTicketController.deleteTicket);

    app.use("/api/v1", router);
  };