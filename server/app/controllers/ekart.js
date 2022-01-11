const db = require("../models");
const Tutorial = db.tutorials;
const request = require("request");
// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Tutorial.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all data from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} item were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all items.",
      });
    });
};

// Find all published items
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving items.",
      });
    });
};

exports.getAllCampaign = (req, res) => {
  const options = {
    method: "GET",
    url: "https://testapi.donatekart.com/api/campaign",
    headers: {
      "Content-type": "application/json",
    },
  };
  request(options, function (error, response) {
    if (error)
      res.status(500).send({
        message: error.message || "Unable to get campaign list",
      });
    const responses = JSON.parse(response.body);
    res.send(responses);
  });
};

exports.getCampaign = (req, res) => {
  const options = {
    method: "GET",
    url: "https://testapi.donatekart.com/api/campaign",
    headers: {
      "Content-type": "application/json",
    },
  };
  request(options, function (error, response) {
    if (error)
      res.status(500).send({
        message: error.message || "Unable to get campaign list",
      });
    let responses = JSON.parse(response.body);
    responses = responses.sort(function (a, b) {
      if (a.totalAmount > b.totalAmount) return -1;
      else if (a.totalAmount < b.totalAmount) return 1;
      else return 0;
    });
    const campaignList = responses.map((item) => {
      return {
        title: item.title,
        totalAmount: item.totalAmount,
        backersCount: item.backersCount,
        endDate: item.backersCount,
      };
    });
    res.send(campaignList);
  });
};

exports.getActiveCampaign = (req, res) => {
  const options = {
    method: "GET",
    url: "https://testapi.donatekart.com/api/campaign",
    headers: {
      "Content-type": "application/json",
    },
  };
  request(options, function (error, response) {
    if (error)
      res.status(500).send({
        message: error.message || "Unable to get campaign list",
      });
    const responses = JSON.parse(response.body);
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    const last30DaysDate = new Date(
      currentDate.setDate(currentDate.getDate() - 30)
    );
    const last30DaysDateTime = last30DaysDate.getTime();
    const last30DaysList = responses
      .filter((x) => {
        const elementDateTime = new Date(x.created).getTime();
        if (
          elementDateTime <= currentDateTime &&
          elementDateTime > last30DaysDateTime
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
      });
    const activeCampaign = last30DaysList.filter((x) => {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(x.endDate) >= today) {
        return true;
      }
      return false;
    });
    res.send(activeCampaign);
  });
};

exports.getClosedCampaign = (req, res) => {
  const options = {
    method: "GET",
    url: "https://testapi.donatekart.com/api/campaign",
    headers: {
      "Content-type": "application/json",
    },
  };
  request(options, function (error, response) {
    if (error)
      res.status(500).send({
        message: error.message || "Unable to get campaign list",
      });
    const responses = JSON.parse(response.body);
    const closedCampaign = responses.filter((x) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(x.endDate) <= today || x.totalProcured >= x.totalAmount) {
        return true;
      }
      return false;
    });
    res.send(closedCampaign);
  });
};

exports.getCurrencyList = (req, res) => {
  var options = {
    method: "GET",
    url: "https://v6.exchangerate-api.com/v6/eee282495c81c8f72f5dd34b/latest/INR",
    headers: {},
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send(JSON.parse(response.body));
  });
};
