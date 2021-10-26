const express = require("express");
const router = express.Router();
const MMU = require("./MMU");
const { genRandomPageRequestQueue } = require("./utils/common");

router
  .route("/")
  .get((req, res, next) => {
    res.render("index");
  })
  .post(async (req, res, next) => {
    const { tableType, ramSize, pageQSize } = req.body;
    const pageQ = genRandomPageRequestQueue(Number(pageQSize));
    const memoryManagmentUnit = new MMU({
      ramSize: Number(ramSize),
      pagesSize: 10,
    });
    const { pageHits, pageFaults } = await memoryManagmentUnit[tableType](
      pageQ
    );
    const tableTypeText = (tableType) => {
      switch (tableType) {
        case "fifo":
          return "First-in First-out";
        case "lru":
          return "Least Recently Used";
        case "sc":
          return "Second Chance";
        case "otm":
          return "Ótimo";
        case "wsm":
          return "Working-set Model";

        default:
          break;
      }
    };
    res.render("tables", {
      tableType: tableTypeText(tableType),
      ramSize: ramSize,
      pageQ: pageQ,
      pageHits: pageHits,
      pageFaults: pageFaults,
    });
  });

module.exports = router;