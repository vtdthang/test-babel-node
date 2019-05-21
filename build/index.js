"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.get('/', function (req, res) {
  res.status(200).json({
    message: 'Welcome to Node.js & Express'
  });
});
app.listen(process.env.PORT || 3000, function () {
  return console.log("Listening to port 3000");
});
//# sourceMappingURL=index.js.map