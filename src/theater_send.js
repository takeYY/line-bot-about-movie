$(document).ready(function () {
  var liff_id = process.env.LIFF_ID;
  initializeLiff(liff_id)
  $('#form').submit(function (event) {
    var values = {};
    $.each($('#form').serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    var params = new URLSearchParams(decodeURIComponent(window.location.search));
    values.lat = params.get('lat');
    values.lon = params.get('lon');
    liff.sendMessages([{
      'type': 'text',
      'text': JSON.stringify(values)
    }]).then(function () {
      liff.closeWindow()
    }).catch(function (error) {
      window.alert('Failed to send message ' + error);
    });
    event.preventDefault();
  });
})
function initializeLiff(liffId) {
  liff
    .init({
      liffId: liffId
    })
    .then(() => {
      console.log('LIFF Initialization succeed')
    })
    .catch((err) => {
      console.log('LIFF Initialization failed ', err)
    });
}
