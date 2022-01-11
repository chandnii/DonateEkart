module.exports = (app) => {
  const ekart = require("../controllers/ekart.js");

  var router = require("express").Router();

  //get all the campaigns list for frotend use
  router.get("/getall", ekart.getAllCampaign);

  // get all the campaign list only appropiate keys
  router.get("/campaignList", ekart.getCampaign);

  // get all active campaign list
  router.get("/activeCampaign", ekart.getActiveCampaign);
  // Create a new Tutorial

  //get all closed campaign list
  router.get("/closedCampaign", ekart.getClosedCampaign);

  //get currency conversion list
  router.get("/getCurrency", ekart.getCurrencyList);

  // Create Tutorial
  router.post("/create", ekart.create);

  // Retrieve all Tutorials
  router.get("/find", ekart.findAll);

  // Retrieve all published Tutorials
  router.get("/published", ekart.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", ekart.findOne);

  // Update a Tutorial with id
  router.put("/:id", ekart.update);

  // Delete a Tutorial with id
  router.delete("/:id", ekart.delete);

  // Create a new Tutorial
  router.delete("/delete", ekart.deleteAll);

  app.use("/api/ekart", router);
};
