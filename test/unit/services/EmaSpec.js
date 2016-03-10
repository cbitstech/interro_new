'use strict';

var expect = chai.expect;

describe('Ema', function () {
  var emaService,
      emaCacheMock,
      emaCachePersistSpy,
      emaAnswerServiceMock;

  var today = moment().format('YYYY-MM-DD');
  var morningEmaId = 1;
  var eveningEmaId = 2;

  beforeEach(module('sis.services'));

  beforeEach(module(function ($provide) {
    emaCacheMock = function () {
      this.persist = function () {
      };
      this.fetchAllRaw = function() {
        return [
                 { 'assessmentDate': moment().hours(4),
                   'assessmentType': 'evening', id: eveningEmaId },
                 { 'assessmentDate': moment().hours(10),
                   'assessmentType': 'morning', id: morningEmaId }
               ];
      };
      emaCachePersistSpy = sinon.spy(this, 'persist');
    };

    emaAnswerServiceMock = function() {
      this.saveEmaAnswers = function() {};
    };

    $provide.service('emaCache', emaCacheMock);
    $provide.service('emaAnswerService', emaAnswerServiceMock);
  }));

  beforeEach(inject(function (_emaService_) {
    emaService = _emaService_;
  }));

  describe('#saveEma', function () {
    it('should use the cache to persist an ema question and answer pair.', function () {
      emaService.saveEma(
        {'date': today, 'description': 'some description'}
      );
      expect(emaCachePersistSpy.calledOnce).to.equal(true);
    });
  });

  describe('#saveEveningEma', function () {
    it('should add the evening type to saved ema questions.', function () {
      emaService.saveEveningEma({'date': today, 'description': 'some description'});
      expect(emaCachePersistSpy.calledOnce).to.equal(true);
      expect(emaCachePersistSpy.args[0][0].assessmentType).to.equal('evening');
    });
  });

  describe('#saveMorningEma', function () {
    it('should add the morning type to saved ema questions..', function () {
      emaService.saveMorningEma({'date': today, 'description': 'some description'});
      expect(emaCachePersistSpy.calledOnce).to.equal(true);
      expect(emaCachePersistSpy.args[0][0].assessmentType).to.equal('morning');
    });
  });

  describe('#getTodaysMorningEma', function () {
    it('should retrieve the morning ema for today, if it exists.', function () {
      var ema = emaService.getTodaysMorningEma();
      expect(ema.id).to.equal(morningEmaId);
    });
  });

  describe('#getTodaysEveningEma', function () {
    it('should retrieve the evening ema for today, if it exists.', function () {
      var ema = emaService.getTodaysEveningEma();
      expect(ema.id).to.equal(eveningEmaId);
    });
  });

  describe('#isMorningPeriod', function () {
    it('should return true if time passed in is within params of morning time.', function () {
      expect(emaService.isMorningPeriod(moment().hours(10))).to.equal(true);
    });
    it('should return false if time passed in is not within params of morning time.', function () {
      expect(emaService.isMorningPeriod(moment().hours(20))).to.equal(false);
    });
  });

  describe('#isEveningPeriod', function () {
    it('should return true if time passed in is within params of evening time.', function () {
      expect(emaService.isEveningPeriod(moment().hours(20))).to.equal(true);
    });
    it('should return false if time passed in is not within params of evening time.', function () {
      expect(emaService.isEveningPeriod(moment().hours(10))).to.equal(false);
    });
  });
});
