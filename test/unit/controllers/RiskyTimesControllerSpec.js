'use strict';

var expect = chai.expect;

describe('RiskyTimesController', function () {
  var EMPTY_STRING = '';
  var RISKY_TIMES = ['such risk', 'much time'];

  var controller, configurationServiceMock,
    localNotificationsMock,
    configurationServiceSaveRiskyTimesSpy,
    localNotificationsScheduleSpy,
    $modalMock,
    $modalOpenSpy,
    $modalInstanceMock,
    $windowMock,
    $windowMomentSpy,
    modalParametersMock;

  beforeEach(module('sis.controllers'));

  beforeEach(module(function ($provide) {
    configurationServiceMock = function () {
      this.saveRiskyTimes = function () {
      };
      this.getRiskyTimes = function () {
        return RISKY_TIMES
      };
      this.getCessationReasons = function () {
        return [{
          description: 'cessation reason description',
          title: 'cessation reason title'
        }];
      };
      configurationServiceSaveRiskyTimesSpy = sinon.spy(this, 'saveRiskyTimes');
    };

    $modalMock = function () {
      this.open = function() {
        return {
          result: {then: function() {}}
        }
      };
      $modalOpenSpy = sinon.spy(this, 'open');
    };

    $modalInstanceMock = function() {
      this.open = function() {};
    };

    $windowMock = function () {
      var empty = function() {};
      var chainedMomentMethods = {
          local: empty,
          day: empty,
          hours: empty,
          minutes: empty,
          toDate: empty
      };
      this.moment = function () {
        return chainedMomentMethods;
      };
      $windowMomentSpy = sinon.spy(this, 'moment');
      sinon.stub(chainedMomentMethods, 'local').returns(chainedMomentMethods);
      sinon.stub(chainedMomentMethods, 'day').returns(chainedMomentMethods);
      sinon.stub(chainedMomentMethods, 'hours').returns(chainedMomentMethods);
      sinon.stub(chainedMomentMethods, 'minutes').returns(chainedMomentMethods);
      sinon.stub(chainedMomentMethods, 'toDate').returns(chainedMomentMethods);
    };

    localNotificationsMock = function () {
      this.schedule = function () {
      };
      this.clear = function () {
      };
      localNotificationsScheduleSpy = sinon.spy(this, 'schedule');
    };

    modalParametersMock = function() {
      this.isModal = true;
      this.instructionContent = '';
    };

    $provide.service('configurationService', configurationServiceMock);
    $provide.service('localNotifications', localNotificationsMock);
    $provide.service('$window', $windowMock);
    $provide.service('$modal', $modalMock);
    $provide.service('$modalInstance', $modalInstanceMock);
    $provide.service('modalParameters', modalParametersMock);
  }));

  beforeEach(module('sis.controllers'));

  beforeEach(inject(function ($controller) {
    controller = $controller('RiskyTimesController');
  }));

  describe('#translateDay', function () {
    it('returns a Sunday value for "su"', function () {
      controller.riskyTime.day = controller.SUNDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Sunday');
    });
    it('returns a Sunday value for "m"', function () {
      controller.riskyTime.day = controller.MONDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Monday');
    });
    it('returns a Sunday value for "tu"', function () {
      controller.riskyTime.day = controller.TUESDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Tuesday');
    });
    it('returns a Sunday value for "w"', function () {
      controller.riskyTime.day = controller.WEDNESDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Wednesday');
    });
    it('returns a Sunday value for "th"', function () {
      controller.riskyTime.day = controller.THURSDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Thursday');
    });
    it('returns a Sunday value for "f"', function () {
      controller.riskyTime.day = controller.FRIDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Friday');
    });
    it('returns a Sunday value for "sa"', function () {
      controller.riskyTime.day = controller.SATURDAY_KEY;
      controller.translateDay();
      expect(controller.riskyTime.day).to.equal('Saturday');
    });
  });

  describe('#saveRiskyTime', function () {
    it('does not reset valid Day and Description when missing Time.', function () {
      controller.riskyTime.day = 'Monday';
      controller.riskyTime.description = 'Some description.';
      controller.saveRiskyTime();
      expect(controller.riskyTimeDay).to.not.equal(EMPTY_STRING);
      expect(controller.riskyTimeDescription).to.not.equal(EMPTY_STRING);
    });
    it('does not reset valid Time and Description when missing Day.', function () {
      controller.riskyTime.time = new Date();
      controller.riskyTime.description = 'Some description.';
      controller.saveRiskyTime();
      expect(controller.riskyTimeTime).to.not.equal(EMPTY_STRING);
      expect(controller.riskyTimeDescription).to.not.equal(EMPTY_STRING);
    });
    it('does not reset valid Day and Time when missing Description.', function () {
      controller.riskyTime.day = 'Monday';
      controller.riskyTime.time = new Date();
      controller.saveRiskyTime();
      expect(controller.riskyTimeDay).to.not.equal(EMPTY_STRING);
      expect(controller.riskyTimeTime).to.not.equal(EMPTY_STRING);
    });

    it('should scrub controller\' riskyTime object, after a successful save.', function () {
      controller.riskyTime.day = 'Monday';
      controller.riskyTime.time = new Date();
      controller.riskyTime.description = 'Some description.';
      controller.saveRiskyTime();
      expect(controller.riskyTime.day).to.equal(undefined);
      expect(controller.riskyTime.time).to.equal(undefined);
      expect(configurationServiceSaveRiskyTimesSpy.calledOnce).to.equal(true);
      expect($windowMomentSpy.calledOnce).to.equal(true);
      expect(localNotificationsScheduleSpy.calledOnce).to.equal(true);
    });
  });

  describe('#randomNotification', function () {
    it('creates a notification specific to strategy when a strategy is set.', function () {
      var STRATEGY = 'fabian';
      var riskyTime = { strategy: STRATEGY };
      var notification = controller.randomNotification(riskyTime);
      expect(notification.title).to.equal('Your strategy');
      expect(notification.text).to.equal(STRATEGY);
    });

    it('creates a notification specific no strategy or cessation\ ' +
      'reason when neither set.', function () {
      var riskyTime = {};
      controller.cessationReasons = null;
      var notification = controller.randomNotification(riskyTime);
      expect(notification.title).to.equal('SiS Reminder');
      expect(notification.text).to.equal('Time to enact one of your smoke-free strategies');
    });
  });

  describe('#buildNotification', function () {
    it('creates a notification specific to cessation reason for notification type 2.', function () {
      var riskyTime = {};
      var notification = controller.buildNotification(controller.NOTIFICATION_TYPE_2, riskyTime);
      expect(notification.title).to.equal('Why you want to be smoke-free');
      expect(notification.text).to.equal('cessation reason description');
    });
  });

  describe('#selectWeekday', function () {
    it('sets the controllers riskyTimeDay and activeButton based on the day given.', function () {
      var someDay = 'Monday';
      controller.selectWeekday(someDay);
      expect(controller.riskyTime.day).to.equal(someDay);
      expect(controller.activeButton).to.equal(someDay);
    });
  });

  describe('#openEditModal', function () {
    it('delegates the opening of the risky time edit modal to the $modal service.', function () {
      controller.openEditModal(null, null, null, null, null, null);
      expect($modalOpenSpy.calledOnce).to.equal(true);
    });
  });
});
