var express = require("express");
var got = require("got");
var uuid = require("uuid").v4;

var router = express.Router();

var secretKey = "test_sk_ODnyRpQWGrNDPNyq1gL3Kwv1M9EN";

router.get("/", function (req, res) {
  res.render("index", {
    title: "Jordan 1",
    orderId: uuid(),
    orderName: "Jordan",
    price: 50000,
    customerName: "Lucas",
    customerKey: uuid(),
  });
});

router.get("/success", function (req, res) {
  got
    .post("https://api.tosspayments.com/v1/payments/" + req.query.paymentKey, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(secretKey + ":").toString("base64"),
        "Content-Type": "application/json",
      },
      json: {
        orderId: req.query.orderId,
        amount: req.query.amount,
      },
      responseType: "json",
    })
    .then(function (response) {
      console.log(response.body);
      // TODO: 구매 완료 비즈니스 로직 구현

      res.render("success", {
        title: "성공적으로 구매했습니다",
        amount: response.body.totalAmount,
      });
    })
    .catch(function (error) {
      res.redirect(
        `/fail?code=${error.response?.body?.code}&message=${error.response?.body?.message}`
      );
    });
});

router.get("/fail", function (req, res) {
  res.render("fail", {
    message: req.query.message,
    code: req.query.code,
  });
});

module.exports = router;
