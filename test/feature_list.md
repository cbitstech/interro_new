# Feature List

This is a list of feature tests for the application. These will need to be
updated as features and tests are added / changed.

* Participant should be able to set quit date
* Participant should be able to specify reasons for stopping smoking
* Participant should be able to set Risky Times
* Participant should not be able to move from the configuration screen until
  the quit date has been set, at least one reason has been specified, and at
  least one risky time has been set
* Participant should be able to return to the configuration page and update
  quit date
* Participant should be able to return to the configuration page and add /
  delete reasons for stopping smoking
* If the participant has not completed Session 2, they should be able to return
  to the configuration page and add / delete risky times
* If the participant has completed Session 2, they should be able to return to
  the configuration page and add, delete, or update risky times. Update to
  risky times includes add a strategy.
* Participant should see the number of days until their quit day at the top of
  the home page
* The number of days until quit should decrement daily until their quit day
* The number of days until quit day should say “It’s quitting day!” on the quit
  day
* Participant should see the number of days since quit day at the top of the
  home page
* The number of days since quit day should increment daily
* Participant should be able to access Session 1
* If it is prior to their quit day, the participant should only be able to
  access Session 1
* If it is on or after their quit day and before 7 days after their quit day,
  the participant should be able to access Session 2
* If it is on or after their quit day and before 7 days after their quit day,
  the participant should only be able to access Session 1 and Session 2
* If it is 7+ days after their quit day, the participant should be able to
  access all sessions
* When a participant accesses Session 1, the branching logic should take them
  correctly through the questions until they complete the session. (this will
  be repeated to test the necessary functionality)
* When a participant accesses Session 2, the branching logic should take them
  correctly through the questions until they complete the session. (this will
  be repeated to test the necessary functionality)
* When a participant accesses Session 3, the branching logic should take them
  correctly through the questions until they complete the session. (this will
  be repeated to test the necessary functionality)
* After a participant completes Session 1, there should be a check mark next to
  it indicating it is complete
* After a participant completes Session 2, there should be a check mark next to
  it indicating it is complete
* After a participant completes Session 3, there should be a check mark next to
  it indicating it is complete
* Each day the participant should receive a random Happiness Exercise to
  complete
* When a participant completes a Happiness Exercise the home page should
  reflect this with the message “complete” (start with only adding one repeat
  and repeat to check all; repeat for different exercises)
* If it is prior to the participant’s quit day, the Smoking Status at the
  bottom of the home page should say “I’m preparing for my quit day”
* If it is on the participant’s quit day, the Smoking Status at the bottom of
  the home page should say “Today is my quit day”
* It it after the participant’s quit day, the Smoking Status at the bottom of
  the home page should say “I’m no longer smoking”
* Participant should be able to update their Smoking Status (repeat as needed)
* Participant should be able to enter a Cigarette Log by selecting “I’m smoking
  now….” A Cigarette Log includes choosing a reason for smoking and how strong
  the urge was (repeat as needed)
* Participant should be able to enter a Cigarette Log by selecting “I forgot
  to add a cigarette…” A Cigarette Log includes choosing a reason for smoking
  and how strong the urge was (repeat as needed)
* Participant should be able to complete a Temptation Log. A Temptation Log
  includes choosing a reason and how strong the urge is (repeat as needed)
* Participant should be notified to complete the Morning EMA at 9 am
* Participant should be notified to complete the Evening EMA at 7 pm
* If it is between the times of 9 am and 7 pm and the participant has not
  completed the Morning EMA, they should be required to complete the Morning
  EMA upon entering the app. (repeat with the opposite condition)
* If it is between the times of 7 pm and 1 am and the participant has not
  completed the Evening EMA, they should be required to complete the Evening
  EMA upon entering the app. (repeat with the opposite condition)
* If participant does not have a reason for stopping smoking, at the time of a
  risky time the participant should receive a notification that says, “SiS
  Reminder: Time to enact one of your smoke-free strategies!”
* If a participant does not have a strategy attached to a risky time, at the
  time of a risky time the participant should receive a notification that is
  randomly selected between the first notification and the second which says,
  “Why you want to be smoke-free:” with the first 100 characters of a randomly
  selected participant-entered reason for stopping smoking.
* If a participant does have a strategy attached to a risky time, at the time
  of the risky time the participant should receive a notification that says,
  “Your strategy:” with the participant-selected strategy attached to that
  risky time.
* The application opens to the configuration screen if the configuration is incomplete upon the press of a risky time notification. 
* The application opens to the motivation page (the screen that begins with "Challenging Time Reminder") on click of notification type 1 if the configuration is complete.
* When the second or third notification is selected the application opens to
  the “Challenging Time Reminder” screen.
* If the participant has a reason for stopping smoking, the “Challenging Time
  Reminder” should display one of these at random.
* If the participant has a strategy attached to a risky time, the “Challenging
  Time Reminder” should display this strategy.
* Participant should be able to edit the reminder by selecting “Edit” and being
  taken to the “Risky Times” screen.
* Participant should be able to close the “Challenging Time Reminder” by
  selecting “Ok”.

Not captured:

* Data storage and transmission.
