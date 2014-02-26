/*
  Thanks to David Flanagan for writing JavaScript: The Definitive Guide
  which has helped guide my AJAX implementation and some of the code
  came from his book.
*/

var Jax = {};

// GET request implementation
Jax.get = function( url, success, failure ) {
  var request = new XMLHttpRequest(),
      p = promisify( success, failure );

  request.open( 'GET', url );

  request.onreadystatechange = function() {
    // Check to see if the ready state is 4 -> DONE
    if( request.readyState === 4 ) {
      console.log( request.status );
      // If request was successful
      if( request.status === 200 ) {
        var type = request.getResponseHeader("Content-Type"),
            data;

        // Check if the server sent back JSON
        if ( type === 'application/json' ) {
          data = JSON.parse( request.responseText );
        }  
        // Check if the server sent XML
        else if( type.indexOf('xml') !== -1 && request.responseXML ) {
          data = request.responseXML;
        } 
        // Otherwise, just grab the response text
        else {
          data = request.responseText;
        }

        // Process any resolve callbacks in promise
        p.resolve( data );
      }
      // Otherwise, there was a failure, and the failure callback
      // should be called.
      else {
        // Process any reject callbacks in our promise
        p.reject();
      }
    }
  }

  request.send(null);

  return p;
};

// POST implementation
Jax.post = function( url, data, success, failure ) {
  var request = new XMLHttpRequest(),
      p = promisify( success, failure );

  // Open the HTTP request to the url
  request.open( 'POST', url );

  // Set the request header to JSON
  request.setRequestHeader("Content-Type", "application/json");

  // Listen for a state change
  request.onreadystatechange = function() {
    // If the request has completed
    if( request.readyState === 4 ) {
      // If it was successefull
      if( request.status === 200 ) {
        // Process any resolve callbacks in promise
        p.resolve( data );
      }
      // If the request failed
      else {
        //  Process any reject callbacks in our promise
        p.reject();
      }
    }
  }

  request.send( JSON.stringify( data ) );

  return p;
};

// Helper function that takes a success and failure callback, and returns
// a promise with those added to the queue.
function promisify( success, failure ) {
  // Create a new instance of promise
  var p = new Promise();

  // If a success callback was provided
  if( success ) {
    // add success to the promise
    p.success( success );
  }
  // If a failure callback was provided
  if( failure ) {
    // add failure to the promise
    p.failure( failure );
  }

  // return the promise
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
    this.pending.push({ reject: callback });
    return this;
  },

  always: function( callback ) {
    this.pending.push({ always: callback });
    return this;
  }
};


/*
  Basic GET test string
  Jax.get( 'api', function( data ) {
    console.log( data );
  }, function() {
    console.log( 'Nice try bucko!' )
  }).then( function() {
    console.log( 'I will only love you when you succeed');
  }, function() {
    console.log( 'Your mother will love you in failure' );
  }, function() {
    console.log( 'Your dog will love you always');
  }).success( function() {
    console.log( 'Yay, success!' );
  }).failure( function() {
    console.log( 'Boo, failure...' );
  }).always( function() {
    console.log( 'Always!!!!');
  });

  Basic POST test string
  Jax.post( 'api', { name: 'Matt', age: 30 }, function( data ) {
    console.log( data );
  }, function() {
    console.log( 'Such a failure...' );
  }).then( function() {
    console.log( 'I will only love you when you succeed');
  }, function() {
    console.log( 'Your mother will love you in failure' );
  }, function() {
    console.log( 'Your dog will love you always');
  }).success( function() {
    console.log( 'Yay, success!' );
  }).failure( function() {
    console.log( 'Boo, failure...' );
  }).always( function() {
    console.log( 'Always!!!!');
  });
*/








