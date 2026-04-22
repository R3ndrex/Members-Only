const membershipController = require("../controllers/membershipController");
const Route = require("express");

const membershipRoute = Route();
membershipRoute.get("/", membershipController.getMembershipFormPage);
membershipRoute.post("/get-access", membershipController.getMembership);
module.exports = membershipRoute;
