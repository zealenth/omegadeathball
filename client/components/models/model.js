'use strict';
var module = angular.module( 'urfApp.models' );

module.factory( 'Model', [ '$rootScope', function( $rootScope ) {
  function Model( settings ) {
    this.model = {};
    this.modelCache = {};
    this.url = settings.url;
    this.status = 'new';

    if( settings.model ) {
      this.model = settings.model;
      _.extend( this, settings.model );
    }
    return this;
  }

  Model.prototype.fetch = function( params ) {
    this.status = 'pending_fetch';
    var self = this;
    var url = this._constructUrl( params );
    return $.ajax( { url: url, type: 'GET' } ).then ( function( resp ) {
      if( !_.isObject( resp ) ) {
        resp = JSON.parse( resp );
      }
      _.extend( self.model, resp );
      _.extend( self, resp );  //for collections
      self.status = 'fetched';
      if( !$rootScope.$$phase ) {
        $rootScope.$digest();
      }
    } );
  };

  Model.prototype.save = function() {
    var url = this._constructUrl();
    var self = this;
    this.status='pending_save';
    var type = this.status === 'new' ? 'PUT' : 'POST';
    return $.ajax( { url: url,
      type: type,
      contentType: 'application/json',
      data: JSON.stringify( self.model )
    } ).then( function( resp ) {
      //we'll want to reset our object with any values from the server
      if( !_.isObject( resp ) ) {
        resp = JSON.parse( resp );
      }
      _.extend( self.model, resp );
      _.extend( self, resp ); //welp, let not name fields save or fetch in our model.  I want to use it
                              //like this in collections without binding a model property.
      self.status = 'fetched';
      if( !$rootScope.$$phase ) {
        $rootScope.$digest();
      }
    } );
  };

  Model.prototype._constructUrl = function( params ) {
    var url = this.url;

    if( _.isObject( params ) && Object.keys( params ).length ) {
      if( params._id ) {
        url += '/' + encodeURIComponent( params._id );
      }
      url += '?';
      _.each( params, function( val, key ) {
        url += encodeURIComponent( key ) + '=' + encodeURIComponent( val );
      } );
    }
    return url;
  };

  return Model;

} ] );
module.factory( 'Collection', [ 'Model', '$rootScope', function( Model, $rootScope ) {
  var Collection = function( settings ) {
    this.models = [];
    this.url = settings.url;
    return this;
  };

  Collection.prototype.fetch = function( params ) {
    var self = this;
    var url = this.url;

    if( _.isObject( params ) ) {
      url += '?';
      _.each( params, function( val, key ) {
        url += encodeURIComponent( key ) + '=' + encodeURIComponent( val );
      } );
    }
    return $.ajax( { url: url, type: 'GET' } ).then( function( resp ) {
      //do we want to reset or check before we add models?
      // self.models.length = 0;
      if( !_.isArray( resp ) && !_.isObject( resp ) ) {
        resp = JSON.parse( resp );
      }
      if( !_.isArray( resp ) && _.isObject( resp ) ) {
        self.addModel( resp );
      }
      else {
        _.each( resp, function( elem ) {
          self.addModel( elem );
        } );
      }
      //should switch to $http so we don't have to do digest cycle hacks
      if( !$rootScope.$$phase ) {
        $rootScope.$digest();
      }
    } );
  };

  Collection.prototype.addModel = function( resp ) {
    if( !_.find( this.models, resp ) ) {
      this.models.push( new Model( { url: this.url, model: resp } ) );
    }

  };

  return Collection;
} ] );
