$(document).ready(function () {
  var liff_id_movie = $movie.data('liffID');
  console.log('映画LIFF_ID');
  console.log(liff_id_movie);
  initializeLiff(liff_id_movie)
  $('#form').submit(function (event) {
    var values = {};
    values.type = 'movie';
    $.each($('#form').serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    values.overview = $('#btn-group-overview > .btn.active').text().trim();
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
});
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
};
