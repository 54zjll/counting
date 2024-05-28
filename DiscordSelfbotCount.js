/*

  SelfBot for Discord by NitramO
  02/03/2020

  CountMessages V0.9
  Based on an rigwild script: https://gist.github.com/rigwild/28f5d9479e3e122070e27db84e104719

*/


'use strict'

/**
 * Discord Console Self bot
 *
 * Open chrome console on Discord using Ctrl+shift+i
 * Go to the network tab, send a message and copy the 'Authorize' header sent by the app.
 * Paste it in authHeader below.
 *
 * Paste the entire script in the console.
 * Now use the provided functions to do some stuff using api.func().
 */

 var selftBotScriptOptions = {
   scriptName: 'SelbotCount',
   version: '0.9',
   author: 'NitramO',
   authorColored: '%cNi%ctra%cmO',
   scriptBase: {
     name: 'Simple Discord Selbot',
     link: 'https://gist.github.com/rigwild/28f5d9479e3e122070e27db84e104719',
     author: 'rigwild'
   }
 };
 var counting = false;//debug
 var stoppedCount = false;//debug

// If vars not declared, declare them. We are in console, var could already be defined.
if (typeof authHeader === 'undefined') {
  var authHeader = ''
  var apiPrefix = ''
  var api = ''
  var timeout = ''
  var apiCall = ''
  var setup = ''
  var stopCount = ''
}

// You 'Authorize' token here
authHeader = ''

apiPrefix = 'https://discord.com/api/v8'

timeout = ms => new Promise(res => setTimeout(res, ms))

apiCall = (apiPath, body, method = 'GET') =>
  fetch(apiPrefix + apiPath, {
    body: body ? JSON.stringify(body): undefined,
    headers: {
      Accept: '*/*',
      'Accept-Language': 'en-US',
      Authority: 'discordapp.com',
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.301 Chrome/56.0.2924.87 Discord/1.6.15 Safari/537.36'
    },
    method
  })
    .then(res => (res.status === 200 ? res.json(): Promise.resolve()))
    .catch(console.error)

// Self bot API
api = {
  // Get messages from channel
  getMessages(channelId) {
    return apiCall(`/channels/${channelId}/messages?limit=100`)
  },

  // Send a message in a channel
  sendMessage(channelId, message, tts) {
    return apiCall(`/channels/${channelId}/messages`, { content: message, tts: !!tts }, 'POST')
  },

  // Edit a message in a channel
  editMessage(channelId, messageId, newMessage) {
    return apiCall(`/channels/${channelId}/messages/${messageId}`, { content: newMessage }, 'PATCH')
  },

  // Delete a message from a channel
  deleteMessage(channelId, messageId) {
    return apiCall(`/channels/${channelId}/messages/${messageId}`, null, 'DELETE')
  }
}

function startMessage() {
  console.log(
    '%cSuccessfully loaded %c' + selftBotScriptOptions.scriptName + ' %cV%c' + selftBotScriptOptions.version + ' %cBy ' + selftBotScriptOptions.authorColored + '%c!',
    'color:green;font-family:system-ui;font-size:1.2rem',
    'color:cyan;font-family:system-ui;font-size:1.2rem;font-weight:bold',
    'color:grey;font-family:system-ui;font-size:1.2rem',
    'color:orange;font-family:system-ui;font-size:1.2rem;font-weight:bold',
    'color:grey;font-family:system-ui;font-size:1.2rem',
    'color:blue;font-family:system-ui;font-size:1.2rem;font-weight:bold;text-shadow: 0px 0px 7px black',
    'color:white;font-family:system-ui;font-size:1.2rem;font-weight:bold;text-shadow: 0px 0px 7px black',
    'color:red;font-family:system-ui;font-size:1.2rem;font-weight:bold;text-shadow: 0px 0px 7px black',
    'color:grey;font-family:system-ui;font-size:1.2rem',
  );
  return new Date();
}

function stopCounting() {
  if (counting == true) {
    if (stoppedCount == false) {
      stoppedCount = true;
      console.log(
        '%cCount stoping...',
        'color:grey;font-family:system-ui;font-size:1.5rem'
      );
      return 'Waiting...';
    } else {
      console.error('Failed to stop counting!', {'Info': 'Count stoping already in progress...'});
      return 'DEBUG: An error occurred, see details above...';
    }
  } else {
    console.error('Failed to stop counting!', {'Info': 'Count stoping already in progress...'});
    return 'DEBUG: An error occurred, see details above...';
  }
}

