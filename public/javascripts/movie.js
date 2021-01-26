$(document).ready(function () {
  var temp = $('#movie_temp').data('temp');
  initializeLiff(temp)
  $('#form').submit(function (event) {
    var values = {};
    values.type = 'movie';
    $.each($('#form').serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    var genres = [];
    $('input:checkbox[name="genres"]:checked').each(function () {
      genres.push($(this).val());
    });
    values.genres = genres;
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
