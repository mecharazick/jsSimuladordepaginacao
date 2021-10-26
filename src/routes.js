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
    const delta = tableType === "wsm" ? ramSize : false;
    const memoryManagmentUnit = new MMU({
      ramSize: Number(ramSize),
      pagesSize: 10,
      delta: delta,
    });
    const { pageHits, pageFaults } = await memoryManagmentUnit[tableType](
      pageQ
    );
    res.render("tables", {
      tableType: tableTypeText(tableType),
      delta: delta,
      ramSize: ramSize,
      pageQ: pageQ,
      pageHits: pageHits,
      pageFaults: pageFaults,
    });

    function tableTypeText(tableType) {
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
    }
  });

module.exports = router;
