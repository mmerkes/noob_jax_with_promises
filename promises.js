function Promise() {
  var self = this;
  this.pending = [];

  this.resolve = function(result) {
    console.log('resolving');
    self.complete('resolve', result);
  },

  this.reject = function(result) {
    console.log('rejecting');
    self.complete('reject', result);
  }
}

Promise.prototype = {
  then: function(success, failure) {
    this.pending.push({ resolve: success, reject: failure });
    return this;
  },

  complete: function(type, result) {
    while (this.pending[0]) {
      console.log(type + ' completing');
      this.pending.shift()[type](result);
    }
  }
};
