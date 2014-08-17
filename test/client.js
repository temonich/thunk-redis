'use strict';
/*global describe, it, before, after, beforeEach, afterEach*/

var should = require('should');
var redis = require('../index');

module.exports = function () {
  describe('createClient', function () {
    var time = '' + Date.now();

    it('redis.createClient()', function (done) {
      var connect = false,
        client = redis.createClient();

      client.on('connect', function () {
        connect = true;
      });
      client.info()(function (error, res) {
        should(error).be.equal(null);
        should(connect).be.equal(true);
        should(res.redis_version).be.type('string');
        return this.select(1);
      })(function (error, res) {
        should(error).be.equal(null);
        should(res).be.equal('OK');
        return this.set('test', time);
      })(function (error, res) {
        should(error).be.equal(null);
        should(res).be.equal('OK');
        this.end();
      })(done);
    });

    it('redis.createClient(options)', function (done) {
      var client = redis.createClient({database: 1});

      client.get('test')(function (error, res) {
        should(error).be.equal(null);
        should(res).be.equal(time);
        this.end();
      })(done);
    });

    it('redis.createClient(port, options)', function (done) {
      var client = redis.createClient(6379, {database: 1});

      client.get('test')(function (error, res) {
        should(error).be.equal(null);
        should(res).be.equal(time);
        this.end();
      })(done);
    });

    it('redis.createClient(port, host, options)', function (done) {
      var client = redis.createClient(6379, 'localhost', {database: 1});

      client.get('test')(function (error, res) {
        should(error).be.equal(null);
        should(res).be.equal(time);
        this.end();
      })(done);
    });
  });
};