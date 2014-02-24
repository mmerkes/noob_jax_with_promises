
var Jax = {};

Jax.get = function( url, success, failure ) {
  var request = new XMLHttpRequest(),
      p = new Promise();

  request.open( 'GET', url );

  request.onreadystatechange = function() {
    // Check to see if the ready state is 4 -> DONE
    if( request.readyState === 4 ) {
      // If request was successful
      if( request.status === 200 ) {
        var type = request.getResponseHeader("Content-Type");
        // Make sure that the content is text
        if( type.match(/^text/)) {
          if( success ) {
            success( request.responseText );
          }
          p.resolve();
        }
      }
      // Otherwise, there was a failure, and the failure callback
      // should be called.
      else {
        if( failure ) {
          failure();
        }
        p.reject();
      }
    }
  }

  request.send(null);

  return p;
}

// Core promise code from: http://dailyjs.com/2011/06/09/framework-66/
function Promise() {
  var self = this;
  this.pending = [];

  this.resolve = function(result) {
    self.complete('resolve', result);
  },

  this.reject = function(result) {
    self.complete('reject', result);
  }
}

Promise.prototype = {
  then: function(success, failure, always) {


    this.pending.push({ resolve: success, reject: failure, always: always });
    return this;
  },

  complete: function(type, result) {
    var set;
    while (this.pending[0]) {
      set = this.pending.shift()
      if( set[type] ) {
        set[type](result);
      }
      if( set['always'] ) {
        set['always'](result);
      }
    }
  },

  success: function( callback ) {
    this.pending.push({ resolve: callback });
    return this;
  },

  failure: function( callback ) {
    this.pending.push({ failure: callback });
    return this;
  },

  always: function( callback ) {
    this.pending.push({ always: callback });
    return this;
  }
};







