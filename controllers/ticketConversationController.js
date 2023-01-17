const { createDB1Manager } = require('../models');
var ifsc = require('ifsc');
const { success, error, validation } = require('../middleware/responseApi');

const { helper } = require('../helper/helper')



class ticketConversationController {

    /**************  create conversation ***********************/
    static addTicketConversation = async (req, res) => {
        try {
            let { ticketConversation } = await createDB1Manager();
            let ticketConversationData = await ticketConversation.create(req.body)
            return res.json(success(' message sent successfully', ticketConversationData, 200));
        } catch (error) {
            return res.send({ status: 500, msg: error });
        }

    }

     /**************  List of   tickets conversation of tid (ticket id) ***********************/
     static getTicketConversations = async (req, res) => {
        try {
            let { ticketConversation } = await createDB1Manager();
            let getTickets = await ticketConversation.findAll({ where: req.query })
            return res.json(success('   conversation  get Successfully', getTickets, 200))
        }
        catch (err) {
            return res.json(error(err.mesage, 500))
        }
    }

    /**************  delete  conversation  by id ***********************/
    static deleteTicketConversation = async (req, res) => {
        try {
            let { ticketConversation } = await createDB1Manager();
            let deleteConversationData = await ticketConversation.destroy({ where: { id: req.params.id } });
            return res.json(success('conversation deleted Successfully', deleteConversationData, 200))
        }
        catch (err) {
            return res.json(error(err.mesage, 500))
        }
    }
   


}



 


module.exports = { ticketConversationController }