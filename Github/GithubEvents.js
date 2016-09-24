const { EventEmitter } = require('events');
const Log = require('../lib/Logger').Logger;
const GithubApi = require('github');

const Issues = require('./Issues');
const IssueComment = require('./IssueComment');
const Push = require('./Push');
const PullRequest = require('./PullRequest');
const Branch = require('./Branch');
const Release = require('./Release');
const Fork = require('./Fork');
const Watch = require('./Watch');

class GithubEvents {
  constructor() {
    this._events = new EventEmitter();
    this.github = new GithubApi({
      protocol: 'https',
      timeout: 5000
    });

    this.github.authenticate({
      type: "oauth",
      token: process.env.GITHUB_TOKEN
    });

    this._latestEvents = [];

    this.Issues = this.Issues.bind(this);
    this.IssueComment = this.IssueComment.bind(this);
    this.Fork = this.Fork.bind(this);
    this.PullRequest = this.PullRequest.bind(this);
    this.Push = this.Push.bind(this);
    this.Watch = this.Watch.bind(this);
    this.Release = this.Release.bind(this);
    this.Branch = this.Branch.bind(this);
  }

  on(e, cb) {
    this._events.on(e, cb);
  }

  emit(e, data) {
    this._events.emit(e, data);
  }

  Event(e, cb) {
    this._events.on(e, cb);
  }

  Issues(payload) {
    const events = this._events;
    events.emit(`issues`, Issues(payload));
  }

  IssueComment(payload) {
    const events = this._events;
    events.emit(`issueComment`, IssueComment(payload));
  }

  Fork(payload) {
    const events = this._events;
    events.emit('fork', Fork(payload));
  }

  PullRequest(payload) {
    const events = this._events;
    events.emit(`pr`, PullRequest(payload));
  }

  Push(payload) {
    const events = this._events;
    events.emit(`push`, Push(payload));
  }

  Watch(payload) {
    const events = this._events;
    events.emit(`watch`, Watch(payload));
  }

  Release(payload) {
    const events = this._events;
    events.emit(`release`, Release(payload));
  }

  Branch(action, payload) {
    const events = this._events;
    events.emit('branch', Branch(action, payload))
  }

  events() {
    return this._latestEvents;
  }
}

module.exports = new GithubEvents();
