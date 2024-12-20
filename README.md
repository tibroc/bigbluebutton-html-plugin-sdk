# BigBlueButton SDK for HTML5 Client Plugins

This repository contains the SDK for developing BigBlueButton plugins.
Plugins are React components that can be loaded from external sources
by the BigBlueButton HTML5 client to extend its functionalities.

## Examples

A variety of example implementations to manipulate different parts of the
BBB client can be found in the [`samples`](samples) folder.

## Usage

This is a general instruction on how to use a plugin.
For a detailed configuration example of each use case,
have a look at the READMEs in the respective [samples](samples)-folders.

### Running the Plugin from Source

For development purposes you can run a plugin locally from source.

For example if you take the [`sample-action-button-dropdown-plugin`](samples/sample-action-button-dropdown-plugin),
you do the following:

*Running from source code with local BBB-server*

1. Start the development server:

   ```bash
   cd $HOME/src/bigbluebutton-html-plugin-sdk/samples/sample-action-button-dropdown-plugin
   npm install
   npm start
   ```

2. Add reference to it on BigBlueButton's `/create` call or add it on `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties`:

```
pluginsManifests=[{"url": "http://localhost:4701/manifest.json"}]
```

*Running from souce code with a remote BBB-server*

If you are running your BBB-server elsewhere, than you can't simply point the manifest URL to a local address, you'll need to either serve the built version into a CDN or serve the dev version using a service to make it public. And for the second option we'd recommend NGROK. Here are the instructions to do that:

1. Create an account on https://ngrok.com/ (Official website of NGROK);

2. Install NGROK in your computer. They have a guide for that right after you created your account;

3. Start the Plugin development server:

```bash
cd $HOME/src/plugin-pick-random-user-plugin
npm install
npm start
```

4. Start the NGROK server into your machine with the following command:

```bash
ngrok http http://172.17.0.1:4701
```

Make sure to point NGROK to the correct local URL (In our case - The samples are made this way, for instance - we used `http://172.17.0.1:4701`)

Right after that, NGROK will create an interface into your terminal and will display the URL which your static files are being served.

Here's an example of URL: `https://<uuid>.ngrok-free.app`

You can already interact with this URL and access both 

`https://<uuid>.ngrok-free.app/manifest.json`

or

`https://<uuid>.ngrok-free.app/PickRandomUserPlugin.js`


5. Add this create parameter into the API-mate of the server you are testing it on:

```
pluginsManifests=[{"url": "https://<uuid>.ngrok-free.app/manifest.json"}]
```

And there you go, you can test it freely.

### Building the Plugin (Production)

To build a plugin for production use
(again, using the example of [`sample-action-button-dropdown-plugin`](samples/sample-action-button-dropdown-plugin)),
follow these steps:

```bash
cd $HOME/src/bigbluebutton-html-plugin-sdk/samples/sample-action-button-dropdown-plugin
npm install
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `SampleActionButtonDropdownPlugin.js` along with the `manifest.json`.
These files can be hosted on any HTTPS server.

To use the plugin with BigBlueButton, add the plugin's `manifest.json` URL to `bigbluebutton.properties` or you can simply send it via `/create` parameter:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

#### Hosting the Plugin on a BBB Server

While the plugin can be hosted on any Server, it is also possible to host the bundled file directly on
a BigBlueButton server. For that you copy `dist/SampleActionButtonDropdownPlugin.js` and `dist/manifest.json` to the folder `/var/www/bigbluebutton-default/assets/plugins/sampleActionButtonDropdownPlugin`.
In this case, the your manifest URL will be `https://<your-host>/plugins/sampleActionButtonDropdownPlugin/manifest.json`.

## API

### Extensible UI areas

Foreach of the following ui-extensible-area, we have a different setter function accessible via `pluginApi`.

Mind that, although each area has its own structure, all the functions follows a certain argument structure, and returns nothing, that would be:

```ts
pluginApi.setterFunctionExample([{
  objectProperty1: 'string',
  objectProperty2: 123,
}])
```

See, it is basicaly a function that requires an array as an argument, with which the more items you push to that array, the more of that extensible area you will have.

That being said, here are the extensible areas we have so far:

- Action bar items (button, separator)
- Action Button Dropdown Items (option, separator)
- Audio settings dropdown items (option, separator)
- Camera settings dropdown items (option, separator)
- Options settings dropdown items (option, separator)
- Nav bar items (button, info)
- Presentation dropdown items (option, separator)
- Presentation toolbar items (button, separator, spinner)
- User camera settings dropdown items (option, separator)
- User list dropdown items (option, separator)
- User list item additional information (item, label)
- Floating window item (floatingWindow)
- Generic Content (main, sidekick)
- User Camera Helper (button)
- Screenshare Helper (button)

