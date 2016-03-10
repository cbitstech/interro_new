# SiS

## Getting Started

### Install Dependencies

Add node modules:

```
npm install
```

configure api endpoint (this step must be completed before adding a platform)

```
npm_config_env=test npm_config_server=http://127.0.0.1:3000 npm run set_endpoint
```

Create the necessary directories and files for a Cordova project:

```
npm run build:prepare
```

## Platforms

### Android

#### Running project in an emulator

Configure Emulator

```
android
```

Create an AVD (Android Virtual Device) via **Tools** > **Manage AVDs...**. This
AVD will be used in your testing suite.

Add platform:

```
npm run android:add_platform
```

Run the project on the simulator (prepare, compile and install):

```
npm run android:simulator
```

#### Installing apk on Android Device

Install apk on Device (to do this you will need to connect the device to your
computer and enable developer options see [Android Developer Options](https://github.com/cbitstech/guides/tools/android/developer_options))

If you haven't yet added Android platform:

```
npm run android:add_platform
```

Build and install on connected device:

```
npm run android:simulator
```

### Browser

Add platform:

```
npm run browser:add_platform
```

Run the project on the simulator (prepare, compile and install):

```
npm run browser:simulator
```

## Building an apk (without installing it or running it)

You can build all platforms (andorid and browser) at once:

```
npm run build:all
```

Or build for each platform separately.

Browser:

```
npm run browser:build
```

Android:

```
npm run android:build
```

## Developing

Serve locally for the web:

```
npm run serve
```

## Testing

### Unit testing

Test the sis_app unit test suite with the following command:

```
npm run test
```

### Appium feature testing

Test the Android feature set using Appium.

1. Ensure that the '/test/features/appium.txt' file configuration matches your local environment settings.
2. Ensure any mobile phones are detached from your computer, then start up you local emulator: ```emulator -avd <emulator name>```
3. Finally, run the appium tests using NPM in the following way: ```npm run test:android_features```

## Travis CI

The Travis configuration file, .travis.yml, will cause Travis to run our tests
when code is pushed to GitHub.

## Additional information

### Contributors

Check them all at: [Contributors](https://github.com/cbitstech/sis_app/graphs/contributors)