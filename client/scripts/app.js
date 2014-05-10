app = {
    server: 'http://127.0.0.1:3000/classes/lobby',
    username: 'anonymous',
    lastMessageId: 0,

    init: function() {
      console.log('running chatterbox');
      // Get username
      app.username = window.location.search.substr(10);
      app.loadAllMessages();

      // cache some dom references
      app.$text = $('#message');

      $('#send').on('submit', app.handleSubmit);
    },

    loadAllMessages: function(){
      app.loadMsgs();
      setTimeout(app.loadAllMessages, 500);
    },

    handleSubmit: function(e){
      e.preventDefault();

      var message = {
        user_name: app.username,
        message_text: app.$text.val(),
        room_name: 'lobby' // need to change this later
      };

      app.$text.val('');

      app.sendMsg(message);
    },

    renderMessage: function(message){
      var $user = $("<div>", {class: 'user'}).text(message.user_name);
      var $text = $("<div>", {class: 'text'}).text(message.message_text);
      var $message = $("<div>", {class: 'chat', 'data-id': message.message_id }).append($user, $text);
      return $message;
    },

    processNewMessage: function(message, objectId){
      message.objectId = objectId;
      app.processNewMessages([message]);
    },

    processNewMessages: function(messages){
      // messages arrive newest first
      for( var i = messages.length; i > 0; i-- ){
        var message = messages[i-1];
        // check if objectId is in dom.
        if( $('#chats').find('.chat[data-id='+message.message_id+']').length ){ continue; }
        $('#chats').prepend(app.renderMessage(message));
      }
    },

    loadMsgs: function(){
      $.ajax({
        url: app.server,
        contentType: 'application/json',
        success: function(json){
          json = JSON.parse(json);
          console.log("json results", json);
          app.processNewMessages(json.results);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    sendMsg: function(message){
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(json){
          // console.log(json);
          // app.processNewMessage(message, json.objectId);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }

};