Mind that no plugin will interfere into another's extensible area. So feel free to set whatever you need into a certain plugin with no worries.

### Getters available through the API:

- `getSessionToken`: returns the user session token located on the user's URL.
- `getJoinUrl`: returns the join url associated with the parameters passed as an argument. Since it fetches the BigBlueButton API, this getter method is asynchronous.

### Realtime data consumption

- `useCurrentPresentation` hook: provides information regarding the current presentation;
- `useLoadedUserList` hook: provides information regarding the loaded user list (displayed in the screen);
- `useCurrentUser` hook: provides information regarding the current user;
- `useUsersBasicInfo` hook: provides information regarding all users (only crucial information: userId, name and role);
- `useLoadedChatMessages` hook: provides information regarding the loaded chat messages;
- `useCustomSubscription` hook: with this hook, the developer can query pretty much anything graphql can provide. Note: Make sure that, on BBB version change, the custom subscriptions you make will work as expected.
- `usePluginSettings` hook: it provides all the specific settings regarding the current plugin it's been loaded from.
- `useTalkingIndicator` hook: it gives you invormation on the user-voice data, that is, who is talking or muted.
- `useMeeting` hook: it gives you information on the current meeting that the user is on.

So for these types of hooks, the return will follow the same structure:

```ts
export interface GraphqlResponseWrapper<TData> {
  loading: boolean;
  data?: TData;
  error?: ApolloError;
}
```

So we have the `data`, which is different for each hook, that's why it's a generic, the error, that will be set if, and only if, there is an error, otherwise it is undefined, and loading, which tells the developer if the query is still loading (being fetched) or not.

### Real time data exchange

- `useDataChannel` hook: this will allow you to exchange information (Send and receive) amongst different users through the same plugin;

So for this hook to read the data from the data channel, the developer will be able to choose the format in which they want it.The possible formats are described down below:

- ALL_ITEMS: Fetches all items from specific data-channel and specific subchannel-name since the begining of the meeting from the newest to the latest (It can be used as a history);
- LATEST_ITEM: Fetches only the latest item pushed to the data-channel within a specific subchannel-name since the begining of the meeting;
- NEW_ITEMS: Fetches the new items pushed to the data-channel within a specific subchannel-name since the moment that the `useDataChannel` hook has been called (It will not see entries sent previous to that moment);

An interesting thing about this hook is that it is generic, so, you can use a custom type, and this will be  found not only in the consumer part of the data structure returned, but also in functions in which you need to specify an object to be persisted, meaning it will force the object to be of the type you mentioned previously (that is the case for `pushEntry` and `replaceEntry`). One can find examples of usage of this in the data-channel plugin sample or most of the official ones. The syntax is described below:

```typescript
const {
  data: response, // Data that will be returned
  pushEntry: pushEntryFunction, // Function to push another item to the data-channel
  deleteEntry: deleteEntryFunction, // Function to delete specific item or wipe all
  replaceEntry: replaceEntryFunction, // Function replace a specifi item
} = useDataChannel<CustomType>(
  channelName, // Defined according to what is on settings.yml from bbb-htlm5
  DataChannelTypes.All_ITEMS, // | LATEST_ITEM | NEW_ITEMS -> ALL_ITEMS is default
  subChannelName = 'default', // If no subchannelName is specified, it will be 'default'
);
```

Wiping all data off will delete every item from the specific data-channel within the specific subchannel-name.

The data-channel name must be written in the settings.yml.

All the permission for writing and deleting must be in the yaml too just like the example ahead:

```yaml
public:
  plugins:
    - name: PluginName
      url: http://<your-hosted-plugin>/PluginName.js
      dataChannels:
        - name: channel-name
          # pushPermission options: moderator, presenter, all
          pushPermission: ['moderator','presenter']
          # replaceOrDeletePermission options: moderator, presenter, creator, all
          replaceOrdeletePermission:
            - moderator
            - sender
```

If no permission is mentioned in the yaml (writing or deleting), no one will be able proceed with that specific action:

The `pushEntryFunction` has a minor detail to pay attention to, it is possible to specify the users who you want to send the item to, if none is specified, all will receive the item, such as done ahead:

```typescript
pushEntryFunction(objectToBePushed: T, options: {
  receivers?: ObjectTo[];
})
export interface ToUserId {
  userId: string;
}
export interface ToRole {
  role: DataChannelPushEntryFunctionUserRole;
}

export type ObjectTo = ToUserId | ToRole;
```

