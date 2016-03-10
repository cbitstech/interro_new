require "rubygems"
require "appium_lib"
require "rspec"

caps_file = File.join(File.dirname(__FILE__), "appium.txt")
caps = Appium.load_appium_txt(file: caps_file)

RSpec.describe "Session 1 content" do
  driver = nil
  before(:all) do
    driver = Appium::Driver.new(caps).start_driver
    Appium.promote_appium_methods RSpec::Core::ExampleGroup
  end

  after(:all) do
    driver_quit
  end

  describe "upon initial load of the application" do
    it "the first session is available" do
      wait do
        find("Begin")
      end
      expect(driver.page_source).to include("Click the button to begin...")
    end
  end

  describe "when schedule your quit day is selected" do
    it "the date selection element is displayed" do
      button("Begin").click
      find("Click here to schedule your quit day").click
      find("Set")
    end
  end

  describe "when a quit date is entered" do
    it "the cessation date is displayed" do
      find("Set").click
      find("Cessation date scheduled for: #{Date.today.strftime('%m/%d/%Y')}")
      button("Continue").click
    end
  end

  describe "when add risky times is selected"  do
    it "the risky times set up modal is displayed" do
      find("Click here to add times in which you may have difficulty resisting the urge to smoke").click
      find("Add risky times below.")
    end
  end
end
