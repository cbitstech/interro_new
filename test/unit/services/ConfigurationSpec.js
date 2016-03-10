'use strict';

var expect = chai.expect;

describe('Configuration', function() {
  beforeEach(module('sis.services'));

  var service,
      configurationCacheMock,
      cessationDateServiceMock,
      cessationDateServiceSaveSpy,
      cessationDateServiceGetCessationDateSpy,
      cessationReasonServiceMock,
      cessationReasonServiceGetCessationReasonsSpy,
      riskyTimeServiceMock,
      riskyTimeServiceGetRiskyTimesSpy,
      socialSupportServiceMock,
      socialSupportServiceGetSocialSupportsSpy,
      localNotificationsMock,
      localNotificationsScheduleSpy;

  beforeEach(module(function ($provide) {
    localNotificationsMock = {
      schedule: function() {}
    };

    localNotificationsScheduleSpy = sinon.spy(localNotificationsMock, 'schedule');

    configurationCacheMock = {
      persist: function () {},
      destroyAll: function () {},
      first: function () {}
    };

    cessationDateServiceMock = {
      save: function () {},
      getCessationDate: function () {}
    };

    cessationDateServiceSaveSpy = sinon.spy(cessationDateServiceMock, 'save');
    cessationDateServiceGetCessationDateSpy =
      sinon.spy(cessationDateServiceMock, 'getCessationDate');

    cessationReasonServiceMock = {
      save: function () {},
      getCessationReasons: function () {}
    };

    cessationReasonServiceGetCessationReasonsSpy =
      sinon.spy(cessationReasonServiceMock, 'getCessationReasons');

    riskyTimeServiceMock = {
      save: function () {},
      getRiskyTimes: function () {}
    };

    riskyTimeServiceGetRiskyTimesSpy = sinon.spy(riskyTimeServiceMock, 'getRiskyTimes');

    socialSupportServiceMock = {
      save: function () {},
      getSocialSupports: function () {}
    };

    socialSupportServiceGetSocialSupportsSpy =
      sinon.spy(socialSupportServiceMock, 'getSocialSupports');

    $provide.constant('configurationCache', configurationCacheMock);
    $provide.constant('cessationDateService', cessationDateServiceMock);
    $provide.constant('cessationReasonService', cessationReasonServiceMock);
    $provide.constant('riskyTimeService', riskyTimeServiceMock);
    $provide.constant('socialSupportService', socialSupportServiceMock);
    $provide.constant('localNotifications', localNotificationsMock);
  }));

  beforeEach(inject(function(_configurationService_) {
    service = _configurationService_;
  }));

  describe('#scheduleNotifications', function() {
    it('schedules notifications if configuration is complete.', function() {
      cessationDateServiceMock.getCessationDate = function() { return '2015-01-01' };
      cessationReasonServiceMock.getCessationReasons = function() { return ['reason'] };
      riskyTimeServiceMock.getRiskyTimes = function() { return ['riskyTime'] };
      socialSupportServiceMock.getSocialSupports = function() { return ['support'] };

      service.saveCessationDate(new Date());
      expect(localNotificationsScheduleSpy.calledOnce).to.equal(true);
    });

    it('does not schedule notification if configuration is incomplete.', function() {
      service.saveCessationDate(new Date());
      expect(localNotificationsScheduleSpy.calledOnce).to.equal(false);
    });
  });

  describe('#saveCessationDate', function() {
    it('delegates the cessation date saving to the cessation date service.', function() {
      service.saveCessationDate(new Date());
      expect(cessationDateServiceSaveSpy.calledOnce).to.equal(true);
    });
  });

  describe('#getCessationDate', function() {
    it('delegates request to cessation date service.', function() {
      service.getCessationDate();
      expect(cessationDateServiceGetCessationDateSpy.calledOnce).to.equal(true);
    });
    it('returns a null value when no cessation date is found.', function() {
      expect(service.getCessationDate()).to.equal(null);
    });
  });

  describe('#getCessationReasons', function() {
    it('delegates request to cessation reason service.', function() {
      service.getCessationReasons();
      expect(cessationReasonServiceGetCessationReasonsSpy.calledOnce).to.equal(true);
    });
    it('returns an empty array when no cessation reasons are found.', function() {
      expect(service.getCessationReasons().length).to.equal(0);
    });
  });

  describe('#getRiskyTimes', function() {
    it('delegates request to risky times service.', function() {
      service.getRiskyTimes();
      expect(riskyTimeServiceGetRiskyTimesSpy.calledOnce).to.equal(true);
    });
    it('returns an empty array when no risky times are found.', function() {
      expect(service.getRiskyTimes().length).to.equal(0);
    });
  });

  describe('#getRiskyTimesByNotificationId', function() {
    it('locates and returns risky time by notification id.', function() {
      var notificationId = '12345';
      var riskyTimes = [{ 'notificationId': notificationId }];
      riskyTimeServiceMock.getRiskyTimes = function() {
        return riskyTimes;
      };
      expect((service.getRiskyTimesByNotificationId(notificationId)).notificationId).
        to.equal(notificationId);
    });
  });

  describe('#getSocialSupport', function() {
    it('delegates request to social support service.', function() {
      service.getSocialSupport();
      expect(socialSupportServiceGetSocialSupportsSpy.calledOnce).to.equal(true);
    });
    it('returns an empty array when no social supports are found.', function() {
      expect(service.getSocialSupport().length).to.equal(0);
    });
  });

});