### Real time ui data consumption

- `useUiData` hook: This will return certain data from the UI depending on the parameter the developer uses. It works just like the useUiEvent hook, but instead of passing a callback as a parameter to be run everytime the event occurs, it will return the data directly, keep in mind that the second parameter is the default value that this function will assume. Possible choices:
  - IntlLocaleUiDataNames.CURRENT_LOCALE;
  - ChatFormUiDataNames.CURRENT_CHAT_INPUT_TEXT;
  - ChatFormUiDataNames.CHAT_INPUT_IS_FOCUSED;
  - ExternalVideoVolumeUiDataNames.CURRENT_VOLUME_VALUE;
  - ExternalVideoVolumeUiDataNames.IS_VOLUME_MUTED;
  - UserListUiDataNames.USER_LIST_IS_OPEN;
  - LayoutPresentatioAreaUiDataNames.CURRENT_ELEMENT;

Example of usage:

```ts
  const currentLocale = pluginApi.useUiData(IntlLocaleUiDataNames.CURRENT_LOCALE, {
    locale: 'en',
    fallbackLocale: 'en',
  });
  // Do something with the currentLocale:
  currentLocale.locale;
  currentLocale.fallbackLocale;

```

Mind that foreach enum we have, a different type of fallback is needed as the second argument. In the example above, we want the `intl`, so the second argument, will follow the structure depicted.

One other thing is that the type of the return is precisely the same type required as the second argument.

### Ui Commands to automatize tasks in BBB

`uiCommands` object: It basically contains all the possible commands available to the developer to interact with the core BBB UI, see the ones implemented down below:

- chat:
  - form:
    - open: this function will open the sidebar chat panel automatically;
    - fill: this function will fill the form input field of the chat passed in the argument as {text: string}
- external-video:
  - volume:
    - set: this function will set the external video volume to a certain number between 0 and 1 (that is 0% and);
- sidekick-options-container:
  - open: this function will open the sidekick options panel automatically;
  - close: this function will close the sidekick options panel automatically (and also the sidebar content if open, to avoid inconsistencies in ui);
- presentation-area:
  - open: this function will open the presentation area content automatically;
  - close: this function will close the presentation area content automatically;
- conference:
  - setSpeakerLevel: this function will set the speaker volume level(audio output) of the conference to a certain number between 0 and 1;
- notification:
  - send: This function will send a notification for the client to render, keep in mind that it's only client-side. Should you want it to be rendered in multiple clients, use this with a data-channel;
- user-status:
  - setAwayStatus: this function will set the away status of the user to a certain status;

See usage ahead:

```ts
  pluginApi.uiCommands.chat.form.open();
  pluginApi.uiCommands.chat.form.fill({
    text: 'Just an example message filled by the plugin',
  });
```

So the idea is that we have a `uiCommands` object and at a point, there will be the command to do the intended action, such as open the chat form and/or fill it, as demonstrated above

  ### Server Commands
  
  `serverCommands` object: It contains all the possible commands available to the developer to interact with the BBB core server, see the ones implemented down below:
  
  - chat:
    - sendPublicMessage: This function sends a message to the public chat on behalf of the currently logged-in user.

    - sendCustomPublicMessage: This function sends a text message to the public chat, optionally including custom metadata.
      > **Note**: The custom messages sent by plugins are not automatically rendered by the client. To display these messages, a plugin must handle the rendering using `useLoadedChatMessages` and `useChatMessageDomElements`.

  - caption:
    - save: this function saves the given text, locale and caption type
    - addLocale: this function sends a locale to be added to the available options

### Dom Element Manipulation

- `useChatMessageDomElements` hook: This hook will return the dom element of a chat message reactively, so one can modify whatever is inside, such as text, css, js, etc.;
- `useUserCameraDomElements` hook: This hook will return the dom element of each of the user's webcam corresponding to the streamIds passed reactively, so one can modify whatever is inside, such as text, css, js, etc., and also can get the video element within it;

### Learning Analytics Dashboard integration

- `sendGenericDataForLearningAnalyticsDashboard`: This function will send data for the bbb to render inside the plugin's table

The object structure of this function's argument must be:

```ts
interface GenericDataForLearningAnalyticsDashboard {
  cardTitle: string; // Yet to be implemented (future updates)
  columnTitle: string;
  value: string;
}
```

So that the data will appear in the following form:

|   User    | Count | `<columnTitle>` |
|    ---    |  :--  |      --:        |
| user-name |   1   |   `<value>`     |


### External data resources

