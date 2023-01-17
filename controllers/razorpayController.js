const { createDB1Manager } = require('../models');
const { helper } = require('../helper/helper')
const { success, error, validation } = require('../middleware/responseApi');
var Razorpay = require("razorpay");
var crypto = require("crypto");
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});



class razorpayTransaction {



    static makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    /************** create order ***********************/
    static createOrder = async (req, res) => {
        try {
            // var options = {
            //     amount: 50000,  // amount in the smallest currency unit
            //     currency: "INR",
            //     receipt: "order_rcptid_11"
            // };
            const { razorpaypayment }= await createDB1Manager();
            var options = req.body;
            options['receipt'] = `bitgtg_order_rcptid_${this.makeid(10)}`;
            instance.orders.create(options, (err, order) => {
                if (err) {
                    return res.json(error(err.mesage, 500))
                }
                order['notes'] = "";
                order['payment_id'] = "";
                order['signature'] = "";
                order['status'] = "pending";
                order['message'] = ''
                razorpaypayment.create(order).then((newOrder) => {
                    return res.json(success("New order created", order, 200));
                }).catch(err => {
                    console.log(err)
                    return res.json(error(err.mesage, 500))
                })
            })
        }
        catch (err) {
            console.log(err)
            return res.json(error(err.mesage, 500))
        }
    }

    /************** checkout order ***********************/
    static checkoutOrder = async (req, res) => {
        try {
            const { razorpaypayment }= await createDB1Manager();
            var order_id = req.body.razorpay_order_id;
            var payment_id = req.body.razorpay_payment_id;
            var signature = req.body.razorpay_signature;

            var gen_sign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(order_id + "|" + payment_id).digest('hex');

            razorpaypayment.findById(order_id).then(async(order_details) => {
                order_details = JSON.parse(JSON.stringify(order_details))
                if (gen_sign === signature) {
                    order_details.status = "confirmed";
                    order_details.message = "Paid And Confirmed";
                    order_details.payment_id = payment_id;
                    order_details.signature = signature;
                }
                else if(req.body.status === 'failed') {
                    order_details.status = req.body.status;
                    order_details.message = "Payment Failure"
                }
                else {
                    order_details.status = "paid";
                    order_details.message = "Paid And Not Confirmed";
                    order_details.payment_id = payment_id;
                    order_details.signature = signature;
                }
                await razorpaypayment.update(order_details, { where: {id: order_id} });
                return res.json(success("Payment status updated", order_details, 200))
            }).catch(err => {
                console.log(err)
                return res.json(error(err.mesage, 500))
            })
        }
        catch (err) {
            return res.json(error(err.mesage, 500))
        }
    }
}


module.exports = {
    razorpayTransaction,
}  