setup = async (token, channelId, valueBuffer, timeOut) => {
  if (token) {
    authHeader = token;
    if (channelId) {
      if (valueBuffer) {
        const lastMessages = await api.getMessages(channelId);
        if (lastMessages) {
          var foundMessage = ''; //debug
          await lastMessages.forEach(function(element, index, array) {
            if (!foundMessage || foundMessage == '' || foundMessage == undefined) {
              if (element.content.match(/^[0-9]+$/g) !== null) {
                foundMessage = element;
              }
            }
          });
          if (foundMessage) {
            var lastMessage = foundMessage;
            var lastMessageValue = parseInt(lastMessage.content, 10);

            await timeout(150);

            if (valueBuffer > lastMessageValue) {
              counting = true;
              console.log(
                '%cCount starting! %c(Start from ' + (lastMessageValue+1) + ' to ' + valueBuffer + '. ' + (valueBuffer-lastMessageValue) + ' Messages to send.)',
                'color:lime;font-family:system-ui;font-size:2rem;font-weight:bold',
                'color:gray;font-family:system-ui;font-size:1.3rem;font-weight:bold'
              );
              for(var i=(lastMessageValue+1); i < (valueBuffer+1); i++) {
                if (stoppedCount && stoppedCount == true) {
                  console.log(
                    '%cCount successfully stopped! %c' + ((i-lastMessageValue)-1) + '/' + (valueBuffer-lastMessageValue) + ' Messages sent. (' + (i-1) + '/' + valueBuffer + ')',
                    'color:lime;font-family:system-ui;font-size:2rem;font-weight:bold',
                    'color:gray;font-family:system-ui;font-size:1.3rem;font-weight:bold'
                  );
                  i = (valueBuffer+1);
                } else {
                  const sendMessage = await api.sendMessage(channelId, i);
                  if (sendMessage) {
                    console.log(
                      '%cSuccessfully sent message: %c' + sendMessage.content + '/' + valueBuffer + ' (' + (i-lastMessageValue) + '/' + (valueBuffer-lastMessageValue) + ' Messages sent.)',
                      'color:green;font-family:system-ui;font-size:1.5rem',
                      'color:gray;font-family:system-ui;font-size:1.2rem'
                    );
                  } else {
                    console.log(
                      '%cFailed to send message: %c' + i + '/' + valueBuffer + ' (' + ((i-lastMessageValue)-1) + '/' + (valueBuffer-lastMessageValue) + ' Messages sent.)',
                      'color:red;font-family:system-ui;font-size:1.5rem',
                      'color:gray;font-family:system-ui;font-size:1.2rem'
                    );
                    i--
                  }
                  if (timeOut) {
                    await timeout(timeOut);
                  }
                }
              };
              counting = false;
              if (stoppedCount && stoppedCount == true) {
                stoppedCount = false;
              } else {
                console.log(
                  '%cCount successfully finished! %c' + ((i-lastMessageValue)-1) + '/' + (valueBuffer-lastMessageValue) + ' Messages sent. (' + (i-1) + '/' + valueBuffer + ')',
                  'color:lime;font-family:system-ui;font-size:2rem;font-weight:bold',
                  'color:gray;font-family:system-ui;font-size:1.3rem;font-weight:bold'
                );
              }
            } else {
              //error message: Number buffer to count is less greater than the last message value.
              console.error('ERROR: Number need to be more greater than the last message value', {'Info': 'Can\'t count from \"' + lastMessageValue + '\" to \"' + valueBuffer + '\".', 'Channel ID': channelId});
            }
          } else {
            //error message: Failed to find message with number.
            console.error('Failed to found number message!', {'Info': 'Missing message that contains number.', 'Channel ID': channelId});
          }
        }
      } else {
        //error message: Missing valueBuffer.
        console.error('Syntax error: Missing amount', {'Info': 'Missing amount argument', 'Syntax': 'setup(\'token\', \'channelId\', \'amount\', \'timeout\')'});
      }
    } else {
      //error message: Missing channelId.
      console.error('Syntax error: Missing channelId', {'Info': 'Missing channelId argument', 'Syntax': 'setup(\'token\', \'channelId\', \'amount\', \'timeout\')'});
    }
  } else {
    //error message: Missing token.
    console.error('Syntax error: Missing token', {'Info': 'Missing token argument', 'Syntax': 'setup(\'token\', \'channelId\', \'amount\', \'timeout\')'});
  }
}

startMessage(); //debug

//Example: setup('token', 'channelId', 'amount', 'timeout')
//Force stop counting: stopCounting()