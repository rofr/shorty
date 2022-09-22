var express = require('express');
var router = express.Router();
var debug = require('debug')('vanilla-express:index');

var db = require('../db')

const wrap = fn => (...args) => fn(...args).catch(args[2])

/* GET home page. */
router.get('/', wrap(async (req, res, next) => {
  let items = await db.find('');
  res.render('index', { title: 'Shorty', items });
}));

router.get('/:alias', wrap(async(req,res) => {
  let alias = req.params.alias
  let result = await db.click(alias)
  if (result)res.redirect(result)
  else res.sendStatus(404)
}))

router.post('/', wrap(async (req,res) =>{
  let body = req.body;
  debug(body)
  let wasAdded = await db.add(body.alias, body.url)
  if (wasAdded) res.sendStatus(200)
  else return res.status(400).send('Alias not available')
}))

module.exports = router;
