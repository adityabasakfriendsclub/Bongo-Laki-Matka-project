const express = require('express');
const router = express.Router();
const Patti = require('../models/Patti');
const auth = require('../middleware/auth');

// GET patti list (public)
router.get('/', async (req, res) => {
  try {
    let patti = await Patti.findOne();
    if (!patti) {
      // Return default
      patti = {
        headers: ['1','2','3','4','5','6','7','8','9','0'],
        rows: [
          ['100','200','300','400','500','600','700','800','900','000'],
          ['678','345','120','789','456','123','890','567','234','127'],
          ['777','444','111','888','555','222','999','666','333','190'],
          ['560','570','580','590','140','150','160','170','180','280'],
          ['470','480','490','130','230','330','340','350','360','370'],
          ['380','390','670','680','690','240','250','260','270','460'],
          ['290','660','238','248','258','268','278','288','450','550'],
          ['119','129','139','149','159','169','179','189','199','235'],
          ['137','237','337','347','357','367','377','116','117','118'],
          ['23','33','15','15','79','44','46','23','46','57'],
        ]
      };
    }
    res.json(patti);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update patti (admin)
router.put('/', auth, async (req, res) => {
  try {
    let patti = await Patti.findOne();
    if (patti) {
      patti.headers = req.body.headers;
      patti.rows = req.body.rows;
      patti.updatedAt = new Date();
      await patti.save();
    } else {
      patti = new Patti(req.body);
      await patti.save();
    }
    res.json(patti);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
