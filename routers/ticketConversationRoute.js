module.exports = app => {
    const {ticketConversationController} = require("../controllers/ticketConversationController");
  
    var router = require("express").Router();
    
     router.post("/addMessage", ticketConversationController.addTicketConversation);
      router.get("/getConversations", ticketConversationController.getTicketConversations);
    //  router.put("/updateTicket/:id", ticketConversationController.updateTicket);
      router.delete("/deleteConversation/:id", ticketConversationController.deleteTicketConversation);

    app.use("/api/v1", router);
  };