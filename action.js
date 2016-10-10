var Action = {
  searchRecipe: function(event) {
    var http = require('http');
    var param = event.message.text.substring(7);

    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    var options = {
      host: 'cms.happyrecipe.com',
      path: '/api/v1/formulas/search?q='+param+'&per_page=3'
    };
    var callback = function(response) {
      //another chunk of data has been recieved, so append it to `str`
      var result = ''
      response.on('data', function (chunk) {
        result += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var parsed = JSON.parse(result)
        var formulas = parsed.formulas;
        var data_elements = [];
        formulas.forEach(function(element, index, array){
          data_elements[index] = {
            title: element.name,
            subtitle: element.name+'chr(10)'+'text',
            item_url: 'https://www.happyrecipe.com/en/recipes/'+element.id + '?utm_source=fb_messengger',
            image_url: element.image,
            buttons: [{
              type: 'web_url',
              url: 'https://www.happyrecipe.com/en/recipes/' + element.id + '?utm_source=fb_messengger',
              title: "Open Web URL"
            }]
          }
        });
        var messageData = {
          recipient: {
            id: event.sender.id
          },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: data_elements
              }
            }
          }
        };
        callSendAPI(messageData);
        // console.log(messageData)
        // sendTextMessage(event.sender.id, parsed.formulas[0].name)
      });
    }
    http.request(options, callback).end();

    // callSendAPI(messageData);
    // sendTextMessage(event.sender.id, param)
  }
}

module.exports = Action;