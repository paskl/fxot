'use strict';
module.exports = function(app) {
  var test = require('../controllers/controllertest');

  // todoList Routes
  app.route('/test')
    .get(test.test_get)
    .post(test.test_post);


  app.route('/test/:taskId')
    .get(test.test_get_id);
    // .put(test.update_a_task)
    // .delete(test.delete_a_task);
};
