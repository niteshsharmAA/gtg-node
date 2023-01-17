const { createDB1Manager } = require('../models');
const { success, error, validation } = require('../middleware/responseApi');

const { helper } = require('../helper/helper')


class supportTicketController {

//     /**************  Add Ticket ***********************/
    static addTicket = async (req, res) => {
        try {
            let { supportTicket } = await createDB1Manager();
            let ticketAdd = await supportTicket.create(req.body)
            return res.json(success(' ticket raise  successfully', ticketAdd, 200));
        } catch (error) {
            console.log(error);
            return res.send({ status: 500, msg: error });
        }

    }
     /**************  List of  All tickets for Admin ***********************/
    static getAllTickets = async (req, res) => {
        try {
            let { supportTicket } = await createDB1Manager();
            let getTickets = await supportTicket.findAll({ where: req.query })
            return res.json(success(' all supportTicket  get Successfully', getTickets, 200))
        }
        catch (err) {
            return res.json(error(err.mesage, 500))
        }
    }





 /**************  delete All tickets  by id ***********************/
 static deleteTicket = async (req, res) => {
    try {
        let { supportTicket } = await createDB1Manager();
        let deleteTicketData = await supportTicket.destroy({ where: { id: req.params.id } });
        return res.json(success('supportTicket deleted Successfully', deleteTicketData, 200))
    }
    catch (err) {
        return res.json(error(err.mesage, 500))
    }
}

 /**************  Update  ticket  by id ***********************/
 static updateTicket = async (req, res) => {
    try {
        let { supportTicket } = await createDB1Manager();
        let updatetTicketData = await supportTicket.update(req.body, { where: { id: req.params.id } });
        return res.json(success('TicketData updated Successfully', updatetTicketData, 200))
    } catch (error) {
        return res.send({ status: 500, msg: error });
    }

}




}



module.exports = { supportTicketController }