This is the new integration with external servers to fetch data in a secure manner.

This is possible by simply configuring the dataResource name in the manifest and then its endpoint in the URL meta parameter that goes in the create request. The manifest would look like:

```json
{
  // ...rest of manifest configuration
  "remoteDataSources": [
      {
          "name": "allUsers",
          "url": "${meta_pluginSettingsUserInformation}",
          "fetchMode": "onMeetingCreate",
          "permissions": ["moderator", "viewer"]
      }
  ]
}
```

Then when creating the meeting send the following parameters along, adjusting to your needs and resources:

```
meta_pluginSettingsUserInformation=https://<your-external-source-with-your-authentication>/api/users
pluginsManifests=[{"url": "http://<domain-of-your-manifest>/your-plugin/manifest.json"}]
```

In the plugin, just use the function like:

```typescript
pluginApi.getRemoteData('allUsers').then((response: Response) => {
  if (response.ok) {
    response.json().then((r: CourseData) => {
      // Do something with the jsonified data (if it's a json)
    }).catch((reason) => {
      pluginLogger.error('Error while processing the json from success response: ', reason);
    });
  }
}).catch((reason) => {
  pluginLogger.error('Error while fetching external resource: ', reason);
});
```


### Frequently Asked Questions (FAQ)

**How do I remove a certain extensible area that I don't want anymore?**
It is pretty simple: just set an empty array of elements of that specific extensible area.
Or simply remove the specific item of the array and set the new array to that extensible area in the next iteration.

See example below:

```ts
// First iteration:
  // Define both variables:
  const dropdownToUserListItem = { ... };
  const buttonToUserListItem = { ... };
  pluginApi.setActionsBarItems([dropdownToUserListItem, buttonToUserListItem]);

// Second iteration:
  // Redefine variable(s):
  const newButtonToUserListItem = { ... };
  pluginApi.setActionsBarItems([newButtonToUserListItem]);

// Third iteration:
  // I don't want any of this extensible-area:
  pluginApi.setActionsBarItems([]);
  // All set from this plugin will disappear from the UI;
```

**How to propperly build a plugin?**
Just go to your plugin folder, install dependencies and run the build command as follows:

```bash
cd my-plugin-folder/
npm i
npm run build-bundl
```

At this point, another folder will be created into the plugin directory called "dist/" inside of that folder you will find the plugin itself `MyPlugin.js`. Remember that the name of this file will be the same as defined in the `webpack.config.js`, such as:

```js
module.exports = {
  // ... Other configurations
  output: {
    filename: 'MyPlugin.js'
  }
  // ... Other configurations
}
```

**Does the builded plugin need to be in the same BBB server?**
No, feel free to host it anywhere you want, just make sure to point the URL from `manifest.json` correctly (into the create endpoint or `bigbluebutton.properties`).

**I am making my plugin based on a sample inside the SDK, but somehow, the sample is not working properly, what do I do to run it in dev mode and make it work?**
Well there are several motives to why the sample is not working properly, so I will go through each one of them briefly:

- The config has not been set properly inside `bbb-html5.yml`, see [this section to configure your plugin](#running-the-plugin-from-source);
- The plugin is not even running in dev mode, it could be the port already in use, or typescript and/or javascript errors (Make sure to initialize the `pluginApi` as any of the samples inside a react function component);
- It could be an error with that sample indeed, or that feature the plugin uses broke (it is not usual, but can happen since BBB is constantly changing and enhancing its features with its wonderful community). If that happens, just open an issue in the [SDK&#39;s github](https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk) detailing the error you are facing. And thank you in advance for reporting it back to us so we can improve each time.

**How to troubleshoot the plugins? See if it has loaded in the BBB, for instance.**
Well, each time a set of plugins are listed in the `bbb-html5.yml`, it will fire some logs based on the amount of plugins that it need to load inside the client. So open the console in the browser by pressing F12 key in your keyboard and search for the following log:

```log
<ratio of loaded plugins> plugins loaded
```

If 1 out of 5 plugins loaded, you'll see "1/5 plugins loaded", and so on.

Also, when a plugin loaded, the client will log it's name like:

```log
Loaded plugin MyPlugin
```

Sometimes, there could be the case of a plugin to not load properly and an error will log with the following message:

```log
Error when loading plugin MyPlugin, error:  {"isTrusted":true}
```

In this case, the URL that leads to the plugin is not available or leads to an error. But it can log something different, so pay attention to what the error message will tell you.

Lastly, there are, of course, other scenarios and different informative logs, but these are the most common and important ones. Please contact us if you feel we left something out!
